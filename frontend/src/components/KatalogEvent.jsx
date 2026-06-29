import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KatalogEvent.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const KatalogEvent = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [regStatus, setRegStatus] = useState('verified');
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    kta: '',
    proof: null,
  });
  const [registerErrors, setRegisterErrors] = useState({});

  const catColorMap = {
    'Musyawarah': 'cat-musyawarah',
    'Seminar': 'cat-seminar',
    'Workshop': 'cat-workshop',
    'Sertifikasi': 'cat-sertifikasi'
  };

  const DEFAULT_EVENTS_DATA = [
    {
      id: 1,
      title: 'Musyawarah Provinsi INKINDO Jawa Timur 2026',
      cat: 'Musyawarah',
      type: 'Internal',
      date: '19-20 Mei 2026',
      city: 'Surabaya',
      price: 'Gratis',
      img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
      time: '13.00 - Selesai',
      cert: 'Tersedia (PKB)',
      desc: 'Membangun Ekosistem Jasa Konsultasi Inklusif Dalam Mendukung Jatim Sebagai Gerbang Baru Nusantara. Agenda tahunan wajib bagi seluruh anggota terdaftar.',
      agenda: [
        { time: '13.00', title: 'Registrasi Peserta' },
        { time: '13.30', title: 'Pembukaan MUSPROV INKINDO Jawa Timur' },
        { time: '14.00', title: 'Sidang Pleno dan Pembahasan Agenda Organisasi' },
        { time: '15.30', title: 'Musyawarah dan Rekomendasi Program' }
      ],
      facilities: ['Sertifikat Resmi', 'Materi Kegiatan', 'Konsumsi', 'Networking Anggota'],
      speakers: [
        { name: 'INKINDO Jatim', role: 'Penyelenggara' },
        { name: 'DPP INKINDO', role: 'Undangan Organisasi' }
      ],
      address: 'Hotel Mercure Grand Mirama, Surabaya',
      sponsors: ['INKINDO Jawa Timur', 'Pemprov Jatim'],
      gallery: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80',
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=300&q=80',
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&q=80'
      ]
    }
  ];

  const [events, setEvents] = useState(DEFAULT_EVENTS_DATA);

  const mapBackendEvent = (backendEvent) => {
    const isFree = backendEvent.is_free;
    const priceVal = backendEvent.price;
    const formattedPrice = isFree || !priceVal || Number(priceVal) === 0
      ? 'Gratis'
      : `Rp ${Number(priceVal).toLocaleString('id-ID')}`;

    const locationStr = backendEvent.location || 'Surabaya';
    const parts = locationStr.split(',');
    const city = parts[parts.length - 1]?.trim() || locationStr;

    return {
      id: backendEvent.id,
      title: backendEvent.title,
      cat: backendEvent.category?.name || 'Seminar',
      type: backendEvent.type === 'internal' ? 'Internal' : 'External',
      date: backendEvent.event_date,
      city: city,
      price: formattedPrice,
      img: backendEvent.ad_image 
        ? `${API_BASE_URL.replace(/\/api$/, '')}/storage/${backendEvent.ad_image}` 
        : backendEvent.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
      time: backendEvent.event_time || '08:00 - Selesai',
      cert: 'Tersedia',
      desc: backendEvent.description || 'Deskripsi kegiatan.',
      agenda: (backendEvent.agenda && Array.isArray(backendEvent.agenda) && backendEvent.agenda.length > 0)
        ? backendEvent.agenda
        : [
            { time: '08:00', title: 'Registrasi Peserta' },
            { time: '09:00', title: 'Sesi Utama' },
            { time: '12:00', title: 'Makan Siang' },
            { time: '13:00', title: 'Tanya Jawab & Penutupan' }
          ],
      facilities: ['Sertifikat Resmi', 'Materi Kegiatan', 'Konsumsi', 'Networking'],
      speakers: [{ name: 'INKINDO Jatim', role: 'Penyelenggara' }],
      address: backendEvent.location || 'Gedung INKINDO Jatim',
      sponsors: ['INKINDO Jawa Timur'],
      gallery: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80'
      ],
      poster_file_path: backendEvent.poster_file || ''
    };
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events`);
        if (response.data.success) {
          const mapped = response.data.data.map(mapBackendEvent);
          setEvents(mapped);
        }
      } catch (error) {
        console.error("Gagal memuat event dari API:", error);
      }
    };
    fetchEvents();
  }, []);

  const tickerWords = ['MUSYAWARAH', 'SEMINAR', 'SERTIFIKASI', 'WORKSHOP', 'INKINDO', 'JAWA TIMUR'];
  const repeatedWords = [...tickerWords, ...tickerWords, ...tickerWords, ...tickerWords];

  const renderEvents = () => {
    const q = searchQuery.toLowerCase();
    const cat = filterCategory;
    const typ = filterType;
    const city = filterCity;

    const filtered = events.filter((ev) => {
      const matchQ = !q || ev.title.toLowerCase().includes(q) || ev.cat.toLowerCase().includes(q);
      const matchCat = !cat || ev.cat === cat;
      const matchType = !typ || ev.type === typ;
      const matchCity = !city || ev.city === city;
      return matchQ && matchCat && matchType && matchCity;
    });

    const shown = filtered.slice(0, visibleCount);
    return { filtered, shown };
  };

  const { filtered, shown } = renderEvents();

  const openEventModal = (id) => {
    const ev = events.find((e) => e.id === id);
    if (ev) {
      setCurrentEvent(ev);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeEventModal = (e, force) => {
    if (force || (e && e.target.id === 'eventDetailModal')) {
      setIsModalOpen(false);
      setCurrentEvent(null);
      document.body.style.overflow = '';
    }
  };

  const isPaidEvent = (ev) => {
    if (!ev?.price) return false;
    return !ev.price.toLowerCase().includes('gratis');
  };

  const isInternalEvent = (ev) => ev?.type?.toLowerCase() === 'internal';

  const openRegisterModal = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert("Anda harus masuk/login terlebih dahulu untuk mendaftar event.");
      return;
    }

    const authUserStr = localStorage.getItem('authUser');
    const authUser = authUserStr ? JSON.parse(authUserStr) : null;

    setIsModalOpen(false);
    setIsRegisterOpen(true);
    setIsSuccessOpen(false);
    setRegisterForm({
      name: authUser?.name || '',
      email: authUser?.email || '',
      whatsapp: authUser?.phone || '',
      kta: authUser?.nta || '',
      proof: null,
    });
    setRegisterErrors({});
    document.body.style.overflow = 'hidden';
  };

  const closeRegisterModal = (e, force) => {
    if (force || (e && e.target.id === 'regModal')) {
      setIsRegisterOpen(false);
      setRegisterErrors({});
      document.body.style.overflow = '';
    }
  };

  const closeSuccessModal = (e, force) => {
    if (force || (e && e.target.id === 'successModal')) {
      setIsSuccessOpen(false);
      document.body.style.overflow = '';
    }
  };

  const validateRegisterForm = () => {
    const errors = {};
    if (!registerForm.name.trim()) {
      errors.name = 'Nama lengkap wajib diisi.';
    }
    if (!registerForm.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!registerForm.email.includes('@')) {
      errors.email = 'Format email tidak valid.';
    }
    if (!registerForm.whatsapp.trim()) {
      errors.whatsapp = 'No. Whatsapp wajib diisi.';
    }
    if (isInternalEvent(currentEvent) && !registerForm.kta.trim()) {
      errors.kta = 'Nomor KTA wajib diisi untuk event internal.';
    }
    if (isPaidEvent(currentEvent) && !registerForm.proof) {
      errors.proof = 'Upload bukti transfer wajib diisi.';
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitRegisterForm = async () => {
    if (!currentEvent) return;
    if (validateRegisterForm()) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Anda harus masuk/login terlebih dahulu untuk mendaftar event.");
        return;
      }

      try {
        // Sync KTA/NTA to backend profile if filled out here and not set on profile
        const authUserStr = localStorage.getItem('authUser');
        const authUser = authUserStr ? JSON.parse(authUserStr) : null;
        
        if (isInternalEvent(currentEvent) && registerForm.kta && authUser && !authUser.nta) {
          try {
            const userUpdateRes = await axios.put(`${API_BASE_URL}/user`, {
              name: authUser.name,
              nta: registerForm.kta,
              phone: registerForm.phone || authUser.phone || registerForm.whatsapp,
              profession: authUser.profession || 'Konsultan',
              company: authUser.company || 'INKINDO',
              company_email: authUser.company_email || authUser.email
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (userUpdateRes.data.success) {
              localStorage.setItem('authUser', JSON.stringify(userUpdateRes.data.data));
            }
          } catch (updateErr) {
            console.error("Gagal memperbarui NTA:", updateErr);
          }
        }

        // Prepare multipart form data
        const formData = new FormData();
        formData.append('event_id', currentEvent.id);
        if (isPaidEvent(currentEvent) && registerForm.proof) {
          formData.append('payment_proof', registerForm.proof);
        }

        const response = await axios.post(`${API_BASE_URL}/events/register`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          setRegStatus(response.data.data.status || 'verified');
          setIsRegisterOpen(false);
          setIsSuccessOpen(true);
        } else {
          alert(response.data.message || 'Pendaftaran gagal.');
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Gagal mendaftar event. Periksa kembali NTA Anda di profil atau unggah bukti transfer.');
      }
    }
  };

  const showMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const getCategoryColor = (cat, typ) => {
    if (typ === 'Internal') return 'cat-internal';
    if (typ === 'External') return 'cat-external';
    return catColorMap[cat] || '';
  };

  return (
    <>
      {/* TICKER SECTION */}
      <div className="ticker-section">
        <div className="ticker-track">
          {repeatedWords.map((w, idx) => (
            <div key={idx} className="ticker-item">
              <span>{w}</span>
              <div className="ticker-dot"></div>
            </div>
          ))}
        </div>
      </div>

      {/* EVENTS SECTION */}
      <section className="section" id="events">
        <div className="section-inner">
          {/* Header Katalog */}
          <div className="text-center">
            <div className="section-tag">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Katalog Event
            </div>
            <h2 className="section-title">Event INKINDO JATIM</h2>
            <p className="section-sub">Temukan dan ikuti berbagai seminar, workshop, serta agenda resmi lainnya.</p>
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>

            <input
              className="search-input"
              type="text"
              placeholder="Cari nama event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="search-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              <option>Musyawarah</option>
              <option>Seminar</option>
              <option>Workshop</option>
              <option>Sertifikasi</option>
            </select>

            <select
              className="search-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Semua Tipe</option>
              <option value="Internal">Internal</option>
              <option value="External">External</option>
            </select>

            <select
              className="search-select"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            >
              <option value="">Semua Kota</option>
              <option>Surabaya</option>
              <option>Malang</option>
              <option>Sidoarjo</option>
            </select>

            <button className="search-btn" aria-label="Cari">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Event Grid */}
          <div className="event-grid">
            {shown.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>Tidak ada event ditemukan berdasarkan pencarian Anda.</p>
              </div>
            ) : (
              shown.map((ev) => (
                <div key={ev.id} className="ev-card" onClick={() => openEventModal(ev.id)}>
                  <div className="ev-card-img">
                    <img
                      className="ev-card-img-inner"
                      src={ev.img}
                      alt={ev.title}
                      loading="lazy"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <div className="ev-card-img-gradient"></div>
                    <div className="ev-card-badges">
                      <div className={`ev-card-badge ${catColorMap[ev.cat]}`}>
                        {ev.cat}
                      </div>
                      <div className={`ev-card-badge ${ev.type === 'Internal' ? 'cat-internal' : 'cat-external'}`}>
                        {ev.type}
                      </div>
                    </div>
                  </div>

                  <div className="ev-card-body">
                    <div className="ev-card-title" title={ev.title}>
                      {ev.title}
                    </div>

                    <div className="ev-card-meta">
                      <div className="ev-card-meta-item">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {ev.date}
                      </div>
                      <div className="ev-card-meta-item">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {ev.city}
                      </div>
                    </div>

                    <div className="ev-card-footer">
                      <div className="ev-card-price">
                        <small>Biaya Registrasi</small>
                        {ev.price}
                      </div>
                      <button className="ev-card-btn">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* See More Button */}
          {visibleCount < filtered.length && (
            <div className="text-center">
              <button className="btn-see-more" onClick={showMore}>
                Lihat Lebih Banyak
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* EVENT DETAIL MODAL */}
      {isModalOpen && currentEvent && (
        <div
          id="eventDetailModal"
          className="ev-overlay open"
          onClick={(e) => closeEventModal(e, false)}
        >
          <div className="ev-box">
            <button className="ev-close" onClick={() => closeEventModal(null, true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="ev-hero">
              <img className="ev-hero-img" src={currentEvent.img} alt={currentEvent.title} />
              <div className="ev-hero-overlay">
                <div className="ev-badges">
                  <span className={`ev-badge ${getCategoryColor(currentEvent.cat, currentEvent.type)}`}>
                    {currentEvent.type || currentEvent.cat}
                  </span>
                  {currentEvent.cert && (
                    <span className="ev-badge" style={{ background: 'rgba(46,203,123,.2)', color: '#2ecb7b', border: '1px solid rgba(46,203,123,.3)' }}>
                      Sertifikat
                    </span>
                  )}
                </div>
                <h2 className="ev-hero-title">{currentEvent.title}</h2>
              </div>
            </div>

            <div className="ev-infobar">
              <div className="ev-info-item">
                <div className="ev-info-label">TANGGAL</div>
                <div className="ev-info-value">{currentEvent.date}</div>
              </div>
              <div className="ev-info-item">
                <div className="ev-info-label">LOKASI</div>
                <div className="ev-info-value">{currentEvent.city}</div>
              </div>
              <div className="ev-info-item">
                <div className="ev-info-label">WAKTU</div>
                <div className="ev-info-value">{currentEvent.time || '-'}</div>
              </div>
              <div className="ev-info-item">
                <div className="ev-info-label">SERTIFIKAT</div>
                <div className="ev-info-value">{currentEvent.cert || '-'}</div>
              </div>
            </div>

            <div className="ev-body">
              <div className="ev-col-left">
                <div className="ev-section">
                  <div className="ev-section-title">
                    <span className="ev-dot"></span> DESKRIPSI KEGIATAN
                  </div>
                  <p className="ev-desc-text">{currentEvent.desc || 'Deskripsi belum tersedia.'}</p>
                </div>

                {currentEvent.agenda && currentEvent.agenda.length > 0 && (
                  <div className="ev-section">
                    <div className="ev-section-title">
                      <span className="ev-dot"></span> AGENDA KEGIATAN
                    </div>
                    <div className="ev-agenda-grid">
                      {currentEvent.agenda.map((a, idx) => (
                        <div key={idx} className="ev-agenda-item">
                          <div className="ev-agenda-time">{a.time}</div>
                          <div className="ev-agenda-title">{a.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ev-section">
                  <div className="ev-section-title">
                    <span className="ev-dot"></span> FASILITAS PESERTA
                  </div>
                  <ul className="ev-facility-list">
                    {(currentEvent.facilities || []).map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="ev-section">
                  <div className="ev-section-title">
                    <span className="ev-dot"></span> GALERI DOKUMENTASI
                  </div>
                  <div className="ev-gallery">
                    {(currentEvent.gallery || []).map((g, idx) => (
                      <img key={idx} src={g} alt={`Galeri ${currentEvent.title}`} loading="lazy" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="ev-col-right">
                <div className="ev-sidebar-card">
                  <div className="ev-sidebar-title">Pembicara Utama</div>
                  {(currentEvent.speakers || []).map((s, idx) => (
                    <div key={idx} className="ev-speaker">
                      <div className="ev-speaker-avatar">{s.name[0]}</div>
                      <div>
                        <div className="ev-speaker-name">{s.name}</div>
                        <div className="ev-speaker-role">{s.role}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ev-sidebar-card">
                  <div className="ev-sidebar-title">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#1565d8" strokeWidth="2.2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Lokasi Acara
                  </div>
                  <div className="ev-map-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.4">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <p className="ev-address">{currentEvent.address || '-'}</p>
                </div>

                {currentEvent.poster_file_path && (
                  <div className="ev-sidebar-card">
                    <div className="ev-sidebar-title" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#1565d8" strokeWidth="2.2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      Dokumen Poster Detail
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 12px', lineHeight: 1.5 }}>
                      Buka dokumen atau unduh poster untuk rincian kegiatan lengkap.
                    </p>
                    <a 
                      href={`${API_BASE_URL.replace(/\/api$/, '')}/storage/${currentEvent.poster_file_path}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="ev-card-btn" 
                      style={{ display: 'inline-flex', width: '100%', justifyContent: 'center', padding: '10px', textDecoration: 'none', background: '#eff6ff', color: '#1565d8', border: '1px solid #dbeafe', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}
                    >
                      Buka / Unduh Poster
                    </a>
                  </div>
                )}

                <div className="ev-sidebar-card">
                  <div className="ev-sidebar-title">Sponsored by:</div>
                  <div className="ev-sponsor-row">
                    {(currentEvent.sponsors || []).map((s, idx) => (
                      <div key={idx} className="ev-sponsor">{s}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="ev-footer-bar">
              <div>
                <div className="ev-footer-label">Biaya Registrasi</div>
                <div className="ev-footer-price">{currentEvent.price}</div>
              </div>
              <button className="ev-footer-btn" onClick={openRegisterModal}>
                Daftar Event
              </button>
            </div>
          </div>
        </div>
      )}

      {isRegisterOpen && currentEvent && (
        <div id="regModal" className="reg-overlay" onClick={(e) => closeRegisterModal(e, false)}>
          <div className="reg-box">
            <button className="reg-close" onClick={() => closeRegisterModal(null, true)} aria-label="Tutup">
              <span>x</span>
            </button>
            <div className="reg-header">
              <div className="reg-header-inner">
                <div className="reg-icon">&#128196;</div>
                <div>
                  <h3 className="reg-title">Finalisasi Pendaftaran</h3>
                  <p className="reg-sub">{currentEvent.title}</p>
                </div>
              </div>
            </div>

            <div className="reg-section" style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '0 20px 16px' }}>
              <div className="reg-section-title" style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Profil Pendaftar</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#1e293b' }}>
                <div><strong>Nama:</strong> {registerForm.name}</div>
                <div><strong>Email:</strong> {registerForm.email}</div>
                <div><strong>WhatsApp:</strong> {registerForm.whatsapp}</div>
              </div>
            </div>

            {isInternalEvent(currentEvent) && (
              <div className="reg-section">
                <div className="reg-section-title">IDENTITAS INTERNAL</div>
                <div className="reg-field">
                  <label>Nomor KTA INKINDO</label>
                  <input
                    type="text"
                    value={registerForm.kta}
                    onChange={(e) => setRegisterForm({ ...registerForm, kta: e.target.value })}
                    placeholder="123xxx-xx"
                  />
                  {registerErrors.kta && <span className="reg-error">{registerErrors.kta}</span>}
                </div>
              </div>
            )}

            {isPaidEvent(currentEvent) && (
              <div className="reg-section reg-payment">
                <div className="reg-payment-head">
                  <div>
                    <div className="reg-payment-label">TOTAL TAGIHAN</div>
                    <div className="reg-payment-note">Mohon selesaikan pembayaran ke rekening BCA 123-456-7890 (a.n INKINDO JATIM). Lalu unggah bukti transfer valid di bawah ini.</div>
                  </div>
                  <div className="reg-payment-amount">{currentEvent.price}</div>
                </div>
                <div className="reg-upload">
                  <label className="reg-upload-box">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setRegisterForm({ ...registerForm, proof: e.target.files?.[0] || null })}
                    />
                    <div className="reg-upload-icon">&#8682;</div>
                    <div className="reg-upload-text">Pilih atau letakkan file bukti</div>
                    <div className="reg-upload-hint">FORMAT : JPG, PNG, PDF (MAX 2MB)</div>
                  </label>
                  {registerErrors.proof && <span className="reg-error">{registerErrors.proof}</span>}
                </div>
              </div>
            )}

            <div className="reg-actions">
              <button className="reg-cancel" onClick={() => closeRegisterModal(null, true)}>Cancel</button>
              <button className="reg-submit" onClick={submitRegisterForm}>Konfirmasi &amp; Daftar</button>
            </div>
          </div>
        </div>
      )}

      {isSuccessOpen && (
        <div id="successModal" className="reg-overlay" onClick={(e) => closeSuccessModal(e, false)}>
          <div className="reg-success-box">
            {regStatus === 'verified' ? (
              <>
                <div className="reg-success-icon">&#10004;</div>
                <h3 className="reg-success-title">Pendaftaran Sukses!</h3>
                <p className="reg-success-copy">E-Tiket telah aktif. Detail kegiatan telah kami kirimkan salinannya melalui email Anda.</p>
              </>
            ) : (
              <>
                <div className="reg-success-icon" style={{ background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏱</div>
                <h3 className="reg-success-title" style={{ color: '#d97706' }}>Menunggu Verifikasi!</h3>
                <p className="reg-success-copy">Pendaftaran berhasil diajukan dengan status <strong>Pending</strong>. Silakan tunggu Admin memverifikasi bukti pembayaran Anda untuk mengaktifkan tiket.</p>
              </>
            )}
            <button className="reg-submit" onClick={() => closeSuccessModal(null, true)}>Tutup &amp; Lihat Jadwal</button>
          </div>
        </div>
      )}
    </>
  );
};

export default KatalogEvent;
