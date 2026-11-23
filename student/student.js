/**
 * Student Dashboard Logic (SCIMS)
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Guard route: Requires student role
    const student = SCIMS.requireAuth("student", "login.html");
    if (!student) return;

    // 2. Render user info across UI
    renderStudentHeader(student);

    // 3. Setup Tab Navigation
    setupTabs();

    // 4. Load initial tab data
    loadOverview(student);
    loadInternships(student);
    loadApplications(student);
    loadNocRequests(student);
    loadWeeklyReports(student);
    loadAnnouncements();

    // 5. Setup Action Listeners (Forms & Modals)
    setupModals(student);
});

function renderStudentHeader(student) {
    const nameEl = document.getElementById("student-header-name");
    const roleEl = document.getElementById("student-header-role");
    const avatarEl = document.getElementById("student-header-avatar");

    if (nameEl) nameEl.textContent = student.name;
    if (roleEl) roleEl.textContent = `${student.rollNo} • ${student.department}`;
    if (avatarEl && student.avatar) avatarEl.src = student.avatar;

    // Profile card on overview tab
    const pName = document.getElementById("prof-name");
    const pRoll = document.getElementById("prof-roll");
    const pDept = document.getElementById("prof-dept");
    const pYear = document.getElementById("prof-year");
    const pCgpa = document.getElementById("prof-cgpa");
    const pEmail = document.getElementById("prof-email");
    const pSkills = document.getElementById("prof-skills");

    if (pName) pName.textContent = student.name;
    if (pRoll) pRoll.textContent = student.rollNo || "N/A";
    if (pDept) pDept.textContent = student.department || "Engineering";
    if (pYear) pYear.textContent = student.year || "3rd Year";
    if (pCgpa) pCgpa.textContent = student.cgpa || "8.5";
    if (pEmail) pEmail.textContent = student.email;
    if (pSkills) {
        pSkills.innerHTML = (student.skills || ["Software", "Problem Solving"])
            .map(s => `<span class="skill-tag">${s}</span>`).join("");
    }
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

function loadOverview(student) {
    const apps = SCIMS.getApplications().filter(a => a.studentId === student.id);
    const nocs = SCIMS.getNOCRequests().filter(n => n.studentId === student.id);
    const reports = SCIMS.getReports().filter(r => r.studentId === student.id);
    const activeJobs = SCIMS.getInternships().filter(j => j.status === "Active");

    const statApps = document.getElementById("stat-my-apps");
    const statShortlisted = document.getElementById("stat-shortlisted");
    const statNoc = document.getElementById("stat-noc-status");
    const statOpenings = document.getElementById("stat-openings");

    if (statApps) statApps.textContent = apps.length;
    if (statShortlisted) {
        const shortlisted = apps.filter(a => a.status === "Shortlisted" || a.status === "Offered").length;
        statShortlisted.textContent = shortlisted;
    }
    if (statNoc) {
        const approvedNoc = nocs.find(n => n.status === "Approved");
        const pendingNoc = nocs.find(n => n.status === "Pending");
        statNoc.textContent = approvedNoc ? "Approved ✓" : (pendingNoc ? "In Review ⏳" : "Not Requested");
    }
    if (statOpenings) statOpenings.textContent = activeJobs.length;

    // Recent applications snippet in overview
    const recentAppsContainer = document.getElementById("overview-recent-apps");
    if (recentAppsContainer) {
        if (apps.length === 0) {
            recentAppsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No applications submitted yet. Browse open roles to apply!</p>`;
        } else {
            recentAppsContainer.innerHTML = apps.slice(0, 3).map(app => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <div style="font-weight: 600; color: #fff; font-size: 0.92rem;">${app.role}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${app.company} • Applied on ${app.appliedDate}</div>
                    </div>
                    <span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span>
                </div>
            `).join("");
        }
    }
}

function loadInternships(student) {
    const list = SCIMS.getInternships();
    const container = document.getElementById("internships-grid-container");
    const appliedIds = new Set(
        SCIMS.getApplications()
            .filter(a => a.studentId === student.id)
            .map(a => a.internshipId)
    );

    if (!container) return;

    window.allInternshipsList = list;
    renderFilteredInternships(list, appliedIds);

    // Search and filter inputs
    const searchInput = document.getElementById("search-internships");
    const modeFilter = document.getElementById("filter-mode");
    const deptFilter = document.getElementById("filter-dept");

    function applyFilter() {
        const term = (searchInput?.value || "").toLowerCase();
        const mode = modeFilter?.value || "all";
        const dept = deptFilter?.value || "all";

        const filtered = list.filter(item => {
            const matchesTerm = item.title.toLowerCase().includes(term) ||
                                item.company.toLowerCase().includes(term) ||
                                (item.skills && item.skills.some(s => s.toLowerCase().includes(term)));
            const matchesMode = mode === "all" || item.mode.toLowerCase() === mode.toLowerCase();
            const matchesDept = dept === "all" || !item.eligibleDepts || item.eligibleDepts.includes(dept);

            return matchesTerm && matchesMode && matchesDept;
        });

        renderFilteredInternships(filtered, appliedIds);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilter);
    if (modeFilter) modeFilter.addEventListener("change", applyFilter);
    if (deptFilter) deptFilter.addEventListener("change", applyFilter);
}

function renderFilteredInternships(list, appliedIds) {
    const container = document.getElementById("internships-grid-container");
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
            No internships match your filter criteria.
        </div>`;
        return;
    }

    container.innerHTML = list.map(job => {
        const isApplied = appliedIds.has(job.id);
        return `
            <div class="job-card">
                <div class="job-card-header">
                    <img src="${job.logo || 'https://via.placeholder.com/48'}" alt="${job.company}" class="company-logo" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
                    <div class="job-info">
                        <h3>${job.title}</h3>
                        <div class="job-company">${job.company} • 📍 ${job.location}</div>
                    </div>
                </div>

                <div class="job-details-pills">
                    <span class="detail-pill">⏱️ ${job.duration}</span>
                    <span class="detail-pill">🏢 ${job.mode}</span>
                    <span class="detail-pill">🎓 Min CGPA: ${job.minCgpa || '7.0'}</span>
                </div>

                <p class="job-desc-snippet">${job.description}</p>

                <div class="skills-tags">
                    ${(job.skills || []).map(s => `<span class="skill-tag">${s}</span>`).join("")}
                </div>

                <div class="job-card-footer">
                    <div>
                        <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Stipend</div>
                        <div class="job-stipend">${job.stipend}</div>
                    </div>
                    ${
                        isApplied 
                        ? `<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: default;">✓ Applied</button>`
                        : `<button class="btn btn-primary btn-sm" onclick="openApplyModal('${job.id}', '${escapeQuotes(job.title)}', '${escapeQuotes(job.company)}')">Apply Now</button>`
                    }
                </div>
            </div>
        `;
    }).join("");
}

function loadApplications(student) {
    const apps = SCIMS.getApplications().filter(a => a.studentId === student.id);
    const tbody = document.getElementById("my-applications-tbody");
    if (!tbody) return;

    if (apps.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">You have not submitted any applications yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = apps.map(app => `
        <tr>
            <td>
                <strong>${app.role}</strong>
            </td>
            <td>${app.company}</td>
            <td>${app.appliedDate}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span>
            </td>
            <td>
                ${app.interviewDate ? `<span style="color: var(--accent-cyan); font-weight: 500;">📅 ${app.interviewDate}</span>` : '<span style="color: var(--text-muted);">None</span>'}
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="viewAppNotes('${escapeQuotes(app.role)}', '${escapeQuotes(app.company)}', '${escapeQuotes(app.coverNote)}')">View Note</button>
            </td>
        </tr>
    `).join("");
}

function loadNocRequests(student) {
    const nocs = SCIMS.getNOCRequests().filter(n => n.studentId === student.id);
    const tbody = document.getElementById("my-noc-tbody");
    if (!tbody) return;

    if (nocs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No NOC clearance requests submitted.</td></tr>`;
        return;
    }

    tbody.innerHTML = nocs.map(noc => `
        <tr>
            <td><strong>${noc.companyName}</strong></td>
            <td>${noc.internshipRole}</td>
            <td>${noc.duration}</td>
            <td>${noc.facultyMentorName}</td>
            <td><span class="badge ${getStatusBadgeClass(noc.status)}">${noc.status}</span></td>
            <td><span style="font-size: 0.82rem; color: var(--text-secondary);">${noc.remarks || 'Under verification'}</span></td>
            <td>
                ${noc.status === 'Approved' ? `
                    <button class="btn btn-success btn-sm" onclick="downloadSimulatedNoc('${noc.id}', '${escapeQuotes(student.name)}', '${escapeQuotes(noc.companyName)}')">📄 Download NOC</button>
                ` : `<span style="color: var(--text-muted); font-size: 0.8rem;">Pending Approval</span>`}
            </td>
        </tr>
    `).join("");
}

function loadWeeklyReports(student) {
    const reports = SCIMS.getReports().filter(r => r.studentId === student.id);
    const tbody = document.getElementById("my-reports-tbody");
    if (!tbody) return;

    if (reports.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No weekly milestone diaries submitted yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = reports.map(r => `
        <tr>
            <td><strong>Week ${r.weekNumber}</strong></td>
            <td>${r.title}</td>
            <td>${r.submissionDate}</td>
            <td><span class="badge ${getStatusBadgeClass(r.status)}">${r.status}</span></td>
            <td>${r.grade ? `<strong style="color: var(--accent-emerald);">${r.grade}</strong>` : `<span style="color: var(--text-muted);">-</span>`}</td>
            <td><span style="font-size: 0.82rem; color: var(--text-secondary);">${r.mentorRemarks || 'Awaiting mentor review'}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="viewReportDetails('${r.weekNumber}', '${escapeQuotes(r.title)}', '${escapeQuotes(r.tasksCompleted)}', '${escapeQuotes(r.learningOutcome)}')">Details</button>
            </td>
        </tr>
    `).join("");
}

function loadAnnouncements() {
    const ann = SCIMS.getAnnouncements().filter(a => a.target === 'all' || a.target === 'student');
    const container = document.getElementById("announcements-container");
    if (!container) return;

    container.innerHTML = ann.map(item => `
        <div class="glass-panel" style="margin-bottom: 1rem; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="color: #fff; font-size: 1.05rem;">${item.title}</h4>
                <span class="badge badge-primary">${item.date}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${item.content}</p>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem;">Posted by: ${item.author}</div>
        </div>
    `).join("");
}

function setupModals(student) {
    // Populate Faculty mentors dropdown in NOC modal
    const mentorSelect = document.getElementById("noc-faculty-select");
    if (mentorSelect) {
        const faculties = SCIMS.getUsers().filter(u => u.role === "faculty");
        mentorSelect.innerHTML = faculties.map(f => `
            <option value="${f.id}" data-name="${f.name}">${f.name} (${f.department})</option>
        `).join("");
    }

    // Handle Apply Modal Form Submission
    const applyForm = document.getElementById("apply-job-form");
    if (applyForm) {
        applyForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const jobId = document.getElementById("apply-job-id").value;
            const coverNote = document.getElementById("apply-cover-note").value;

            const res = SCIMS.applyForInternship(student, jobId, coverNote);
            if (res.success) {
                SCIMS.showToast("Application submitted successfully!", "success");
                closeModal("apply-modal");
                // Reload state
                loadOverview(student);
                loadInternships(student);
                loadApplications(student);
            } else {
                SCIMS.showToast(res.message, "error");
            }
        });
    }

    // Handle Submit NOC Form
    const nocForm = document.getElementById("submit-noc-form");
    if (nocForm) {
        nocForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const mentorOption = mentorSelect.options[mentorSelect.selectedIndex];
            
            const nocData = {
                studentId: student.id,
                studentName: student.name,
                studentRoll: student.rollNo || "N/A",
                department: student.department || "General",
                companyName: document.getElementById("noc-company").value.trim(),
                internshipRole: document.getElementById("noc-role").value.trim(),
                duration: document.getElementById("noc-duration").value,
                startDate: document.getElementById("noc-start-date").value,
                endDate: document.getElementById("noc-end-date").value,
                stipend: document.getElementById("noc-stipend").value.trim() || "Not Disclosed",
                facultyMentorId: mentorOption.value,
                facultyMentorName: mentorOption.getAttribute("data-name"),
                offerLetterUploaded: true,
                remarks: "Submitted by student. Awaiting mentor verification."
            };

            SCIMS.requestNOC(nocData);
            SCIMS.showToast("NOC Clearance Request submitted to " + nocData.facultyMentorName, "success");
            nocForm.reset();
            closeModal("request-noc-modal");
            loadOverview(student);
            loadNocRequests(student);
        });
    }

    // Handle Submit Weekly Report Form
    const reportForm = document.getElementById("submit-report-form");
    if (reportForm) {
        reportForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const reportData = {
                studentId: student.id,
                studentName: student.name,
                rollNo: student.rollNo || "N/A",
                company: document.getElementById("rep-company").value.trim(),
                weekNumber: parseInt(document.getElementById("rep-week-num").value),
                title: document.getElementById("rep-title").value.trim(),
                tasksCompleted: document.getElementById("rep-tasks").value.trim(),
                learningOutcome: document.getElementById("rep-learnings").value.trim()
            };

            SCIMS.submitReport(reportData);
            SCIMS.showToast("Weekly Milestone Diary logged successfully!", "success");
            reportForm.reset();
            closeModal("submit-report-modal");
            loadOverview(student);
            loadWeeklyReports(student);
        });
    }
}

// Global modal triggers
window.openApplyModal = function (jobId, title, company) {
    document.getElementById("apply-job-id").value = jobId;
    document.getElementById("apply-modal-job-title").textContent = title;
    document.getElementById("apply-modal-company").textContent = company;
    openModal("apply-modal");
};

window.viewAppNotes = function (role, company, note) {
    alert(`Application Note for ${role} @ ${company}:\n\n"${note}"`);
};

window.viewReportDetails = function (week, title, tasks, learnings) {
    alert(`Week ${week}: ${title}\n\nTasks Executed:\n${tasks}\n\nKey Learnings:\n${learnings}`);
};

window.downloadSimulatedNoc = function (nocId, studentName, company) {
    SCIMS.showToast(`Generating certified Digital NOC #${nocId} for ${studentName}...`, "info");
    setTimeout(() => {
        alert(`====================================================\n        OFFICIAL DIGITAL NOC CLEARANCE CERTIFICATE\n====================================================\n\nReference: ${nocId}\nCandidate: ${studentName}\nHost Enterprise: ${company}\nStatus: VERIFIED & APPROVED BY ACADEMIC COMMITTEE\n\nThis certifies that the candidate has fulfilled campus clearance requirements to undertake industry internship.\n\nDate: ${new Date().toLocaleDateString()}\nOffice of Academic Affairs & Training & Placement Cell`);
    }, 600);
};

window.openModal = function (modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add("active");
};

window.closeModal = function (modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove("active");
};

function getStatusBadgeClass(status) {
    switch (status) {
        case "Approved":
        case "Offered":
            return "badge-success";
        case "Shortlisted":
        case "Interview Scheduled":
            return "badge-info";
        case "Pending":
        case "Applied":
        case "Submitted":
            return "badge-warning";
        case "Rejected":
        case "Needs Revision":
            return "badge-danger";
        default:
            return "badge-primary";
    }
}

function escapeQuotes(str) {
    return (str || "").replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
