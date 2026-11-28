Joineazy — Course, Group & Assignment Management Platform (Round 2)
​An enhanced full-stack academic workspace built with React.js, Tailwind CSS, Node.js, Express, and PostgreSQL 16. Round 2 introduces a split-screen JWT authentication flow, course-centric Student and Professor dashboards with animated SVG progress rings, Individual vs. Group assignment workflows, strict Group Leader-only acknowledgment propagation, and real-time faculty submission status filtering.
​Live Project Links
​Live Deployed Platform: https://assignment-system-nine.vercel.app/
​GitHub Repository: https://github.com/Parashuram2006/assignment-system/tree/main
​Working Demo Video: https://drive.google.com/file/d/1qktOigP8s7HmMzht25vvyQBMBJ8BV8So/view?usp=sharing
​1. UI/UX Design Choices & Rationale
​1. Split-Screen Authentication & Role-Based Redirection:
​Design: A high-contrast split-screen layout pairing an academic product showcase on the left with a clean sign-in and registration card on the right, complete with inline field validation, password visibility toggle, an animated JWT verification spinner, and 1-click demo role switcher cards.
​Rationale: Reduces onboarding friction for evaluators while clearly communicating JWT-backed authentication and automatic role-based routing (Student Enrolled Courses vs. Professor Console).
​2. Course-Centric Dashboards & Circular Progress Visualization:
​Design: Instead of showing all tasks in a single flat list, Students see a responsive card grid of Enrolled Courses (CS-401, CS-405, CS-412) with gradient course banners, instructor avatars, and animated SVG circular completion rings. Professors see Courses Taught with enrolled student counts and aggregate completion rings.
​Rationale: Mirrors real university workflows—students navigate by course first, and faculty immediately see per-course engagement before drilling into individual assignments.
​3. 3-Step Visual Submission Stepper & Celebratory Micro-Animations:
​Design: Each assignment card features a visual 3-step workflow bar (1. Open OneDrive Folder -> 2. Upload Deliverables -> 3. Leader / Student Acknowledges), urgency deadline badges, and an animated emerald card glow plus checkmark pop upon verification.
​Rationale: Decouples external OneDrive file uploads from final acknowledgment while giving immediate visual confirmation when a task is completed.
​4. Group Leader-Only Acknowledgment Enforcement:
​Design: Group assignments display a Group Assignment badge. Only the designated Group Leader sees the active Acknowledge Group Submission button; non-leader group members see an explicit status lock (Only Group Leader Can Acknowledge) until the leader submits, at which point the verified status and timestamp automatically reflect across all group members.
​Rationale: Prevents conflicting or duplicate confirmations within a team while keeping every group member synchronized in real time.
​2. Frontend Component Architecture
​App.jsx (JWT Session State, Local/API Sync Layer & Role Router)
├── ToastNotification (Non-blocking feedback banner)
├── AuthScreen (Split-screen Login/Register, live validation & 1-Click Role Switcher)
├── StudentWorkspace
│   ├── EnrolledCoursesGrid (Responsive course cards + CircularProgress SVG rings)
│   ├── CourseAssignmentsView
│   │   ├── CourseScopeHeader & CourseFilterPills
│   │   ├── AssignmentCard (3-Step Stepper + Group Leader Lock / Ack Action)
│   │   └── SubmissionVerificationModal (Checklist confirmation + audit note)
│   └── MyGroupView (Team roster, invite code copy, Group Leader peer onboarding)
└── ProfessorWorkspace
├── CoursesTaughtDashboard (KPI MetricCards + Courses Taught grid)
├── CourseAssignmentsCRUD (Create, Edit, Delete Individual/Group assignments)
├── SubmissionsTracker (Filter by Status: All / Acknowledged / Pending + Search)
└── AnalyticsView (Real-time completion bars across all courses & assignments)
​3. UI Flow Walkthrough
​1. Authentication (AuthScreen): Users sign in or register with email and password validation. Upon JWT issuance, Students redirect to Enrolled Courses and Professors redirect to Courses & Overview.
​2. Student Course Dashboard (EnrolledCoursesGrid): Displays overall completion percentage alongside individual course cards (CS-401, CS-405, CS-412). Clicking any course opens its assignment list.
​3. Assignment & Group Leader Flow (CourseAssignmentsView):
​For Individual tasks, any enrolled student can open OneDrive, upload work, and click Submit & Acknowledge.
​For Group tasks, the Group Leader (Aarav Patel) confirms submission via the verification modal, triggering an animated checkmark and syncing completion to group members (Sneha Nair). Non-leaders see a leader-only lock badge prior to submission.
​4. Professor Console (ProfessorWorkspace): Faculty monitor enrolled student counts per course, create or edit assignments (INDIVIDUAL or GROUP), and filter submissions by All, Acknowledged, or Pending.
​4. Relational Database Schema (PostgreSQL 16)
​+------------------+       +--------------------+       +------------------+
|      users       |       | course_enrollments |       |     courses      |
+------------------+       +--------------------+       +------------------+
| PK id (UUID)     |--1:N--| FK student_id      |--N:1--| PK id (UUID)     |
|    code_id       |       | FK course_id       |       |    code (UNIQUE) |
|    name          |       +--------------------+       |    title         |
|    email (UNIQUE)|                                    |    semester      |
|    password_hash |       +--------------------+       | FK professor_id  |
|    role (ENUM)   |       |   group_members    |       +------------------+
+------------------+       +--------------------+                | 1:N
|                  | PK id (UUID)       |                v
|--1:1-------------| FK user_id (UNIQUE)|       +------------------+
|                  | FK group_id        |       |   assignments    |
|                  |    role_in_group   |       +------------------+
|                  +--------------------+       | PK id (UUID)     |
|                            |                  | FK course_id     |
v                            v                  |    title         |
+--------------------------------------------------+    |    deadline      |
|                   submissions                    |    |    onedrive_url  |
+--------------------------------------------------+    |    submission_type|
| PK id (UUID) | FK assignment_id | submission_type|    +------------------+
| FK group_id  | FK student_id    | status         |
| FK acknowledged_by | note       | acknowledged_at|
+--------------------------------------------------+
​5. REST API Endpoints
​POST /api/auth/register (Public) — Register Student or Professor & return JWT + redirect path
​POST /api/auth/login (Public) — Authenticate credentials & return JWT + redirect path
​GET /api/courses (Authenticated) — Fetch enrolled courses (Student) or taught courses (Professor)
​GET /api/courses/:courseId/assignments (Authenticated) — Fetch course assignments with group/individual submission status
​POST /api/assignments (Professor) — Create a new Individual or Group assignment for a course
​POST /api/submissions/acknowledge (Student) — Acknowledge submission (enforces Group Leader check for group tasks)
​6. Setup Instructions (Run Locally)
​Option A: Quick Start with Docker Compose (PostgreSQL + Backend API)
​git clone https://github.com/Parashuram2006/assignment-system.git
cd assignment-system
docker-compose up -d
​PostgreSQL 16 automatically initializes backend/schema.sql, and the Express API starts at http://localhost:5000.
​Option B: Manual Local Setup
​1. Backend Server (Node.js + Express + PostgreSQL):
​cd backend
npm install
npm start
​2. Frontend Client (React + Vite + Tailwind CSS):
​cd frontend
npm install
npm run dev
​Open http://localhost:5173 in your browser.
