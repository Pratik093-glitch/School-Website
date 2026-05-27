const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const DEFAULT_USERS = [
  {
    userId: 'student123',
    password: 'password123',
    role: 'student',
    name: 'Rahul Kumar',
    meta: 'Roll Number: 24 · Standard X-A',
    avatar: 'RK',
    session: 'Academic Session: 2026 - 2027 · Standard X-A',
    stats: { total: 180, attended: 162, absent: 18, percent: 90 },
    chartLabel: 'My Grades',
    chartGrades: [
      { name: 'English', score: 85 },
      { name: 'Mathematics', score: 92 },
      { name: 'Science', score: 78 },
      { name: 'Computer', score: 88 }
    ],
    widgetTitle: 'Homework Queue',
    widgetItems: [
      { label: 'Maths: Trigonometry Exercise 4.2', detail: 'Due: Tomorrow, 02:00 PM', time: 'URGENT', color: '#ef4444' },
      { label: 'Physics: Ray Reflection Lab Journal', detail: 'Due: Friday, 10:00 AM', time: 'PENDING', color: '#10b981' }
    ]
  },
  {
    userId: 'teacher123',
    password: 'password123',
    role: 'teacher',
    name: 'Dr. Anita Sen',
    meta: 'Department: Computer Sciences & AI',
    avatar: 'AS',
    session: 'Faculty Database Panel · Active Classes X-A, X-B, VIII-C',
    stats: { total: 140, attended: 138, absent: 2, percent: 98 },
    chartLabel: 'Class Averages',
    chartGrades: [
      { name: 'Class X-A', score: 84 },
      { name: 'Class X-B', score: 79 },
      { name: 'Class VIII-C', score: 88 },
      { name: 'Class VII-A', score: 91 }
    ],
    widgetTitle: 'Faculty Quick Actions',
    widgetItems: [
      { label: 'Record Class Attendance (X-A)', detail: 'Status: Completed Today', time: 'DONE', color: '#10b981' },
      { label: 'Upload Homework Assignment File', detail: 'Pending Grade VIII upload', time: 'REQUIRED', color: '#ef4444' }
    ]
  },
  {
    userId: 'parent123',
    password: 'password123',
    role: 'parent',
    name: 'Vijay Sharma',
    meta: 'Ward: Aanya Sharma · Standard VIII-B',
    avatar: 'VS',
    session: 'Parent Portal Session: 2026 - 2027 · Ward Profile',
    stats: { total: 180, attended: 171, absent: 9, percent: 95 },
    chartLabel: 'Ward Grades',
    chartGrades: [
      { name: 'English', score: 90 },
      { name: 'Mathematics', score: 84 },
      { name: 'Social', score: 89 },
      { name: 'Sciences', score: 93 }
    ],
    widgetTitle: 'Fee Clearances & Alerts',
    widgetItems: [
      { label: 'Quarter 1 Tuition Fee Invoice', detail: 'Paid: April 10, 2026', time: 'CLEARED', color: '#10b981' },
      { label: 'Quarter 2 Transport / Annual Fee', detail: 'Due Date: July 15, 2026', time: 'PENDING', color: '#f59e0b' }
    ]
  }
];

// Initialize database file with new schema if missing
function initDb() {
  let needsRewrite = false;
  let data = { admissions: [], users: DEFAULT_USERS };

  if (fs.existsSync(DB_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      
      // If it's using the old format (e.g. allowedEmails exists but not users)
      if (!existing.users) {
        needsRewrite = true;
        data.admissions = existing.admissions || [];
      } else {
        data = existing;
      }
    } catch (e) {
      needsRewrite = true;
    }
  } else {
    needsRewrite = true;
  }

  if (needsRewrite) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// Helper to read data
function readData() {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return { admissions: [], users: DEFAULT_USERS };
  }
}

// Helper to write data
function writeData(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}

// Core Database Methods
const db = {
  getAdmissions() {
    const data = readData();
    return data.admissions || [];
  },

  saveAdmission(admission) {
    const data = readData();
    const newEnquiry = {
      id: 'ADM_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      studentName: admission.studentName,
      studentClass: admission.studentClass,
      studentDOB: admission.studentDOB,
      parentName: admission.parentName,
      parentPhone: admission.parentPhone,
      parentEmail: admission.parentEmail,
      resAddress: admission.resAddress,
      createdAt: new Date().toISOString()
    };
    data.admissions = data.admissions || [];
    data.admissions.push(newEnquiry);
    writeData(data);
    return newEnquiry;
  },

  getUser(userId) {
    const data = readData();
    const sanitizedId = userId.trim().toLowerCase();
    return (data.users || []).find(u => u.userId.toLowerCase() === sanitizedId);
  },

  getAllUsers() {
    const data = readData();
    return data.users || [];
  },

  getAllowedEmails() {
    const data = readData();
    // Whitelisted student emails are the userIds of student records
    return (data.users || [])
      .filter(u => u.role === 'student')
      .map(u => u.userId);
  },

  addAllowedEmail(email) {
    const data = readData();
    data.users = data.users || [];
    const sanitizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const userExists = data.users.some(u => u.userId.toLowerCase() === sanitizedEmail);
    
    if (sanitizedEmail && !userExists) {
      // Create a default student user account dynamically!
      const defaultStudent = {
        userId: sanitizedEmail,
        password: 'password123', // default initial password
        role: 'student',
        name: sanitizedEmail.split('@')[0].toUpperCase(),
        meta: `Student Email: ${sanitizedEmail} · Standard X-A`,
        avatar: sanitizedEmail.substring(0, 2).toUpperCase(),
        session: 'Academic Session: 2026 - 2027 · Standard X-A',
        stats: { total: 180, attended: 165, absent: 15, percent: 91 },
        chartLabel: 'My Grades',
        chartGrades: [
          { name: 'English', score: 80 },
          { name: 'Mathematics', score: 85 },
          { name: 'Science', score: 75 },
          { name: 'Computer', score: 90 }
        ],
        widgetTitle: 'Homework Queue',
        widgetItems: [
          { label: 'Computer: Smart School Database Essay', detail: 'Due: Friday, 02:00 PM', time: 'PENDING', color: '#10b981' }
        ]
      };
      
      data.users.push(defaultStudent);
      writeData(data);
      return { success: true, email: sanitizedEmail };
    }
    return { success: false, message: 'Email already whitelisted or user account exists.' };
  }
};

// Initialize database immediately on startup
initDb();

module.exports = db;
