import React, { useState, useEffect, useRef } from 'react';

export default function Header({ currentTheme, toggleTheme, onTriggerLogin, activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (!element) return;
    
    const offset = 90; // Adjust for sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  const handleNavItemClick = (e, id) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <>
      {/* TOP INFORMATION BAR */}
      <div className="topbar">
        <div className="topbar-contact">
          <span><i className="ti ti-phone"></i> +91-6542-223456</span>
          <span><i className="ti ti-mail"></i> info@chinmayabokaro.edu.in</span>
        </div>
        <div className="topbar-links">
          <a href="#admissions" onClick={(e) => handleNavItemClick(e, 'admissions')}>Admissions 2026-27 Open</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onTriggerLogin('student'); }}>Student Portal</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onTriggerLogin('parent'); }}>Parent Portal</a>
        </div>
      </div>

      {/* STICKY HEADER / NAVIGATION */}
      <header id="mainHeader" className={isScrolled ? 'scrolled' : ''}>
        <div className="navbar">
          <a 
            href="#home" 
            className="nav-brand" 
            id="navBrandLink"
            onClick={(e) => handleNavItemClick(e, 'home')}
          >
            <div className="nav-logo-container">
              {/* Custom SVG School Logo */}
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="#c9a227" stroke-width="2.5"/>
                <path d="M20 7 L20 33 M7 20 L33 20" stroke="#c9a227" stroke-width="3" stroke-linecap="round"/>
                <path d="M20 7 C20 7 13 13 13 20 C13 27 20 33 20 33" fill="none" stroke="rgba(201,162,39,.4)" stroke-width="2"/>
                <circle cx="20" cy="20" r="4.5" fill="#c9a227"/>
              </svg>
            </div>
            <div class="nav-title">
              <h1>Chinmaya Vidyalaya</h1>
              <p>BOKARO STEEL CITY · CBSE AFFILIATED</p>
            </div>
          </a>

          {/* Menu Navigation */}
          <nav className={`nav-menu ${isMobileMenuOpen ? 'show' : ''}`} id="navMenu">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'academics', label: 'Academics' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'news', label: 'News' },
              { id: 'contact', label: 'Contact' }
            ].map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => handleNavItemClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Utilities */}
          <div className="nav-utils">
            <button 
              className="theme-toggle-btn" 
              id="themeToggleBtn" 
              aria-label="Toggle Theme"
              onClick={toggleTheme}
            >
              {currentTheme === 'dark' ? <i className="ti ti-sun"></i> : <i className="ti ti-moon"></i>}
            </button>
            <div className="login-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
              <button 
                className={`btn btn-secondary nav-login-btn ${isDropdownOpen ? 'active' : ''}`} 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ gap: '4px' }}
              >
                <i className="ti ti-login"></i> Login <i className="ti ti-chevron-down" style={{ fontSize: '0.75rem', transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
              </button>
              
              {isDropdownOpen && (
                <div className="nav-login-dropdown glassmorphic-dropdown">
                  <button onClick={() => { onTriggerLogin('student'); setIsDropdownOpen(false); }}>
                    <i className="ti ti-school"></i> Student Portal
                  </button>
                  <button onClick={() => { onTriggerLogin('parent'); setIsDropdownOpen(false); }}>
                    <i className="ti ti-users-group"></i> Parent Portal
                  </button>
                  <button onClick={() => { onTriggerLogin('teacher'); setIsDropdownOpen(false); }}>
                    <i className="ti ti-teacher"></i> Teacher Portal
                  </button>
                </div>
              )}
            </div>
            <div 
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
              id="hamburgerMenu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
