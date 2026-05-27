/**
 * Simulated Full-Stack LocalStorage API Interceptor for Chinmaya Vidyalaya.
 * When deployed on static hosts like Surge, this automatically intercepts
 * all '/api/' calls to simulate the node server database operations client-side.
 */

const MOCK_USER_PROFILES = {
  student123: {
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
  parent123: {
    role: 'parent',
    name: 'Vijay Sharma',
    meta: 'Ward: Aanya Sharma · Standard VIII-B',
    avatar: 'VS',
    session: "Parent Portal Session: 2026 - 2027 · Ward Profile",
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
  },
  teacher123: {
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
  }
};

export function initApiInterceptor() {
  const isStaticHost = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (!isStaticHost) {
    return;
  }
  
  console.log("%c[Surge Live Mode] Initializing Client-Side Full-Stack Simulator...", "color: #10b981; font-weight: bold;");
  
  // Seed initial mock databases in LocalStorage
  if (!localStorage.getItem('mock_admissions')) {
    const defaultAdmissions = [
      {
        id: 'ADM_1716832400000_1',
        studentName: 'Amit Ranjan',
        studentClass: 'Secondary',
        studentDOB: '2011-04-12',
        parentName: 'Ramesh Ranjan',
        parentPhone: '9876543210',
        parentEmail: 'ramesh@gmail.com',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'ADM_1716832400000_2',
        studentName: 'Sneha Kumari',
        studentClass: 'Senior Science',
        studentDOB: '2009-08-25',
        parentName: 'Sunil Kumar',
        parentPhone: '8765432109',
        parentEmail: 'sunil@gmail.com',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ];
    localStorage.setItem('mock_admissions', JSON.stringify(defaultAdmissions));
  }
  
  if (!localStorage.getItem('mock_whitelist')) {
    localStorage.setItem('mock_whitelist', JSON.stringify(['student123']));
  }

  // Intercept all fetch requests to /api/
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    const urlString = typeof url === 'string' ? url : (url.url || '');
    
    if (urlString.startsWith('/api/')) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const responseData = simulateApiRequest(urlString, options);
          resolve(new Response(JSON.stringify(responseData.body), {
            status: responseData.status,
            headers: { 'Content-Type': 'application/json' }
          }));
        }, 400); // 400ms delay to mimic server response latency
      });
    }
    return originalFetch.apply(this, arguments);
  };

  function simulateApiRequest(url, options) {
    const method = (options && options.method) ? options.method.toUpperCase() : 'GET';
    const body = (options && options.body) ? JSON.parse(options.body) : null;

    // 1. GET /api/admissions
    if (url === '/api/admissions' && method === 'GET') {
      const admissions = JSON.parse(localStorage.getItem('mock_admissions') || '[]');
      return { status: 200, body: { success: true, admissions } };
    }

    // 2. POST /api/admissions
    if (url === '/api/admissions' && method === 'POST') {
      if (!body.studentName || !body.studentClass || !body.studentDOB || !body.parentName || !body.parentPhone || !body.parentEmail || !body.resAddress) {
        return { status: 400, body: { success: false, message: 'Missing required enquiry parameters.' } };
      }
      const admissions = JSON.parse(localStorage.getItem('mock_admissions') || '[]');
      const newEnquiry = {
        id: 'ADM_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        ...body,
        createdAt: new Date().toISOString()
      };
      admissions.push(newEnquiry);
      localStorage.setItem('mock_admissions', JSON.stringify(admissions));
      return { status: 201, body: { success: true, enquiry: newEnquiry } };
    }

    // 3. GET /api/allowed-emails
    if (url === '/api/allowed-emails' && method === 'GET') {
      const emails = JSON.parse(localStorage.getItem('mock_whitelist') || '[]');
      return { status: 200, body: { success: true, emails } };
    }

    // 4. POST /api/allowed-emails
    if (url === '/api/allowed-emails' && method === 'POST') {
      const email = body.email ? body.email.trim().toLowerCase() : '';
      if (!email) {
        return { status: 400, body: { success: false, message: 'Email field is required.' } };
      }
      const emails = JSON.parse(localStorage.getItem('mock_whitelist') || '[]');
      if (emails.includes(email)) {
        return { status: 400, body: { success: false, message: 'Email already whitelisted.' } };
      }
      emails.push(email);
      localStorage.setItem('mock_whitelist', JSON.stringify(emails));
      return { status: 201, body: { success: true, email } };
    }

    // 5. POST /api/login
    if (url === '/api/login' && method === 'POST') {
      const { userId, password, role } = body;
      if (!userId || !password || !role) {
        return { status: 400, body: { success: false, message: 'Missing credentials.' } };
      }
      const sanitizedId = userId.trim().toLowerCase();

      // 5a. Admin/Teacher Login
      if (role === 'teacher') {
        if (sanitizedId === 'teacher123' && password === 'password123') {
          return { status: 200, body: { success: true, profile: MOCK_USER_PROFILES.teacher123 } };
        }
        return { status: 401, body: { success: false, message: 'Access Denied: Incorrect password or ID.' } };
      }

      // 5b. Parent Login
      if (role === 'parent') {
        if (sanitizedId === 'parent123' && password === 'password123') {
          return { status: 200, body: { success: true, profile: MOCK_USER_PROFILES.parent123 } };
        }
        return { status: 401, body: { success: false, message: 'Access Denied: Incorrect password or ID.' } };
      }

      // 5c. Student Login
      if (role === 'student') {
        const whitelist = JSON.parse(localStorage.getItem('mock_whitelist') || '[]');
        if (whitelist.includes(sanitizedId) || sanitizedId === 'student123') {
          if (sanitizedId === 'student123' && password !== 'password123') {
            return { status: 401, body: { success: false, message: 'Access Denied: Incorrect password entered.' } };
          }
          if (sanitizedId !== 'student123' && password !== 'password123') {
            return { status: 401, body: { success: false, message: 'Access Denied: Incorrect password entered (default is password123).' } };
          }
          
          // Build student profile dynamically
          const studentProfile = {
            role: 'student',
            name: sanitizedId === 'student123' ? 'Rahul Kumar' : sanitizedId.split('@')[0].toUpperCase(),
            userId: sanitizedId,
            meta: sanitizedId === 'student123' ? 'Roll Number: 24 · Standard X-A' : `Student Email: ${sanitizedId} · Standard X-A`,
            avatar: sanitizedId === 'student123' ? 'RK' : sanitizedId.substring(0, 2).toUpperCase(),
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
          };
          return { status: 200, body: { success: true, profile: studentProfile } };
        }
        return {
          status: 403,
          body: {
            success: false,
            message: `Access Denied: The student email '${userId}' is not whitelisted in the school registry. Please contact administration.`
          }
        };
      }
    }

    return { status: 404, body: { success: false, message: 'Not Found' } };
  }
}
