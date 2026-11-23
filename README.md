# Joineazy — Student, Group & Assignment Management System

Role-based full-stack web application enabling students to self-organize into project groups, access external OneDrive assignment folders, and verify submissions via a two-step confirmation flow—while professors manage assignments and monitor group-wise and student-wise progress.

---

## 1. System Architecture Overview

```
┌────────────────────────┐     REST API + JWT      ┌──────────────────────────┐
│   React + Tailwind     │ ──────────────────────► │  Node.js + Express API   │
│   Frontend (App.jsx)   │ ◄────────────────────── │  (RBAC: Student / Admin) │
└────────────────────────┘      JSON Payloads      └────────────┬─────────────┘
                                                                │ pg Pool (SQL)
                                                                ▼
                                                   ┌──────────────────────────┐
                                                   │   PostgreSQL 16 Database │
                                                   │  (Normalized Relational) │
                                                   └──────────────────────────┘
```

## 2. Database Schema & Entity-Relationship (ER) Diagram

```
+------------------+       +--------------------+       +------------------+
|      users       |       |   group_members    |       |      groups      |
+------------------+       +--------------------+       +------------------+
| PK id (UUID)     |--1:1--| FK user_id (UNIQUE)|--N:1--| PK id (UUID)     |
|    code_id       |       | FK group_id        |       |    name          |
|    name          |       |    role_in_group   |       |    invite_code   |
|    email (UNIQUE)|       |    joined_at       |       | FK created_by    |
|    password_hash |       +--------------------+       +------------------+
|    role (ENUM)   |                                             | 1:N
+------------------+                                             ▼
+------------------+       +--------------------+       +------------------+
|   assignments    |       | assignment_targets |       |   submissions    |
+------------------+       +--------------------+       +------------------+
| PK id (UUID)     |--1:N--| FK assignment_id   |       | PK id (UUID)     |
|    title         |       | FK group_id        |       | FK assignment_id |
|    description   |       +--------------------+       | FK group_id      |
|    due_date      |                                    | FK confirmed_by  |
|    onedrive_url  |                                    |    confirmed_at  |
|    target_type   |                                    |    note          |
+------------------+                                    +------------------+
```

## 3. REST API Endpoints

| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a Student or Admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue signed JWT |
| `GET` | `/api/groups/my` | Student | Fetch current student's group & roster |
| `POST` | `/api/groups` | Student | Create a new project group (transactional) |
| `POST` | `/api/groups/:groupId/members` | Student | Add peer via email or Student ID |
| `GET` | `/api/assignments` | Authenticated | Role-scoped assignment list & status |
| `POST` | `/api/assignments` | Admin | Publish assignment (All or Specific groups) |
| `PUT` | `/api/assignments/:id` | Admin | Update assignment metadata or targets |
| `DELETE` | `/api/assignments/:id` | Admin | Delete assignment & cascade records |
| `POST` | `/api/submissions/confirm` | Student | Record verified group submission |
| `GET` | `/api/analytics/overview` | Admin | Summary completion metrics |

## 4. Setup & Run Instructions

### Using Docker Compose (PostgreSQL + Backend API)
```bash
docker-compose up -d
```
The PostgreSQL database automatically initializes `backend/schema.sql` on first startup, and the Express REST API starts on `http://localhost:5000`.

### Local Backend Setup
```bash
cd backend
npm install
npm start
```

## 5. Key Engineering & Design Decisions
1. **Group Submission Idempotency:** A composite `UNIQUE (assignment_id, group_id)` constraint on `submissions` guarantees a group cannot submit duplicate confirmations while preserving `confirmed_by` and `confirmed_at` for auditability.
2. **Two-Step Submission Verification:** Separates external OneDrive file upload from explicit two-stage confirmation (`"Yes, I have submitted"` → checklist verification → `"Confirm Submission"`) to eliminate accidental clicks.
3. **Strict RBAC Middleware:** JWT payload verification (`authenticate`) paired with `requireRole('ADMIN' | 'STUDENT')` enforces authorization boundaries at the API layer.
4. 
