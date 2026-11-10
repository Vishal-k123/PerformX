/* ============================================================
   PerformX - Main JavaScript (app.js)
   All logic: storage, auth, clock, salary, attendance, etc.
   ============================================================ */

'use strict';

// ============================================================
// LOCAL STORAGE KEYS (used instead of real MySQL for VS Code)
// ============================================================
const KEYS = {
  EMPLOYEES:   'px_employees',
  ATTENDANCE:  'px_attendance',
  PUNCHES:     'px_punches',
  EDUCATION:   'px_education',
  EXPERIENCE:  'px_experience',
  HISTORY:     'px_history',
  SALARY:      'px_salary',
  CURRENT_USER:'px_current_user',
  ADMIN:       'px_admin_logged',
};

// ============================================================
// STORAGE HELPERS
// ============================================================
const Store = {
  get(key)       { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }},
  getOne(key)    { try { return JSON.parse(localStorage.getItem(key));       } catch { return null; }},
  set(key, val)  { localStorage.setItem(key, JSON.stringify(val)); },
  push(key, item){ const a = Store.get(key); a.push(item); Store.set(key, a); },
  update(key, id, updates) {
    const a = Store.get(key);
    const i = a.findIndex(x => x.employee_id === id);
    if (i !== -1) { a[i] = { ...a[i], ...updates }; Store.set(key, a); return true; }
    return false;
  },
};

// ============================================================
// EMPLOYEE ID GENERATOR
// ============================================================
function generateEmployeeId() {
  const emps = Store.get(KEYS.EMPLOYEES);
  const year  = new Date().getFullYear();
  const seq   = String(emps.length + 1).padStart(3, '0');
  return `PX-${year}-${seq}`;
}

// ============================================================
// SEED DEMO DATA (first load only)
// ============================================================
function seedDemoData() {
  if (Store.get(KEYS.EMPLOYEES).length > 0) return; // already seeded
  const emp = {
    employee_id: 'PX-2024-001',
    first_name: 'Rahul',
    last_name: 'Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    date_of_birth: '2000-05-15',
    gender: 'Male',
    blood_group: 'B+',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    department: 'Engineering',
    designation: 'Software Developer',
    date_of_joining: '2024-01-10',
    employment_type: 'Full-Time',
    daily_rate: 1200,
    status: 'Active',
    created_at: new Date().toISOString(),
  };
  Store.push(KEYS.EMPLOYEES, emp);
  Store.push(KEYS.EDUCATION, {
    employee_id: 'PX-2024-001',
    degree: 'B.Tech Computer Science',
    institution: 'Mumbai University',
    board_university: 'Mumbai University',
    year_of_passing: '2022',
    percentage_grade: '78%',
  });
  Store.push(KEYS.EXPERIENCE, {
    employee_id: 'PX-2024-001',
    company_name: 'TechStart Pvt Ltd',
    designation: 'Junior Developer',
    start_date: '2022-06-01',
    end_date: '2023-12-31',
    years_of_experience: 1.5,
    responsibilities: 'Built internal tools using HTML/CSS/JS.',
    reason_for_leaving: 'Better opportunity',
    feedback: 'Hardworking and quick learner.',
  });
  Store.push(KEYS.HISTORY, {
    employee_id: 'PX-2024-001',
    event_type: 'Joined',
    description: 'Joined as Software Developer in Engineering Dept.',
    effective_date: '2024-01-10',
    recorded_by: 'admin',
  });
}
seedDemoData();

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(msg, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span>
                     <span class="toast-message">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300); }, duration);
}

// ============================================================
// LIVE CLOCK
// ============================================================
function startClock(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick(); setInterval(tick, 1000);
}

function getDateStr(d = new Date()) {
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}
function getTimeStr(d = new Date()) {
  return d.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
}
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number); return h * 60 + m;
}
function minutesToHM(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return `${h}h ${String(m).padStart(2,'0')}m`;
}

// ============================================================
// AUTH
// ============================================================
const ADMIN_CREDS = { username: 'admin', password: 'admin123' };

function loginAdmin(username, password) {
  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    Store.set(KEYS.ADMIN, true);
    Store.set(KEYS.CURRENT_USER, { role: 'admin', username });
    return true;
  }
  return false;
}

function loginEmployee(empId, birthYear) {
  const emps = Store.get(KEYS.EMPLOYEES);
  const emp  = emps.find(e => e.employee_id === empId);
  if (!emp) return null;
  const dob = new Date(emp.date_of_birth);
  if (String(dob.getFullYear()) === String(birthYear)) {
    Store.set(KEYS.CURRENT_USER, { role: 'employee', employee_id: empId, name: emp.first_name + ' ' + emp.last_name });
    return emp;
  }
  return null;
}

function logout() {
  Store.set(KEYS.CURRENT_USER, null);
  Store.set(KEYS.ADMIN, false);
  window.location.href = 'index.html';
}

function getCurrentUser() { return Store.getOne(KEYS.CURRENT_USER); }
function requireAdmin()   { if (!Store.getOne(KEYS.ADMIN)) window.location.href='index.html'; }
function requireEmployee() {
  const u = getCurrentUser();
  if (!u || u.role !== 'employee') window.location.href='index.html';
  return u;
}

// ============================================================
// EMPLOYEE CRUD
// ============================================================
function addEmployee(data) {
  data.employee_id = generateEmployeeId();
  data.status = 'Active';
  data.created_at = new Date().toISOString();
  Store.push(KEYS.EMPLOYEES, data);
  return data.employee_id;
}

function getEmployee(empId) {
  return Store.get(KEYS.EMPLOYEES).find(e => e.employee_id === empId) || null;
}

function getAllEmployees() { return Store.get(KEYS.EMPLOYEES); }

function addEducation(data)   { Store.push(KEYS.EDUCATION,  data); }
function addExperience(data)  { Store.push(KEYS.EXPERIENCE, data); }
function addHistory(data)     { Store.push(KEYS.HISTORY,    data); }

function getEducation(empId)  { return Store.get(KEYS.EDUCATION).filter(e=>e.employee_id===empId); }
function getExperience(empId) { return Store.get(KEYS.EXPERIENCE).filter(e=>e.employee_id===empId); }
function getHistory(empId)    { return Store.get(KEYS.HISTORY).filter(e=>e.employee_id===empId); }

// ============================================================
// ATTENDANCE
// ============================================================
function punchIn(empId) {
  const today = getDateStr();
  const now   = getTimeStr();
  const punches = Store.get(KEYS.PUNCHES);
  punches.push({ employee_id: empId, punch_date: today, punch_time: now, punch_type: 'IN' });
  Store.set(KEYS.PUNCHES, punches);

  // Create or update attendance record
  const att = Store.get(KEYS.ATTENDANCE);
  const idx = att.findIndex(a => a.employee_id === empId && a.attendance_date === today);
  if (idx === -1) {
    att.push({ employee_id: empId, attendance_date: today, first_in: now, last_out: null, working_hours: 0, status: 'Present' });
  }
  Store.set(KEYS.ATTENDANCE, att);
  return now;
}

function punchOut(empId) {
  const today = getDateStr();
  const now   = getTimeStr();
  const punches = Store.get(KEYS.PUNCHES);
  punches.push({ employee_id: empId, punch_date: today, punch_time: now, punch_type: 'OUT' });
  Store.set(KEYS.PUNCHES, punches);

  const att = Store.get(KEYS.ATTENDANCE);
  const idx = att.findIndex(a => a.employee_id === empId && a.attendance_date === today);
  if (idx !== -1) {
    att[idx].last_out = now;
    // Calculate hours from first_in to last_out
    const inMins  = timeToMinutes(att[idx].first_in);
    const outMins = timeToMinutes(now);
    att[idx].working_hours = ((outMins - inMins) / 60).toFixed(2);
    Store.set(KEYS.ATTENDANCE, att);
  }
  return now;
}

function getTodayAttendance(empId) {
  const today = getDateStr();
  return Store.get(KEYS.ATTENDANCE).find(a => a.employee_id === empId && a.attendance_date === today) || null;
}

function getTodayPunches(empId) {
  const today = getDateStr();
  return Store.get(KEYS.PUNCHES).filter(p => p.employee_id === empId && p.punch_date === today);
}

function getMonthlyAttendance(empId, monthYear) { // e.g. '2024-06'
  return Store.get(KEYS.ATTENDANCE).filter(a => a.employee_id === empId && a.attendance_date.startsWith(monthYear));
}

// ============================================================
// SALARY CALCULATOR
// ============================================================
function calcSalary(dailyRate, workingDays, workingHours) {
  // Per-day = dailyRate (for 8 hours)
  // Hourly rate = dailyRate / 8
  const hourlyRate = dailyRate / 8;
  // Salary = (days * dailyRate) + extra hours pay if any
  const fromDays  = workingDays * dailyRate;
  const fromHours = workingHours * hourlyRate;
  // We use whichever the user provides; days-based or hours-based
  // If hours provided: hours * hourlyRate
  // If days provided: days * dailyRate
  return { hourlyRate, fromDays, fromHours, dailyRate };
}

// ============================================================
// RENDER HELPERS (used on multiple pages)
// ============================================================
function renderEmployeeRow(emp, actions = true) {
  const initials = emp.first_name[0] + emp.last_name[0];
  const badge    = emp.status === 'Active'
    ? '<span class="badge badge-success">Active</span>'
    : '<span class="badge badge-danger">Inactive</span>';
  const act = actions ? `
    <button class="btn btn-sm btn-outline" onclick="viewEmployee('${emp.employee_id}')">View</button>
    <button class="btn btn-sm btn-primary-filled" onclick="attendanceFor('${emp.employee_id}')">Punch</button>
  ` : '';
  return `<tr>
    <td><span class="emp-id-badge">${emp.employee_id}</span></td>
    <td>
      <div class="flex gap-12" style="align-items:center">
        <div class="user-avatar" style="width:36px;height:36px;font-size:13px">${initials}</div>
        <div>
          <div class="fw-600">${emp.first_name} ${emp.last_name}</div>
          <div class="text-sm text-muted">${emp.email}</div>
        </div>
      </div>
    </td>
    <td>${emp.department || '-'}</td>
    <td>${emp.designation || '-'}</td>
    <td>${badge}</td>
    <td>₹${Number(emp.daily_rate||0).toLocaleString('en-IN')}/day</td>
    <td>${emp.date_of_joining || '-'}</td>
    ${act ? `<td><div class="flex gap-8">${act}</div></td>` : ''}
  </tr>`;
}

// expose globally
window.PX = {
  Store, KEYS, showToast, startClock,
  loginAdmin, loginEmployee, logout, getCurrentUser, requireAdmin, requireEmployee,
  addEmployee, getEmployee, getAllEmployees,
  addEducation, addExperience, addHistory,
  getEducation, getExperience, getHistory,
  punchIn, punchOut, getTodayAttendance, getTodayPunches, getMonthlyAttendance,
  calcSalary, generateEmployeeId,
  renderEmployeeRow, getDateStr, getTimeStr, minutesToHM, timeToMinutes,
};
