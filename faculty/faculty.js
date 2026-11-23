/**
 * Faculty Mentor Dashboard Logic (SCIMS)
 */

document.addEventListener("DOMContentLoaded", function () {
    const faculty = SCIMS.requireAuth("faculty", "login.html");
    if (!faculty) return;

    renderFacultyHeader(faculty);
    setupTabs();

    loadOverview(faculty);
    loadNocQueue(faculty);
    loadReportsQueue(faculty);
    loadMenteeCohort(faculty);
    loadAnnouncements();

    setupActionModals(faculty);
});

function renderFacultyHeader(faculty) {
    const nameEl = document.getElementById("faculty-header-name");
    const roleEl = document.getElementById("faculty-header-role");
    const avatarEl = document.getElementById("faculty-header-avatar");

    if (nameEl) nameEl.textContent = faculty.name;
    if (roleEl) roleEl.textContent = `${faculty.designation} • ${faculty.department}`;
    if (avatarEl && faculty.avatar) avatarEl.src = faculty.avatar;
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

function loadOverview(faculty) {
    const allNocs = SCIMS.getNOCRequests();
    const myNocs = allNocs.filter(n => n.facultyMentorId === faculty.id || n.department === faculty.department);
    const pendingNocs = myNocs.filter(n => n.status === "Pending");

    const allReports = SCIMS.getReports();
    const pendingReports = allReports.filter(r => r.status === "Submitted");

    const mentees = SCIMS.getUsers().filter(u => u.role === "student" && u.department === faculty.department);

    const elPendingNoc = document.getElementById("stat-fac-pending-noc");
    const elMentees = document.getElementById("stat-fac-mentees");
    const elPendingReports = document.getElementById("stat-fac-pending-reports");
    const elDeptRate = document.getElementById("stat-fac-placed");

    if (elPendingNoc) elPendingNoc.textContent = pendingNocs.length;
    if (elMentees) elMentees.textContent = mentees.length;
    if (elPendingReports) elPendingReports.textContent = pendingReports.length;
    if (elDeptRate) elDeptRate.textContent = "84.5%";

    // Render quick pending queue in overview
    const quickQueue = document.getElementById("fac-quick-queue");
    if (quickQueue) {
        if (pendingNocs.length === 0) {
            quickQueue.innerHTML = `<p style="color: var(--text-muted); padding: 1rem 0;">No pending student NOC clearance requests at this time. All caught up! 🎉</p>`;
        } else {
            quickQueue.innerHTML = pendingNocs.slice(0, 3).map(n => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <strong style="color: #fff; font-size: 0.95rem;">${n.studentName} (${n.studentRoll})</strong>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${n.companyName} • ${n.internshipRole} • ${n.duration}</div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-success btn-sm" onclick="quickApproveNoc('${n.id}', '${escapeQuotes(n.studentName)}')">Approve ✓</button>
                        <button class="btn btn-secondary btn-sm" onclick="openReviewNocModal('${n.id}')">Review</button>
                    </div>
                </div>
            `).join("");
        }
    }
}

function loadNocQueue(faculty) {
    const list = SCIMS.getNOCRequests().filter(n => n.facultyMentorId === faculty.id || n.department === faculty.department || true);
    const tbody = document.getElementById("fac-noc-tbody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No student NOC requests found.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(n => `
        <tr>
            <td>
                <strong>${n.studentName}</strong>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${n.studentRoll} • ${n.department}</div>
            </td>
            <td>
                <strong>${n.companyName}</strong>
                <div style="font-size: 0.78rem; color: var(--text-secondary);">${n.internshipRole}</div>
            </td>
            <td>${n.duration} (${n.startDate || 'TBD'})</td>
            <td><strong style="color: var(--accent-emerald);">${n.stipend || '₹0'}</strong></td>
            <td><span class="badge ${getStatusBadge(n.status)}">${n.status}</span></td>
            <td><span style="font-size: 0.82rem; color: var(--text-secondary);">${n.remarks || '-'}</span></td>
            <td>
                <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-primary btn-sm" onclick="openReviewNocModal('${n.id}')">Evaluate</button>
                </div>
            </td>
        </tr>
    `).join("");
}

function loadReportsQueue(faculty) {
    const reports = SCIMS.getReports();
    const tbody = document.getElementById("fac-reports-tbody");
    if (!tbody) return;

    if (reports.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No student weekly reports available to evaluate.</td></tr>`;
        return;
    }

    tbody.innerHTML = reports.map(r => `
        <tr>
            <td>
                <strong>${r.studentName}</strong>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${r.rollNo}</div>
            </td>
            <td>${r.company}</td>
            <td><strong>Week ${r.weekNumber}</strong>: ${r.title}</td>
            <td>${r.submissionDate}</td>
            <td><span class="badge ${getStatusBadge(r.status)}">${r.status}</span></td>
            <td>${r.grade ? `<strong style="color: var(--accent-cyan);">${r.grade}</strong>` : `<span style="color: var(--text-muted);">Ungraded</span>`}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openGradeReportModal('${r.id}')">Grade & Feedback</button>
            </td>
        </tr>
    `).join("");
}

function loadMenteeCohort(faculty) {
    const students = SCIMS.getUsers().filter(u => u.role === "student");
    const container = document.getElementById("mentees-container");
    if (!container) return;

    const allApps = SCIMS.getApplications();

    container.innerHTML = students.map(s => {
        const studentApps = allApps.filter(a => a.studentId === s.id);
        const offered = studentApps.find(a => a.status === "Offered");

        return `
            <div class="mentee-card">
                <div class="mentee-header">
                    <img src="${s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" class="mentee-avatar" alt="Student">
                    <div>
                        <h4 style="color: #fff; font-size: 1.05rem;">${s.name}</h4>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${s.rollNo} • ${s.year || '3rd Year'}</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
                    <span style="color: var(--text-muted);">Department:</span>
                    <strong style="color: #fff;">${s.department}</strong>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <span style="color: var(--text-muted);">Current CGPA:</span>
                    <strong style="color: var(--accent-emerald);">${s.cgpa} / 10.0</strong>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <span style="color: var(--text-muted);">Placement Status:</span>
                    ${
                        offered 
                        ? `<span class="badge badge-success">Placed @ ${offered.company}</span>`
                        : `<span class="badge badge-warning">${studentApps.length} Applied</span>`
                    }
                </div>

                <div style="margin-top: 0.5rem;">
                    <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="alert('Contacting student:\\nEmail: ${s.email}\\nPhone: ${s.phone || 'N/A'}')">
                        Contact Student ✉️
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function loadAnnouncements() {
    const ann = SCIMS.getAnnouncements().filter(a => a.target === 'all' || a.target === 'faculty');
    const container = document.getElementById("fac-announcements-container");
    if (!container) return;

    container.innerHTML = ann.map(item => `
        <div class="glass-panel" style="margin-bottom: 1rem; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="color: #fff; font-size: 1.05rem;">${item.title}</h4>
                <span class="badge badge-primary">${item.date}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${item.content}</p>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem;">Author: ${item.author}</div>
        </div>
    `).join("");
}

function setupActionModals(faculty) {
    // Review NOC Form Submit
    const nocForm = document.getElementById("fac-review-noc-form");
    if (nocForm) {
        nocForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nocId = document.getElementById("modal-noc-id").value;
            const status = document.getElementById("modal-noc-decision").value;
            const remarks = document.getElementById("modal-noc-remarks").value.trim();

            SCIMS.updateNOCStatus(nocId, status, remarks);
            SCIMS.showToast(`NOC request marked as ${status}`, status === "Approved" ? "success" : "error");
            closeModal("fac-review-noc-modal");
            loadOverview(faculty);
            loadNocQueue(faculty);
        });
    }

    // Grade Report Form Submit
    const reportForm = document.getElementById("fac-grade-report-form");
    if (reportForm) {
        reportForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const repId = document.getElementById("modal-rep-id").value;
            const status = document.getElementById("modal-rep-status").value;
            const grade = document.getElementById("modal-rep-grade").value;
            const remarks = document.getElementById("modal-rep-feedback").value.trim();

            SCIMS.gradeReport(repId, status, remarks, grade);
            SCIMS.showToast(`Student weekly diary evaluated (${grade})`, "success");
            closeModal("fac-grade-report-modal");
            loadOverview(faculty);
            loadReportsQueue(faculty);
        });
    }
}

// Global Modal Openers
window.openReviewNocModal = function (nocId) {
    const noc = SCIMS.getNOCRequests().find(n => n.id === nocId);
    if (!noc) return;

    document.getElementById("modal-noc-id").value = noc.id;
    document.getElementById("modal-noc-student").textContent = `${noc.studentName} (${noc.studentRoll})`;
    document.getElementById("modal-noc-company").textContent = `${noc.companyName} • ${noc.internshipRole}`;
    document.getElementById("modal-noc-duration").textContent = `${noc.duration} (Start: ${noc.startDate || 'TBD'})`;
    document.getElementById("modal-noc-decision").value = noc.status === "Pending" ? "Approved" : noc.status;
    document.getElementById("modal-noc-remarks").value = noc.remarks || "Approved based on academic performance and required credits completion.";

    openModal("fac-review-noc-modal");
};

window.quickApproveNoc = function (nocId, studentName) {
    SCIMS.updateNOCStatus(nocId, "Approved", "Expedited mentor sign-off granted.");
    SCIMS.showToast(`NOC approved for ${studentName}!`, "success");
    const faculty = SCIMS.getCurrentUser();
    loadOverview(faculty);
    loadNocQueue(faculty);
};

window.openGradeReportModal = function (repId) {
    const report = SCIMS.getReports().find(r => r.id === repId);
    if (!report) return;

    document.getElementById("modal-rep-id").value = report.id;
    document.getElementById("modal-rep-student").textContent = `${report.studentName} (${report.rollNo}) - Week ${report.weekNumber}`;
    document.getElementById("modal-rep-task-text").textContent = report.tasksCompleted;
    document.getElementById("modal-rep-learn-text").textContent = report.learningOutcome;
    document.getElementById("modal-rep-grade").value = report.grade || "A+";
    document.getElementById("modal-rep-status").value = report.status === "Submitted" ? "Approved" : report.status;
    document.getElementById("modal-rep-feedback").value = report.mentorRemarks || "Deliverables verified. Good engineering progress.";

    openModal("fac-grade-report-modal");
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
        case "Approved":
            return "badge-success";
        case "Pending":
        case "Submitted":
            return "badge-warning";
        case "Rejected":
        case "Needs Revision":
            return "badge-danger";
        default:
            return "badge-info";
    }
}

function escapeQuotes(str) {
    return (str || "").replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
