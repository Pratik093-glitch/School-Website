import React, { useState, useEffect } from 'react';

export default function Dashboard({ userProfile, onLogout, showToast }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, grades, schedule, admin
  const [admissions, setAdmissions] = useState([]);
  const [whitelist, setWhitelist] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');

  // Radial attendance progress calculation (r=70)
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82
  const attendancePercent = userProfile.stats?.percent || 90;
  const dashOffset = circumference - (attendancePercent / 100) * circumference;

  // Load Admissions Log & Whitelist if Teacher logs in
  const isTeacher = userProfile.role === 'teacher';

  const fetchAdmissions = () => {
    fetch('/api/admissions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.admissions) {
          // Newest first
          setAdmissions([...data.admissions].reverse());
        }
      })
      .catch(err => {
        console.error('Error fetching admissions:', err);
        showToast('Error', 'Failed to retrieve admissions database log.', 'danger');
      });
  };

  const fetchWhitelist = () => {
    fetch('/api/allowed-emails')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.emails) {
          setWhitelist(data.emails);
        }
      })
      .catch(err => {
        console.error('Error fetching whitelist:', err);
      });
  };

  useEffect(() => {
    if (isTeacher) {
      fetchAdmissions();
      fetchWhitelist();
    }
  }, [userProfile]);

  const handleRefreshAdmissions = () => {
    fetchAdmissions();
    showToast('Refreshed', 'Admissions log updated.', 'info');
  };

  const handleWhitelistSubmit = (e) => {
    e.preventDefault();
    const emailToAdd = newEmail.trim();
    if (!emailToAdd) return;

    fetch('/api/allowed-emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailToAdd })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast('Whitelist Updated', `'${data.email}' is now authorized to sign in.`, 'success');
          setNewEmail('');
          fetchWhitelist();
        } else {
          showToast('Whitelist Failed', data.message || 'Error occurred while whitelisting.', 'warning');
        }
      })
      .catch(err => {
        console.error('Whitelist error:', err);
        showToast('Network Error', 'Cannot reach backend server. Please verify Express status.', 'danger');
      });
  };

  const handleTeacherAssignmentUpload = (e) => {
    e.preventDefault();
    const title = newAssignmentTitle.trim();
    if (!title) return;

    showToast(
      'Assignment Dispatched!',
      `Topic '${title}' has been logged and classroom dashboards updated.`,
      'success'
    );
    setNewAssignmentTitle('');
  };

  return (
    <div className="portal-dashboard-overlay show" id="portalDashboard">
      <div className="dashboard-layout">
        {/* Dashboard Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <i className="ti ti-chart-bar"></i>
            </div>
            <div className="sidebar-brand">
              <h3>Chinmaya Portals</h3>
              <p id="sidebarPortalType">{userProfile.role.toUpperCase()} PORTAL</p>
            </div>
          </div>

          <ul className="sidebar-nav">
            <li 
              className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => setActiveTab('overview')}
            >
              <i className="ti ti-layout-dashboard"></i> <span>Overview Summary</span>
            </li>
            <li 
              className={`sidebar-item ${activeTab === 'grades' ? 'active' : ''}`} 
              onClick={() => setActiveTab('grades')}
            >
              <i className="ti ti-books"></i>{' '}
              <span id="sidebarAcademicsLabel">{userProfile.chartLabel || 'Grades'}</span>
            </li>
            <li 
              className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`} 
              onClick={() => setActiveTab('schedule')}
            >
              <i className="ti ti-calendar-time"></i> <span>Calendar Schedule</span>
            </li>
            {isTeacher && (
              <li 
                className={`sidebar-item ${activeTab === 'admin' ? 'active' : ''}`} 
                onClick={() => setActiveTab('admin')}
              >
                <i className="ti ti-shield-lock"></i> <span>Admin Panel</span>
              </li>
            )}
          </ul>

          <div className="sidebar-footer">
            <button 
              className="sidebar-item" 
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }} 
              onClick={onLogout}
            >
              <i className="ti ti-logout"></i> <span>Sign Out Portal</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Main View */}
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div className="dashboard-welcome">
              <h2 id="dbWelcomeMsg">Welcome Back, {userProfile.name}!</h2>
              <p id="dbSessionMsg">{userProfile.session}</p>
            </div>
            <div className="dashboard-user-profile">
              <div className="user-avatar" id="dbUserAvatar">{userProfile.avatar}</div>
              <div className="user-meta">
                <h4 id="dbUserName">{userProfile.name}</h4>
                <p id="dbUserRole">{userProfile.meta}</p>
              </div>
            </div>
          </div>

          {/* VIEW 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div id="dbViewOverview">
              <div className="dashboard-grid">
                {/* Left Side Details */}
                <div>
                  <div className="dashboard-card">
                    <div className="dashboard-card-title">
                      <span>Attendance Record</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>GOOD STANDING</span>
                    </div>
                    <div className="db-stats-row">
                      <div className="db-stat-item">
                        <div className="db-stat-val" id="dbTotalClasses">{userProfile.stats?.total || 180}</div>
                        <div className="db-stat-lbl">Total Sessions</div>
                      </div>
                      <div className="db-stat-item">
                        <div className="db-stat-val" id="dbAttendedClasses">{userProfile.stats?.attended || 162}</div>
                        <div className="db-stat-lbl">Attended Logs</div>
                      </div>
                      <div className="db-stat-item">
                        <div className="db-stat-val" id="dbAbsentClasses">{userProfile.stats?.absent || 18}</div>
                        <div className="db-stat-lbl">Absent Logs</div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Radial Chart */}
                  <div className="dashboard-card">
                    <div className="dashboard-card-title">Live Attendance Percentage</div>
                    <div className="radial-chart-box">
                      <svg className="radial-svg" viewBox="0 0 160 160">
                        <circle className="radial-track" cx="80" cy="80" r={radius}/>
                        <circle 
                          className="radial-progress" 
                          id="dbRadialProgress" 
                          cx="80" 
                          cy="80" 
                          r={radius}
                          style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: dashOffset,
                            transition: 'stroke-dashoffset 0.8s ease-out'
                          }}
                        />
                      </svg>
                      <div className="radial-percentage" id="dbRadialPercentText">
                        {attendancePercent}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Details (Homework/Actions) */}
                <div>
                  <div className="dashboard-card" id="dbWidgetCard">
                    <div className="dashboard-card-title" id="dbWidgetTitle">{userProfile.widgetTitle || 'Assignments'}</div>
                    
                    <div className="class-schedule-list" id="dbWidgetList">
                      {userProfile.widgetItems?.map((item, idx) => (
                        <div key={idx} className="schedule-card" style={{ borderLeftColor: item.color }}>
                          <div className="schedule-details">
                            <h4>{item.label}</h4>
                            <p>{item.detail}</p>
                          </div>
                          <span className="schedule-time" style={{ color: item.color }}>{item.time}</span>
                        </div>
                      ))}

                      {/* Special dispatch form for teachers */}
                      {isTeacher && (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px dashed var(--border-color)' }}>
                          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '12px' }}>
                            <i className="ti ti-upload" style={{ color: 'var(--secondary)' }}></i> Dispatch E-Assignment
                          </h4>
                          <form onSubmit={handleTeacherAssignmentUpload}>
                            <div className="form-group" style={{ marginBottom: '10px' }}>
                              <input 
                                type="text" 
                                placeholder="Assignment Title (e.g. Code arrays)" 
                                value={newAssignmentTitle}
                                onChange={(e) => setNewAssignmentTitle(e.target.value)}
                                required 
                                style={{ padding: '8px 12px', fontSize: '0.8rem' }} 
                              />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem', width: '100%' }}>
                              Upload & Notify Class
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: ACADEMICS / GRADES */}
          {activeTab === 'grades' && (
            <div id="dbViewAcademics">
              <div className="dashboard-card">
                <div className="dashboard-card-title">Grade Performance Analysis</div>
                <p className="section-subtitle" style={{ fontSize: '0.85rem', marginBottom: '24px' }}>
                  Breakdown of academic grades achieved in the recent evaluation cycle.
                </p>
                
                <div className="mock-chart-container" id="gradeChartContainer">
                  {userProfile.chartGrades?.map((grade, idx) => (
                    <div key={idx} className="chart-bar-wrapper">
                      <div className="chart-bar" style={{ height: `${grade.score}%` }}>
                        <span className="chart-bar-val">{grade.score}%</span>
                      </div>
                      <span className="chart-bar-label">{grade.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: SCHEDULE / CALENDAR */}
          {activeTab === 'schedule' && (
            <div id="dbViewSchedule">
              <div className="dashboard-card">
                <div className="dashboard-card-title">Today's Class Timetable</div>
                <p className="section-subtitle" style={{ fontSize: '0.85rem', marginBottom: '24px' }}>
                  Daily routine log for live school classes and subjects.
                </p>
                
                <div className="class-schedule-list" id="dbScheduleList">
                  <div className="schedule-card">
                    <div className="schedule-details">
                      <h4>Subject Class: Mathematics (Trigonometry)</h4>
                      <p>Teacher: Mr. R. Prasad · Classroom A2</p>
                    </div>
                    <span className="schedule-time">08:30 - 09:15</span>
                  </div>
                  <div className="schedule-card">
                    <div className="schedule-details">
                      <h4>Subject Class: Physics Lab</h4>
                      <p>Teacher: Mrs. S. Sen · Science Lab B</p>
                    </div>
                    <span className="schedule-time">09:15 - 10:00</span>
                  </div>
                  <div className="schedule-card">
                    <div className="schedule-details">
                      <h4>Subject Class: English Literature</h4>
                      <p>Teacher: Mr. A. Roy · Classroom A2</p>
                    </div>
                    <span className="schedule-time">10:15 - 11:00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: TEACHER ADMIN PANEL */}
          {activeTab === 'admin' && isTeacher && (
            <div id="dbViewAdmin">
              <div className="dashboard-grid" style={{ gridTemplateColumns: '1.25fr 0.75fr' }}>
                {/* Left Side: Admissions List */}
                <div className="dashboard-card">
                  <div className="dashboard-card-title">
                    <span>Admissions Enquiries Log</span>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '6px 12px', fontSize: '0.72rem' }} 
                      onClick={handleRefreshAdmissions}
                    >
                      <i className="ti ti-refresh"></i> Refresh
                    </button>
                  </div>
                  <p className="section-subtitle" style={{ fontSize: '0.8rem', marginBottom: '12px', maxWidth: '100%' }}>
                    Database log of student admission enquiries submitted online.
                  </p>
                  
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Class Seek</th>
                          <th>Parent Name</th>
                          <th>Phone</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody id="adminAdmissionsTableBody">
                        {admissions.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                              No enquiries logged.
                            </td>
                          </tr>
                        ) : (
                          admissions.map((row, idx) => (
                            <tr key={idx}>
                              <td><strong>{row.studentName}</strong></td>
                              <td>
                                <span className="news-tag" style={{ position: 'static', fontSize: '0.62rem', padding: '2px 6px' }}>
                                  {row.studentClass}
                                </span>
                              </td>
                              <td>{row.parentName}</td>
                              <td>
                                <a href={`tel:${row.parentPhone}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                  <i className="ti ti-phone" style={{ fontSize: '0.75rem' }}></i> {row.parentPhone}
                                </a>
                              </td>
                              <td>
                                <a href={`mailto:${row.parentEmail}`} style={{ color: 'var(--secondary-dark)', fontWeight: 600 }}>
                                  <i className="ti ti-mail" style={{ fontSize: '0.75rem' }}></i> {row.parentEmail}
                                </a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Right Side: Email Whitelist Editor */}
                <div className="dashboard-card">
                  <div className="dashboard-card-title">
                    <span>Student Email Whitelist</span>
                  </div>
                  <p className="section-subtitle" style={{ fontSize: '0.8rem', marginBottom: '12px', maxWidth: '100%' }}>
                    Whitelisted student emails permitted to authenticate portals.
                  </p>
                  
                  <div className="whitelist-emails-container" id="adminWhitelistContainer">
                    {whitelist.length === 0 ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '8px' }}>
                        No whitelisted student emails.
                      </span>
                    ) : (
                      whitelist.map((email, idx) => (
                        <span key={idx} className="whitelist-tag">
                          {email}
                        </span>
                      ))
                    )}
                  </div>
                  
                  <form className="admin-form-inline" id="adminWhitelistForm" onSubmit={handleWhitelistSubmit}>
                    <input 
                      type="email" 
                      placeholder="Enter student email to allow..." 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required 
                      style={{ padding: '8px 12px', fontSize: '0.8rem', height: '38px' }} 
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', height: '38px', fontSize: '0.8rem' }}>
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
