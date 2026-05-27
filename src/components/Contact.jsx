import React from 'react';

export default function Contact() {
  return (
    <section id="contact">
      <div className="contact-grid">
        {/* Info Form */}
        <div className="contact-info">
          <div className="section-header">
            <span className="section-label">Get in Touch</span>
            <h2 className="section-title">Contact School Offices</h2>
            <p className="section-subtitle">
              We are here to support your questions. Reach out to school admin panels during office hours.
            </p>
          </div>

          <div className="contact-item">
            <div className="contact-icon"><i className="ti ti-map-pin"></i></div>
            <div className="contact-text">
              <h4>Campus Address</h4>
              <p>Sector 5C, Bokaro Steel City, Jharkhand - 827006</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon"><i className="ti ti-mail"></i></div>
            <div className="contact-text">
              <h4>Email Queries</h4>
              <p>
                General: info@chinmayabokaro.edu.in
                <br />
                Admissions: admissions@chinmayabokaro.edu.in
              </p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon"><i className="ti ti-phone"></i></div>
            <div className="contact-text">
              <h4>Reception Phones</h4>
              <p>+91-6542-223456, +91-6542-223457 (08:00 AM - 02:00 PM)</p>
            </div>
          </div>
        </div>

        {/* Interactive Google Map */}
        <div>
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ti ti-map" style={{ color: 'var(--secondary)' }}></i> School Location Map
          </h4>
          <div className="map-canvas-container">
            <iframe 
              src="https://maps.google.com/maps?q=Chinmaya%20Vidyalaya,%20Sector%205,%20Bokaro%20Steel%20City,%20Jharkhand&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Chinmaya Vidyalaya Map"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
