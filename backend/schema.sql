-- ============================================================================
-- JOINEAZY ROUND 2 — POSTGRESQL RELATIONAL SCHEMA (COURSES, GROUPS & RBAC)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'PROFESSOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE group_role AS ENUM ('LEADER', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_mode AS ENUM ('INDIVIDUAL', 'GROUP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Collection / Table (Students & Professors)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_id VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    department VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Courses Table (Associates Professors, Enrolled Students, and Assignments)
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(24) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    semester VARCHAR(64) NOT NULL,
    description TEXT,
    professor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Course Enrollments (Many-to-Many: Students <-> Courses)
CREATE TABLE IF NOT EXISTS course_enrollments (
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (course_id, student_id)
);

-- 4. Project Groups Table (Tracks Group Leader reference)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    invite_code VARCHAR(16) UNIQUE NOT NULL,
    leader_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Group Memberships (Enforces 1 Active Group per Student)
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_group group_role NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Course Assignments (Supports INDIVIDUAL & GROUP submission modes)
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    onedrive_url TEXT NOT NULL,
    submission_type submission_mode NOT NULL DEFAULT 'GROUP',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Verified Submissions & Leader Acknowledgments
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    submission_type submission_mode NOT NULL,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(24) NOT NULL DEFAULT 'ACKNOWLEDGED',
    acknowledged_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    note TEXT,
    acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, group_id),
    UNIQUE (assignment_id, student_id),
    CHECK (
      (submission_type = 'GROUP' AND group_id IS NOT NULL AND student_id IS NULL) OR
      (submission_type = 'INDIVIDUAL' AND student_id IS NOT NULL AND group_id IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_group_id ON submissions(group_id);
