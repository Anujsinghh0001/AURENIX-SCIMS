/**
 * Smart Campus Internship Management System (SCIMS)
 * Universal Data Layer & Mock State Management
 * Persistent via localStorage with pre-seeded data for all 4 pillars
 */

const SEED_USERS = [
    // Administrator (No registration allowed)
    {
        id: "USR-ADM-001",
        name: "Dr. Vikramaditya Rathore",
        email: "admin@campus.edu",
        password: "admin123",
        role: "admin",
        designation: "Dean of Academic & Industry Partnerships",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    // Faculty / Mentors
    {
        id: "USR-FAC-101",
        name: "Prof. Arun Kumar",
        email: "arun@campus.edu",
        password: "faculty123",
        role: "faculty",
        department: "Computer Science & Engineering",
        designation: "Associate Professor & Internship Mentor",
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
        id: "USR-FAC-102",
        name: "Dr. Meera Sen",
        email: "meera@campus.edu",
        password: "faculty123",
        role: "faculty",
        department: "Electronics & Communication",
        designation: "Head of Industry Liaison",
        phone: "+91 98765 43211",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    // Students
    {
        id: "USR-STU-201",
        name: "Rahul Sharma",
        email: "rahul@campus.edu",
        password: "student123",
        role: "student",
        rollNo: "CS21B045",
        department: "Computer Science & Engineering",
        year: "3rd Year (6th Sem)",
        cgpa: "8.92",
        skills: ["React", "Node.js", "Python", "SQL", "Cloud Computing"],
        phone: "+91 91234 56789",
        resumeUrl: "resume-rahul-sharma.pdf",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
    },
    {
        id: "USR-STU-202",
        name: "Priya Verma",
        email: "priya@campus.edu",
        password: "student123",
        role: "student",
        rollNo: "EC21B012",
        department: "Electronics & Communication",
        year: "4th Year (8th Sem)",
        cgpa: "9.15",
        skills: ["Embedded C", "IoT", "TensorFlow", "MATLAB", "PCB Design"],
        phone: "+91 91234 56780",
        resumeUrl: "resume-priya-verma.pdf",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    // Recruiters / Companies
    {
        id: "USR-REC-301",
        name: "Sarah Jenkins",
        email: "sarah@google.com",
        password: "recruiter123",
        role: "recruiter",
        company: "Google Cloud",
        designation: "University Relations Lead",
        location: "Bangalore / Hybrid",
        website: "https://cloud.google.com",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
    },
    {
        id: "USR-REC-302",
        name: "David Miller",
        email: "david@microsoft.com",
        password: "recruiter123",
        role: "recruiter",
        company: "Microsoft IDC",
        designation: "Technical Talent Acquisition",
        location: "Hyderabad / Onsite",
        website: "https://microsoft.com",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    {
        id: "USR-REC-303",
        name: "Ananya Roy",
        email: "ananya@tatamotors.com",
        password: "recruiter123",
        role: "recruiter",
        company: "Tata Motors Innovation Lab",
        designation: "Campus Placement Partner",
        location: "Pune / Onsite",
        website: "https://tatamotors.com",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    }
];

const SEED_INTERNSHIPS = [
    {
        id: "INT-101",
        title: "Cloud Software Engineer Intern",
        recruiterId: "USR-REC-301",
        company: "Google Cloud",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        location: "Bangalore (Hybrid)",
        stipend: "₹85,000 / month",
        duration: "6 Months (Summer 2026)",
        mode: "Hybrid",
        category: "Software Development",
        deadline: "2026-12-15",
        status: "Active",
        eligibleDepts: ["Computer Science & Engineering", "Information Technology"],
        minCgpa: "8.0",
        openings: 5,
        description: "Join Google Cloud engineering team building next-generation distributed systems, Kubernetes orchestration, and multi-cloud observability tools.",
        skills: ["Go / Python / Java", "Distributed Systems", "Docker & Kubernetes", "Problem Solving"]
    },
    {
        id: "INT-102",
        title: "AI & GenAI Research Fellow",
        recruiterId: "USR-REC-302",
        company: "Microsoft IDC",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        location: "Hyderabad (On-site)",
        stipend: "₹75,000 / month",
        duration: "3 Months (Intensive)",
        mode: "On-site",
        category: "Artificial Intelligence",
        deadline: "2026-12-20",
        status: "Active",
        eligibleDepts: ["Computer Science & Engineering", "Electronics & Communication"],
        minCgpa: "8.5",
        openings: 3,
        description: "Contribute to cutting-edge LLM alignment, agentic workflows, and semantic index optimization in collaboration with Microsoft Research scientists.",
        skills: ["PyTorch / JAX", "Transformers & LLMs", "Python", "Data Analysis"]
    },
    {
        id: "INT-103",
        title: "Connected Vehicle & IoT Firmware Intern",
        recruiterId: "USR-REC-303",
        company: "Tata Motors Innovation Lab",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg",
        location: "Pune (On-site)",
        stipend: "₹45,000 / month",
        duration: "6 Months",
        mode: "On-site",
        category: "Embedded & Hardware",
        deadline: "2026-11-30",
        status: "Active",
        eligibleDepts: ["Electronics & Communication", "Electrical Engineering", "Computer Science & Engineering"],
        minCgpa: "7.5",
        openings: 4,
        description: "Design telematics gateway firmware, CAN-bus integration modules, and real-time battery analytics telemetry for next-gen electric vehicles.",
        skills: ["Embedded C / C++", "RTOS", "CAN Bus Protocol", "Hardware Debugging"]
    },
    {
        id: "INT-104",
        title: "FinTech Full-Stack Developer",
        recruiterId: "USR-REC-301",
        company: "Google Cloud",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        location: "Bengaluru (Remote)",
        stipend: "₹65,000 / month",
        duration: "4 Months",
        mode: "Remote",
        category: "Software Development",
        deadline: "2026-12-28",
        status: "Active",
        eligibleDepts: ["Computer Science & Engineering", "Information Technology"],
        minCgpa: "7.8",
        openings: 2,
        description: "Develop resilient banking microservices and zero-latency transactional interfaces using TypeScript, GraphQL, and cloud-native databases.",
        skills: ["TypeScript", "Node.js", "React", "PostgreSQL", "Kafka"]
    }
];

const SEED_APPLICATIONS = [
    {
        id: "APP-901",
        internshipId: "INT-101",
        studentId: "USR-STU-201",
        studentName: "Rahul Sharma",
        studentRoll: "CS21B045",
        studentDept: "Computer Science & Engineering",
        studentCgpa: "8.92",
        studentEmail: "rahul@campus.edu",
        company: "Google Cloud",
        role: "Cloud Software Engineer Intern",
        appliedDate: "2026-11-05",
        status: "Shortlisted", // Applied, Shortlisted, Interview Scheduled, Offered, Rejected
        coverNote: "I have built production Docker deployments and contributed to open-source Kubernetes operators.",
        interviewDate: "2026-11-18 at 2:00 PM IST"
    },
    {
        id: "APP-902",
        internshipId: "INT-102",
        studentId: "USR-STU-201",
        studentName: "Rahul Sharma",
        studentRoll: "CS21B045",
        studentDept: "Computer Science & Engineering",
        studentCgpa: "8.92",
        studentEmail: "rahul@campus.edu",
        company: "Microsoft IDC",
        role: "AI & GenAI Research Fellow",
        appliedDate: "2026-11-06",
        status: "Applied",
        coverNote: "Interested in multimodal agent architectures and vector retrieval systems.",
        interviewDate: null
    },
    {
        id: "APP-903",
        internshipId: "INT-103",
        studentId: "USR-STU-202",
        studentName: "Priya Verma",
        studentRoll: "EC21B012",
        studentDept: "Electronics & Communication",
        studentCgpa: "9.15",
        studentEmail: "priya@campus.edu",
        company: "Tata Motors Innovation Lab",
        role: "Connected Vehicle & IoT Firmware Intern",
        appliedDate: "2026-11-02",
        status: "Offered",
        coverNote: "Developed an IoT battery thermal monitor with 98% telemetry reliability on STM32 microcontrollers.",
        interviewDate: "Completed on 2026-11-08"
    }
];

const SEED_NOC_REQUESTS = [
    {
        id: "NOC-501",
        studentId: "USR-STU-201",
        studentName: "Rahul Sharma",
        studentRoll: "CS21B045",
        department: "Computer Science & Engineering",
        companyName: "Google Cloud",
        internshipRole: "Cloud Software Engineer Intern",
        duration: "6 Months",
        startDate: "2027-01-10",
        endDate: "2027-07-10",
        facultyMentorId: "USR-FAC-101",
        facultyMentorName: "Prof. Arun Kumar",
        stipend: "₹85,000 / month",
        status: "Pending", // Pending, Approved, Rejected
        remarks: "Awaiting final semester timetable alignment.",
        requestDate: "2026-11-08",
        offerLetterUploaded: true
    },
    {
        id: "NOC-502",
        studentId: "USR-STU-202",
        studentName: "Priya Verma",
        studentRoll: "EC21B012",
        department: "Electronics & Communication",
        companyName: "Tata Motors Innovation Lab",
        internshipRole: "Connected Vehicle & IoT Firmware Intern",
        duration: "6 Months",
        startDate: "2026-12-01",
        endDate: "2027-05-31",
        facultyMentorId: "USR-FAC-102",
        facultyMentorName: "Dr. Meera Sen",
        stipend: "₹45,000 / month",
        status: "Approved",
        remarks: "Approved. All lab project deliverables submitted in advance.",
        requestDate: "2026-11-04",
        offerLetterUploaded: true
    }
];

const SEED_REPORTS = [
    {
        id: "REP-301",
        studentId: "USR-STU-202",
        studentName: "Priya Verma",
        rollNo: "EC21B012",
        company: "Tata Motors Innovation Lab",
        weekNumber: 1,
        title: "Onboarding, Hardware Lab Setup & Safety Protocols",
        submissionDate: "2026-11-09",
        tasksCompleted: "Configured JTAG debugger, verified CAN transceiver isolation circuits, signed lab IP protocols.",
        learningOutcome: "Understood real-world automotive hardware safety compliance standards (ISO 26262).",
        status: "Approved", // Pending, Approved, Needs Revision
        mentorRemarks: "Excellent start. Ensure you log CAN bus packet drop rates in your next report.",
        grade: "A+"
    }
];

const SEED_ANNOUNCEMENTS = [
    {
        id: "ANN-001",
        title: "Campus Summer 2026 Internship Fair Schedule",
        author: "Admin Office",
        date: "2026-11-01",
        target: "all",
        content: "Over 45 Tier-1 tech and core engineering companies have registered. Ensure your resume and CGPA are updated before December 1st."
    },
    {
        id: "ANN-002",
        title: "Mandatory NOC Policy Guidelines for 6th & 8th Semesters",
        author: "Dr. Vikramaditya Rathore",
        date: "2026-11-04",
        target: "student",
        content: "All students must obtain digital NOC sign-off from their assigned faculty mentor prior to accepting any off-campus internship offer."
    },
    {
        id: "ANN-003",
        title: "Weekly Log Submission Reminder for Faculty Guides",
        author: "Dean Academics",
        date: "2026-11-07",
        target: "faculty",
        content: "Faculty guides are requested to review and grade pending weekly milestone diaries by every Sunday evening."
    }
];

// Core System State Manager
window.SCIMS = {
    KEYS: {
        USERS: "SCIMS_USERS",
        INTERNSHIPS: "SCIMS_INTERNSHIPS",
        APPLICATIONS: "SCIMS_APPLICATIONS",
        NOC: "SCIMS_NOC_REQUESTS",
        REPORTS: "SCIMS_REPORTS",
        ANNOUNCEMENTS: "SCIMS_ANNOUNCEMENTS",
        SESSION: "SCIMS_SESSION"
    },

    init: function () {
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(SEED_USERS));
        }
        if (!localStorage.getItem(this.KEYS.INTERNSHIPS)) {
            localStorage.setItem(this.KEYS.INTERNSHIPS, JSON.stringify(SEED_INTERNSHIPS));
        }
        if (!localStorage.getItem(this.KEYS.APPLICATIONS)) {
            localStorage.setItem(this.KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
        }
        if (!localStorage.getItem(this.KEYS.NOC)) {
            localStorage.setItem(this.KEYS.NOC, JSON.stringify(SEED_NOC_REQUESTS));
        }
        if (!localStorage.getItem(this.KEYS.REPORTS)) {
            localStorage.setItem(this.KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
        }
        if (!localStorage.getItem(this.KEYS.ANNOUNCEMENTS)) {
            localStorage.setItem(this.KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
        }
    },

    getUsers: function () {
        this.init();
        return JSON.parse(localStorage.getItem(this.KEYS.USERS) || "[]");
    },

    saveUsers: function (users) {
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    getCurrentUser: function () {
        const raw = sessionStorage.getItem(this.KEYS.SESSION) || localStorage.getItem(this.KEYS.SESSION);
        return raw ? JSON.parse(raw) : null;
    },

    setCurrentUser: function (user, remember = true) {
        const payload = JSON.stringify(user);
        if (remember) {
            localStorage.setItem(this.KEYS.SESSION, payload);
        }
        sessionStorage.setItem(this.KEYS.SESSION, payload);
    },

    logout: function (redirectUrl = "../index.html") {
        localStorage.removeItem(this.KEYS.SESSION);
        sessionStorage.removeItem(this.KEYS.SESSION);
        window.location.href = redirectUrl;
    },

    login: function (email, password, expectedRole) {
        const users = this.getUsers();
        const user = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password);
        
        if (!user) {
            return { success: false, message: "Invalid email or password. Please verify credentials." };
        }
        if (expectedRole && user.role !== expectedRole) {
            return { 
                success: false, 
                message: `This email belongs to a ${user.role.toUpperCase()} account. Please switch to the ${user.role} portal.` 
            };
        }
        this.setCurrentUser(user);
        return { success: true, user: user };
    },

    register: function (userData) {
        const users = this.getUsers();
        const exists = users.some(u => u.email.trim().toLowerCase() === userData.email.trim().toLowerCase());
        if (exists) {
            return { success: false, message: "An account with this email address is already registered." };
        }

        const newUser = {
            id: `USR-${userData.role.slice(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
            ...userData,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);
        this.setCurrentUser(newUser);
        return { success: true, user: newUser };
    },

    // Internships
    getInternships: function () {
        this.init();
        return JSON.parse(localStorage.getItem(this.KEYS.INTERNSHIPS) || "[]");
    },

    saveInternships: function (list) {
        localStorage.setItem(this.KEYS.INTERNSHIPS, JSON.stringify(list));
    },

    addInternship: function (internship) {
        const list = this.getInternships();
        const newInt = {
            id: `INT-${Date.now().toString().slice(-4)}`,
            status: "Active",
            openings: parseInt(internship.openings || 1),
            ...internship
        };
        list.unshift(newInt);
        this.saveInternships(list);
        return newInt;
    },

    // Applications
    getApplications: function () {
        this.init();
        return JSON.parse(localStorage.getItem(this.KEYS.APPLICATIONS) || "[]");
    },

    saveApplications: function (list) {
        localStorage.setItem(this.KEYS.APPLICATIONS, JSON.stringify(list));
    },

    applyForInternship: function (student, internshipId, coverNote) {
        const apps = this.getApplications();
        const already = apps.find(a => a.studentId === student.id && a.internshipId === internshipId);
        if (already) {
            return { success: false, message: "You have already applied for this position." };
        }

        const internships = this.getInternships();
        const job = internships.find(i => i.id === internshipId);
        if (!job) {
            return { success: false, message: "Internship listing not found." };
        }

        const newApp = {
            id: `APP-${Date.now().toString().slice(-4)}`,
            internshipId: job.id,
            studentId: student.id,
            studentName: student.name,
            studentRoll: student.rollNo || "N/A",
            studentDept: student.department || "General",
            studentCgpa: student.cgpa || "N/A",
            studentEmail: student.email,
            company: job.company,
            role: job.title,
            appliedDate: new Date().toISOString().split("T")[0],
            status: "Applied",
            coverNote: coverNote || "Excited to contribute my technical skills and learn from the engineering team.",
            interviewDate: null
        };

        apps.unshift(newApp);
        this.saveApplications(apps);
        return { success: true, application: newApp };
    },

    updateApplicationStatus: function (appId, newStatus, interviewDate = null) {
        const apps = this.getApplications();
        const app = apps.find(a => a.id === appId);
        if (app) {
            app.status = newStatus;
            if (interviewDate) app.interviewDate = interviewDate;
            this.saveApplications(apps);
            return true;
        }
        return false;
    },

    // NOC Requests
    getNOCRequests: function () {
        this.init();
        return JSON.parse(localStorage.getItem(this.KEYS.NOC) || "[]");
    },

    saveNOCRequests: function (list) {
        localStorage.setItem(this.KEYS.NOC, JSON.stringify(list));
    },

    requestNOC: function (nocData) {
        const list = this.getNOCRequests();
        const newNOC = {
            id: `NOC-${Date.now().toString().slice(-4)}`,
            status: "Pending",
            requestDate: new Date().toISOString().split("T")[0],
            ...nocData
        };
        list.unshift(newNOC);
        this.saveNOCRequests(list);
        return newNOC;
    },

    updateNOCStatus: function (nocId, status, remarks) {
        const list = this.getNOCRequests();
        const item = list.find(n => n.id === nocId);
        if (item) {
            item.status = status;
            if (remarks) item.remarks = remarks;
            this.saveNOCRequests(list);
            return true;
        }
        return false;
    },

    // Weekly Reports
    getReports: function () {
        this.init();
        return JSON.parse(localStorage.getItem(this.KEYS.REPORTS) || "[]");
    },

    saveReports: function (list) {
        localStorage.setItem(this.KEYS.REPORTS, JSON.stringify(list));
    },

    submitReport: function (reportData) {
        const list = this.getReports();
        const newReport = {
            id: `REP-${Date.now().toString().slice(-4)}`,
            submissionDate: new Date().toISOString().split("T")[0],
            status: "Submitted",
            grade: null,
            mentorRemarks: "Awaiting mentor evaluation.",
            ...reportData
        };
        list.unshift(newReport);
        this.saveReports(list);
        return newReport;
    },

    gradeReport: function (reportId, status, remarks, grade) {
        const list = this.getReports();
        const item = list.find(r => r.id === reportId);
        if (item) {
            item.status = status;
            item.mentorRemarks = remarks;
            item.grade = grade;
            this.saveReports(list);
            return true;
        }
        return false;
    },

    // Announcements
    getAnnouncements: function () {
        this.init();
        return JSON.parse(localStorage.getItem(this.KEYS.ANNOUNCEMENTS) || "[]");
    },

    saveAnnouncements: function (list) {
        localStorage.setItem(this.KEYS.ANNOUNCEMENTS, JSON.stringify(list));
    },

    addAnnouncement: function (item) {
        const list = this.getAnnouncements();
        const newAnn = {
            id: `ANN-${Date.now().toString().slice(-4)}`,
            date: new Date().toISOString().split("T")[0],
            ...item
        };
        list.unshift(newAnn);
        this.saveAnnouncements(list);
        return newAnn;
    },

    // Auth Route Guard
    requireAuth: function (role, loginPath = "login.html") {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = loginPath;
            return null;
        }
        if (role && user.role !== role) {
            alert(`Unauthorized: This page requires ${role.toUpperCase()} permissions.`);
            window.location.href = `../${user.role}/dashboard.html`;
            return null;
        }
        return user;
    },

    // Toast Notification helper
    showToast: function (message, type = "info") {
        let container = document.getElementById("scims-toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "scims-toast-container";
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `scims-toast toast-${type}`;
        
        const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-msg">${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("toast-show");
        }, 10);

        setTimeout(() => {
            toast.classList.remove("toast-show");
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    }
};

// Auto-run init
window.SCIMS.init();
