import React from 'react';

export default function Portals({ onTriggerLogin }) {
  return (
    <section className="portal-section" id="portals">
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="section-label">Digital Campus</span>
        <h2 className="section-title">Interactive Portals</h2>
        <p className="section-subtitle" style={{ margin: '0 auto', color: '#c9daf8' }}>
          Login to your respective mock panels to access dashboards, attendances, assignment logs, and profiles.
        </p>
      </div>

      <div className="portal-grid">
        {/* Student Card */}
        <div className="portal-card">
          <i className="ti ti-school"></i>
          <h3>Student Portal</h3>
          <p>Access homework checklists, dynamic mark sheets, profile details, and daily class timetables.</p>
          <button className="btn btn-primary" onClick={() => onTriggerLogin('student')}>
            <i className="ti ti-login"></i> Student Login
          </button>
        </div>

        {/* Parent Card */}
        <div className="portal-card">
          <i className="ti ti-users-group"></i>
          <h3>Parent Portal</h3>
          <p>Track your ward's attendance charts, report grades, monthly fee receipts, and send communications to administration.</p>
          <button className="btn btn-primary" onClick={() => onTriggerLogin('parent')}>
            <i className="ti ti-login"></i> Parent Login
          </button>
        </div>

        {/* Teacher Card */}
        <div className="portal-card">
          <i className="ti ti-teacher"></i>
          <h3>Teacher Portal</h3>
          <p>Log student grades, upload online assignments, manage attendance registries, and schedule classroom tests.</p>
          <button className="btn btn-primary" onClick={() => onTriggerLogin('teacher')}>
            <i className="ti ti-login"></i> Teacher Login
          </button>
        </div>
      </div>
    </section>
  );
}
