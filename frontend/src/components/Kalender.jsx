import React, { useState } from 'react';
import './Kalender.css';

const Kalender = () => {
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4); // 0 = Jan, 4 = Mei
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Events Data
  const EVENTS_DATA = [
    {
      id: 1,
      title: 'Musyawarah Provinsi INKINDO Jawa Timur 2026',
      cat: 'Musyawarah',
      type: 'Internal',
      date: '19-20 Mei 2026',
      city: 'Surabaya',
      price: 'Gratis',
      time: '13.00 - Selesai',
      cert: 'Tersedia (PKB)',
      desc: 'Membangun Ekosistem Jasa Konsultasi Inklusif Dalam Mendukung Jatim Sebagai Gerbang Baru Nusantara. Agenda tahunan wajib bagi seluruh anggota terdaftar.',
      address: 'Hotel Mercure Grand Mirama, Surabaya',
      calendarDates: ['2026-05-19', '2026-05-20']
    },
    {
      id: 2,
      title: 'Seminar Transformasi Digital Konsultan Konstruksi',
      cat: 'Seminar',
      type: 'External',
      date: '15 Juni 2026',
      city: 'Malang',
      price: 'Rp 150.000',
      time: '08.00 - 15.00 WIB',
      cert: 'Tersedia',
      desc: 'Seminar mendalam mengenai pemanfaatan teknologi digital terbaru dalam sektor jasa konstruksi dan konsultansi.',
      address: 'Harris Hotel & Conventions, Malang',
      calendarDates: ['2026-06-15']
    },
    {
      id: 3,
      title: 'Workshop Penyusunan RAB Berbasis BIM',
      cat: 'Workshop',
      type: 'Internal',
      date: '02 Juli 2026',
      city: 'Surabaya',
      price: 'Rp 350.000',
      time: '09.00 - 16.00 WIB',
      cert: 'Tersedia (Sertifikat Keahlian)',
      desc: 'Pelatihan intensif 1 hari penuh mengenai cara menyusun Rencana Anggaran Biaya (RAB) yang akurat menggunakan Building Information Modeling (BIM).',
      address: 'PT Solusi BIM Indonesia, Surabaya',
      calendarDates: ['2026-07-02']
    },
    {
      id: 4,
      title: 'Sertifikasi Profesional Jasa Desain dan Konstruksi',
      cat: 'Sertifikasi',
      type: 'Internal',
      date: '10 Agustus 2026',
      city: 'Jakarta',
      price: 'Rp 800.000',
      time: '07.00 - 17.00 WIB',
      cert: 'Sertifikat Profesional Nasional',
      desc: 'Program sertifikasi profesional komprehensif untuk meningkatkan kompetensi di bidang jasa desain dan konstruksi sesuai standar internasional.',
      address: 'Gedung Pusat INKINDO, Jakarta',
      calendarDates: ['2026-08-10']
    },
    {
      id: 5,
      title: 'Seminar Tren Industri 2026 - Penutup Tahun',
      cat: 'Seminar',
      type: 'External',
      date: '25 Agustus 2026',
      city: 'Surabaya',
      price: 'Gratis',
      time: '10.00 - 12.00 WIB',
      cert: 'Tersedia',
      desc: 'Refleksi dan proyeksi tren industri jasa konstruksi dan konsultasi di akhir tahun 2026 bersama stakeholder utama.',
      address: 'Grand Ballroom Hotel Bromo, Surabaya',
      calendarDates: ['2026-08-25']
    }
  ];

  // Mapping dari calendar date ke event
  const dateEventMap = {};
  EVENTS_DATA.forEach(event => {
    event.calendarDates.forEach(dateStr => {
      if (!dateEventMap[dateStr]) dateEventMap[dateStr] = [];
      dateEventMap[dateStr].push(event);
    });
  });

  const CALENDAR_EVENTS = {
    '2026-05-19': 'ev-musyawarah',
    '2026-05-20': 'ev-musyawarah',
    '2026-06-15': 'ev-seminar',
    '2026-07-02': 'ev-workshop',
    '2026-08-10': 'ev-sertifikasi',
    '2026-08-25': 'ev-seminar'
  };

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const renderCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();

    const cells = [];

    // Empty cells before first day
    for (let i = 0; i < offset; i++) {
      cells.push(
        <div key={`empty-${i}`} className="cal-cell empty"></div>
      );
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const evClass = CALENDAR_EVENTS[dateStr] || '';
      const eventsOnDate = dateEventMap[dateStr] || [];
      const isToday = (
        today.getFullYear() === calYear &&
        today.getMonth() === calMonth &&
        today.getDate() === d
      );

      const handleDateHover = (e) => {
        if (eventsOnDate.length > 0) {
          const rect = e.currentTarget.getBoundingClientRect();
          const tooltipWidth = 340;
          const spacing = 16;
          
          // Calculate position - simple and reliable
          let left = rect.right + spacing; // Right side default
          let placement = 'right';
          
          // If not enough space on right, place on left
          if (left + tooltipWidth > window.innerWidth - 20) {
            left = rect.left - tooltipWidth - spacing;
            placement = 'left';
          }
          
          // Vertical center of cell
          const top = rect.top + rect.height / 2;
          
          setHoveredDate({ 
            date: dateStr, 
            event: eventsOnDate[0], 
            top: top,
            left: left,
            placement: placement
          });
        }
      };

      const handleDateLeave = () => {
        setHoveredDate(null);
      };

      const handleDateClick = () => {
        if (eventsOnDate.length > 0) {
          setSelectedEventId(eventsOnDate[0].id);
          setShowEventDetail(true);
        }
      };

      cells.push(
        <div
          key={`day-${d}`}
          className={`cal-cell ${isToday ? 'today' : ''} ${evClass ? `has-event ${evClass}` : ''}`}
          onMouseEnter={handleDateHover}
          onMouseLeave={handleDateLeave}
          onClick={handleDateClick}
        >
          {d}
        </div>
      );
    }

    return cells;
  };

  const selectedEvent = EVENTS_DATA.find(e => e.id === selectedEventId);

  const getCategoryColor = (cat, typ) => {
    const typeMap = {
      'Internal': '#1565d8',
      'External': '#f97316'
    };
    const catMap = {
      'Musyawarah': '#2ecb7b',
      'Seminar': '#1565d8',
      'Workshop': '#7c3aed',
      'Sertifikasi': '#fbbf24'
    };
    return typeMap[typ] || catMap[cat] || '#1565d8';
  };

  return (
    <>
      <section className="section" id="calendar">
        <div className="calendar-inner">
          <div className="calendar-grid">
            
            {/* Left Side: Text & Legend */}
            <div className="cal-left">
              <div className="section-tag">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Event Calendar
              </div>
              <h2 className="section-title">Kalender Kegiatan</h2>
              <p className="section-sub">
                Pantau jadwal kegiatan INKINDO secara real-time. Klik pada tanggal yang ditandai untuk melihat detail agenda pada hari tersebut.
              </p>
              
              <div className="cal-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#1565d8' }}></div>
                  <span>Seminar</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#7c3aed' }}></div>
                  <span>Workshop</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#2ecb7b' }}></div>
                  <span>Musyawarah</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#fbbf24' }}></div>
                  <span>Sertifikasi</span>
                </div>
              </div>
            </div>

            {/* Right Side: Calendar Widget */}
            <div className="cal-widget">
              {/* Header: Month & Navigation */}
              <div className="cal-head">
                <button className="cal-nav" onClick={prevMonth} aria-label="Bulan Sebelumnya">
                  &#8249;
                </button>
                <div className="cal-month">
                  {monthNames[calMonth]} {calYear}
                </div>
                <button className="cal-nav" onClick={nextMonth} aria-label="Bulan Selanjutnya">
                  &#8250;
                </button>
              </div>
              
              {/* Day Names Header */}
              <div className="cal-days-hdr">
                <div className="cal-day-name">Sn</div>
                <div className="cal-day-name">Sl</div>
                <div className="cal-day-name">Rb</div>
                <div className="cal-day-name">Km</div>
                <div className="cal-day-name">Jm</div>
                <div className="cal-day-name">Sb</div>
                <div className="cal-day-name">Mg</div>
              </div>
              
              {/* Calendar Grid */}
              <div className="cal-grid">
                {renderCalendarDays()}
              </div>
            </div>

          </div>

          {/* Event Preview Tooltip - Rendered outside grid for proper positioning */}
          {hoveredDate && (
            <div
              className={`event-tooltip ${hoveredDate.placement === 'left' ? 'tooltip-left' : 'tooltip-right'}`}
              style={{ top: `${hoveredDate.top}px`, left: `${hoveredDate.left}px` }}
            >
              <div className="event-tooltip-content">
                <div 
                  className="tooltip-badge" 
                  style={{ 
                    background: getCategoryColor(hoveredDate.event.cat, hoveredDate.event.type),
                    opacity: 0.85
                  }}
                >
                  {hoveredDate.event.cat}
                </div>
                <h4 className="tooltip-title">{hoveredDate.event.title}</h4>
                <div className="tooltip-info">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{hoveredDate.event.time}</span>
                </div>
                <div className="tooltip-info">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{hoveredDate.event.city}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Event Detail Modal */}
      {showEventDetail && selectedEvent && (
        <div className="modal-overlay" onClick={() => { setShowEventDetail(false); document.body.style.overflow = 'auto'; }}>
          <div className="event-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowEventDetail(false); document.body.style.overflow = 'auto'; }}>
              ✕
            </button>
            
            <div className="modal-header">
              <div className="modal-badge" style={{ background: getCategoryColor(selectedEvent.cat, selectedEvent.type) }}>
                {selectedEvent.cat} • {selectedEvent.type}
              </div>
              <h2 className="modal-title">{selectedEvent.title}</h2>
            </div>

            <div className="modal-info-grid">
              <div className="info-item">
                <span className="info-label">📅 Tanggal</span>
                <span className="info-value">{selectedEvent.date}</span>
              </div>
              <div className="info-item">
                <span className="info-label">⏱️ Waktu</span>
                <span className="info-value">{selectedEvent.time}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📍 Lokasi</span>
                <span className="info-value">{selectedEvent.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">💰 Biaya</span>
                <span className="info-value">{selectedEvent.price}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📜 Sertifikat</span>
                <span className="info-value">{selectedEvent.cert}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📍 Alamat</span>
                <span className="info-value">{selectedEvent.address}</span>
              </div>
            </div>

            <div className="modal-desc">
              <h3>Deskripsi Event</h3>
              <p>{selectedEvent.desc}</p>
            </div>

            <button className="btn-lihat-detail" onClick={() => alert('Lihat detail penuh di halaman Events')}>
              Lihat Detail Lengkap
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Kalender;