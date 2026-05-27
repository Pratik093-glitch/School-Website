import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import HeroSlider from './components/HeroSlider.jsx';
import QuickBar from './components/QuickBar.jsx';
import AboutSection from './components/AboutSection.jsx';
import Facilities from './components/Facilities.jsx';
import Academics from './components/Academics.jsx';
import Admissions from './components/Admissions.jsx';
import NoticeBoard from './components/NoticeBoard.jsx';
import Portals from './components/Portals.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import LoginModal from './components/LoginModal.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  // --- TOAST NOTIFICATIONS STATE ---
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type, isFading: false }]);
    
    // Trigger fade-out animation before removal
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, isFading: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 400); // Wait for transition duration (~400ms)
    }, 4000);
  };

  // --- THEME MANAGEMENT STATE ---
  const [theme, setTheme] = useState(() => localStorage.getItem('chinmaya-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('chinmaya-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(
      `${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} Mode Enabled`,
      `The website layout has adapted to ${nextTheme} rendering.`,
      'info'
    );
  };

  // --- AUTH PORTALS STATE ---
  const [activeUser, setActiveUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState(null); // student, parent, teacher

  // Restore active user window scroll behavior on portal logout
  useEffect(() => {
    if (activeUser) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeUser]);

  const handleTriggerLogin = (type) => {
    setLoginType(type);
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    setLoginType(null);
  };

  const handleLoginSuccess = (profile) => {
    setActiveUser(profile);
  };

  const handleLogout = () => {
    setActiveUser(null);
    showToast('Logged Out', 'Your session has ended successfully.', 'info');
  };

  // --- SCROLL SPY STATE FOR NAVIGATION ---
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['home', 'about', 'academics', 'facilities', 'admissions', 'news', 'contact'];
      let current = 'home';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          if (window.scrollY >= (top - 150)) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <>
      {/* TOAST NOTIFICATIONS CONTAINER */}
      <div className="toast-container" id="toastContainer">
        {toasts.map(toast => {
          let iconClass = 'ti-info-circle';
          if (toast.type === 'success') iconClass = 'ti-circle-check';
          if (toast.type === 'warning') iconClass = 'ti-alert-circle';
          if (toast.type === 'danger') iconClass = 'ti-alert-triangle';
          
          return (
            <div 
              key={toast.id} 
              className={`toast ${toast.type}`}
              style={{
                transform: toast.isFading ? 'translateX(120%)' : 'translateX(0)',
                opacity: toast.isFading ? 0 : 1,
                transition: 'all 0.4s ease'
              }}
            >
              <i className={`ti ${iconClass} toast-icon`}></i>
              <div className="toast-content">
                <h4>{toast.title}</h4>
                <p>{toast.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* HEADER / NAVIGATION */}
      <Header 
        currentTheme={theme} 
        toggleTheme={toggleTheme} 
        onTriggerLogin={handleTriggerLogin} 
        activeSection={activeSection}
      />

      {/* HOME HERO BANNER SLIDER */}
      <HeroSlider />

      {/* QUICK ACTIONS OVERLAY BAR */}
      <QuickBar onTriggerLogin={handleTriggerLogin} />

      {/* ABOUT LEGACY SECTION */}
      <AboutSection />

      {/* WORLD CLASS FACILITIES SHOWCASE */}
      <Facilities />

      {/* ACADEMICS STREAM TABS */}
      <Academics />

      {/* ADMISSIONS WIZARD & FEE ESTIMATOR */}
      <Admissions showToast={showToast} />

      {/* NOTICE BOARD BOARD */}
      <NoticeBoard />

      {/* DIGITAL PORTALS DECK */}
      <Portals onTriggerLogin={handleTriggerLogin} />

      {/* CONTACT & MAP SECTION */}
      <Contact />

      {/* PREMIUM DESCRIPTIVE FOOTER */}
      <Footer onTriggerLogin={handleTriggerLogin} />

      {/* LOGIN MODAL */}
      <LoginModal 
        isOpen={isLoginOpen} 
        loginType={loginType} 
        onClose={handleCloseLogin} 
        onLoginSuccess={handleLoginSuccess}
        showToast={showToast}
      />

      {/* IMMERSIVE FULL SCREEN DASHBOARD PORTAL */}
      {activeUser && (
        <Dashboard 
          userProfile={activeUser} 
          onLogout={handleLogout} 
          showToast={showToast}
        />
      )}
    </>
  );
}
