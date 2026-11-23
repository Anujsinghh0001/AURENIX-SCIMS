/**
 * Recruiter Portal Logic (SCIMS)
 */

document.addEventListener("DOMContentLoaded", function () {
    const recruiter = SCIMS.requireAuth("recruiter", "login.html");
    if (!recruiter) return;

    renderRecruiterHeader(recruiter);
    setupTabs();

    loadOverview(recruiter);
    loadMyPostings(recruiter);
    loadCandidatesATS(recruiter);
    loadAnnouncements();

    setupActionModals(recruiter);
});

function renderRecruiterHeader(recruiter) {
    const nameEl = document.getElementById("rec-header-name");
    const roleEl = document.getElementById("rec-header-role");
    const avatarEl = document.getElementById("rec-header-avatar");

    if (nameEl) nameEl.textContent = recruiter.name;
    if (roleEl) roleEl.textContent = `${recruiter.designation} • ${recruiter.company}`;
    if (avatarEl && recruiter.avatar) avatarEl.src = recruiter.avatar;
}

function setupTabs() {
    const menuItems = document.querySelectorAll(".sidebar-item[data-tab]");
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(m => m.classList.remove("active"));
            item.classList.add("active");

            const targetTab = item.getAttribute("data-tab");
            document.querySelectorAll(".tab-content").forEach(tab => {
                tab.classList.remove("active");
            });

            const activePanel = document.getElementById(targetTab);
            if (activePanel) activePanel.classList.add("active");
        });
    });
}

function loadOverview(recruiter) {
    const allJobs = SCIMS.getInternships();
    const myJobs = allJobs.filter(j => j.company.toLowerCase() === recruiter.company.toLowerCase() || j.recruiterId === recruiter.id);
    const myJobIds = new Set(myJobs.map(j => j.id));

    const allApps = SCIMS.getApplications();
    const myApps = allApps.filter(a => myJobIds.has(a.internshipId) || a.company.toLowerCase() === recruiter.company.toLowerCase());

    const shortlisted = myApps.filter(a => a.status === "Shortlisted" || a.status === "Interview Scheduled");
    const offered = myApps.filter(a => a.status === "Offered");

    const elPostings = document.getElementById("stat-rec-postings");
    const elApps = document.getElementById("stat-rec-apps");
    const elShortlist = document.getElementById("stat-rec-shortlist");
    const elOffered = document.getElementById("stat-rec-offers");

    if (elPostings) elPostings.textContent = myJobs.length;
    if (elApps) elApps.textContent = myApps.length;
    if (elShortlist) elShortlist.textContent = shortlisted.length;
    if (elOffered) elOffered.textContent = offered.length;

    // Recent candidates snippet in overview
    const recentCandidates = document.getElementById("rec-recent-applicants");
    if (recentCandidates) {
        if (myApps.length === 0) {
            recentCandidates.innerHTML = `<p style="color: var(--text-muted); padding: 1rem 0;">No student applications received yet. Postings are live on student boards.</p>`;
        } else {
            recentCandidates.innerHTML = myApps.slice(0, 4).map(app => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <strong style="color: #fff; font-size: 0.95rem;">${app.studentName}</strong>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${app.role} • CGPA: ${app.studentCgpa || '8.5'} • Applied ${app.appliedDate}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <span class="badge ${getStatusBadge(app.status)}">${app.status}</span>
                        <button class="btn btn-secondary btn-sm" onclick="openReviewCandidateModal('${app.id}')">Evaluate</button>
                    </div>
                </div>
            `).join("");
        }
    }
}

function loadMyPostings(recruiter) {
    const allJobs = SCIMS.getInternships();
    const myJobs = allJobs.filter(j => j.company.toLowerCase() === recruiter.company.toLowerCase() || j.recruiterId === recruiter.id);
    const allApps = SCIMS.getApplications();

    const tbody = document.getElementById("rec-postings-tbody");
    if (!tbody) return;

    if (myJobs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No job listings posted yet. Click "+ Post New Internship" to begin sourcing.</td></tr>`;
        return;
    }

    tbody.innerHTML = myJobs.map(job => {
        const applicantCount = allApps.filter(a => a.internshipId === job.id).length;
        return `
            <tr>
                <td>
                    <strong>${job.title}</strong>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${job.category || 'Engineering'}</div>
                </td>
                <td><span class="detail-pill">${job.mode}</span></td>
                <td><strong style="color: var(--accent-emerald);">${job.stipend}</strong></td>
                <td>${job.duration}</td>
                <td><span class="badge badge-primary">${applicantCount} Applied</span></td>
                <td>
                    <span class="badge badge-success">${job.status}</span>
                </td>
            </tr>
        `;
    }).join("");
}

function loadCandidatesATS(recruiter) {
    const allJobs = SCIMS.getInternships();
    const myJobs = allJobs.filter(j => j.company.toLowerCase() === recruiter.company.toLowerCase() || j.recruiterId === recruiter.id);
    const myJobIds = new Set(myJobs.map(j => j.id));

    const allApps = SCIMS.getApplications();
    const myApps = allApps.filter(a => myJobIds.has(a.internshipId) || a.company.toLowerCase() === recruiter.company.toLowerCase());

    const tbody = document.getElementById("rec-ats-tbody");
    if (!tbody) return;

    if (myApps.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No candidates in hiring pipeline.</td></tr>`;
        return;
    }

    tbody.innerHTML = myApps.map(app => `
        <tr>
            <td>
                <strong>${app.studentName}</strong>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${app.studentRoll} • ${app.studentEmail}</div>
            </td>
            <td><strong>${app.role}</strong></td>
            <td><strong style="color: var(--accent-emerald);">${app.studentCgpa || 'N/A'}</strong></td>
            <td>${app.studentDept}</td>
            <td><span class="badge ${getStatusBadge(app.status)}">${app.status}</span></td>
            <td>
                ${app.interviewDate ? `<span style="color: var(--accent-cyan); font-size: 0.8rem;">📅 ${app.interviewDate}</span>` : '<span style="color: var(--text-muted);">-</span>'}
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openReviewCandidateModal('${app.id}')">Manage Candidate</button>
            </td>
        </tr>
    `).join("");
}

function loadAnnouncements() {
    const ann = SCIMS.getAnnouncements().filter(a => a.target === 'all');
    const container = document.getElementById("rec-announcements-container");
    if (!container) return;

    container.innerHTML = ann.map(item => `
        <div class="glass-panel" style="margin-bottom: 1rem; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="color: #fff; font-size: 1.05rem;">${item.title}</h4>
                <span class="badge badge-warning">${item.date}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${item.content}</p>
        </div>
    `).join("");
}

function setupActionModals(recruiter) {
    // Post New Internship Form
    const postJobForm = document.getElementById("post-job-form");
    if (postJobForm) {
        postJobForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const rawSkills = document.getElementById("job-skills").value;
            const skillsArr = rawSkills ? rawSkills.split(",").map(s => s.trim()).filter(Boolean) : ["General Tech"];

            const newJob = {
                title: document.getElementById("job-title").value.trim(),
                recruiterId: recruiter.id,
                company: recruiter.company,
                logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                location: document.getElementById("job-location").value.trim(),
                stipend: document.getElementById("job-stipend").value.trim(),
                duration: document.getElementById("job-duration").value,
                mode: document.getElementById("job-mode").value,
                category: document.getElementById("job-category").value,
                deadline: document.getElementById("job-deadline").value,
                minCgpa: document.getElementById("job-cgpa").value.trim() || "7.5",
                openings: parseInt(document.getElementById("job-openings").value || 2),
                description: document.getElementById("job-desc").value.trim(),
                skills: skillsArr,
                eligibleDepts: [
                    "Computer Science & Engineering",
                    "Information Technology",
                    "Electronics & Communication"
                ]
            };

            SCIMS.addInternship(newJob);
            SCIMS.showToast(`Internship position "${newJob.title}" posted successfully!`, "success");
            postJobForm.reset();
            closeModal("post-job-modal");

            loadOverview(recruiter);
            loadMyPostings(recruiter);
        });
    }

    // Candidate Decision Form
    const candidateForm = document.getElementById("manage-candidate-form");
    if (candidateForm) {
        candidateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const appId = document.getElementById("modal-app-id").value;
            const decision = document.getElementById("modal-candidate-status").value;
            const interviewDate = document.getElementById("modal-interview-date").value.trim() || null;

            SCIMS.updateApplicationStatus(appId, decision, interviewDate);
            SCIMS.showToast(`Applicant updated to status: ${decision}`, "success");
            closeModal("review-candidate-modal");

            loadOverview(recruiter);
            loadCandidatesATS(recruiter);
        });
    }
}

// Global modal triggers
window.openReviewCandidateModal = function (appId) {
    const app = SCIMS.getApplications().find(a => a.id === appId);
    if (!app) return;

    document.getElementById("modal-app-id").value = app.id;
    document.getElementById("modal-cand-name").textContent = `${app.studentName} (${app.studentRoll})`;
    document.getElementById("modal-cand-role").textContent = app.role;
    document.getElementById("modal-cand-dept").textContent = `${app.studentDept} • CGPA: ${app.studentCgpa || '8.5'}`;
    document.getElementById("modal-cand-note").textContent = app.coverNote || "Candidate is eager to contribute to technical projects.";
    document.getElementById("modal-candidate-status").value = app.status;
    document.getElementById("modal-interview-date").value = app.interviewDate || "";

    openModal("review-candidate-modal");
};

window.openModal = function (modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add("active");
};

window.closeModal = function (modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove("active");
};

function getStatusBadge(status) {
    switch (status) {
        case "Offered":
            return "badge-success";
        case "Shortlisted":
        case "Interview Scheduled":
            return "badge-info";
        case "Applied":
            return "badge-warning";
        case "Rejected":
            return "badge-danger";
        default:
            return "badge-primary";
    }
}
