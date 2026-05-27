import React, { useState } from 'react';

const NOTICES_DATA = [
  {
    id: 1,
    category: 'academic',
    tag: 'Academic',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80',
    date: 'May 25, 2026',
    title: 'Summer Vacation Class Schedules',
    desc: 'School offices will close for student summer break from June 1st. Standard offices remain open. Academic homework is logged on dashboards.'
  },
  {
    id: 2,
    category: 'admission',
    tag: 'Admissions',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80',
    date: 'May 20, 2026',
    title: 'Admission Assessment Round 3',
    desc: 'Dates for standard Grade XI aptitude tests are announced. Eligible parents must confirm registry at the admissions desk by next Tuesday.'
  },
  {
    id: 3,
    category: 'sports',
    tag: 'Sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80',
    date: 'May 15, 2026',
    title: 'Inter-School Sports Gala Winners',
    desc: 'Chinmaya Vidyalaya Bokaro wins first place in the Inter-School Basketball Tournament. Congratulations to our senior team players!'
  }
];

export default function NoticeBoard() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredNotices = activeFilter === 'all' 
    ? NOTICES_DATA 
    : NOTICES_DATA.filter(notice => notice.category === activeFilter);

  return (
    <section id="news">
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span className="section-label">Notice Board</span>
        <h2 className="section-title">Latest News & Events</h2>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Stay updated with latest announcements, activity news and school events.
        </p>
      </div>

      {/* Filters Nav */}
      <div className="filter-nav">
        {[
          { id: 'all', label: 'All Board' },
          { id: 'academic', label: 'Academics' },
          { id: 'sports', label: 'Sports' },
          { id: 'admission', label: 'Admissions' }
        ].map(filter => (
          <button 
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="news-grid" id="newsGrid">
        {filteredNotices.map(notice => (
          <div 
            key={notice.id} 
            className="news-card" 
            data-category={notice.category}
            style={{ display: 'flex', opacity: 1, transform: 'scale(1)', transition: 'all 0.4s ease' }}
          >
            <div className="news-image" style={{ backgroundImage: `url('${notice.image}')` }}>
              <span className="news-tag">{notice.tag}</span>
            </div>
            <div className="news-body">
              <div className="news-date">
                <i className="ti ti-calendar"></i> {notice.date}
              </div>
              <h4>{notice.title}</h4>
              <p>{notice.desc}</p>
              <a href="#" className="news-link" onClick={(e) => e.preventDefault()}>
                Read Notice <i className="ti ti-arrow-right"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
