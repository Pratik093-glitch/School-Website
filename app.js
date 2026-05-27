/**
 * CHINMAYA VIDYALAYA BOKARO - INTERACTION SYSTEM
 * Robust Vanilla JavaScript modules delivering dynamic portals, Wizards,
 * dynamic calculators, notification toast managers, and high-end animations.
 */

/* ==========================================
   MOCK BACKEND API INTERCEPTOR FOR STATIC SURGE DEPLOYMENT
   This handles API requests client-side when deployed on static environments
   ========================================== */
(function() {
  const isStaticHost = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isStaticHost) {
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
          }, 400); // 400ms delay to mimic server response latency beautifully!
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
})();

document.addEventListener('DOMContentLoaded', () => {
  // Init core UI systems
  initThemeManager();
  initHeaderScrollSpy();
  initMobileMenu();
  initHeroSlider();
  initFeeEstimator();
  initAdmissionWizard();
  initNoticeFilter();
  initCustomMapPulse();
});

/* ==========================================
   1. TOAST NOTIFICATION SYSTEM
   ========================================== */
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconClass = 'ti-info-circle';
  if (type === 'success') iconClass = 'ti-circle-check';
  if (type === 'warning') iconClass = 'ti-alert-circle';
  if (type === 'danger') iconClass = 'ti-alert-triangle';

  toast.innerHTML = `
    <i class="ti ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;

  container.appendChild(toast);

  // Auto slide-in and removal
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 50);

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

/* ==========================================
   2. THEME MANAGER (DARK/LIGHT MODE)
   ========================================== */
function initThemeManager() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  // Read cache
  const savedTheme = localStorage.getItem('chinmaya-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('chinmaya-theme', newTheme);
    
    showToast(
      `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode Enabled`,
      `The website layout has adapted to ${newTheme} rendering.`,
      'info'
    );
  });
}

/* ==========================================
   3. STICKY HEADER & SCROLL SPY
   ========================================== */
function initHeaderScrollSpy() {
  const header = document.getElementById('mainHeader');
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  // Sticky navbar logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active item highlight spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').slice(1) === current) {
        item.classList.add('active');
      }
    });
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const offset = 90; // Adjust for sticky header
  const elementPosition = section.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/* ==========================================
   4. MOBILE NAV MENU CONTROL
   ========================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerMenu');
  const navMenu = document.getElementById('navMenu');
  const navItems = document.querySelectorAll('.nav-item');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('show');
  });

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = item.getAttribute('href').slice(1);
      scrollToSection(targetSection);
      
      // Close mobile menu
      hamburger.classList.remove('active');
      navMenu.classList.remove('show');
    });
  });
}

/* ==========================================
   5. HERO BANNER SLIDER MODULE
   ========================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length === 0) return;

  // Build dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.className = `dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateSlides() {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      dots[idx].classList.remove('active');
      if (idx === currentSlide) {
        slide.classList.add('active');
        dots[idx].classList.add('active');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  }

  function goToSlide(idx) {
    currentSlide = idx;
    updateSlides();
    resetInterval();
  }

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5500);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  // Start automation
  slideInterval = setInterval(nextSlide, 5500);
}

/* ==========================================
   6. ACADEMICS NAV TABS
   ========================================== */
function switchAcademicTab(event, tabId) {
  const tabButtons = document.querySelectorAll('.ac-tab-btn');
  const tabContents = document.querySelectorAll('.ac-tab-content');

  tabButtons.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));

  event.currentTarget.classList.add('active');
  const targetContent = document.getElementById(tabId);
  if (targetContent) {
    targetContent.classList.add('active');
  }
}

/* ==========================================
   7. INTERACTIVE SCHOOL FEE ESTIMATOR
   ========================================== */
const FEE_STRUCTURE = {
  'Pre-Primary': { admission: 12000, tuition: 2200, annual: 5000 },
  'Primary': { admission: 15000, tuition: 2800, annual: 8000 },
  'Middle': { admission: 18000, tuition: 3200, annual: 10000 },
  'Secondary': { admission: 20000, tuition: 3800, annual: 12000 },
  'Senior Science': { admission: 25000, tuition: 4500, annual: 15000 },
  'Senior Commerce': { admission: 22000, tuition: 4200, annual: 12000 }
};

const TRANSPORT_STRUCTURE = {
  'none': 0,
  'zoneA': 1200,
  'zoneB': 1500,
  'zoneC': 2000
};

function calculateSchoolFees() {
  const targetClass = document.getElementById('calcClass').value;
  const transportZone = document.getElementById('calcTransport').value;

  const schoolFee = FEE_STRUCTURE[targetClass];
  const transportFee = TRANSPORT_STRUCTURE[transportZone];

  if (!schoolFee) return;

  const totalOutlay = schoolFee.admission + schoolFee.tuition + schoolFee.annual + transportFee;

  // Animate/Render values in DOM
  document.getElementById('feeAdmission').innerText = `₹${schoolFee.admission.toLocaleString('en-IN')}`;
  document.getElementById('feeTuition').innerText = `₹${schoolFee.tuition.toLocaleString('en-IN')}/mo`;
  document.getElementById('feeAnnual').innerText = `₹${schoolFee.annual.toLocaleString('en-IN')}`;
  document.getElementById('feeTransport').innerText = `₹${transportFee.toLocaleString('en-IN')}/mo`;
  document.getElementById('feeTotal').innerText = `₹${totalOutlay.toLocaleString('en-IN')}`;
}

function initFeeEstimator() {
  const calcClass = document.getElementById('calcClass');
  if (calcClass) calculateSchoolFees();
}

/* ==========================================
   8. STEP-BY-STEP ADMISSIONS ENQUIRY WIZARD
   ========================================== */
let wizardStep = 1;

function updateWizardProgress() {
  const progressLine = document.getElementById('wizardProgressBar');
  const indicator2 = document.getElementById('wizardStepIndicator2');
  const indicator3 = document.getElementById('wizardStepIndicator3');

  if (wizardStep === 1) {
    progressLine.style.width = '0%';
    indicator2.className = 'step-indicator';
    indicator3.className = 'step-indicator';
  } else if (wizardStep === 2) {
    progressLine.style.width = '50%';
    indicator2.className = 'step-indicator active';
    indicator3.className = 'step-indicator';
  } else if (wizardStep === 3) {
    progressLine.style.width = '100%';
    indicator2.className = 'step-indicator completed';
    indicator3.className = 'step-indicator active';
  }
}

function validateWizardStepFields(step) {
  if (step === 1) {
    const sName = document.getElementById('studentName').value.trim();
    const sClass = document.getElementById('studentClass').value;
    const sDob = document.getElementById('studentDOB').value;

    if (!sName || !sClass || !sDob) {
      showToast('Validation Error', 'Please complete all required student fields before continuing.', 'warning');
      return false;
    }
  } else if (step === 2) {
    const pName = document.getElementById('parentName').value.trim();
    const pPhone = document.getElementById('parentPhone').value.trim();
    const pEmail = document.getElementById('parentEmail').value.trim();

    if (!pName || !pPhone || !pEmail) {
      showToast('Validation Error', 'Please enter parent name and complete contact details.', 'warning');
      return false;
    }
    
    // Simple 10 digit check
    if (!/^\d{10}$/.test(pPhone)) {
      showToast('Validation Error', 'Please enter a valid 10-digit mobile number.', 'warning');
      return false;
    }

    // Email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pEmail)) {
      showToast('Validation Error', 'Please specify a correct email structure.', 'warning');
      return false;
    }
  }
  return true;
}

function nextWizardStep(currentStep) {
  if (!validateWizardStepFields(currentStep)) return;

  const currentStepEl = document.getElementById(`wizardStep${currentStep}`);
  const nextStepEl = document.getElementById(`wizardStep${currentStep + 1}`);

  if (currentStepEl && nextStepEl) {
    currentStepEl.classList.remove('active');
    nextStepEl.classList.add('active');
    wizardStep = currentStep + 1;
    updateWizardProgress();
  }
}

function prevWizardStep(currentStep) {
  const currentStepEl = document.getElementById(`wizardStep${currentStep}`);
  const prevStepEl = document.getElementById(`wizardStep${currentStep - 1}`);

  if (currentStepEl && prevStepEl) {
    currentStepEl.classList.remove('active');
    prevStepEl.classList.add('active');
    wizardStep = currentStep - 1;
    updateWizardProgress();
  }
}

function handleEnquiryFormSubmit(event) {
  event.preventDefault();

  const isDecl = document.getElementById('declarationCheck').checked;
  const resAddr = document.getElementById('resAddress').value.trim();

  if (!resAddr || !isDecl) {
    showToast('Declaration Required', 'Please enter your address and check the declaration statement.', 'warning');
    return;
  }

  // Gather form values
  const payload = {
    studentName: document.getElementById('studentName').value.trim(),
    studentClass: document.getElementById('studentClass').value,
    studentDOB: document.getElementById('studentDOB').value,
    parentName: document.getElementById('parentName').value.trim(),
    parentPhone: document.getElementById('parentPhone').value.trim(),
    parentEmail: document.getElementById('parentEmail').value.trim(),
    resAddress: resAddr
  };

  // Submit to Express backend API
  fetch('/api/admissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(
        'Enquiry Submitted Successfully!',
        'Our admission database has logged your data. Administration will review it.',
        'success'
      );
      
      // Reset Form
      document.getElementById('enquiryForm').reset();
      
      // Return to step 1
      document.getElementById('wizardStep3').classList.remove('active');
      document.getElementById('wizardStep1').classList.add('active');
      wizardStep = 1;
      updateWizardProgress();
    } else {
      showToast('Submission Failed', data.message || 'Error occurred during database submission.', 'danger');
    }
  })
  .catch(error => {
    console.error('Error submitting enquiry:', error);
    showToast('Network Error', 'Cannot reach backend server. Please ensure express is running.', 'danger');
  });
}

function initAdmissionWizard() {
  updateWizardProgress();
}

/* ==========================================
   9. NOTICE BOARD FILTER CATEGORIES
   ========================================== */
function filterNews(event, category) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  filterBtns.forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  newsCards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    
    // Reset standard state
    card.style.display = 'none';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';

    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 50);
    }
  });
}

function initNoticeFilter() {
  const defaultFilter = document.querySelector('.filter-btn.active');
  if (defaultFilter) {
    // Refresh visible grids
  }
}

/* ==========================================
   10. INTERACTIVE MOCK CAMPUS MAP PULSE
   ========================================== */
function initCustomMapPulse() {
  // Dynamic map canvas is stylized via CSS grid
  // No complex canvas scripting needed for smooth visuals
}

/* ==========================================
   11. PORTALS LOGIN MODAL AND AUTH ENTRIES
   ========================================== */
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

function triggerPortalLogin(type) {
  const modal = document.getElementById('loginModal');
  const title = document.getElementById('loginModalTitle');
  const desc = document.getElementById('loginModalDesc');
  const hint = document.getElementById('loginHintText');
  const typeField = document.getElementById('loginTypeField');
  const idInput = document.getElementById('loginUserId');
  const passInput = document.getElementById('loginUserPass');

  if (!modal) return;

  const data = PORTAL_METADATA[type];
  if (data) {
    title.innerText = data.title;
    desc.innerText = data.desc;
    hint.innerText = data.hint;
    typeField.value = type;
    
    // Auto-prefill dynamic credentials for frictionless testing
    if (type === 'student') {
      idInput.value = 'student123';
      if (passInput) passInput.value = 'password123';
    } else {
      idInput.value = `${type}123`;
      if (passInput) passInput.value = 'password123';
    }
  }

  modal.classList.add('show');
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.remove('show');
}

/* ==========================================
   12. DASHBOARD SIMULATOR LOGIC
   ========================================== */
let activeDashboardRole = 'student';

// Mock credentials profiles database
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

function handlePortalLogin(event) {
  event.preventDefault();

  const userId = document.getElementById('loginUserId').value.trim();
  const passwordField = document.getElementById('loginUserPass').value;
  const typeField = document.getElementById('loginTypeField').value;

  const payload = {
    userId: userId,
    password: passwordField,
    role: typeField
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

      // Close Login popup
      closeLoginModal();

      // Populate Dashboard details
      activeDashboardRole = data.profile.role;
      populateDashboardView(data.profile);

      // Show Dashboard Overlay
      const dashboard = document.getElementById('portalDashboard');
      if (dashboard) {
        dashboard.classList.add('show');
        document.body.style.overflow = 'hidden';
      }

      // Trigger radial chart animation
      setTimeout(() => {
        animateRadialAttendance(data.profile.stats.percent);
      }, 400);

      // If teacher role, configure the Admin admissions panel and email whitelist tools!
      if (data.profile.role === 'teacher') {
        const sidebarAdminBtn = document.getElementById('sidebarItemAdmin');
        if (sidebarAdminBtn) sidebarAdminBtn.style.display = 'flex';
        refreshAdmissionsLog();
        refreshWhitelistEmails();
      } else {
        const sidebarAdminBtn = document.getElementById('sidebarItemAdmin');
        if (sidebarAdminBtn) sidebarAdminBtn.style.display = 'none';
      }
    }
  })
  .catch(error => {
    console.error('Portal Login error:', error);
    showToast('Authentication Failed', error.message, 'danger');
  });
}

function animateRadialAttendance(percent) {
  const circle = document.getElementById('dbRadialProgress');
  const percentText = document.getElementById('dbRadialPercentText');
  if (!circle || !percentText) return;

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  
  // Math mapping percent to stroke-dashoffset
  const offset = circumference - (percent / 100) * circumference;
  
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${offset}`;
  percentText.innerText = `${percent}%`;
}

function populateDashboardView(profile) {
  // Header profile information
  document.getElementById('sidebarPortalType').innerText = `${profile.role.toUpperCase()} PORTAL`;
  document.getElementById('dbWelcomeMsg').innerText = `Welcome Back, ${profile.name}!`;
  document.getElementById('dbSessionMsg').innerText = profile.session;
  document.getElementById('dbUserName').innerText = profile.name;
  document.getElementById('dbUserRole').innerText = profile.meta;
  document.getElementById('dbUserAvatar').innerText = profile.avatar;

  // Overview metrics stats
  document.getElementById('dbTotalClasses').innerText = profile.stats.total;
  document.getElementById('dbAttendedClasses').innerText = profile.stats.attended;
  document.getElementById('dbAbsentClasses').innerText = profile.stats.absent;

  // Grade Chart labels & values
  document.getElementById('sidebarAcademicsLabel').innerText = profile.chartLabel;
  const gradeChartContainer = document.getElementById('gradeChartContainer');
  if (gradeChartContainer) {
    gradeChartContainer.innerHTML = ''; // Clear prior grades
    profile.chartGrades.forEach(grade => {
      const wrapper = document.createElement('div');
      wrapper.className = 'chart-bar-wrapper';
      wrapper.innerHTML = `
        <div class="chart-bar" style="height: ${grade.score}%;">
          <span class="chart-bar-val">${grade.score}%</span>
        </div>
        <span class="chart-bar-label">${grade.name}</span>
      `;
      gradeChartContainer.appendChild(wrapper);
    });
  }

  // Build widgets (Task list / Fee alerts)
  document.getElementById('dbWidgetTitle').innerText = profile.widgetTitle;
  const widgetList = document.getElementById('dbWidgetList');
  if (widgetList) {
    widgetList.innerHTML = '';
    
    // Add specific items
    profile.widgetItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'schedule-card';
      card.style.borderLeftColor = item.color;
      card.innerHTML = `
        <div class="schedule-details">
          <h4>${item.label}</h4>
          <p>${item.detail}</p>
        </div>
        <span class="schedule-time" style="color: ${item.color};">${item.time}</span>
      `;
      widgetList.appendChild(card);
    });

    // Special Add Upload Assignment Form for Teacher role!
    if (profile.role === 'teacher') {
      const uploadContainer = document.createElement('div');
      uploadContainer.style.marginTop = '20px';
      uploadContainer.style.paddingTop = '20px';
      uploadContainer.style.borderTop = '2px dashed var(--border-color)';
      uploadContainer.innerHTML = `
        <h4 style="font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: var(--primary); margin-bottom: 12px;">
          <i class="ti ti-upload" style="color: var(--secondary);"></i> Dispatch E-Assignment
        </h4>
        <form onsubmit="handleTeacherAssignmentUpload(event)">
          <div class="form-group" style="margin-bottom: 10px;">
            <input type="text" id="teacherAssignmentTitle" placeholder="Assignment Title (e.g. Code arrays)" required style="padding: 8px 12px; font-size: 0.8rem;">
          </div>
          <button type="submit" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.75rem; width: 100%;">
            Upload & Notify Class
          </button>
        </form>
      `;
      widgetList.appendChild(uploadContainer);
    }
  }
}

// Special assignment logs handler
window.handleTeacherAssignmentUpload = function(event) {
  event.preventDefault();
  const input = document.getElementById('teacherAssignmentTitle');
  const title = input.value.trim();

  if (!title) return;

  showToast(
    'Assignment Dispatched!',
    `Topic '${title}' has been logged and classroom dashboards updated.`,
    'success'
  );

  input.value = ''; // Reset input
};

function switchDashboardView(viewName) {
  const viewOverview = document.getElementById('dbViewOverview');
  const viewAcademics = document.getElementById('dbViewAcademics');
  const viewSchedule = document.getElementById('dbViewSchedule');
  const viewAdmin = document.getElementById('dbViewAdmin');
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  // Remove active sidebar highlight
  sidebarItems.forEach(item => item.classList.remove('active'));

  // Toggle DOM views
  viewOverview.style.display = 'none';
  viewAcademics.style.display = 'none';
  viewSchedule.style.display = 'none';
  if (viewAdmin) viewAdmin.style.display = 'none';

  if (viewName === 'overview') {
    viewOverview.style.display = 'block';
    sidebarItems[0].classList.add('active');
    
    // Rerun circle animation based on active DOM percentage
    const attElement = document.getElementById('dbRadialPercentText');
    if (attElement) {
      const attVal = parseInt(attElement.innerText) || 90;
      setTimeout(() => {
        animateRadialAttendance(attVal);
      }, 50);
    }
  } else if (viewName === 'academics') {
    viewAcademics.style.display = 'block';
    sidebarItems[1].classList.add('active');
  } else if (viewName === 'schedule') {
    viewSchedule.style.display = 'block';
    sidebarItems[2].classList.add('active');
  } else if (viewName === 'admin') {
    if (viewAdmin) viewAdmin.style.display = 'block';
    const sidebarAdminBtn = document.getElementById('sidebarItemAdmin');
    if (sidebarAdminBtn) sidebarAdminBtn.classList.add('active');
  }
}

function logoutPortal() {
  const dashboard = document.getElementById('portalDashboard');
  if (dashboard) {
    dashboard.classList.remove('show');
    // Restore window scroll
    document.body.style.overflow = '';
  }

  showToast('Logged Out', 'Your session has ended successfully.', 'info');
}

/* ==========================================
   13. TEACHER ADMIN CONTROL APIs (FULL-STACK)
   ========================================== */

// 1. Fetch admissions enquiries from JSON database
window.refreshAdmissionsLog = function() {
  const tbody = document.getElementById('adminAdmissionsTableBody');
  if (!tbody) return;

  fetch('/api/admissions')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.admissions) {
        tbody.innerHTML = ''; // Clear older logs

        if (data.admissions.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No enquiries submitted yet.</td></tr>`;
          return;
        }

        // Render each enquiry in descending order (newest first)
        data.admissions.reverse().forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${row.studentName}</strong></td>
            <td><span class="news-tag" style="position: static; font-size: 0.62rem; padding: 2px 6px;">${row.studentClass}</span></td>
            <td>${row.parentName}</td>
            <td><a href="tel:${row.parentPhone}" style="color: var(--primary); font-weight:600;"><i class="ti ti-phone" style="font-size:0.75rem;"></i> ${row.parentPhone}</a></td>
            <td><a href="mailto:${row.parentEmail}" style="color: var(--secondary-dark); font-weight:600;"><i class="ti ti-mail" style="font-size:0.75rem;"></i> ${row.parentEmail}</a></td>
          `;
          tbody.appendChild(tr);
        });
      }
    })
    .catch(err => {
      console.error('Error loading enquiries:', err);
      showToast('Error', 'Failed to retrieve admissions database log.', 'danger');
    });
};

// 2. Fetch whitelisted emails from database
window.refreshWhitelistEmails = function() {
  const container = document.getElementById('adminWhitelistContainer');
  if (!container) return;

  fetch('/api/allowed-emails')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.emails) {
        container.innerHTML = ''; // Clear older tags
        
        if (data.emails.length === 0) {
          container.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-muted); padding: 8px;">No whitelisted student emails.</span>`;
          return;
        }

        data.emails.forEach(email => {
          const tag = document.createElement('span');
          tag.className = 'whitelist-tag';
          tag.innerText = email;
          container.appendChild(tag);
        });
      }
    })
    .catch(err => {
      console.error('Error fetching whitelist:', err);
    });
};

// 3. Add email to Student Whitelist
window.handleWhitelistAdd = function(event) {
  event.preventDefault();
  const input = document.getElementById('whitelistNewEmail');
  if (!input) return;

  const email = input.value.trim();
  if (!email) return;

  fetch('/api/allowed-emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast('Whitelist Updated', `'${data.email}' is now authorized to sign in.`, 'success');
        input.value = ''; // Reset input
        refreshWhitelistEmails(); // Refresh visible whitelist tags
      } else {
        showToast('Whitelist Failed', data.message || 'Error occurred while whitelisting.', 'warning');
      }
    })
    .catch(err => {
      console.error('Whitelist error:', err);
      showToast('Network Error', 'Cannot reach backend server. Please verify express status.', 'danger');
    });
};

