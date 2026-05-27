import React, { useState, useEffect } from 'react';

const PORTAL_METADATA = {
  student: {
    title: 'Student Portal Login',
    desc: 'Access homework logs, report cards, class files, and profile sheets.',
    hint: "Hint: Login with ID 'student123' and password 'password123'."
  },
  parent: {
    title: 'Parent Portal Login',
    desc: "Track children's attendances, review performance charts, and pay tuition.",
    hint: "Hint: Login with ID 'parent123' and password 'password123'."
  },
  teacher: {
    title: 'Teacher Faculty Login',
    desc: 'Upload assignments, update classroom timetables, and record grades.',
    hint: "Hint: Login with ID 'teacher123' and password 'password123'."
  }
};

export default function LoginModal({ isOpen, loginType, onClose, onLoginSuccess, showToast }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('password123');

  // Pre-fill user IDs based on login role type to make manual testing seamless and frictionless
  useEffect(() => {
    if (loginType) {
      if (loginType === 'student') {
        setUserId('student123');
      } else {
        setUserId(`${loginType}123`);
      }
      setPassword('password123');
    }
  }, [loginType]);

  if (!isOpen || !loginType) return null;

  const metadata = PORTAL_METADATA[loginType];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId.trim() || !password) {
      showToast('Validation Error', 'Please complete all required login fields.', 'warning');
      return;
    }

    const payload = {
      userId: userId.trim(),
      password: password,
      role: loginType
    };

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message || 'Authentication failed'); });
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.profile) {
          showToast(
            'Access Granted',
            `Authenticated as ${data.profile.name}. Building dashboard...`,
            'success'
          );
          onLoginSuccess(data.profile);
          onClose();
        }
      })
      .catch(error => {
        console.error('Portal Login error:', error);
        showToast('Authentication Failed', error.message, 'danger');
      });
  };

  return (
    <div className="modal-overlay show" id="loginModal">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close Modal">
          <i className="ti ti-x"></i>
        </button>
        <div className="modal-icon">
          <i className="ti ti-user-circle"></i>
        </div>
        <h2>{metadata.title}</h2>
        <p>{metadata.desc}</p>

        <form id="portalLoginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loginUserId">Portal User ID / Email *</label>
            <input 
              type="text" 
              id="loginUserId" 
              placeholder="Enter Email or User ID" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required 
            />
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>
              {metadata.hint}
            </p>
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="loginUserPass">Password *</label>
            <input 
              type="password" 
              id="loginUserPass" 
              placeholder="Enter secure password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Authenticate <i className="ti ti-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
