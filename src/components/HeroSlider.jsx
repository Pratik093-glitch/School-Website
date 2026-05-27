import React, { useState, useEffect, useRef } from 'react';

const SLIDES_DATA = [
  {
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
    badge: 'Est. 1977 · Legacy of Learning',
    title: 'Shaping Minds,',
    titleSpan: 'Building Character',
    desc: 'Nurturing young minds with a perfect blend of high-end academic excellence, holistic personal growth, and timeless values from Pre-Kindergarten to Grade XII.',
    actionPrimary: { label: 'Apply Online', icon: 'ti-pencil-plus', target: 'admissions' },
    actionSecondary: { label: 'Discover Legacy', target: 'about' }
  },
  {
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
    badge: 'World-Class infrastructure',
    title: 'Empowering through',
    titleSpan: 'Modern Innovation',
    desc: '63 digital smart classrooms, modern physics, chemistry, biology and computer sciences laboratories, supporting children to explore, innovate, and create.',
    actionPrimary: { label: 'Explore Facilities', icon: 'ti-building', target: 'facilities' },
    actionSecondary: { label: 'Our Curriculums', target: 'academics' }
  },
  {
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80',
    badge: 'Sports & Co-Curriculars',
    title: 'Nurturing Talents',
    titleSpan: 'Beyond Classrooms',
    desc: 'Promoting sportsmanship, artistic creativity, leadership development and dynamic community service through robust co-curricular portfolios.',
    actionPrimary: { label: 'Contact School', icon: 'ti-mail', target: 'contact' },
    actionSecondary: { label: 'Latest Highlights', target: 'news' }
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);

  const startSlider = () => {
    stopSlider();
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES_DATA.length);
    }, 5500);
  };

  const stopSlider = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  useEffect(() => {
    startSlider();
    return () => stopSlider();
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES_DATA.length);
    startSlider();
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
    startSlider();
  };

  const handleDotClick = (idx) => {
    setCurrentSlide(idx);
    startSlider();
  };

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
    <section className="hero-slider-section" id="home">
      <div className="hero-slider">
        {SLIDES_DATA.map((slide, idx) => (
          <div key={idx} className={`slide ${idx === currentSlide ? 'active' : ''}`}>
            <div className="slide-overlay"></div>
            <div 
              className="slide-bg" 
              style={{ backgroundImage: `url('${slide.image}')` }}
            ></div>
            <div className="slide-content">
              <div className="slide-badge">{slide.badge}</div>
              <h2>
                {slide.title}
                <br />
                <span>{slide.titleSpan}</span>
              </h2>
              <p>{slide.desc}</p>
              <div className="slide-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => scrollToSection(slide.actionPrimary.target)}
                >
                  {slide.actionPrimary.icon && <i className={`ti ${slide.actionPrimary.icon}`}></i>}{' '}
                  {slide.actionPrimary.label}
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => scrollToSection(slide.actionSecondary.target)}
                >
                  {slide.actionSecondary.label}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow Controls */}
      <button 
        className="slider-arrow prev" 
        id="sliderPrevBtn" 
        aria-label="Previous Slide"
        onClick={handlePrev}
      >
        <i className="ti ti-chevron-left"></i>
      </button>
      <button 
        className="slider-arrow next" 
        id="sliderNextBtn" 
        aria-label="Next Slide"
        onClick={handleNext}
      >
        <i className="ti ti-chevron-right"></i>
      </button>

      {/* Navigation dots */}
      <div className="slider-dots" id="sliderDots">
        {SLIDES_DATA.map((_, idx) => (
          <span 
            key={idx}
            className={`dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(idx)}
          ></span>
        ))}
      </div>

      {/* Floating Statistics Box */}
      <div className="hero-stats">
        <div className="stat-box">
          <div className="stat-num" id="statYears">45+</div>
          <div className="stat-label">Years Legacy</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" id="statStudents">2000+</div>
          <div className="stat-label">Enrolled</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" id="statFaculty">120+</div>
          <div className="stat-label">Faculty</div>
        </div>
      </div>
    </section>
  );
}
