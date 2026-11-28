import React, { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * ============================================================================
 * JOINEAZY ROUND 2 — ENHANCED UI/UX ACADEMIC WORKSPACE
 * ============================================================================
 * Features:
 *  - Split-screen JWT Authentication & Registration with live field validation
 *  - Role-based redirection (Student Enrolled Courses vs. Professor Console)
 *  - Course-centric dashboards with animated SVG progress rings & gradients
 *  - Visual 3-step assignment submission stepper (OneDrive -> Upload -> Ack)
 *  - Strict Group Leader-only acknowledgment reflected across all members
 *  - Celebratory completion micro-animations & real-time faculty analytics
 * ============================================================================
 */

const API_BASE_URL = 'http://localhost:5000/api';
const DB_STORAGE_KEY = 'joineazy_round2_store_v3';
const AUTH_STORAGE_KEY = 'joineazy_round2_auth_v3';

// ----------------------------------------------------------------------------
// 1. CRISP INLINE SVG ICON LIBRARY
// ----------------------------------------------------------------------------
const Icon = ({ name, className = 'w-4 h-4' }) => {
  const paths = {
    brand: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </>
    ),
    courses: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
    assignments: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    userPlus: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </>
    ),
    analytics: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
    checkCircle: (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    crown: (
      <>
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <line x1="5" y1="20" x2="19" y2="20" />
      </>
    ),
    externalLink: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
    arrowLeft: (
      <>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </>
    ),
    arrowRight: (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
    check: (
      <>
        <polyline points="20 6 9 17 4 12" />
      </>
    ),
    refresh: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </>
    ),
    loader: (
      <>
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      </>
    ),
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name] || null}
    </svg>
  );
};

// ----------------------------------------------------------------------------
// 2. REUSABLE VISUAL DESIGN COMPONENTS (Avatar, Circular Ring, Badges)
// ----------------------------------------------------------------------------
const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-purple-500 to-fuchsia-600',
];

function AvatarBadge({ name = 'U', size = 'md' }) {
  const initials = name
    .replace(/^Dr\.\s+/i, '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const grad = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  const dims =
    size === 'sm'
      ? 'w-7 h-7 text-[11px]'
      : size === 'lg'
      ? 'w-11 h-11 text-sm'
      : 'w-9 h-9 text-xs';

  return (
    <div
      className={`${dims} rounded-full bg-gradient-to-br ${grad} text-white font-bold flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white`}
    >
      {initials}
    </div>
  );
}

function CircularProgress({ pct = 0, size = 54, strokeWidth = 5, color = '#4f46e5' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="-rotate-90 transform" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={clamped === 100 ? '#10b981' : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-[11px] font-extrabold text-slate-900 tabular-nums">
        {clamped}%
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3. RELATIONAL SEED DATA
// ----------------------------------------------------------------------------
const SEED_DATABASE = {
  users: [
    {
      id: 'prof-101',
      codeId: 'PROF-101',
      name: 'Dr. Ananya Sharma',
      email: 'ananya.sharma@joineazy.edu',
      password: 'password123',
      role: 'PROFESSOR',
      department: 'Computer Science',
      enrolledCourseIds: ['crs-401', 'crs-405', 'crs-412'],
    },
    {
      id: 'stu-01',
      codeId: 'STU-2026-01',
      name: 'Aarav Patel',
      email: 'aarav@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech CSE',
      enrolledCourseIds: ['crs-401', 'crs-405', 'crs-412'],
    },
    {
      id: 'stu-02',
      codeId: 'STU-2026-02',
      name: 'Sneha Nair',
      email: 'sneha@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech CSE',
      enrolledCourseIds: ['crs-401', 'crs-405', 'crs-412'],
    },
    {
      id: 'stu-03',
      codeId: 'STU-2026-03',
      name: 'Rohan Kulkarni',
      email: 'rohan@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech IT',
      enrolledCourseIds: ['crs-401', 'crs-405'],
    },
    {
      id: 'stu-04',
      codeId: 'STU-2026-04',
      name: 'Meera Krishnan',
      email: 'meera@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech IT',
      enrolledCourseIds: ['crs-401', 'crs-405'],
    },
    {
      id: 'stu-05',
      codeId: 'STU-2026-05',
      name: 'Riya Verma',
      email: 'riya@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech CSE',
      enrolledCourseIds: ['crs-401', 'crs-412'],
    },
    {
      id: 'stu-06',
      codeId: 'STU-2026-06',
      name: 'Kabir Malhotra',
      email: 'kabir@joineazy.edu',
      password: 'password123',
      role: 'STUDENT',
      department: 'B.Tech AI & DS',
      enrolledCourseIds: ['crs-401', 'crs-405'],
    },
  ],
  courses: [
    {
      id: 'crs-401',
      code: 'CS-401',
      title: 'Distributed Systems & Cloud Architecture',
      semester: 'Fall 2026 • Core',
      professorId: 'prof-101',
      accent: 'indigo',
      description:
        'Consensus protocols, fault-tolerant storage, relational modeling, and containerized microservices.',
    },
    {
      id: 'crs-405',
      title: 'Full-Stack Web Engineering & API Security',
      code: 'CS-405',
      semester: 'Fall 2026 • Core',
      professorId: 'prof-101',
      accent: 'emerald',
      description:
        'Modern React UI/UX design systems, RESTful Express services, JWT RBAC, and PostgreSQL optimization.',
    },
    {
      id: 'crs-412',
      code: 'CS-412',
      title: 'Applied Machine Learning & Data Pipelines',
      semester: 'Fall 2026 • Elective',
      professorId: 'prof-101',
      accent: 'amber',
      description:
        'Feature engineering, supervised evaluation pipelines, and reproducible model deployment.',
    },
  ],
  groups: [
    {
      id: 'grp-01',
      name: 'Team Quantum',
      inviteCode: 'QTM-804',
      leaderId: 'stu-01',
      createdAt: '2026-11-10T09:30:00.000Z',
    },
    {
      id: 'grp-02',
      name: 'Cloud Nexus',
      inviteCode: 'CLD-319',
      leaderId: 'stu-03',
      createdAt: '2026-11-11T14:15:00.000Z',
    },
  ],
  groupMembers: [
    {
      id: 'gm-01',
      groupId: 'grp-01',
      userId: 'stu-01',
      roleInGroup: 'LEADER',
      joinedAt: '2026-11-10T09:30:00.000Z',
    },
    {
      id: 'gm-02',
      groupId: 'grp-01',
      userId: 'stu-02',
      roleInGroup: 'MEMBER',
      joinedAt: '2026-11-10T10:05:00.000Z',
    },
    {
      id: 'gm-03',
      groupId: 'grp-02',
      userId: 'stu-03',
      roleInGroup: 'LEADER',
      joinedAt: '2026-11-11T14:15:00.000Z',
    },
    {
      id: 'gm-04',
      groupId: 'grp-02',
      userId: 'stu-04',
      roleInGroup: 'MEMBER',
      joinedAt: '2026-11-11T15:00:00.000Z',
    },
  ],
  assignments: [
    {
      id: 'asg-101',
      courseId: 'crs-401',
      title: 'Normalized PostgreSQL Schema & ER Modeling',
      description:
        'Design a 3NF relational schema with foreign keys, composite uniqueness constraints, and upload your architecture report and schema.sql to OneDrive.',
      deadline: '2026-12-03T23:59:00.000Z',
      oneDriveUrl: 'https://onedrive.live.com/?id=joineazy_cs401_asg1',
      submissionType: 'GROUP',
      createdBy: 'prof-101',
      createdAt: '2026-11-12T08:00:00.000Z',
    },
    {
      id: 'asg-102',
      courseId: 'crs-401',
      title: 'Raft Consensus Simulation & Latency Benchmark',
      description:
        'Run leader-election fault simulations across 5 nodes and submit your individual benchmark analysis PDF to the course OneDrive folder.',
      deadline: '2026-12-07T18:00:00.000Z',
      oneDriveUrl: 'https://onedrive.live.com/?id=joineazy_cs401_asg2',
      submissionType: 'INDIVIDUAL',
      createdBy: 'prof-101',
      createdAt: '2026-11-16T10:00:00.000Z',
    },
    {
      id: 'asg-201',
      courseId: 'crs-405',
      title: 'JWT Authentication & RBAC Middleware Lab',
      description:
        'Build Express middleware enforcing Student vs. Professor JWT authorization and role-based dashboard redirection. Group leaders must acknowledge once uploaded.',
      deadline: '2026-12-05T20:00:00.000Z',
      oneDriveUrl: 'https://onedrive.live.com/?id=joineazy_cs405_asg1',
      submissionType: 'GROUP',
      createdBy: 'prof-101',
      createdAt: '2026-11-15T11:30:00.000Z',
    },
    {
      id: 'asg-202',
      courseId: 'crs-405',
      title: 'Responsive UI/UX Accessibility & Component Audit',
      description:
        'Submit an individual Lighthouse & responsive breakpoint audit report for your React + Tailwind interface.',
      deadline: '2026-12-09T17:00:00.000Z',
      oneDriveUrl: 'https://onedrive.live.com/?id=joineazy_cs405_asg2',
      submissionType: 'INDIVIDUAL',
      createdBy: 'prof-101',
      createdAt: '2026-11-19T14:00:00.000Z',
    },
    {
      id: 'asg-301',
      courseId: 'crs-412',
      title: 'Feature Engineering & Cross-Validation Notebook',
      description:
        'Upload your cleaned dataset pipeline, ROC-AUC metrics, and Jupyter notebook to OneDrive and acknowledge completion.',
      deadline: '2026-12-10T23:59:00.000Z',
      oneDriveUrl: 'https://onedrive.live.com/?id=joineazy_cs412_asg1',
      submissionType: 'INDIVIDUAL',
      createdBy: 'prof-101',
      createdAt: '2026-11-20T09:15:00.000Z',
    },
  ],
  submissions: [
    {
      id: 'sub-01',
      assignmentId: 'asg-101',
      submissionType: 'GROUP',
      groupId: 'grp-01',
      studentId: null,
      status: 'ACKNOWLEDGED',
      acknowledgedByUserId: 'stu-01',
      acknowledgedAt: '2026-11-22T14:22:00.000Z',
      note: 'Uploaded ER_Diagram_v2.pdf and schema.sql for Team Quantum.',
    },
    {
      id: 'sub-02',
      assignmentId: 'asg-101',
      submissionType: 'GROUP',
      groupId: 'grp-02',
      studentId: null,
      status: 'ACKNOWLEDGED',
      acknowledgedByUserId: 'stu-03',
      acknowledgedAt: '2026-11-23T19:45:00.000Z',
      note: 'Submitted complete architectural report and DDL scripts.',
    },
    {
      id: 'sub-03',
      assignmentId: 'asg-102',
      submissionType: 'INDIVIDUAL',
      groupId: null,
      studentId: 'stu-02',
      status: 'ACKNOWLEDGED',
      acknowledgedByUserId: 'stu-02',
      acknowledgedAt: '2026-11-25T11:10:00.000Z',
      note: 'Uploaded Raft_Benchmark_Sneha.pdf.',
    },
  ],
};

// ----------------------------------------------------------------------------
// 4. HELPERS & JWT TOKEN BUILDER
// ----------------------------------------------------------------------------
function createJwtToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      codeId: user.codeId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  );
  const sig = btoa(`je_r2_${user.id}`).replace(/=/g, '').slice(0, 24);
  return `${header}.${payload}.${sig}`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDeadlineBadge(iso, acknowledged) {
  if (acknowledged) return { label: 'Completed', tone: 'emerald' };
  const diffMs = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diffMs / 86400000);
  if (diffMs < 0) return { label: 'Past Deadline', tone: 'rose' };
  if (days <= 2) return { label: `Due in ${days}d • Urgent`, tone: 'amber' };
  return { label: `Due in ${days} days`, tone: 'slate' };
}

async function syncWithBackend(path, options = {}, token = null) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 900);
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const COURSE_THEMES = {
  indigo: {
    banner: 'from-indigo-600 via-indigo-600 to-violet-700',
    pill: 'bg-white/20 text-white border-white/25',
    bar: 'bg-indigo-600',
    ring: '#4f46e5',
    softBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  },
  emerald: {
    banner: 'from-emerald-600 via-teal-600 to-cyan-700',
    pill: 'bg-white/20 text-white border-white/25',
    bar: 'bg-emerald-600',
    ring: '#059669',
    softBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  },
  amber: {
    banner: 'from-amber-500 via-orange-500 to-rose-600',
    pill: 'bg-white/20 text-white border-white/25',
    bar: 'bg-amber-500',
    ring: '#d97706',
    softBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
};

// ----------------------------------------------------------------------------
// 5. MAIN APPLICATION SHELL
// ----------------------------------------------------------------------------
export default function App() {
  const [db, setDb] = useState(() => {
    try {
      const cached = localStorage.getItem(DB_STORAGE_KEY);
      return cached ? JSON.parse(cached) : SEED_DATABASE;
    } catch {
      return SEED_DATABASE;
    }
  });

  const [session, setSession] = useState(() => {
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('courses');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [toast, setToast] = useState(null);
  const [recentlyCompletedAsgId, setRecentlyCompletedAsgId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch {}
  }, [db]);

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {}
  }, [session]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((curr) => (curr && curr.message === message ? null : curr));
    }, 3600);
  }, []);

  const currentUser = useMemo(() => {
    if (!session) return null;
    return db.users.find((u) => u.id === session.userId) || null;
  }, [db.users, session]);

  const handleLogin = async (user) => {
    const remote = await syncWithBackend('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    const token = remote?.token || createJwtToken(user);
    setSession({ userId: user.id, token });
    setSelectedCourseId(null);
    setActiveNav('courses');
    showToast(
      `JWT Verified • Redirected to ${
        user.role === 'PROFESSOR' ? 'Professor Console' : 'Student Courses'
      }`
    );
  };

  const handleRegister = async ({ name, email, password, role, department }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const prefix = role === 'PROFESSOR' ? 'PROF' : 'STU-2026';
    const seq = String(db.users.length + 1).padStart(2, '0');
    const newUser = {
      id: `usr_${Date.now()}`,
      codeId: `${prefix}-${seq}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
      department: department.trim() || (role === 'PROFESSOR' ? 'Faculty' : 'B.Tech CSE'),
      enrolledCourseIds: ['crs-401', 'crs-405'],
    };

    await syncWithBackend('/auth/register', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    setDb((prev) => ({ ...prev, users: [...prev.users, newUser] }));
    await handleLogin(newUser);
    return { ok: true };
  };

  const handleLogout = () => {
    setSession(null);
    setSelectedCourseId(null);
    setMobileMenuOpen(false);
    showToast('Signed out cleanly', 'info');
  };

  const handleResetStore = () => {
    setDb(SEED_DATABASE);
    setSelectedCourseId(null);
    showToast('Workspace reset to Round 2 seed state', 'info');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
        <AuthScreen
          users={db.users}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </div>
    );
  }

  const isProfessor = currentUser.role === 'PROFESSOR' || currentUser.role === 'ADMIN';

  const navItems = isProfessor
    ? [
        { id: 'courses', label: 'Courses & Overview', icon: 'courses' },
        { id: 'assignments', label: 'All Assignments', icon: 'assignments' },
        { id: 'tracking', label: 'Submissions', icon: 'users' },
        { id: 'analytics', label: 'Analytics', icon: 'analytics' },
      ]
    : [
        { id: 'courses', label: 'Enrolled Courses', icon: 'courses' },
        { id: 'assignments', label: 'All Assignments', icon: 'assignments' },
        { id: 'group', label: 'My Group', icon: 'users' },
      ];

  const activeCourse = selectedCourseId
    ? db.courses.find((c) => c.id === selectedCourseId) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-50/90 text-slate-900 flex">
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-68 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm shadow-indigo-500/25">
              <Icon name="brand" className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base text-slate-900 block leading-none">
                Joineazy
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                {isProfessor ? 'Faculty Console' : 'Student Workspace'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3.5 py-5 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Menu
          </div>
          {navItems.map((item) => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.id !== 'assignments') setSelectedCourseId(null);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-sm shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Card & Footer */}
        <div className="p-3.5 border-t border-slate-100 space-y-2.5">
          <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-3">
            <AvatarBadge name={currentUser.name} size="md" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {currentUser.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono text-slate-500">
                  {currentUser.codeId}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                    isProfessor
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {isProfessor ? 'Prof' : 'Student'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleResetStore}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100/70 hover:bg-slate-200/70 transition active:scale-[0.98]"
            >
              <Icon name="refresh" className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50/80 hover:bg-rose-100 transition active:scale-[0.98]"
            >
              <Icon name="logout" className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open Menu"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <div className="truncate">
              <h1 className="font-display text-base sm:text-lg font-extrabold text-slate-900 truncate">
                {activeCourse
                  ? `${activeCourse.code} — ${activeCourse.title}`
                  : activeNav === 'courses'
                  ? isProfessor
                    ? 'Courses Taught & Overview'
                    : 'My Enrolled Courses'
                  : activeNav === 'tracking'
                  ? 'Submission Tracking'
                  : activeNav === 'group'
                  ? 'Project Group & Leadership'
                  : activeNav === 'analytics'
                  ? 'Course Completion Analytics'
                  : 'All Assignments'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              JWT Session Active
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {isProfessor ? (
            <ProfessorWorkspace
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              selectedCourseId={selectedCourseId}
              setSelectedCourseId={setSelectedCourseId}
              currentUser={currentUser}
              session={session}
              db={db}
              setDb={setDb}
              showToast={showToast}
            />
          ) : (
            <StudentWorkspace
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              selectedCourseId={selectedCourseId}
              setSelectedCourseId={setSelectedCourseId}
              currentUser={currentUser}
              session={session}
              db={db}
              setDb={setDb}
              showToast={showToast}
              recentlyCompletedAsgId={recentlyCompletedAsgId}
              setRecentlyCompletedAsgId={setRecentlyCompletedAsgId}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 6. TOAST NOTIFICATION
// ----------------------------------------------------------------------------
function ToastNotification({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-slate-700/70 text-sm max-w-sm animate-view-enter">
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
          toast.type === 'error'
            ? 'bg-rose-500/20 text-rose-400'
            : 'bg-emerald-500/20 text-emerald-400'
        }`}
      >
        <Icon
          name={toast.type === 'error' ? 'alert' : 'checkCircle'}
          className="w-4 h-4"
        />
      </div>
      <span className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</span>
      <button onClick={onDismiss} className="text-slate-400 hover:text-white p-1">
        <Icon name="x" className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 7. SPLIT-SCREEN AUTHENTICATION EXPERIENCE
// ----------------------------------------------------------------------------
function AuthScreen({ users, onLogin, onRegister }) {
  const [tab, setTab] = useState('LOGIN');
  const [email, setEmail] = useState('aarav@joineazy.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [department, setDepartment] = useState('B.Tech CSE');
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (tab === 'REGISTER' && name.trim().length < 2) {
      errs.name = 'Enter your full name (at least 2 characters).';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid university email address.';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters long.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const triggerAuthWithLoader = async (fn) => {
    setIsSubmitting(true);
    setAuthError('');
    await new Promise((r) => setTimeout(r, 420));
    await fn();
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await triggerAuthWithLoader(async () => {
      if (tab === 'LOGIN') {
        const user = users.find(
          (u) =>
            u.email.toLowerCase() === email.trim().toLowerCase() &&
            u.password === password
        );
        if (!user) {
          setAuthError('Invalid email or password. Use a quick-access role below.');
          return;
        }
        await onLogin(user);
      } else {
        const res = await onRegister({ name, email, password, role, department });
        if (!res.ok) setAuthError(res.error);
      }
    });
  };

  const quickAccounts = [
    {
      badge: 'Professor',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      user: users.find((u) => u.id === 'prof-101'),
    },
    {
      badge: 'Group Leader',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      user: users.find((u) => u.id === 'stu-01'),
    },
    {
      badge: 'Group Member',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
      user: users.find((u) => u.id === 'stu-02'),
    },
    {
      badge: 'Solo Student',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      user: users.find((u) => u.id === 'stu-05'),
    },
  ].filter((item) => item.user);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
      {/* Left Showcase Panel (Visible on Desktop) */}
      <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Icon name="brand" className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight">
            Joineazy
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Icon name="sparkles" className="w-3.5 h-3.5 text-indigo-300" />
            <span>Round 2 Academic Platform</span>
          </div>

          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Streamlined courses, teams, and verified submissions.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Built for university cohorts: organize project groups, track individual and
            group deliverables, and enforce group leader acknowledgment with instant
            faculty visibility.
          </p>

          {/* Mini Preview Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500 text-white text-[11px] font-bold">
                  CS-401
                </span>
                <span className="text-xs font-semibold text-white">
                  Distributed Systems
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                ✓ Leader Verified
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Team Quantum (3 Members Synced)</span>
              <span>JWT RBAC Secured</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between">
          <span>React • Tailwind • Node.js • PostgreSQL 16</span>
          <span>Joineazy Assessment</span>
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className="lg:col-span-6 flex items-center justify-center px-4 py-10 sm:px-8 bg-slate-50">
        <div className="w-full max-w-md space-y-6 animate-view-enter">
          <div className="text-center lg:text-left">
            <div className="lg:hidden w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-md mb-4">
              <Icon name="brand" className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              {tab === 'LOGIN' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {tab === 'LOGIN'
                ? 'Sign in to access your courses and project workspace.'
                : 'Register as a Student or Professor with instant JWT session.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-2 bg-slate-100/90 p-1 rounded-2xl mb-6">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setTab('LOGIN');
                  setFieldErrors({});
                  setAuthError('');
                }}
                className={`py-2.5 text-xs font-bold rounded-xl transition ${
                  tab === 'LOGIN'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setTab('REGISTER');
                  setFieldErrors({});
                  setAuthError('');
                }}
                className={`py-2.5 text-xs font-bold rounded-xl transition ${
                  tab === 'REGISTER'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {tab === 'REGISTER' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Parashuram"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        fieldErrors.name
                          ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500/20'
                          : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/15'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-[11px] font-semibold text-rose-600">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-600"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="PROFESSOR">Professor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Department
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="B.Tech CSE"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  University Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@joineazy.edu"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    fieldErrors.email
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/15'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-4 pr-10 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                      fieldErrors.password
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} className="w-4 h-4" />
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <Icon name="alert" className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-70 text-white text-sm font-bold transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isSubmitting && <Icon name="loader" className="w-4 h-4 animate-spin" />}
                <span>
                  {isSubmitting
                    ? 'Verifying JWT & Redirecting...'
                    : tab === 'LOGIN'
                    ? 'Sign In to Workspace'
                    : 'Create Account & Continue'}
                </span>
              </button>
            </form>

            {/* 1-Click Role Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                Instant Demo Role Access
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickAccounts.map(({ badge, badgeClass, user }) => (
                  <button
                    key={user.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => triggerAuthWithLoader(() => onLogin(user))}
                    className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition active:scale-[0.98]"
                  >
                    <AvatarBadge name={user.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {user.name}
                      </div>
                      <span
                        className={`inline-block mt-0.5 px-1.5 py-0.2 rounded border text-[9px] font-extrabold ${badgeClass}`}
                      >
                        {badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 8. STUDENT WORKSPACE (Enrolled Courses, 3-Step Stepper & Group Leader Rule)
// ----------------------------------------------------------------------------
function StudentWorkspace({
  activeNav,
  setActiveNav,
  selectedCourseId,
  setSelectedCourseId,
  currentUser,
  session,
  db,
  setDb,
  showToast,
  recentlyCompletedAsgId,
  setRecentlyCompletedAsgId,
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [pendingConfirmAsg, setPendingConfirmAsg] = useState(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [verifiedUpload, setVerifiedUpload] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const membership = useMemo(
    () => db.groupMembers.find((m) => m.userId === currentUser.id) || null,
    [db.groupMembers, currentUser.id]
  );

  const myGroup = useMemo(() => {
    if (!membership) return null;
    return db.groups.find((g) => g.id === membership.groupId) || null;
  }, [db.groups, membership]);

  const isGroupLeader = Boolean(myGroup && membership && membership.roleInGroup === 'LEADER');

  const roster = useMemo(() => {
    if (!myGroup) return [];
    return db.groupMembers
      .filter((m) => m.groupId === myGroup.id)
      .map((m) => ({
        ...m,
        user: db.users.find((u) => u.id === m.userId),
      }))
      .filter((m) => m.user);
  }, [db.groupMembers, db.users, myGroup]);

  const groupLeaderUser = useMemo(() => {
    if (!myGroup) return null;
    const leaderMem = roster.find((m) => m.roleInGroup === 'LEADER');
    return leaderMem ? leaderMem.user : null;
  }, [myGroup, roster]);

  const availablePeers = useMemo(() => {
    const takenIds = new Set(db.groupMembers.map((m) => m.userId));
    return db.users.filter((u) => u.role === 'STUDENT' && !takenIds.has(u.id));
  }, [db.users, db.groupMembers]);

  const enrolledCourses = useMemo(() => {
    const ids = currentUser.enrolledCourseIds || [];
    return db.courses.filter((c) => ids.includes(c.id));
  }, [db.courses, currentUser.enrolledCourseIds]);

  const getSubmissionForAssignment = useCallback(
    (asg) => {
      if (asg.submissionType === 'GROUP') {
        if (!myGroup) return null;
        return (
          db.submissions.find(
            (s) => s.assignmentId === asg.id && s.groupId === myGroup.id
          ) || null
        );
      }
      return (
        db.submissions.find(
          (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
        ) || null
      );
    },
    [db.submissions, myGroup, currentUser.id]
  );

  const enrichedAssignments = useMemo(() => {
    const courseSet = new Set(enrolledCourses.map((c) => c.id));
    return db.assignments
      .filter((a) => courseSet.has(a.courseId))
      .map((a) => {
        const course = db.courses.find((c) => c.id === a.courseId);
        const submission = getSubmissionForAssignment(a);
        const acknowledgedBy = submission
          ? db.users.find((u) => u.id === submission.acknowledgedByUserId)
          : null;
        return { ...a, course, submission, acknowledgedBy };
      });
  }, [db.assignments, db.courses, db.users, enrolledCourses, getSubmissionForAssignment]);

  const courseCards = useMemo(() => {
    return enrolledCourses.map((course) => {
      const prof = db.users.find((u) => u.id === course.professorId);
      const courseAsgs = enrichedAssignments.filter((a) => a.courseId === course.id);
      const done = courseAsgs.filter((a) => Boolean(a.submission)).length;
      const total = courseAsgs.length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return { ...course, professor: prof, done, total, pct };
    });
  }, [enrolledCourses, db.users, enrichedAssignments]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const trimmed = newGroupName.trim();
    if (!trimmed || myGroup) return;

    const newGroup = {
      id: `grp_${Date.now()}`,
      name: trimmed,
      inviteCode: `${trimmed.slice(0, 3).toUpperCase()}-${Math.floor(
        100 + Math.random() * 900
      )}`,
      leaderId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    const newMember = {
      id: `gm_${Date.now()}`,
      groupId: newGroup.id,
      userId: currentUser.id,
      roleInGroup: 'LEADER',
      joinedAt: new Date().toISOString(),
    };

    await syncWithBackend(
      '/groups',
      { method: 'POST', body: JSON.stringify({ name: trimmed }) },
      session?.token
    );

    setDb((prev) => ({
      ...prev,
      groups: [...prev.groups, newGroup],
      groupMembers: [...prev.groupMembers, newMember],
    }));
    setNewGroupName('');
    showToast(`Created group "${newGroup.name}" as Group Leader`);
  };

  const handleAddMember = async (e, presetUser = null) => {
    if (e) e.preventDefault();
    setInviteError('');
    if (!myGroup || !isGroupLeader) return;

    let student = presetUser;
    if (!student) {
      const q = inviteInput.trim().toLowerCase();
      if (!q) return;
      student = db.users.find(
        (u) =>
          u.role === 'STUDENT' &&
          (u.email.toLowerCase() === q || u.codeId.toLowerCase() === q)
      );
    }

    if (!student) {
      setInviteError('Student not found. Check the email or Student ID.');
      return;
    }

    const existing = db.groupMembers.find((m) => m.userId === student.id);
    if (existing) {
      const grp = db.groups.find((g) => g.id === existing.groupId);
      setInviteError(`${student.name} is already in "${grp?.name || 'a group'}".`);
      return;
    }

    await syncWithBackend(
      `/groups/${myGroup.id}/members`,
      { method: 'POST', body: JSON.stringify({ identifier: student.email }) },
      session?.token
    );

    const memberRecord = {
      id: `gm_${Date.now()}`,
      groupId: myGroup.id,
      userId: student.id,
      roleInGroup: 'MEMBER',
      joinedAt: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      groupMembers: [...prev.groupMembers, memberRecord],
    }));
    setInviteInput('');
    showToast(`Added ${student.name} to ${myGroup.name}`);
  };

  const handleRemoveMember = (member) => {
    if (!isGroupLeader || member.userId === currentUser.id) return;
    setDb((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.filter((m) => m.id !== member.id),
    }));
    showToast(`Removed ${member.user.name}`, 'info');
  };

  const startSubmissionConfirmation = (asg) => {
    if (asg.submissionType === 'GROUP') {
      if (!myGroup) {
        showToast('Create a group first to acknowledge group assignments.', 'error');
        setActiveNav('group');
        return;
      }
      if (!isGroupLeader) {
        showToast(
          `Only Group Leader (${
            groupLeaderUser ? groupLeaderUser.name : 'Leader'
          }) can acknowledge group submissions.`,
          'error'
        );
        return;
      }
    }
    setSubmissionNote('');
    setVerifiedUpload(false);
    setPendingConfirmAsg(asg);
  };

  const confirmSubmission = async (e) => {
    e.preventDefault();
    if (!pendingConfirmAsg || !verifiedUpload) return;

    if (pendingConfirmAsg.submissionType === 'GROUP' && (!myGroup || !isGroupLeader)) {
      showToast('Only the group leader can acknowledge group submissions.', 'error');
      return;
    }

    await syncWithBackend(
      '/submissions/acknowledge',
      {
        method: 'POST',
        body: JSON.stringify({
          assignmentId: pendingConfirmAsg.id,
          groupId: pendingConfirmAsg.submissionType === 'GROUP' ? myGroup.id : null,
          note: submissionNote.trim(),
        }),
      },
      session?.token
    );

    const newSub = {
      id: `sub_${Date.now()}`,
      assignmentId: pendingConfirmAsg.id,
      submissionType: pendingConfirmAsg.submissionType,
      groupId: pendingConfirmAsg.submissionType === 'GROUP' ? myGroup.id : null,
      studentId: pendingConfirmAsg.submissionType === 'INDIVIDUAL' ? currentUser.id : null,
      status: 'ACKNOWLEDGED',
      acknowledgedByUserId: currentUser.id,
      acknowledgedAt: new Date().toISOString(),
      note:
        submissionNote.trim() || 'Files uploaded to OneDrive and submission acknowledged.',
    };

    setDb((prev) => ({
      ...prev,
      submissions: [...prev.submissions, newSub],
    }));

    setRecentlyCompletedAsgId(pendingConfirmAsg.id);
    setTimeout(() => setRecentlyCompletedAsgId(null), 1600);

    showToast(
      pendingConfirmAsg.submissionType === 'GROUP'
        ? `Group submission acknowledged! Synced across all ${myGroup.name} members.`
        : `Individual submission acknowledged for "${pendingConfirmAsg.title}"`
    );
    setPendingConfirmAsg(null);
  };

  // ==========================================================================
  // VIEW A: ENROLLED COURSES DASHBOARD
  // ==========================================================================
  if (activeNav === 'courses') {
    const totalDone = enrichedAssignments.filter((a) => a.submission).length;
    const totalAll = enrichedAssignments.length;
    const overallPct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;

    return (
      <div className="space-y-7 animate-view-enter">
        {/* Welcome Banner with Circular Ring */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                {currentUser.department}
              </span>
              {myGroup ? (
                <button
                  type="button"
                  onClick={() => setActiveNav('group')}
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100 transition"
                >
                  {isGroupLeader && <Icon name="crown" className="w-3 h-3 text-amber-500" />}
                  <span>
                    {myGroup.name} • {isGroupLeader ? 'Group Leader' : 'Member'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveNav('group')}
                  className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
                >
                  + Create Project Group
                </button>
              )}
            </div>

            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              Welcome back, {currentUser.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Select an enrolled course below to view assignment briefs, upload deliverables to
              OneDrive, and track acknowledgments.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 shrink-0">
            <CircularProgress pct={overallPct} size={62} strokeWidth={5.5} />
            <div>
              <div className="text-xs font-bold text-slate-900">Overall Completion</div>
              <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                {totalDone} of {totalAll} tasks verified
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseCards.map((course) => {
            const theme = COURSE_THEMES[course.accent] || COURSE_THEMES.indigo;
            const pendingCount = course.total - course.done;

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setStatusFilter('ALL');
                  setActiveNav('assignments');
                }}
                className="group text-left bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_30px_-8px_rgba(79,70,229,0.14)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Course Gradient Banner */}
                  <div className={`bg-gradient-to-r ${theme.banner} p-5 text-white`}>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${theme.pill}`}
                      >
                        {course.code}
                      </span>
                      <span className="text-[11px] font-semibold text-white/90">
                        {course.semester}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-extrabold mt-3.5 leading-snug">
                      {course.title}
                    </h3>
                  </div>

                  {/* Course Body */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2.5 pt-1">
                      <AvatarBadge
                        name={course.professor ? course.professor.name : 'Prof'}
                        size="sm"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-slate-800">
                          {course.professor ? course.professor.name : 'Faculty'}
                        </div>
                        <div className="text-[11px] text-slate-400">Course Instructor</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Progress Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      <span className="font-bold text-slate-900">
                        {course.done}/{course.total}
                      </span>{' '}
                      <span className="text-slate-500">Acknowledged</span>
                    </div>
                    {pendingCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                        {pendingCount} Pending
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        All Done
                      </span>
                    )}
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        course.pct === 100 ? 'bg-emerald-500' : theme.bar
                      }`}
                      style={{ width: `${course.pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 pt-1">
                    <span>Open Course Workspace</span>
                    <Icon
                      name="arrowRight"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW B: MY GROUP & LEADERSHIP MANAGEMENT
  // ==========================================================================
  if (activeNav === 'group') {
    return (
      <div className="space-y-6 animate-view-enter">
        {!myGroup ? (
          <div className="max-w-lg bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-8 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Icon name="users" className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Create Your Project Group
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Creating a group assigns you as the <strong>Group Leader</strong>, granting you
              permission to onboard teammates and acknowledge group assignments.
            </p>

            <form onSubmit={handleCreateGroup} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Team / Group Name
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Team Apex"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm transition active:scale-[0.98]"
              >
                Create Group as Leader
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Group Roster Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-display text-xl font-extrabold">{myGroup.name}</h2>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(myGroup.inviteCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 1800);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-semibold transition"
                    >
                      <span>{myGroup.inviteCode}</span>
                      <Icon name={copiedCode ? 'check' : 'copy'} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {roster.length} member{roster.length === 1 ? '' : 's'} • Group Leader
                    acknowledgments sync to all members
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {roster.map((m) => (
                  <div key={m.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <AvatarBadge name={m.user.name} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {m.user.name}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              m.roleInGroup === 'LEADER'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {m.roleInGroup === 'LEADER' && (
                              <Icon name="crown" className="w-3 h-3 text-amber-600" />
                            )}
                            {m.roleInGroup}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">
                          <span className="font-mono">{m.user.codeId}</span> • {m.user.email}
                        </div>
                      </div>
                    </div>

                    {isGroupLeader && m.userId !== currentUser.id && (
                      <button
                        onClick={() => handleRemoveMember(m)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Remove member"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Teammate Panel */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
              <div>
                <h3 className="font-display text-base font-extrabold text-slate-900">
                  Team Onboarding
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isGroupLeader
                    ? 'Add unassigned peers via email address or Student ID.'
                    : 'Only the Group Leader can manage group membership.'}
                </p>
              </div>

              {isGroupLeader ? (
                <>
                  <form onSubmit={(e) => handleAddMember(e)} className="space-y-3">
                    <input
                      type="text"
                      value={inviteInput}
                      onChange={(e) => {
                        setInviteInput(e.target.value);
                        setInviteError('');
                      }}
                      placeholder="kabir@joineazy.edu or STU-2026-06"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                    />
                    {inviteError && (
                      <p className="text-xs text-rose-600 font-semibold">{inviteError}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition active:scale-[0.98]"
                    >
                      <Icon name="userPlus" className="w-4 h-4" />
                      <span>Add Teammate</span>
                    </button>
                  </form>

                  {availablePeers.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5">
                        Available Peers
                      </div>
                      <div className="space-y-2">
                        {availablePeers.map((peer) => (
                          <div
                            key={peer.id}
                            className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                          >
                            <div className="flex items-center gap-2.5">
                              <AvatarBadge name={peer.name} size="sm" />
                              <div>
                                <div className="text-xs font-bold text-slate-900">
                                  {peer.name}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500">
                                  {peer.codeId}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddMember(null, peer)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 text-xs font-bold transition shadow-2xs"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  You are a <strong>Member</strong> of {myGroup.name}. Group acknowledgments
                  made by <strong>{groupLeaderUser ? groupLeaderUser.name : 'your Leader'}</strong>{' '}
                  sync automatically to your course progress.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // VIEW C: COURSE ASSIGNMENTS PAGE (With 3-Step Visual Workflow Stepper)
  // ==========================================================================
  const visibleAssignments = enrichedAssignments.filter((a) => {
    if (selectedCourseId && a.courseId !== selectedCourseId) return false;
    if (statusFilter === 'ACKNOWLEDGED') return Boolean(a.submission);
    if (statusFilter === 'PENDING') return !a.submission;
    return true;
  });

  const scopeAssignments = selectedCourseId
    ? enrichedAssignments.filter((a) => a.courseId === selectedCourseId)
    : enrichedAssignments;
  const completedCount = scopeAssignments.filter((a) => a.submission).length;
  const progressPct =
    scopeAssignments.length > 0
      ? Math.round((completedCount / scopeAssignments.length) * 100)
      : 0;

  const currentCourseObj = selectedCourseId
    ? db.courses.find((c) => c.id === selectedCourseId)
    : null;
  const currentCourseTheme = currentCourseObj
    ? COURSE_THEMES[currentCourseObj.accent] || COURSE_THEMES.indigo
    : COURSE_THEMES.indigo;

  return (
    <div className="space-y-6 animate-view-enter">
      {/* Top Breadcrumb & Course Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedCourseId(null);
            setActiveNav('courses');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-2xs"
        >
          <Icon name="arrowLeft" className="w-3.5 h-3.5" />
          <span>Back to Courses</span>
        </button>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCourseId(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              !selectedCourseId
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            All Courses
          </button>
          {enrolledCourses.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition ${
                selectedCourseId === c.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* Course / Scope Hero Progress Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {currentCourseObj && (
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${currentCourseTheme.softBg}`}
              >
                {currentCourseObj.code}
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500">
              {myGroup
                ? `${myGroup.name} (${isGroupLeader ? 'Group Leader' : 'Group Member'})`
                : 'Individual Workspace'}
            </span>
          </div>
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            {currentCourseObj ? currentCourseObj.title : 'All Enrolled Course Assignments'}
          </h2>
          <p className="text-xs text-slate-500">
            {completedCount} of {scopeAssignments.length} assignments acknowledged
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <CircularProgress pct={progressPct} size={60} strokeWidth={5.5} />
          <div className="w-40 hidden sm:block">
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span className="text-slate-600">Progress</span>
              <span className="text-indigo-600">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {[
          { id: 'ALL', label: `All (${scopeAssignments.length})` },
          { id: 'PENDING', label: `Pending (${scopeAssignments.length - completedCount})` },
          { id: 'ACKNOWLEDGED', label: `Acknowledged (${completedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assignment Cards */}
      <div className="space-y-5">
        {visibleAssignments.map((asg) => {
          const acknowledged = Boolean(asg.submission);
          const isGroupTask = asg.submissionType === 'GROUP';
          const deadlineInfo = getDeadlineBadge(asg.deadline, acknowledged);
          const justCompleted = recentlyCompletedAsgId === asg.id;

          return (
            <div
              key={asg.id}
              className={`bg-white rounded-3xl border p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] transition-all ${
                acknowledged
                  ? 'border-emerald-200/90 bg-gradient-to-b from-white to-emerald-50/20'
                  : 'border-slate-200/90'
              } ${justCompleted ? 'animate-card-complete' : ''}`}
            >
              {/* Top Tag Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                {asg.course && (
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-slate-100 text-slate-800">
                    {asg.course.code}
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border ${
                    isGroupTask
                      ? 'bg-violet-50 text-violet-700 border-violet-200/80'
                      : 'bg-sky-50 text-sky-700 border-sky-200/80'
                  }`}
                >
                  <Icon name={isGroupTask ? 'users' : 'shield'} className="w-3 h-3" />
                  {isGroupTask ? 'Group Assignment' : 'Individual Assignment'}
                </span>

                {acknowledged ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-check-pop">
                    <Icon name="checkCircle" className="w-3.5 h-3.5" />
                    Acknowledged
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border ${
                      deadlineInfo.tone === 'rose'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : deadlineInfo.tone === 'amber'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Icon name="clock" className="w-3 h-3" />
                    {deadlineInfo.label}
                  </span>
                )}

                <span className="text-xs font-medium text-slate-400 ml-auto">
                  Due {formatDateTime(asg.deadline)}
                </span>
              </div>

              <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 mt-3.5">
                {asg.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                {asg.description}
              </p>

              {/* Visual 3-Step Submission Stepper */}
              <div className="mt-5 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                    1
                  </span>
                  <span className="font-semibold text-slate-700">Open OneDrive Folder</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                    2
                  </span>
                  <span className="font-semibold text-slate-700">Upload Deliverables</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[11px] shrink-0 ${
                      acknowledged
                        ? 'bg-emerald-500 text-white animate-check-pop'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {acknowledged ? '✓' : '3'}
                  </span>
                  <span
                    className={`font-semibold ${
                      acknowledged ? 'text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {isGroupTask ? 'Leader Acknowledges' : 'Student Acknowledges'}
                  </span>
                </div>
              </div>

              {/* Acknowledged Audit Banner */}
              {acknowledged && (
                <div className="mt-4 px-4 py-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 animate-check-pop">
                    <Icon name="check" className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">
                      {isGroupTask
                        ? `Acknowledged by Group Leader (${
                            asg.acknowledgedBy?.name || 'Leader'
                          }) for ${myGroup ? myGroup.name : 'Group'}`
                        : `Acknowledged by ${currentUser.name}`}{' '}
                      <span className="font-normal text-emerald-800">
                        • {formatDateTime(asg.submission.acknowledgedAt)}
                      </span>
                    </div>
                    {asg.submission.note && (
                      <div className="text-emerald-800 mt-0.5">
                        Note: {asg.submission.note}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={asg.oneDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition"
                >
                  <Icon name="externalLink" className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open OneDrive Folder</span>
                </a>

                {!acknowledged && (
                  <>
                    {isGroupTask && myGroup && !isGroupLeader ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/90">
                        <Icon name="lock" className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          Only Group Leader (
                          {groupLeaderUser ? groupLeaderUser.name : 'Leader'}) Can
                          Acknowledge
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startSubmissionConfirmation(asg)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white transition shadow-sm shadow-indigo-500/20 active:scale-[0.98]"
                      >
                        <Icon name="checkCircle" className="w-4 h-4" />
                        <span>
                          {isGroupTask
                            ? 'Acknowledge Group Submission'
                            : 'Submit & Acknowledge'}
                        </span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Verification Modal */}
      {pendingConfirmAsg && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl animate-view-enter">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">
                  {pendingConfirmAsg.submissionType === 'GROUP'
                    ? 'Group Leader Acknowledgment'
                    : 'Individual Verification'}
                </span>
                <h3 className="font-display text-xl font-extrabold text-slate-900 mt-0.5">
                  Confirm Submission
                </h3>
              </div>
              <button
                onClick={() => setPendingConfirmAsg(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={confirmSubmission} className="mt-4 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <div className="font-bold text-slate-900">{pendingConfirmAsg.title}</div>
                <div className="text-slate-500">
                  {pendingConfirmAsg.submissionType === 'GROUP' ? (
                    <>
                      Reflects immediately across all members of{' '}
                      <strong className="text-slate-800">{myGroup?.name}</strong>
                    </>
                  ) : (
                    <>
                      Individual submission for{' '}
                      <strong className="text-slate-800">{currentUser.name}</strong>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Submission Note (Optional)
                </label>
                <input
                  type="text"
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="e.g., Uploaded final report & SQL scripts"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition">
                <input
                  type="checkbox"
                  required
                  checked={verifiedUpload}
                  onChange={(e) => setVerifiedUpload(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I confirm our deliverables have been uploaded to the shared OneDrive
                  folder and officially acknowledge submission.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingConfirmAsg(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!verifiedUpload}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm transition"
                >
                  Confirm &amp; Acknowledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// 9. PROFESSOR WORKSPACE (Courses Taught, Analytics, CRUD & Status Filter)
// ----------------------------------------------------------------------------
function ProfessorWorkspace({
  activeNav,
  setActiveNav,
  selectedCourseId,
  setSelectedCourseId,
  currentUser,
  session,
  db,
  setDb,
  showToast,
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingAsg, setEditingAsg] = useState(null);
  const [courseIdInput, setCourseIdInput] = useState('crs-401');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [oneDriveUrl, setOneDriveUrl] = useState('');
  const [submissionType, setSubmissionType] = useState('GROUP');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [filterAssignmentId, setFilterAssignmentId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const students = useMemo(() => db.users.filter((u) => u.role === 'STUDENT'), [db.users]);

  const coursesTaught = useMemo(
    () => db.courses.filter((c) => c.professorId === currentUser.id),
    [db.courses, currentUser.id]
  );

  const assignmentStats = useMemo(() => {
    return db.assignments.map((asg) => {
      const course = db.courses.find((c) => c.id === asg.courseId);
      const enrolledStudents = students.filter((s) =>
        (s.enrolledCourseIds || []).includes(asg.courseId)
      );

      if (asg.submissionType === 'GROUP') {
        const total = db.groups.length;
        const acknowledgedCount = db.groups.filter((g) =>
          db.submissions.some((s) => s.assignmentId === asg.id && s.groupId === g.id)
        ).length;
        const pct = total > 0 ? Math.round((acknowledgedCount / total) * 100) : 0;
        return { ...asg, course, acknowledgedCount, total, pct, unitLabel: 'Groups' };
      } else {
        const total = enrolledStudents.length;
        const acknowledgedCount = enrolledStudents.filter((stu) =>
          db.submissions.some((s) => s.assignmentId === asg.id && s.studentId === stu.id)
        ).length;
        const pct = total > 0 ? Math.round((acknowledgedCount / total) * 100) : 0;
        return { ...asg, course, acknowledgedCount, total, pct, unitLabel: 'Students' };
      }
    });
  }, [db.assignments, db.courses, db.groups, db.submissions, students]);

  const professorCourseCards = useMemo(() => {
    return coursesTaught.map((course) => {
      const enrolledCount = students.filter((s) =>
        (s.enrolledCourseIds || []).includes(course.id)
      ).length;
      const courseAsgs = assignmentStats.filter((a) => a.courseId === course.id);
      const totalExpected = courseAsgs.reduce((s, a) => s + a.total, 0);
      const totalAck = courseAsgs.reduce((s, a) => s + a.acknowledgedCount, 0);
      const pct = totalExpected > 0 ? Math.round((totalAck / totalExpected) * 100) : 0;
      return {
        ...course,
        enrolledCount,
        assignmentCount: courseAsgs.length,
        totalAck,
        totalExpected,
        pct,
      };
    });
  }, [coursesTaught, students, assignmentStats]);

  const openCreateForm = (defaultCourseId = 'crs-401') => {
    setEditingAsg(null);
    setCourseIdInput(defaultCourseId || 'crs-401');
    setTitle('');
    setDescription('');
    setDeadline(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
    setOneDriveUrl('https://onedrive.live.com/?id=joineazy_submission');
    setSubmissionType('GROUP');
    setFormOpen(true);
  };

  const openEditForm = (asg) => {
    setEditingAsg(asg);
    setCourseIdInput(asg.courseId);
    setTitle(asg.title);
    setDescription(asg.description);
    setDeadline(new Date(asg.deadline).toISOString().slice(0, 16));
    setOneDriveUrl(asg.oneDriveUrl);
    setSubmissionType(asg.submissionType);
    setFormOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !deadline || !oneDriveUrl.trim()) return;

    const payload = {
      courseId: courseIdInput,
      title: title.trim(),
      description: description.trim(),
      deadline: new Date(deadline).toISOString(),
      oneDriveUrl: oneDriveUrl.trim(),
      submissionType,
    };

    if (editingAsg) {
      await syncWithBackend(
        `/assignments/${editingAsg.id}`,
        { method: 'PUT', body: JSON.stringify(payload) },
        session?.token
      );
      setDb((prev) => ({
        ...prev,
        assignments: prev.assignments.map((a) =>
          a.id === editingAsg.id ? { ...a, ...payload } : a
        ),
      }));
      showToast('Assignment updated');
    } else {
      await syncWithBackend(
        '/assignments',
        { method: 'POST', body: JSON.stringify(payload) },
        session?.token
      );
      const created = {
        id: `asg_${Date.now()}`,
        ...payload,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      setDb((prev) => ({
        ...prev,
        assignments: [created, ...prev.assignments],
      }));
      showToast('Assignment published to course');
    }
    setFormOpen(false);
  };

  const handleDeleteAssignment = async (id) => {
    await syncWithBackend(`/assignments/${id}`, { method: 'DELETE' }, session?.token);
    setDb((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
      submissions: prev.submissions.filter((s) => s.assignmentId !== id),
    }));
    setConfirmDeleteId(null);
    showToast('Assignment deleted', 'info');
  };

  const renderModal = () => (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl my-8 animate-view-enter">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-display text-xl font-extrabold text-slate-900">
            {editingAsg ? 'Edit Assignment' : 'Create Course Assignment'}
          </h3>
          <button
            onClick={() => setFormOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveAssignment} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Course</label>
              <select
                value={courseIdInput}
                onChange={(e) => setCourseIdInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-600"
              >
                {coursesTaught.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Submission Type
              </label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-600"
              >
                <option value="GROUP">Group (Leader Acknowledges)</option>
                <option value="INDIVIDUAL">Individual Student</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Microservices Fault Tolerance Lab"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description &amp; Instructions
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deliverables and OneDrive upload instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Deadline</label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                OneDrive Folder URL
              </label>
              <input
                type="url"
                required
                value={oneDriveUrl}
                onChange={(e) => setOneDriveUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              {editingAsg ? 'Save Changes' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // ==========================================================================
  // VIEW 1: PROFESSOR COURSES DASHBOARD
  // ==========================================================================
  if (activeNav === 'courses') {
    const totalExpected = assignmentStats.reduce((s, a) => s + a.total, 0);
    const totalAck = assignmentStats.reduce((s, a) => s + a.acknowledgedCount, 0);
    const overallPct = totalExpected > 0 ? Math.round((totalAck / totalExpected) * 100) : 0;

    return (
      <div className="space-y-7 animate-view-enter">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Courses Taught"
            value={coursesTaught.length}
            sub="Fall 2026 Semester"
            icon="courses"
            accent="bg-indigo-50 text-indigo-600"
          />
          <MetricCard
            label="Enrolled Students"
            value={students.length}
            sub={`${db.groups.length} active project groups`}
            icon="users"
            accent="bg-sky-50 text-sky-600"
          />
          <MetricCard
            label="Acknowledged Rate"
            value={`${overallPct}%`}
            sub={`${totalAck} of ${totalExpected} submissions`}
            icon="checkCircle"
            accent="bg-emerald-50 text-emerald-600"
          />
          <MetricCard
            label="Active Assignments"
            value={db.assignments.length}
            sub="Group & Individual tasks"
            icon="assignments"
            accent="bg-amber-50 text-amber-600"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Courses Being Taught
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any course card to manage assignments and monitor submission statuses
            </p>
          </div>
          <button
            onClick={() => openCreateForm('crs-401')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 self-start sm:self-auto active:scale-[0.98]"
          >
            <Icon name="plus" className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professorCourseCards.map((course) => {
            const theme = COURSE_THEMES[course.accent] || COURSE_THEMES.indigo;
            return (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setActiveNav('assignments');
                }}
                className="cursor-pointer group bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_30px_-8px_rgba(79,70,229,0.14)] hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className={`bg-gradient-to-r ${theme.banner} p-5 text-white`}>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${theme.pill}`}
                      >
                        {course.code}
                      </span>
                      <span className="text-xs font-bold bg-black/20 px-2.5 py-0.5 rounded-full">
                        {course.enrolledCount} Students
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-extrabold mt-3.5 leading-snug">
                      {course.title}
                    </h3>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {course.assignmentCount} Assignment(s)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {course.totalAck} of {course.totalExpected} Acknowledged
                      </div>
                    </div>
                    <CircularProgress
                      pct={course.pct}
                      size={48}
                      strokeWidth={4.5}
                      color={theme.ring}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 pt-1">
                    <span>Manage Course &amp; Submissions</span>
                    <Icon
                      name="arrowRight"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {formOpen && renderModal()}
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: SUBMISSIONS TRACKER WITH STATUS FILTERING
  // ==========================================================================
  if (activeNav === 'tracking') {
    const trackingRows = [];
    db.assignments
      .filter((a) => filterAssignmentId === 'ALL' || a.id === filterAssignmentId)
      .forEach((asg) => {
        const course = db.courses.find((c) => c.id === asg.courseId);
        const enrolled = students.filter((s) =>
          (s.enrolledCourseIds || []).includes(asg.courseId)
        );

        enrolled.forEach((stu) => {
          const mem = db.groupMembers.find((m) => m.userId === stu.id);
          const grp = mem ? db.groups.find((g) => g.id === mem.groupId) : null;

          const sub =
            asg.submissionType === 'GROUP'
              ? grp
                ? db.submissions.find(
                    (s) => s.assignmentId === asg.id && s.groupId === grp.id
                  )
                : null
              : db.submissions.find(
                  (s) => s.assignmentId === asg.id && s.studentId === stu.id
                );

          const ackUser = sub
            ? db.users.find((u) => u.id === sub.acknowledgedByUserId)
            : null;

          const status = sub ? 'ACKNOWLEDGED' : 'PENDING';
          if (statusFilter !== 'ALL' && status !== statusFilter) return;

          const q = searchTerm.trim().toLowerCase();
          if (
            q &&
            !stu.name.toLowerCase().includes(q) &&
            !stu.codeId.toLowerCase().includes(q) &&
            !(grp && grp.name.toLowerCase().includes(q))
          ) {
            return;
          }

          trackingRows.push({
            key: `${asg.id}_${stu.id}`,
            student: stu,
            group: grp,
            assignment: asg,
            course,
            status,
            submission: sub,
            ackUser,
          });
        });
      });

    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-view-enter">
        <div className="p-5 sm:p-6 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl self-start">
            {[
              { id: 'ALL', label: 'All Statuses' },
              { id: 'ACKNOWLEDGED', label: 'Acknowledged' },
              { id: 'PENDING', label: 'Pending' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === pill.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterAssignmentId}
              onChange={(e) => setFilterAssignmentId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:border-indigo-600"
            >
              <option value="ALL">All Assignments</option>
              {db.assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>

            <div className="relative">
              <Icon
                name="search"
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter student or group..."
                className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs w-full sm:w-56 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-5">Assignment &amp; Course</th>
                <th className="py-3.5 px-5">Type / Group</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Acknowledged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {trackingRows.map((row) => (
                <tr key={row.key} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <AvatarBadge name={row.student.name} size="sm" />
                      <div>
                        <div className="font-bold text-slate-900">{row.student.name}</div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {row.student.codeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-800">{row.assignment.title}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {row.course?.code}
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        row.assignment.submissionType === 'GROUP'
                          ? 'bg-violet-50 text-violet-700 border border-violet-200/80'
                          : 'bg-sky-50 text-sky-700 border border-sky-200/80'
                      }`}
                    >
                      {row.assignment.submissionType}
                    </span>
                    {row.group && (
                      <span className="block text-[11px] font-medium text-slate-600 mt-1">
                        {row.group.name}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    {row.status === 'ACKNOWLEDGED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Icon name="checkCircle" className="w-3 h-3" />
                        Acknowledged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Icon name="clock" className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-slate-600">
                    {row.submission ? (
                      <div>
                        <span className="font-bold text-slate-900">
                          {row.ackUser?.name || 'Student'}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {formatDate(row.submission.acknowledgedAt)}
                        </span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 3: ANALYTICS
  // ==========================================================================
  if (activeNav === 'analytics') {
    return (
      <div className="space-y-6 animate-view-enter">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <h3 className="font-display text-lg font-extrabold text-slate-900">
            Submission Completion Across All Assignments
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-6">
            Tracks both Group Leader acknowledgments and Individual submissions in real time
          </p>

          <div className="space-y-5">
            {assignmentStats.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70"
              >
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-900 truncate pr-4">
                    <span className="font-mono text-indigo-600 mr-1.5">
                      [{a.course?.code}]
                    </span>
                    {a.title} ({a.submissionType})
                  </span>
                  <span className="text-indigo-600 tabular-nums shrink-0">
                    {a.acknowledgedCount} / {a.total} {a.unitLabel} ({a.pct}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      a.pct === 100
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-indigo-600 to-violet-600'
                    }`}
                    style={{ width: `${a.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 4: PROFESSOR ASSIGNMENTS CRUD
  // ==========================================================================
  const filteredStats = selectedCourseId
    ? assignmentStats.filter((a) => a.courseId === selectedCourseId)
    : assignmentStats;

  return (
    <div className="space-y-6 animate-view-enter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedCourseId(null);
            setActiveNav('courses');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-2xs"
        >
          <Icon name="arrowLeft" className="w-3.5 h-3.5" />
          <span>Back to Courses</span>
        </button>

        <button
          onClick={() => openCreateForm(selectedCourseId || 'crs-401')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStats.map((asg) => (
          <div
            key={asg.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {asg.course && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-mono font-bold">
                      {asg.course.code}
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      asg.submissionType === 'GROUP'
                        ? 'bg-violet-50 text-violet-700 border border-violet-200/80'
                        : 'bg-sky-50 text-sky-700 border border-sky-200/80'
                    }`}
                  >
                    {asg.submissionType}
                  </span>
                  <span className="text-xs text-slate-500">Due {formatDate(asg.deadline)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(asg)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <Icon name="edit" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(asg.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {confirmDeleteId === asg.id && (
                <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
                  <span className="text-rose-800 font-bold">Delete assignment?</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <h3 className="font-display text-lg font-extrabold text-slate-900 mt-3.5">
                {asg.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {asg.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-500">Acknowledged ({asg.unitLabel})</span>
                  <span className="text-slate-900 tabular-nums">
                    {asg.acknowledgedCount} / {asg.total} ({asg.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${asg.pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a
                  href={asg.oneDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <Icon name="externalLink" className="w-3.5 h-3.5" />
                  <span>OneDrive Folder</span>
                </a>
                <button
                  onClick={() => {
                    setFilterAssignmentId(asg.id);
                    setActiveNav('tracking');
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600"
                >
                  Inspect Submissions →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formOpen && renderModal()}
    </div>
  );
}

function MetricCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] flex items-start justify-between gap-3">
      <div>
        <div className="text-xs font-bold text-slate-500">{label}</div>
        <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
          {value}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
      </div>
      {icon && (
        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${accent}`}>
          <Icon name={icon} className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
