const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());

// Serve static assets
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.use(express.static(__dirname));

/* ==========================================
   BACKEND API ROUTING
   ========================================== */

// 1. Submit an admission enquiry
app.post('/api/admissions', (req, res) => {
  const { studentName, studentClass, studentDOB, parentName, parentPhone, parentEmail, resAddress } = req.body;
  
  if (!studentName || !studentClass || !studentDOB || !parentName || !parentPhone || !parentEmail || !resAddress) {
    return res.status(400).json({ success: false, message: 'Missing required enquiry parameters.' });
  }

  try {
    const newEnquiry = db.saveAdmission({
      studentName,
      studentClass,
      studentDOB,
      parentName,
      parentPhone,
      parentEmail,
      resAddress
    });
    return res.status(201).json({ success: true, enquiry: newEnquiry });
  } catch (error) {
    console.error('Error saving admission:', error);
    return res.status(500).json({ success: false, message: 'Database error while saving enquiry.' });
  }
});

// 2. Fetch all enquiries (Admin Teacher Panel)
app.get('/api/admissions', (req, res) => {
  try {
    const list = db.getAdmissions();
    return res.json({ success: true, admissions: list });
  } catch (error) {
    console.error('Error fetching admissions:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching enquiries.' });
  }
});

// 3. Allowed emails whitelist CRUD
app.get('/api/allowed-emails', (req, res) => {
  try {
    const list = db.getAllowedEmails();
    return res.json({ success: true, emails: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving whitelisted emails.' });
  }
});

app.post('/api/allowed-emails', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email field is required.' });
  }

  try {
    const result = db.addAllowedEmail(email);
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error adding email to whitelist.' });
  }
});

// 4. Authenticate Portal Logins against Database records
app.post('/api/login', (req, res) => {
  const { userId, password, role } = req.body;

  if (!userId || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing user credentials or role type.' });
  }

  const sanitizedId = userId.trim().toLowerCase();

  try {
    // Query database for user profile
    const user = db.getUser(sanitizedId);

    // If user exists and role matches
    if (user && user.role === role) {
      // Validate password
      if (user.password === password) {
        // Return full database profile
        return res.json({ success: true, profile: user });
      } else {
        return res.status(401).json({ success: false, message: 'Access Denied: Incorrect password entered.' });
      }
    }

    // Handlers if user profile is missing
    if (role === 'student') {
      return res.status(403).json({
        success: false,
        message: `Access Denied: The student email '${userId}' is not whitelisted in the school registry. Please contact administration.`
      });
    }

    return res.status(404).json({
      success: false,
      message: `Access Denied: Portal account with ID '${userId}' not found.`
    });

  } catch (error) {
    console.error('Login routing error:', error);
    return res.status(500).json({ success: false, message: 'Database query authentication error.' });
  }
});

// Serve frontend home page as fallback for single-page routing
app.use((req, res) => {
  const distIndex = path.join(distPath, 'index.html');
  if (require('fs').existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Launch server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  Chinmaya Vidyalaya Server is running on port ${PORT} `);
  console.log(`  Local URL: http://localhost:${PORT}                `);
  console.log(`===================================================`);
});
