import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';


const Hero = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const countersRef = useRef({});

  const heroSlides = [
    {
      title: 'Tingkatkan Kompetensi',
      titleSpan: 'Perluas Koneksi.',
      sub: 'Platform manajemen terpadu untuk registrasi event resmi INKINDO Jawa Timur.'
    },
    {
      title: 'Daftar Event Resmi',
      titleSpan: 'Mudah & Cepat.',
      sub: 'Seminar, workshop, dan musyawarah INKINDO Jawa Timur tersedia dalam satu platform.'
    },
    {
      title: 'Ikuti Agenda Strategis',
      titleSpan: 'INKINDO Jatim.',
      sub: 'Pantau kegiatan organisasi, forum anggota, dan pengembangan kompetensi konsultan.'
    },
    {
      title: 'Satu Akses Untuk',
      titleSpan: 'Semua Kegiatan.',
      sub: 'Kelola pendaftaran, tiket, dan informasi acara melalui dashboard anggota.'
    }
  ];

  // Animasi counter untuk angka
  const animateCounter = (element, target) => {
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      element.textContent = Math.floor(current).toLocaleString('id-ID');

      if (current >= target) clearInterval(timer);
    }, step);
  };

  // Initialize counter animation on mount
  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach((el) => {
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
    });
  }, []);

  // Handle slide change
  const changeSlide = (direction) => {
    const title = titleRef.current;
    const sub = subRef.current;

    title.classList.remove('slide-in', 'slide-out');
    sub.classList.remove('slide-in', 'slide-out');

    void title.offsetWidth; // Force reflow

    title.classList.add('slide-out');
    sub.classList.add('slide-out');

    setTimeout(() => {
      setSlideIndex((prev) => (prev + direction + heroSlides.length) % heroSlides.length);

      title.classList.remove('slide-out');
      sub.classList.remove('slide-out');
      void title.offsetWidth;
      title.classList.add('slide-in');
      sub.classList.add('slide-in');
    }, 260);
  };

  const nextSlide = () => changeSlide(1);
  const prevSlide = () => changeSlide(-1);

  const currentSlide = heroSlides[slideIndex];

  const statCards = [
    { icon: 'members', number: 5, label: 'Anggota Aktif', suffix: '+' },
    { icon: 'calendar', number: 20, label: 'Event Tahunan', suffix: '+' },
    { icon: 'globe', number: 34, label: 'Provinsi', suffix: '' },
    { icon: 'team', number: 100, label: 'Mitra Afiliasi', suffix: '+' }
  ];

  const renderStatIcon = (type) => {
    const svgProps = { viewBox: '0 0 52 52', fill: 'none' };

    switch (type) {
      case 'members':
        return (
          <svg {...svgProps}>
            <circle cx="18" cy="19" r="7.5" stroke="#94a3b8" strokeWidth="2.2" fill="none" />
            <circle cx="34" cy="19" r="7.5" stroke="#94a3b8" strokeWidth="2.2" fill="none" />
            <path
              d="M4 44c0-9 6.3-15.5 14-15.5h16c7.7 0 14 6.5 14 15.5"
              stroke="#94a3b8"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );
      case 'calendar':
        return (
          <svg {...svgProps}>
            <rect x="6" y="10" width="40" height="34" rx="5" stroke="#94a3b8" strokeWidth="2.2" fill="none" />
            <path d="M6 22h40" stroke="#94a3b8" strokeWidth="2.2" />
            <path d="M17 6v8M35 6v8" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" />
            <path
              d="M17 32l6 6L35 26"
              stroke="#94a3b8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'globe':
        return (
          <svg {...svgProps}>
            <circle cx="26" cy="23" r="16" stroke="#94a3b8" strokeWidth="2.2" fill="none" />
            <circle cx="26" cy="23" r="6" stroke="#94a3b8" strokeWidth="2" fill="none" />
            <path
              d="M26 7v4M26 35v4M10 23H6M46 23h-4"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'team':
        return (
          <svg {...svgProps}>
            <circle cx="22" cy="17" r="8" stroke="#94a3b8" strokeWidth="2.2" fill="none" />
            <path
              d="M8 44c0-8 6.3-14 14-14h0c7.7 0 14 6 14 14"
              stroke="#94a3b8"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M37 12c2.5 1.5 4 4.2 4 7.2 0 4.5-3.4 8.1-7.8 8.5"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M40 34c3.8 1.4 6.5 4.5 6.5 9" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="hero" id="home">
      {/* Efek Visual Latar */}
      <div className="hero-grid"></div>
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-orb hero-orb-3"></div>

      {/* Tombol Slider */}
      <button className="hero-arrow left" onClick={prevSlide} aria-label="Slide sebelumnya">
        ‹
      </button>
      <button className="hero-arrow right" onClick={nextSlide} aria-label="Slide berikutnya">
        ›
      </button>

      {/* Badge */}
      <div className="hero-badge">
        <div className="hero-badge-dot"></div>
        Platform Resmi INKINDO Jawa Timur
      </div>

      {/* Hero Title & Sub */}
      <h1 className="hero-title slide-in" ref={titleRef}>
        {currentSlide.title}
        <br />
        <span className="line-accent">{currentSlide.titleSpan}</span>
      </h1>
      <p className="hero-sub slide-in" ref={subRef}>
        {currentSlide.sub}
      </p>

      {/* Stats Section */}
      <div className="stats-strip">
        <div className="stats-row">
          {statCards.map((card, index) => (
            <div className="stat-card" key={index}>
              {renderStatIcon(card.icon)}
              <div className="stat-number">
                <span className="counter" data-target={card.number}>
                  0
                </span>
                <span>{card.suffix}</span>
              </div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;