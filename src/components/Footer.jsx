import React from 'react';

export default function Footer({ onTriggerLogin }) {
  const scrollToSection = (e, id) => {
    e.preventDefault();
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
    <footer>
      <div className="footer-grid">
        {/* Col 1 */}
        <div className="footer-col">
          <h3>Chinmaya Vidyalaya</h3>
          <p>
            A premiere educational beacon managed by Chinmaya Mission, fostering academic brilliance and values integration across Bokaro Steel City since 1977.
          </p>
          <div className="social-links">
            <a href="#" className="social-btn" aria-label="Facebook" onClick={(e) => e.preventDefault()}><i className="ti ti-brand-facebook"></i></a>
            <a href="#" className="social-btn" aria-label="Twitter" onClick={(e) => e.preventDefault()}><i className="ti ti-brand-twitter"></i></a>
            <a href="#" className="social-btn" aria-label="YouTube" onClick={(e) => e.preventDefault()}><i className="ti ti-brand-youtube"></i></a>
            <a href="#" className="social-btn" aria-label="Linkedin" onClick={(e) => e.preventDefault()}><i className="ti ti-brand-linkedin"></i></a>
          </div>
        </div>

        {/* Col 2 */}
        <div className="footer-col">
          <h4>Portals Link</h4>
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onTriggerLogin('student'); }}>Student Portal Log</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onTriggerLogin('parent'); }}>Parent Portal Log</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onTriggerLogin('teacher'); }}>Faculty Database</a>
            <a href="#admissions" onClick={(e) => scrollToSection(e, 'admissions')}>Online Fee Estimator</a>
          </div>
        </div>

        {/* Col 3 */}
        <div className="footer-col">
          <h4>Our School</h4>
          <div className="footer-links">
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>Legacy and Mission</a>
            <a href="#facilities" onClick={(e) => scrollToSection(e, 'facilities')}>Campus Infrastructure</a>
            <a href="#academics" onClick={(e) => scrollToSection(e, 'academics')}>Academic Syllabus</a>
            <a href="#news" onClick={(e) => scrollToSection(e, 'news')}>Notices & News</a>
          </div>
        </div>

        {/* Col 4 */}
        <div className="footer-col">
          <h4>Affiliations</h4>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
            CBSE School Affiliation Code: 3430013
            <br />
            School School Code: 66203
            <br />
            School Board: Central Board of Secondary Education, New Delhi
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Chinmaya Vidyalaya Bokaro. All rights reserved.</p>
        <p>Affiliated with CBSE, New Delhi</p>
      </div>
    </footer>
  );
}
