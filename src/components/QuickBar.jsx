import React from 'react';

export default function QuickBar({ onTriggerLogin }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 90;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <div className="quick-bar">
      <div className="quick-item" onClick={() => onTriggerLogin('student')}>
        <i className="ti ti-device-laptop"></i>
        <span>Student Portal</span>
      </div>
      <div className="quick-item" onClick={() => onTriggerLogin('parent')}>
        <i className="ti ti-users"></i>
        <span>Parent Dashboard</span>
      </div>
      <div className="quick-item" onClick={() => scrollToSection('admissions')}>
        <i className="ti ti-file-plus"></i>
        <span>Online Admissions</span>
      </div>
      <div className="quick-item" onClick={() => scrollToSection('admissions')}>
        <i className="ti ti-receipt"></i>
        <span>Fee Estimator</span>
      </div>
      <div className="quick-item" onClick={() => scrollToSection('news')}>
        <i className="ti ti-calendar-event"></i>
        <span>Latest Events</span>
      </div>
      <div className="quick-item" onClick={() => scrollToSection('contact')}>
        <i className="ti ti-map-pin"></i>
        <span>Locate On Map</span>
      </div>
    </div>
  );
}
