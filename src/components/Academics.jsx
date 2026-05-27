import React, { useState } from 'react';

const TABS_DATA = {
  prePrimary: {
    title: '👶 Play-Based Early Development',
    desc: 'For Pre-Kindergarten to Kindergarten children, we offer a playway learning model centered on speech expansion, basic spatial analysis, sensory activities, and interactive physical games.',
    features: [
      'Sensory Play Hubs',
      'Interactive Storytelling',
      'Foundational Fine Motor Skills',
      'Social Skill Groups'
    ]
  },
  primary: {
    title: '✏️ Building Core Pillars (Grade I - V)',
    desc: 'Focuses on mathematical reasoning, language proficiency (English, Hindi), basic environmental studies, and computer logic, structured to build creative thinking habits.',
    features: [
      'Activity-Driven Maths',
      'Linguistic labs',
      'EVS Exploratory Trips',
      'Creative Arts Portfolio'
    ]
  },
  middle: {
    title: '📚 Conceptual Exploration (Grade VI - VIII)',
    desc: 'Adapting deep NCERT based curricula across sciences, technologies, histories, and three languages. Focus shifts towards scientific methods, analytical writing, and computational systems.',
    features: [
      'Lab Experiment Logs',
      'Introduction to Coding',
      'Integrated Social Studies',
      'PTM Academic Diagnostics'
    ]
  },
  senior: {
    title: '🎓 Stream Specialisations (Grade IX - XII)',
    desc: 'Rigorous preparatory programs preparing students for CBSE board exams, alongside custom coaching for national engineering, medical, and commerce assessments.',
    features: [
      'Physics, Chemistry, Maths, Bio',
      'Commerce Accountancy, Economics',
      'Pre-Board Diagnostic Testing',
      'University Entry Guidance'
    ]
  }
};

export default function Academics() {
  const [activeTab, setActiveTab] = useState('prePrimary');

  return (
    <section id="academics">
      <div className="academics-grid">
        {/* Left Side: Tabs Nav and Tab Card */}
        <div style={{ minWidth: 0, width: '100%' }}>
          <div className="section-header">
            <span className="section-label">Active Learning</span>
            <h2 className="section-title">Academic Curriculums</h2>
            <p className="section-subtitle">
              Our educational pathway focuses on continuous exploration, reasoning depth, and standard-based conceptual excellence.
            </p>
          </div>

          {/* Academics Tabs Nav */}
          <div className="ac-tabs-nav">
            <button 
              className={`ac-tab-btn ${activeTab === 'prePrimary' ? 'active' : ''}`} 
              onClick={() => setActiveTab('prePrimary')}
            >
              Pre-Primary
            </button>
            <button 
              className={`ac-tab-btn ${activeTab === 'primary' ? 'active' : ''}`} 
              onClick={() => setActiveTab('primary')}
            >
              Primary
            </button>
            <button 
              className={`ac-tab-btn ${activeTab === 'middle' ? 'active' : ''}`} 
              onClick={() => setActiveTab('middle')}
            >
              Middle School
            </button>
            <button 
              className={`ac-tab-btn ${activeTab === 'senior' ? 'active' : ''}`} 
              onClick={() => setActiveTab('senior')}
            >
              Senior Secondary
            </button>
          </div>

          {/* Tab Content rendering dynamically */}
          <div className="ac-tab-content active">
            <div className="ac-content-card">
              <h3>{TABS_DATA[activeTab].title}</h3>
              <p>{TABS_DATA[activeTab].desc}</p>
              <div className="ac-features-grid">
                {TABS_DATA[activeTab].features.map((feat, idx) => (
                  <div key={idx} className="ac-feat-item">
                    <i className="ti ti-circle-check"></i> <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div className="ac-sidebar">
          {/* Highlights Box */}
          <div className="ac-side-card highlights-box">
            <h4><i className="ti ti-trophy"></i> Academic Highlights</h4>
            <div className="highlights-list">
              <div className="highlight-item">
                <i className="ti ti-circle-check-filled"></i>
                <span>100% success ratios in CBSE 10th & 12th Board examinations.</span>
              </div>
              <div className="highlight-item">
                <i className="ti ti-circle-check-filled"></i>
                <span>Highly trained educators with regular pedagogical workshops.</span>
              </div>
              <div className="highlight-item">
                <i className="ti ti-circle-check-filled"></i>
                <span>Consistently leading in national science exhibitions and Olympiads.</span>
              </div>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="ac-side-card">
            <h4><i className="ti ti-calendar"></i> Academic Calendar</h4>
            <div className="calendar-list">
              <div className="calendar-item">
                <span class="calendar-event">New Session Starts</span>
                <span class="calendar-date">April 2026</span>
              </div>
              <div className="calendar-item">
                <span class="calendar-event">First Term Assessments</span>
                <span class="calendar-date">June 2026</span>
              </div>
              <div className="calendar-item">
                <span class="calendar-event">Inter-School Sports</span>
                <span class="calendar-date">October 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
