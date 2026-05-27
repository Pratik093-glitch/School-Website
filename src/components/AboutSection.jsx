import React from 'react';

export default function AboutSection() {
  return (
    <section id="about">
      <div className="about-grid">
        <div className="about-visual">
          <h3>🏫 Empowering Generations Since 1977</h3>
          <p>Chinmaya Vidyalaya, Bokaro Steel City is a premier co-educational English-medium Senior Secondary School affiliated with CBSE (Affiliation No. 3430013). For over four decades, we have remained committed to academic excellence, value guidance, and personal integration.</p>
          <p>Managed under the spiritual principles of the Chinmaya Mission, we aim to deliver holistic school education that empowers the head, the heart, and the hands.</p>
          <div className="about-highlights">
            <div className="highlight-badge">
              <i className="ti ti-award"></i>
              <span>CBSE Affiliated</span>
            </div>
            <div className="highlight-badge">
              <i className="ti ti-school"></i>
              <span>Grade Pre-K to XII</span>
            </div>
            <div className="highlight-badge">
              <i className="ti ti-users"></i>
              <span>Co-Educational</span>
            </div>
            <div className="highlight-badge">
              <i className="ti ti-building-community"></i>
              <span>Active alumni</span>
            </div>
          </div>
        </div>

        <div className="about-point-list">
          <div className="section-header">
            <span className="section-label">Our Legacy</span>
            <h2 className="section-title">Why Choose Chinmaya?</h2>
            <p className="section-subtitle">A sanctuary of comprehensive development providing deep intellectual values and active physical learning.</p>
          </div>

          <div className="about-point">
            <div className="about-point-icon">
              <i className="ti ti-brain"></i>
            </div>
            <div className="about-point-text">
              <h4>Academic Innovation</h4>
              <p>Our activity-based academic learning structure delivers conceptual knowledge and promotes logic reasoning across grade curriculums.</p>
            </div>
          </div>

          <div className="about-point">
            <div className="about-point-icon">
              <i className="ti ti-heart-handshake"></i>
            </div>
            <div className="about-point-text">
              <h4>Spiritual Values Integration</h4>
              <p>Rooted in values of community, integrity, respect, and responsibility, helping students thrive as active, conscious global citizens.</p>
            </div>
          </div>

          <div className="about-point">
            <div className="about-point-icon">
              <i className="ti ti-trophy"></i>
            </div>
            <div className="about-point-text">
              <h4>All-Round Development</h4>
              <p>Providing dynamic avenues in performing arts, sciences exhibitions, sports matches, and multi-school championships.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
