/**
 * Administrator Console Logic (SCIMS)
 */

document.addEventListener("DOMContentLoaded", function () {
    const admin = SCIMS.requireAuth("admin", "login.html");
    if (!admin) return;

    renderAdminHeader(admin);
    setupTabs();

    loadOverview();
    loadUserDirectory();
    loadCorporateOpenings();
    loadAnnouncements();

    setupBroadcastForm(admin);
});

function renderAdminHeader(admin) {
    const nameEl = document.getElementById("admin-header-name");
    const roleEl = document.getElementById("admin-header-role");
    const avatarEl = document.getElementById("admin-header-avatar");

    if (nameEl) nameEl.textContent = admin.name;
    if (roleEl) roleEl.textContent = `${admin.designation || 'Institutional Administrator'}`;
    if (avatarEl && admin.avatar) avatarEl.src = admin.avatar;
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

function loadOverview() {
    const users = SCIMS.getUsers();
    const students = users.filter(u => u.role === "student");
    const faculty = users.filter(u => u.role === "faculty");
    const recruiters = users.filter(u => u.role === "recruiter");

    const apps = SCIMS.getApplications();
    const nocs = SCIMS.getNOCRequests();
    const approvedNocs = nocs.filter(n => n.status === "Approved");
    const offered = apps.filter(a => a.status === "Offered");

    const elStu = document.getElementById("stat-adm-students");
    const elFac = document.getElementById("stat-adm-faculty");
    const elRec = document.getElementById("stat-adm-recruiters");
    const elApps = document.getElementById("stat-adm-apps");
    const elNocs = document.getElementById("stat-adm-nocs");
    const elOffers = document.getElementById("stat-adm-offers");

    if (elStu) elStu.textContent = students.length;
    if (elFac) elFac.textContent = faculty.length;
    if (elRec) elRec.textContent = recruiters.length;
    if (elApps) elApps.textContent = apps.length;
    if (elNocs) elNocs.textContent = approvedNocs.length;
    if (elOffers) elOffers.textContent = offered.length;
}

function loadUserDirectory() {
    const users = SCIMS.getUsers();
    const tbody = document.getElementById("admin-users-tbody");
    if (!tbody) return;

    window.allCampusUsers = users;
    renderUserRows(users);

    const searchInput = document.getElementById("search-users-input");
    const roleSelect = document.getElementById("filter-user-role");

    function applyUserFilter() {
        const query = (searchInput?.value || "").toLowerCase();
        const role = roleSelect?.value || "all";

        const filtered = users.filter(u => {
            const matchesQuery = u.name.toLowerCase().includes(query) ||
                                 u.email.toLowerCase().includes(query) ||
                                 (u.department && u.department.toLowerCase().includes(query)) ||
                                 (u.company && u.company.toLowerCase().includes(query));
            const matchesRole = role === "all" || u.role === role;
            return matchesQuery && matchesRole;
        });

        renderUserRows(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyUserFilter);
    if (roleSelect) roleSelect.addEventListener("change", applyUserFilter);
}

function renderUserRows(list) {
    const tbody = document.getElementById("admin-users-tbody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching campus accounts found.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(u => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${u.avatar || 'https://via.placeholder.com/32'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
                    <div>
                        <strong>${u.name}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${u.id}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="role-badge-pill role-${u.role}">${u.role}</span>
            </td>
            <td>${u.email}</td>
            <td>${u.department || u.company || 'University Central'}</td>
            <td>${u.rollNo || u.designation || 'Master Admin'}</td>
            <td>
                <span class="badge badge-success">Active</span>
            </td>
        </tr>
    `).join("");
}

function loadCorporateOpenings() {
    const jobs = SCIMS.getInternships();
    const apps = SCIMS.getApplications();
    const tbody = document.getElementById("admin-jobs-tbody");
    if (!tbody) return;

    tbody.innerHTML = jobs.map(job => {
        const count = apps.filter(a => a.internshipId === job.id).length;
        return `
            <tr>
                <td><strong>${job.company}</strong></td>
                <td><strong>${job.title}</strong></td>
                <td><span class="detail-pill">${job.mode}</span></td>
                <td>${job.stipend}</td>
                <td>${job.openings} Openings</td>
                <td><span class="badge badge-primary">${count} Applicants</span></td>
                <td><span class="badge badge-success">${job.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="toggleJobStatus('${job.id}')">Toggle State</button>
                </td>
            </tr>
        `;
    }).join("");
}

window.toggleJobStatus = function (jobId) {
    const jobs = SCIMS.getInternships();
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        job.status = job.status === "Active" ? "Paused" : "Active";
        SCIMS.saveInternships(jobs);
        SCIMS.showToast(`Listing ${job.title} set to ${job.status}`, "info");
        loadCorporateOpenings();
    }
};

function loadAnnouncements() {
    const ann = SCIMS.getAnnouncements();
    const container = document.getElementById("admin-announcements-list");
    if (!container) return;

    container.innerHTML = ann.map(item => `
        <div class="glass-panel" style="margin-bottom: 1rem; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="color: #fff; font-size: 1.05rem;">${item.title}</h4>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <span class="badge badge-info">Audience: ${item.target.toUpperCase()}</span>
                    <span class="badge badge-primary">${item.date}</span>
                </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${item.content}</p>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem;">Published by: ${item.author}</div>
        </div>
    `).join("");
}

function setupBroadcastForm(admin) {
    const form = document.getElementById("broadcast-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newAnn = {
            title: document.getElementById("ann-title").value.trim(),
            author: admin.name,
            target: document.getElementById("ann-target").value,
            content: document.getElementById("ann-content").value.trim()
        };

        SCIMS.addAnnouncement(newAnn);
        SCIMS.showToast("Official campus announcement broadcasted!", "success");
        form.reset();
        loadAnnouncements();
    });
}

// Simulated Export Report
window.generateInstitutionalAuditReport = function () {
    const users = SCIMS.getUsers();
    const jobs = SCIMS.getInternships();
    const apps = SCIMS.getApplications();
    const nocs = SCIMS.getNOCRequests();
    const reports = SCIMS.getReports();

    const reportContent = `
================================================================================
SMART CAMPUS INTERNSHIP MANAGEMENT SYSTEM (SCIMS) - INSTITUTIONAL AUDIT DOSSIER
Generated On: ${new Date().toLocaleString()}
Authority: Office of Dean, Academic & Corporate Affairs
================================================================================

1. DEMOGRAPHIC SUMMARY:
   - Total Registered Students: ${users.filter(u => u.role === 'student').length}
   - Authorized Faculty Guides: ${users.filter(u => u.role === 'faculty').length}
   - Corporate Recruiter Entities: ${users.filter(u => u.role === 'recruiter').length}
   - Master Administrators: ${users.filter(u => u.role === 'admin').length}

2. INTERNSHIP & PLACEMENT FUNNEL:
   - Active Corporate Openings: ${jobs.filter(j => j.status === 'Active').length}
   - Total Student Applications Logged: ${apps.length}
   - Candidate Shortlists / Interviews: ${apps.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled').length}
   - Formal Offers Extended: ${apps.filter(a => a.status === 'Offered').length}

3. CLEARANCE & COMPLIANCE GOVERNANCE:
   - Total NOC Clearance Requests: ${nocs.length}
   - Approved Institutional NOCs: ${nocs.filter(n => n.status === 'Approved').length}
   - Pending Faculty Reviews: ${nocs.filter(n => n.status === 'Pending').length}
   - Weekly Milestone Diaries Logged: ${reports.length}

4. CORPORATE PARTNERS:
   ${jobs.map(j => `* ${j.company} - ${j.title} (${j.stipend})`).join('\n   ')}

================================================================================
END OF AUDIT REPORT • SYSTEM COMPLIANCE VERIFIED
================================================================================
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SCIMS-Campus-Audit-Report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    SCIMS.showToast("Institutional Audit Report downloaded successfully!", "success");
};

// Reset Mock Database Helper for Testing
window.resetMockData = function () {
    if (confirm("Reset system state to factory demo data? This clears any newly created mock records.")) {
        localStorage.clear();
        sessionStorage.clear();
        SCIMS.init();
        alert("Database successfully reset to default factory state!");
        window.location.reload();
    }
};
