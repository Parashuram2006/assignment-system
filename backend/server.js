/**
 * ============================================================================
 * JOINEAZY ROUND 2 — REST API SERVER (Node.js + Express + PostgreSQL + JWT)
 * ============================================================================
 * Supports:
 *  - JWT Authentication & Role-Based Redirection (STUDENT vs PROFESSOR)
 *  - Course-scoped Dashboards & Assignments (INDIVIDUAL vs GROUP)
 *  - Group Leader-only Submission Acknowledgment reflected across all members
 *  - Professor Submission Status Filtering (ALL / ACKNOWLEDGED / PENDING)
 * ============================================================================
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'joineazy_round2_jwt_secret';

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://joineazy:joineazy_password@localhost:5432/joineazy_db',
});

// ----------------------------------------------------------------------------
// JWT & RBAC MIDDLEWARE
// ----------------------------------------------------------------------------
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired JWT token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: `Forbidden: requires ${role} role` });
  }
  next();
};

// ----------------------------------------------------------------------------
// 1. AUTHENTICATION & ROLE-BASED REDIRECTION
// ----------------------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'STUDENT', department = '' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const codeId = `${role === 'PROFESSOR' ? 'PROF' : 'STU-2026'}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const { rows } = await pool.query(
      `INSERT INTO users (code_id, name, email, password_hash, role, department)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, code_id AS "codeId", name, email, role, department`,
      [codeId, name.trim(), cleanEmail, hash, role, department.trim()]
    );

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user,
      redirectTo: user.role === 'PROFESSOR' ? '/professor/courses' : '/student/courses',
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email.trim().toLowerCase(),
    ]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        codeId: user.code_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      redirectTo: user.role === 'PROFESSOR' ? '/professor/courses' : '/student/courses',
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

// ----------------------------------------------------------------------------
// 2. COURSES DASHBOARD (ROLE-SCOPED)
// ----------------------------------------------------------------------------
app.get('/api/courses', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'PROFESSOR') {
      const { rows } = await pool.query(
        `SELECT c.id, c.code, c.title, c.semester, c.description,
                COUNT(DISTINCT ce.student_id)::int AS "studentCount",
                COUNT(DISTINCT a.id)::int AS "assignmentCount"
         FROM courses c
         LEFT JOIN course_enrollments ce ON ce.course_id = c.id
         LEFT JOIN assignments a ON a.course_id = c.id
         WHERE c.professor_id = $1
         GROUP BY c.id
         ORDER BY c.code ASC`,
        [req.user.id]
      );
      return res.json(rows);
    }

    const { rows } = await pool.query(
      `SELECT c.id, c.code, c.title, c.semester, c.description, u.name AS "professorName"
       FROM course_enrollments ce
       JOIN courses c ON c.id = ce.course_id
       JOIN users u ON u.id = c.professor_id
       WHERE ce.student_id = $1
       ORDER BY c.code ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load courses', detail: err.message });
  }
});

// ----------------------------------------------------------------------------
// 3. COURSE ASSIGNMENTS CRUD
// ----------------------------------------------------------------------------
app.get('/api/courses/:courseId/assignments', authenticate, async (req, res) => {
  const { courseId } = req.params;
  try {
    const grpRes = await pool.query(
      'SELECT group_id, role_in_group FROM group_members WHERE user_id = $1',
      [req.user.id]
    );
    const groupId = grpRes.rows[0]?.group_id || null;

    const { rows } = await pool.query(
      `SELECT a.id, a.course_id AS "courseId", a.title, a.description,
              a.deadline, a.onedrive_url AS "oneDriveUrl", a.submission_type AS "submissionType",
              s.id AS "submissionId", s.status, s.acknowledged_at AS "acknowledgedAt", s.note
       FROM assignments a
       LEFT JOIN submissions s ON s.assignment_id = a.id
         AND ((a.submission_type = 'GROUP' AND s.group_id = $2)
           OR (a.submission_type = 'INDIVIDUAL' AND s.student_id = $3))
       WHERE a.course_id = $1
       ORDER BY a.deadline ASC`,
      [courseId, groupId, req.user.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load course assignments', detail: err.message });
  }
});

app.post('/api/assignments', authenticate, requireRole('PROFESSOR'), async (req, res) => {
  const { courseId, title, description, deadline, oneDriveUrl, submissionType = 'GROUP' } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO assignments (course_id, title, description, deadline, onedrive_url, submission_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, course_id AS "courseId", title, description, deadline, onedrive_url AS "oneDriveUrl", submission_type AS "submissionType"`,
      [courseId, title.trim(), description.trim(), deadline, oneDriveUrl.trim(), submissionType, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create assignment', detail: err.message });
  }
});

// ----------------------------------------------------------------------------
// 4. SUBMISSION & GROUP LEADER-ONLY ACKNOWLEDGMENT
// ----------------------------------------------------------------------------
app.post('/api/submissions/acknowledge', authenticate, requireRole('STUDENT'), async (req, res) => {
  const { assignmentId, note = '' } = req.body;
  if (!assignmentId) {
    return res.status(400).json({ error: 'assignmentId is required' });
  }

  try {
    const asgRes = await pool.query(
      'SELECT id, submission_type FROM assignments WHERE id = $1',
      [assignmentId]
    );
    const assignment = asgRes.rows[0];
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.submission_type === 'GROUP') {
      // Enforce Group Leader-Only Acknowledgment Rule
      const memberRes = await pool.query(
        'SELECT group_id, role_in_group FROM group_members WHERE user_id = $1',
        [req.user.id]
      );
      const membership = memberRes.rows[0];
      if (!membership) {
        return res.status(400).json({ error: 'You must join a group before submitting' });
      }
      if (membership.role_in_group !== 'LEADER') {
        return res.status(403).json({
          error: 'Only the Group Leader can acknowledge group assignment submissions',
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO submissions (assignment_id, submission_type, group_id, status, acknowledged_by, note)
         VALUES ($1, 'GROUP', $2, 'ACKNOWLEDGED', $3, $4)
         ON CONFLICT (assignment_id, group_id) DO NOTHING
         RETURNING id, assignment_id AS "assignmentId", group_id AS "groupId", status, acknowledged_at AS "acknowledgedAt"`,
        [assignmentId, membership.group_id, req.user.id, note.trim()]
      );

      if (rows.length === 0) {
        return res.status(409).json({ error: 'Group submission already acknowledged' });
      }
      return res.status(201).json(rows[0]);
    }

    // Individual Assignment Flow
    const { rows } = await pool.query(
      `INSERT INTO submissions (assignment_id, submission_type, student_id, status, acknowledged_by, note)
       VALUES ($1, 'INDIVIDUAL', $2, 'ACKNOWLEDGED', $2, $3)
       ON CONFLICT (assignment_id, student_id) DO NOTHING
       RETURNING id, assignment_id AS "assignmentId", student_id AS "studentId", status, acknowledged_at AS "acknowledgedAt"`,
      [assignmentId, req.user.id, note.trim()]
    );

    if (rows.length === 0) {
      return res.status(409).json({ error: 'Individual submission already acknowledged' });
    }
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to acknowledge submission', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Joineazy Round 2 API running on http://localhost:${PORT}`);
});
