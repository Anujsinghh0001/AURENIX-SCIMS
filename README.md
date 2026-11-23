# Smart Campus Internship Management System (SCIMS)

An enterprise-grade, modern, and client-side web application architected for universities to seamlessly manage the entire lifecycle of student internships across four vital institutional pillars: **Student**, **Faculty**, **Corporate Recruiter**, and **Administrator**.

---

## 📌 Problem Statement & Architecture

### The Problem
Traditional college and university internship management is notoriously fragmented:
1. **Students** struggle to track verified internship openings, obtain departmental NOC (No Objection Certificate) clearances, submit progress reports, and track multi-stage interview results.
2. **Faculty Guides** are overwhelmed with manual physical paperwork, lack visibility into student off-campus offers, and have no centralized record of students' weekly progress logs.
3. **Corporate Recruiters** receive unstructured emails with resumes and lack direct access to academic CGPA verification and student readiness data.
4. **Campus Administrators** lack consolidated real-time analytics to audit placement conversion rates, evaluate departmental metrics, and enforce institutional governance.

### How SCIMS Solves This ("Understand -> Think -> Apply")
- **Pure Client-Side Architecture**: Built strictly with HTML5, CSS3, and Modern JavaScript—zero server backend required.
- **Persistent State Management**: Uses structured JavaScript constant seed datasets (`data.js`) hydrated into browser `localStorage`, ensuring that newly registered accounts, applications, NOC requests, weekly diaries, and job postings persist dynamically in real time across browser tabs.
- **Dedicated Role-Based Portals**:
  - **Student Portal**: Explore corporate openings, apply with 1-click & custom statements, request digital faculty NOC clearance, submit weekly milestone diaries, and track real-time hiring decisions.
  - **Faculty Portal**: Review and issue digital NOC clearances, grade and comment on student weekly progress diaries, and inspect mentee academic cohorts.
  - **Recruiter Portal**: Post new corporate internship listings, review student applications in an ATS funnel, schedule interviews, and extend formal job offers.
  - **Administrator Portal**: Master institutional oversight—inspect all user accounts via RBAC directory, audit job postings, broadcast campus-wide notices, and download accredited audit reports. Strictly protected with direct administrative authentication (**no public registration**).

---

## 🔑 Pre-Seeded Demo Credentials

| Pillar / Portal | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **👨‍🎓 Student** | `rahul@campus.edu` | `student123` | View internships, 1-click apply, submit NOC & weekly logs |
| **👩‍🏫 Faculty** | `arun@campus.edu` | `faculty123` | Approve/Reject NOCs, grade weekly diaries, review mentees |
| **💼 Recruiter** | `sarah@google.com` | `recruiter123` | Post new roles, shortlist candidates, schedule interviews, offer |
| **🛡️ Administrator** | `admin@campus.edu` | `admin123` | Master governance, audit reports, user directory (No registration) |

*Note: All login screens also feature a one-click "Auto-Fill Demo Credentials" button for instant testing, as well as registration links for Student, Faculty, and Recruiter.*

---

## 📂 Project Directory Structure

```
smart-campus-internship-system/
├── index.html                    # Central Portal Gateway & System Showcase
├── README.md                     # Comprehensive Architecture & User Guide
├── assets/
│   ├── css/
│   │   └── shared.css            # Dark glassmorphic design system, typography & components
│   └── js/
│       └── data.js               # Universal state store, mock seed data & auth guards
├── student/
│   ├── login.html                # Student Authentication
│   ├── register.html             # Student Profile Registration
│   ├── dashboard.html            # Applications, Internships, NOC & Weekly Diaries
│   ├── student.css               # Dedicated Student Styles
│   └── student.js                # Student Workflow Logic
├── faculty/
│   ├── login.html                # Faculty Guide Authentication
│   ├── register.html             # Faculty Guide Registration
│   ├── dashboard.html            # NOC Clearance Desk, Diary Grading & Mentee Roster
│   ├── faculty.css               # Dedicated Faculty Styles
│   └── faculty.js                # Faculty Evaluation Logic
├── recruiter/
│   ├── login.html                # Recruiter Authentication
│   ├── register.html             # Corporate Employer Registration
│   ├── dashboard.html            # Post Roles, Applicant ATS & Interview Scheduling
│   ├── recruiter.css             # Dedicated Recruiter Styles
│   └── recruiter.js              # Recruiter Sourcing Logic
└── admin/
    ├── login.html                # Master Admin Authentication (Protected, No Public Register)
    ├── dashboard.html            # Institutional Governance, Audit Reports & Broadcasts
    ├── admin.css                 # Dedicated Admin Styles
    └── admin.js                  # Master Administrative Logic
```

---

## 🚀 How to Run the Project

1. Simply double-click `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
2. No Node.js, Webpack, or backend server installation is required.
3. Everything runs locally in the browser with full persistent state across reloads.
