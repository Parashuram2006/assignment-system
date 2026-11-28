import React, { useState, useEffect, useMemo, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';
const DB_STORAGE_KEY = 'joineazy_round2_store_v2';
const AUTH_STORAGE_KEY = 'joineazy_round2_auth_v2';

// ----------------------------------------------------------------------------
// 1. MINIMAL INLINE SVG ICON SET
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
// 2. RELATIONAL SEED DATA (Courses, Users, Groups, Individual/Group Tasks)
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
      code: 'CS-405',
      title: 'Full-Stack Web Engineering & API Security',
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
// 3. HELPERS & JWT TOKEN BUILDER
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

function isOverdue(iso) {
  return new Date(iso).getTime() < Date.now();
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

// ----------------------------------------------------------------------------
// 4. MAIN APPLICATION SHELL
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
      `Authenticated via JWT • Redirected to ${
        user.role === 'PROFESSOR' ? 'Professor Dashboard' : 'Student Courses'
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
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
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
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex">
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Icon name="brand" className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-none">
                Joineazy
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {isProfessor ? 'Professor Console' : 'Student Portal'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600"
          >
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile & Controls */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isProfessor
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {isProfessor ? 'Professor' : 'Student'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              {currentUser.codeId}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetStore}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              <Icon name="refresh" className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
            >
              <Icon name="logout" className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <div className="truncate">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {activeCourse
                  ? `${activeCourse.code}: ${activeCourse.title}`
                  : activeNav === 'courses'
                  ? isProfessor
                    ? 'Courses Taught & Analytics'
                    : 'My Enrolled Courses'
                  : activeNav === 'tracking'
                  ? 'Submission Tracking'
                  : activeNav === 'group'
                  ? 'Group & Leadership'
                  : activeNav === 'analytics'
                  ? 'Course Analytics'
                  : 'Assignments'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              JWT Verified
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto animate-view-enter">
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
// 5. TOAST NOTIFICATION
// ----------------------------------------------------------------------------
function ToastNotification({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm max-w-sm animate-view-enter">
      <Icon
        name={toast.type === 'error' ? 'alert' : 'checkCircle'}
        className={`w-4 h-4 shrink-0 ${
          toast.type === 'error' ? 'text-rose-400' : 'text-emerald-400'
        }`}
      />
      <span className="flex-1 text-xs font-medium">{toast.message}</span>
      <button onClick={onDismiss} className="text-slate-400 hover:text-white">
        <Icon name="x" className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 6. AUTHENTICATION SCREEN (Validation, Loader Animation & Role Redirect)
// ----------------------------------------------------------------------------
function AuthScreen({ users, onLogin, onRegister }) {
  const [tab, setTab] = useState('LOGIN');
  const [email, setEmail] = useState('aarav@joineazy.edu');
  const [password, setPassword] = useState('password123');
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
          setAuthError('Invalid email or password. Try a quick-access account below.');
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
      badgeClass: 'bg-amber-100 text-amber-800',
      user: users.find((u) => u.id === 'prof-101'),
    },
    {
      badge: 'Group Leader',
      badgeClass: 'bg-indigo-100 text-indigo-800',
      user: users.find((u) => u.id === 'stu-01'),
    },
    {
      badge: 'Group Member',
      badgeClass: 'bg-sky-100 text-sky-800',
      user: users.find((u) => u.id === 'stu-02'),
    },
    {
      badge: 'Solo Student',
      badgeClass: 'bg-slate-100 text-slate-700',
      user: users.find((u) => u.id === 'stu-05'),
    },
  ].filter((item) => item.user);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 animate-view-enter">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Icon name="brand" className="w-6 h-6" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Joineazy Academic Workspace
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Course-linked group collaboration &amp; verified submissions
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setTab('LOGIN');
                setFieldErrors({});
                setAuthError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
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
              className={`py-2 text-xs font-semibold rounded-lg transition ${
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Parashuram"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                      fieldErrors.name
                        ? 'border-rose-400 bg-rose-50/40'
                        : 'border-slate-300 focus:border-indigo-600'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-600"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="PROFESSOR">Professor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@joineazy.edu"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                  fieldErrors.email
                    ? 'border-rose-400 bg-rose-50/40'
                    : 'border-slate-300 focus:border-indigo-600'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                  fieldErrors.password
                    ? 'border-rose-400 bg-rose-50/40'
                    : 'border-slate-300 focus:border-indigo-600'
                }`}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <Icon name="alert" className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-sm font-semibold transition shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting && <Icon name="loader" className="w-4 h-4 animate-spin" />}
              <span>
                {isSubmitting
                  ? 'Authenticating JWT...'
                  : tab === 'LOGIN'
                  ? 'Sign In'
                  : 'Create Account'}
              </span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              1-Click Role Switcher (Test All Flows)
            </div>
            <div className="space-y-2">
              {quickAccounts.map(({ badge, badgeClass, user }) => (
                <button
                  key={user.id}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => triggerAuthWithLoader(() => onLogin(user))}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                    {badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 7. STUDENT WORKSPACE (Courses Grid, Group Leader Rule & Individual/Group)
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
        showToast('Create or join a group first for group assignments.', 'error');
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
    setTimeout(() => setRecentlyCompletedAsgId(null), 1500);

    showToast(
      pendingConfirmAsg.submissionType === 'GROUP'
        ? `Group submission acknowledged! Reflected across all ${myGroup.name} members.`
        : `Individual submission acknowledged for "${pendingConfirmAsg.title}"`
    );
    setPendingConfirmAsg(null);
  };

  // VIEW A: ENROLLED COURSES DASHBOARD
  if (activeNav === 'courses') {
    const totalDone = enrichedAssignments.filter((a) => a.submission).length;
    const totalAll = enrichedAssignments.length;
    const overallPct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;

    return (
      <div className="space-y-6 animate-view-enter">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">
                {currentUser.department}
              </span>
              <span className="text-slate-300">•</span>
              {myGroup ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  {isGroupLeader && <Icon name="crown" className="w-3 h-3" />}
                  {myGroup.name} ({isGroupLeader ? 'Leader' : 'Member'})
                </span>
              ) : (
                <button
                  onClick={() => setActiveNav('group')}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  No Group Assigned — Create Group →
                </button>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Welcome back, {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any enrolled course below to view assignments and acknowledge submissions.
            </p>
          </div>

          <div className="w-full md:w-72">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600">Overall Course Progress</span>
              <span className="text-indigo-600 tabular-nums">
                {totalDone}/{totalAll} ({overallPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courseCards.map((course) => {
            const accentMap = {
              indigo: 'bg-indigo-600 text-white',
              emerald: 'bg-emerald-600 text-white',
              amber: 'bg-amber-500 text-white',
            };
            const barMap = {
              indigo: 'bg-indigo-600',
              emerald: 'bg-emerald-600',
              amber: 'bg-amber-500',
            };

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setStatusFilter('ALL');
                  setActiveNav('assignments');
                }}
                className="group text-left bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md p-6 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
                        accentMap[course.accent] || 'bg-indigo-600 text-white'
                      }`}
                    >
                      {course.code}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {course.semester}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-4 group-hover:text-indigo-700 transition">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <div className="text-xs text-slate-500">
                    Instructor:{' '}
                    <span className="font-semibold text-slate-700">
                      {course.professor ? course.professor.name : 'Faculty'}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">
                        {course.done} of {course.total} Acknowledged
                      </span>
                      <span className="text-slate-900 tabular-nums">{course.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          barMap[course.accent] || 'bg-indigo-600'
                        }`}
                        style={{ width: `${course.pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-1">
                    <span>Open Course Assignments</span>
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

  // VIEW B: MY GROUP & LEADERSHIP MANAGEMENT
  if (activeNav === 'group') {
    return (
      <div className="space-y-6 animate-view-enter">
        {!myGroup ? (
          <div className="max-w-lg bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Create Your Project Group</h2>
            <p className="text-sm text-slate-500 mt-1">
              Creating a group makes you the <strong>Group Leader</strong>, authorizing you to
              acknowledge group assignments for all members.
            </p>

            <form onSubmit={handleCreateGroup} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Team Apex"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
              >
                Create Group as Leader
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-slate-900">{myGroup.name}</h2>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(myGroup.inviteCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 1800);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold transition"
                    >
                      <span>{myGroup.inviteCode}</span>
                      <Icon name={copiedCode ? 'check' : 'copy'} className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {roster.length} members • Group Leader acknowledges group submissions
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {roster.map((m) => (
                  <div key={m.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {m.user.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.roleInGroup === 'LEADER'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m.roleInGroup === 'LEADER' && (
                            <Icon name="crown" className="w-3 h-3" />
                          )}
                          {m.roleInGroup}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="font-mono">{m.user.codeId}</span> • {m.user.email}
                      </div>
                    </div>

                    {isGroupLeader && m.userId !== currentUser.id && (
                      <button
                        onClick={() => handleRemoveMember(m)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Group Member</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isGroupLeader
                    ? 'Add teammates via email or Student ID.'
                    : 'Only the Group Leader can add or remove members.'}
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
                      <p className="text-xs text-rose-600 font-medium">{inviteError}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition"
                    >
                      <Icon name="userPlus" className="w-4 h-4" />
                      <span>Add to Group</span>
                    </button>
                  </form>

                  {availablePeers.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                        Unassigned Students
                      </div>
                      <div className="space-y-2">
                        {availablePeers.map((peer) => (
                          <div
                            key={peer.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-900">
                                {peer.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">
                                {peer.codeId}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddMember(null, peer)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 text-xs font-semibold transition"
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
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  You are a <strong>Member</strong> of {myGroup.name}. Group acknowledgments
                  by <strong>{groupLeaderUser ? groupLeaderUser.name : 'your Leader'}</strong>{' '}
                  sync automatically to your dashboard.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // VIEW C: COURSE ASSIGNMENTS & PROGRESS PAGE
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

  return (
    <div className="space-y-6 animate-view-enter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedCourseId(null);
            setActiveNav('courses');
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <Icon name="arrowLeft" className="w-4 h-4" />
          <span>Back to Enrolled Courses</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCourseId(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              !selectedCourseId
                ? 'bg-indigo-600 text-white border-indigo-600'
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
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

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-semibold text-slate-500">
            {myGroup
              ? `Group: ${myGroup.name} (${isGroupLeader ? 'Group Leader' : 'Group Member'})`
              : 'Individual Workspace'}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {completedCount} of {scopeAssignments.length} Assignments Acknowledged
          </h2>
        </div>

        <div className="w-full md:w-72">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Completion Progress</span>
            <span className="text-indigo-600 tabular-nums">{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200">
        {[
          { id: 'ALL', label: `All (${scopeAssignments.length})` },
          { id: 'PENDING', label: `Pending (${scopeAssignments.length - completedCount})` },
          { id: 'ACKNOWLEDGED', label: `Acknowledged (${completedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visibleAssignments.map((asg) => {
          const acknowledged = Boolean(asg.submission);
          const isGroupTask = asg.submissionType === 'GROUP';
          const late = !acknowledged && isOverdue(asg.deadline);
          const justCompleted = recentlyCompletedAsgId === asg.id;

          return (
            <div
              key={asg.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
                acknowledged ? 'border-emerald-200/90' : 'border-slate-200'
              } ${justCompleted ? 'animate-card-complete' : ''}`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                {asg.course && (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                    {asg.course.code}
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isGroupTask
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  <Icon name={isGroupTask ? 'users' : 'checkCircle'} className="w-3 h-3" />
                  {isGroupTask ? 'Group Assignment' : 'Individual Assignment'}
                </span>

                {acknowledged ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-check-pop">
                    <Icon name="checkCircle" className="w-3.5 h-3.5" />
                    Acknowledged
                  </span>
                ) : late ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <Icon name="alert" className="w-3.5 h-3.5" />
                    Past Deadline
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Icon name="clock" className="w-3.5 h-3.5" />
                    Pending Submission
                  </span>
                )}

                <span className="text-xs font-medium text-slate-500 ml-auto">
                  Deadline: {formatDateTime(asg.deadline)}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-3">{asg.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{asg.description}</p>

              {acknowledged && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <Icon
                    name="checkCircle"
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-check-pop"
                  />
                  <div>
                    <div className="font-semibold">
                      {isGroupTask
                        ? `Acknowledged by Group Leader (${
                            asg.acknowledgedBy?.name || 'Leader'
                          }) for ${myGroup ? myGroup.name : 'Group'}`
                        : `Acknowledged by ${currentUser.name}`}{' '}
                      • {formatDateTime(asg.submission.acknowledgedAt)}
                    </div>
                    {asg.submission.note && (
                      <div className="text-emerald-800/80 mt-0.5">
                        Note: {asg.submission.note}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={asg.oneDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                >
                  <Icon name="externalLink" className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open OneDrive Folder</span>
                </a>

                {!acknowledged && (
                  <>
                    {isGroupTask && myGroup && !isGroupLeader ? (
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <Icon name="lock" className="w-3.5 h-3.5" />
                        <span>
                          Awaiting Group Leader (
                          {groupLeaderUser ? groupLeaderUser.name : 'Leader'})
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startSubmissionConfirmation(asg)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                      >
                        <Icon name="checkCircle" className="w-3.5 h-3.5" />
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

      {/* Verification Modal */}
      {pendingConfirmAsg && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl animate-view-enter">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {pendingConfirmAsg.submissionType === 'GROUP'
                    ? 'Group Leader Acknowledgment'
                    : 'Individual Verification'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Confirm Submission</h3>
              </div>
              <button
                onClick={() => setPendingConfirmAsg(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={confirmSubmission} className="mt-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-900">{pendingConfirmAsg.title}</div>
                <div className="text-slate-500">
                  {pendingConfirmAsg.submissionType === 'GROUP' ? (
                    <>
                      Reflects automatically across all members of{' '}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Submission Note (Optional)
                </label>
                <input
                  type="text"
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="e.g., Uploaded final report & code archive"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={verifiedUpload}
                  onChange={(e) => setVerifiedUpload(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I confirm our files have been uploaded to the shared OneDrive link and officially
                  acknowledge submission.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingConfirmAsg(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!verifiedUpload}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition"
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
// 8. PROFESSOR WORKSPACE (Courses Taught, Analytics, CRUD & Status Filter)
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
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl my-8 animate-view-enter">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {editingAsg ? 'Edit Assignment' : 'Create Course Assignment'}
          </h3>
          <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveAssignment} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Course</label>
              <select
                value={courseIdInput}
                onChange={(e) => setCourseIdInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-600"
              >
                {coursesTaught.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Submission Type
              </label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-600"
              >
                <option value="GROUP">Group (Leader Acknowledges)</option>
                <option value="INDIVIDUAL">Individual Student</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deadline</label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {editingAsg ? 'Save Changes' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // VIEW 1: PROFESSOR COURSES DASHBOARD
  if (activeNav === 'courses') {
    const totalExpected = assignmentStats.reduce((s, a) => s + a.total, 0);
    const totalAck = assignmentStats.reduce((s, a) => s + a.acknowledgedCount, 0);
    const overallPct = totalExpected > 0 ? Math.round((totalAck / totalExpected) * 100) : 0;

    return (
      <div className="space-y-6 animate-view-enter">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Courses Taught" value={coursesTaught.length} sub="Fall 2026 Semester" />
          <MetricCard
            label="Enrolled Students"
            value={students.length}
            sub={`${db.groups.length} active project groups`}
          />
          <MetricCard
            label="Acknowledged Rate"
            value={`${overallPct}%`}
            sub={`${totalAck} of ${totalExpected} submissions`}
          />
          <MetricCard
            label="Active Assignments"
            value={db.assignments.length}
            sub="Group & Individual tasks"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Courses Being Taught</h2>
            <p className="text-xs text-slate-500">
              Click any course card to manage assignments and inspect submissions
            </p>
          </div>
          <button
            onClick={() => openCreateForm('crs-401')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm self-start sm:self-auto"
          >
            <Icon name="plus" className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {professorCourseCards.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setActiveNav('assignments');
              }}
              className="cursor-pointer group bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md p-6 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700">
                    {course.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {course.enrolledCount} Students
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-4 group-hover:text-indigo-700 transition">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{course.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">{course.assignmentCount} Assignment(s)</span>
                  <span className="text-emerald-700 tabular-nums">
                    {course.totalAck}/{course.totalExpected} ({course.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${course.pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-1">
                  <span>Manage Course &amp; Submissions</span>
                  <Icon
                    name="arrowRight"
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {formOpen && renderModal()}
      </div>
    );
  }

  // VIEW 2: SUBMISSIONS TRACKER WITH STATUS FILTERING
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-view-enter">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl self-start">
            {[
              { id: 'ALL', label: 'All Statuses' },
              { id: 'ACKNOWLEDGED', label: 'Acknowledged' },
              { id: 'PENDING', label: 'Pending' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === pill.id
                    ? 'bg-white text-slate-900 shadow-sm'
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
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-indigo-600"
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
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-5">Assignment &amp; Course</th>
                <th className="py-3.5 px-5">Type / Group</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Acknowledged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {trackingRows.map((row) => (
                <tr key={row.key} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-900">{row.student.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {row.student.codeId}
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-800">{row.assignment.title}</div>
                    <div className="text-[11px] text-slate-500">{row.course?.code}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        row.assignment.submissionType === 'GROUP'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}
                    >
                      {row.assignment.submissionType}
                    </span>
                    {row.group && (
                      <span className="block text-[11px] text-slate-600 mt-1">
                        {row.group.name}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    {row.status === 'ACKNOWLEDGED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Icon name="checkCircle" className="w-3 h-3" />
                        Acknowledged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Icon name="clock" className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-slate-600">
                    {row.submission ? (
                      <div>
                        <span className="font-semibold text-slate-900">
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

  // VIEW 3: ANALYTICS
  if (activeNav === 'analytics') {
    return (
      <div className="space-y-6 animate-view-enter">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">
            Submission Completion Across All Assignments
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-6">
            Tracks both Group Leader acknowledgments and Individual submissions
          </p>

          <div className="space-y-5">
            {assignmentStats.map((a) => (
              <div key={a.id}>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-800 truncate pr-4">
                    [{a.course?.code}] {a.title} ({a.submissionType})
                  </span>
                  <span className="text-indigo-600 tabular-nums shrink-0">
                    {a.acknowledgedCount} / {a.total} {a.unitLabel} ({a.pct}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
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

  // VIEW 4: PROFESSOR ASSIGNMENTS CRUD
  const filteredStats = selectedCourseId
    ? assignmentStats.filter((a) => a.courseId === selectedCourseId)
    : assignmentStats;

  return (
    <div className="space-y-5 animate-view-enter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedCourseId(null);
            setActiveNav('courses');
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600"
        >
          <Icon name="arrowLeft" className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>

        <button
          onClick={() => openCreateForm(selectedCourseId || 'crs-401')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStats.map((asg) => (
          <div
            key={asg.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {asg.course && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                      {asg.course.code}
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      asg.submissionType === 'GROUP'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-sky-50 text-sky-700'
                    }`}
                  >
                    {asg.submissionType}
                  </span>
                  <span className="text-xs text-slate-500">Due {formatDate(asg.deadline)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(asg)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <Icon name="edit" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(asg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {confirmDeleteId === asg.id && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
                  <span className="text-rose-800 font-medium">Delete assignment?</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="px-2.5 py-1 rounded bg-rose-600 text-white font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <h3 className="text-base font-bold text-slate-900 mt-3">{asg.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {asg.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-500">Acknowledged ({asg.unitLabel})</span>
                  <span className="text-slate-900 tabular-nums">
                    {asg.acknowledgedCount} / {asg.total} ({asg.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${asg.pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a
                  href={asg.oneDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Icon name="externalLink" className="w-3.5 h-3.5" />
                  <span>OneDrive Folder</span>
                </a>
                <button
                  onClick={() => {
                    setFilterAssignmentId(asg.id);
                    setActiveNav('tracking');
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
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

function MetricCard({ label, value, sub }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{value}</div>
      <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
    </div>
  );
}
