import React from 'react';

const FACILITIES_DATA = [
  {
    icon: 'ti-device-laptop',
    title: 'Smart Classrooms',
    desc: '63 digital classrooms equipped with interactive smart displays, multimedia access, and rapid web learning support.'
  },
  {
    icon: 'ti-microscope',
    title: 'Science Laboratories',
    desc: 'Highly advanced physics, chemistry, and biology labs allowing rich practical experiments and dynamic research projects.'
  },
  {
    icon: 'ti-cpu',
    title: 'Computer Science Hub',
    desc: 'Large IT labs featuring high-speed modern internet computing networks, teaching code architectures and AI designs.'
  },
  {
    icon: 'ti-book',
    title: 'Knowledge Library',
    desc: 'Housing thousands of books, journals, scientific papers, alongside digital library consoles for absolute reading enrichment.'
  },
  {
    icon: 'ti-ball-basketball',
    title: 'Modern Sports Ground',
    desc: 'Large active outdoor playgrounds for cricket, football, basketball and tracks encouraging dynamic physical coordination.'
  },
  {
    icon: 'ti-music',
    title: 'Performing Arts Studios',
    desc: 'Specially curated hubs for fine painting, instrumental music compositions, traditional dances, and drama play rehearsals.'
  },
  {
    icon: 'ti-bus',
    title: 'Fleet Transportation',
    desc: 'Highly safe school transport buses encompassing GPS, mobile tracking, and trained logistics across Bokaro Steel City.'
  },
  {
    icon: 'ti-first-aid-kit',
    title: '24/7 Campus Medical Hub',
    desc: 'On-campus clinic led by licensed health professionals, delivering urgent checkups and student wellness assistance.'
  }
];

export default function Facilities() {
  return (
    <section className="facilities-section" id="facilities">
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="section-label">Campus Infrastructure</span>
        <h2 className="section-title">World-Class Facilities</h2>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Providing students with highly modern, technologically equipped amenities supporting comprehensive growth.
        </p>
      </div>

      <div className="fac-grid">
        {FACILITIES_DATA.map((fac, idx) => (
          <div key={idx} className="fac-card">
            <div className="fac-icon-container">
              <i className={`ti ${fac.icon}`}></i>
            </div>
            <h4>{fac.title}</h4>
            <p>{fac.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
