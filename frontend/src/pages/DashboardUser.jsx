import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import heroImage from '../assets/hero.png';
import './DashboardUser.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const PROFILE_FIELDS = [
  { key: 'fullName', label: 'Nama Lengkap', type: 'text' },
  { key: 'profession', label: 'Profesi', type: 'text' },
  { key: 'email', label: 'Email Pribadi', type: 'email' },
  { key: 'company', label: 'Perusahaan / Instansi', type: 'text' },
  { key: 'phone', label: 'No. HP', type: 'tel' },
  { key: 'officeEmail', label: 'Email Kantor', type: 'email' },
];

const INITIAL_PROFILE = {
  fullName: 'John Doe',
  profession: 'Konsultan Hukum',
  email: 'john@example.com',
  company: 'INKINDO JATIM',
  phone: '0812-3456-7890',
  officeEmail: 'john.doe@inkindojatim.org',
};

const EVENT_LIST = [
  {
    id: 1,
    title: 'Musyawarah Provinsi INKINDO Jawa Timur',
    category: 'Musyawarah',
    date: '19-20 Mei 2026',
    time: '13.00 - selesai',
    image: heroImage,
    status: 'Confirmed',
    ticketCode: 'TKT-1001',
    ticketTitle: 'MUSPROV 2026',
    ticketCategory: 'VIP',
    venue: 'Hotel Mercure Grand Mirama, Surabaya',
  },
  {
    id: 2,
    title: 'Workshop Manajemen Proyek Konstruksi',
    category: 'Workshop',
    date: '12 Juni 2026',
    time: '08.30 - 12.00',
    image: heroImage,
    status: 'Confirmed',
    ticketCode: 'TKT-2048',
    ticketTitle: 'WORKSHOP PMP',
    ticketCategory: 'Peserta',
    venue: 'Gedung INKINDO Jatim, Surabaya',
  },
];

const CERTIFICATES = [
  {
    id: 1,
    title: 'Musyawarah Provinsi INKINDO Jawa Timur 2026',
    date: '19 Mei 2026',
    location: 'Surabaya',
  },
  {
    id: 2,
    title: 'Seminar Nasional Jasa Konstruksi Digital',
    date: '14 April 2026',
    location: 'Malang',
  },
];

const NAV_ITEMS = [
  { id: 'profil', label: 'Identitas Profil' },
  { id: 'jadwal', label: 'Jadwal Event Saya' },
  { id: 'sertifikat', label: 'E-Certificates' },
];

const iconProps = {
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Icon({ name, size = 20 }) {
  const icons = {
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    badge: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.5 12.8 17 22l-5-3-5 3 1.5-9.2" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    check: <path d="M20 6 9 17l-5-5" />,
    file: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 7h10M7 11h10M7 15h6" />
      </>
    ),
    mail: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </>
    ),
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72 13 13 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 8 8l1.27-1.27a2 2 0 0 1 2.11-.45 13 13 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />,
    building: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
      </>
    ),
    briefcase: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
        <path d="M12 15V3" />
      </>
    ),
    send: (
      <>
        <path d="M22 2 11 13" />
        <path d="m22 2-7 20-4-9-9-4Z" />
      </>
    ),
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
  };

  return (
    <svg {...iconProps} width={size} height={size}>
      {icons[name]}
    </svg>
  );
}

const getInitials = (value) =>
  value
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'JD';

const getFieldIcon = (fieldKey) => {
  if (fieldKey === 'profession') return 'briefcase';
  if (fieldKey === 'email' || fieldKey === 'officeEmail') return 'mail';
  if (fieldKey === 'company') return 'building';
  if (fieldKey === 'phone') return 'phone';
  return 'user';
};

const DashboardUser = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil');
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [snapshot, setSnapshot] = useState(INITIAL_PROFILE);
  const [myEvents, setMyEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('Belum ada perubahan tersimpan');
  const [toast, setToast] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          const user = response.data;
          const mapped = {
            fullName: user.name || '',
            profession: user.profession || '',
            email: user.email || '',
            company: user.company || '',
            phone: user.phone || '',
            officeEmail: user.company_email || ''
          };
          setProfile(mapped);
          setSnapshot(mapped);
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          const mapped = response.data.data.map((reg) => {
            const ev = reg.event;
            const statusLabel = reg.status === 'verified' ? 'Confirmed' : reg.status === 'rejected' ? 'Rejected' : 'Pending';
            return {
              id: reg.id,
              title: ev?.title || 'Event INKINDO',
              category: ev?.category?.name || 'Seminar',
              date: ev?.event_date || '',
              time: ev?.event_time || '08:00 - Selesai',
              image: ev?.image_url || heroImage,
              status: statusLabel,
              ticketCode: reg.ticket_code ? `TKT-${reg.ticket_code.slice(0, 8).toUpperCase()}` : 'Belum Ada',
              ticketTitle: ev?.title ? ev.title.split(' ').slice(0, 3).join(' ').toUpperCase() : 'TIKET',
              ticketCategory: reg.ticket_type === 'vip' ? 'VIP' : 'Peserta',
              venue: ev?.location || 'Surabaya',
              qrUrl: reg.ticket_code ? `http://localhost:8000/storage/qrcodes/${reg.ticket_code}.svg` : null
            };
          });
          setMyEvents(mapped);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat:", error);
      }
    };

    fetchProfile();
    fetchHistory();
  }, [navigate]);

  useEffect(() => {
    if (!toast) return undefined;

    const timeoutId = window.setTimeout(() => setToast(null), toast.duration ?? 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const dirtyFields = useMemo(
    () => PROFILE_FIELDS.filter((field) => profile[field.key] !== snapshot[field.key]).map((field) => field.key),
    [profile, snapshot],
  );

  const showToast = (type, title, message, duration = 3000) => {
    setToast({ type, title, message, duration });
  };

  const handleFieldChange = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const stopEditing = () => {
    setIsEditing(false);
    setProfile(snapshot);
  };

  const handleToggleEdit = async () => {
    if (isSaving) return;

    if (!isEditing) {
      setIsEditing(true);
      showToast('info', 'Mode edit aktif', 'Ubah data lalu klik simpan untuk menyimpan perubahan.', 2200);
      return;
    }

    const fullName = profile.fullName.trim();
    const email = profile.email.trim();

    if (!fullName) {
      showToast('error', 'Nama wajib diisi', 'Nama lengkap tidak boleh kosong.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('error', 'Email tidak valid', 'Periksa kembali format email pribadi Anda.');
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem('authToken');
    const authUserStr = localStorage.getItem('authUser');
    const authUser = authUserStr ? JSON.parse(authUserStr) : null;
    const currentNta = authUser ? authUser.nta : null;

    try {
      const response = await axios.put(`${API_BASE_URL}/user`, {
        name: profile.fullName,
        profession: profile.profession,
        phone: profile.phone,
        company: profile.company,
        company_email: profile.officeEmail,
        nta: currentNta
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        localStorage.setItem('authUser', JSON.stringify(response.data.data));

        const nextSnapshot = { ...profile };
        const savedTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        setSnapshot(nextSnapshot);
        setIsSaving(false);
        setIsEditing(false);
        setLastSaved(`Tersimpan pukul ${savedTime}`);
        showToast('success', 'Data berhasil disimpan', `Profil Anda telah diperbarui pukul ${savedTime}.`);
      } else {
        showToast('error', 'Gagal menyimpan data', response.data.message || 'Terjadi kesalahan.');
        setIsSaving(false);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Gagal menyimpan data', error.response?.data?.message || 'Terjadi kesalahan koneksi.');
      setIsSaving(false);
    }
  };

  const handleTabChange = (tabId) => {
    if (tabId !== 'profil' && isEditing && !isSaving) {
      stopEditing();
    }

    setActiveTab(tabId);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await axios.post(`${API_BASE_URL}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    window.sessionStorage.removeItem('inkindo-auth-role');
    window.sessionStorage.removeItem('inkindo-user-profile');
    navigate('/');
  };

  const renderProfileTab = () => (
    <section className="user-panel user-panel-profile">
      <div className="user-panel-header">
        <div>
          <h2 className="user-panel-title">Profil Data Diri</h2>
          <p className="user-panel-meta">{lastSaved}</p>
        </div>
        <button
          type="button"
          className={`user-edit-toggle ${isSaving ? 'is-saving' : isEditing ? 'is-save' : 'is-edit'}`}
          onClick={handleToggleEdit}
          disabled={isSaving}
        >
          {isSaving ? <span className="user-spinner" /> : <Icon name={isEditing ? 'check' : 'edit'} size={15} />}
          <span>{isSaving ? 'Menyimpan...' : isEditing ? 'Simpan Data' : 'Edit Data'}</span>
        </button>
      </div>

      <div className={`user-change-summary ${dirtyFields.length ? 'is-visible' : ''}`}>
        <Icon name="info" size={16} />
        <span>
          Ada <strong>{dirtyFields.length} field</strong> yang diubah dan belum disimpan
        </span>
      </div>

      <div className="user-form-grid">
        {PROFILE_FIELDS.map((field) => {
          const isDirty = dirtyFields.includes(field.key);

          return (
            <label key={field.key} className={`user-field ${isDirty ? 'is-dirty' : ''}`}>
              <span>{field.label}</span>
              <div className="user-input-wrap">
                <Icon name={getFieldIcon(field.key)} size={15} />
                <input
                  type={field.type}
                  value={profile[field.key]}
                  readOnly={!isEditing}
                  onChange={(event) => handleFieldChange(field.key, event.target.value)}
                />
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );

  const renderScheduleTab = () => (
    <section className="user-panel">
      <div className="user-panel-header user-panel-header-stack">
        <div>
          <h2 className="user-panel-title">Jadwal Event Aktif</h2>
          <p className="user-panel-subtitle">Daftar event terdaftar Anda yang akan datang</p>
        </div>
      </div>

      <div className="user-event-list">
        {myEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <p>Belum ada event terdaftar.</p>
          </div>
        ) : (
          myEvents.map((eventItem) => (
            <article key={eventItem.id} className="user-event-item">
              <img src={eventItem.image} alt={eventItem.title} className="user-event-thumb" />
              <div className="user-event-main">
                <div className="user-event-badges">
                  <span className={`user-badge user-badge-${eventItem.status.toLowerCase()}`}>{eventItem.status}</span>
                  <span className="user-badge user-badge-category">{eventItem.category}</span>
                </div>
                <h3>{eventItem.title}</h3>
                <div className="user-event-meta">
                  <span>
                    <Icon name="calendar" size={14} />
                    {eventItem.date}
                  </span>
                  <span>
                    <Icon name="clock" size={14} />
                    {eventItem.time}
                  </span>
                </div>
              </div>
              <button type="button" className="user-ticket-button" onClick={() => setActiveTicket(eventItem)}>
                <Icon name="download" size={15} />
                Unduh Tiket
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );

  const renderCertificateTab = () => (
    <section className="user-panel">
      <div className="user-panel-header user-panel-header-stack">
        <div>
          <h2 className="user-panel-title">E-Certificates</h2>
          <p className="user-panel-subtitle">Sertifikat digital dari event yang telah Anda ikuti</p>
        </div>
      </div>

      <div className="user-certificate-grid">
        {CERTIFICATES.map((certificate) => (
          <article key={certificate.id} className="user-certificate-card">
            <h3>{certificate.title}</h3>
            <p>
              {certificate.date} · {certificate.location}
            </p>
            <button
              type="button"
              className="user-certificate-button"
              onClick={() => showToast('info', 'Mengunduh sertifikat', `Sertifikat ${certificate.title} sedang diproses.`)}
            >
              <Icon name="download" size={14} />
              Unduh PDF
            </button>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <div className="user-dashboard">
      <header className="user-topbar">
        <button type="button" className="user-logo" onClick={() => navigate('/')}>
          <img src="/logoinkindo.png" alt="INKINDO Jawa Timur" />
          <span>
            <strong>INKINDO JAWA TIMUR</strong>
            <small>Event Hub</small>
          </span>
        </button>

        <nav className="user-toplinks">
          <button type="button" onClick={() => navigate('/')}>
            Home
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Events
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Calendar
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Contact Us
          </button>
        </nav>

        <div className="user-topactions">
          <button type="button" className="user-dashboard-pill">
            <Icon name="user" size={15} />
            Dashboard
          </button>
          <button type="button" className="user-logout" onClick={handleLogout} aria-label="Keluar">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </header>

      <main className="user-layout">
        <aside className="user-sidebar-card">
          <div className="user-sidebar-cover" />
          <div className="user-avatar">{getInitials(profile.fullName)}</div>
          <div className="user-profile-summary">
            <h1>{profile?.fullName || ''}</h1>
            <p>{profile.profession}</p>
            <div className="user-valid-badge">
              <Icon name="check" size={11} />
              Anggota Valid
            </div>
          </div>

          <div className="user-sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`user-sidebar-link ${activeTab === item.id ? 'is-active' : ''}`}
                onClick={() => handleTabChange(item.id)}
              >
                <Icon name={item.id === 'profil' ? 'user' : item.id === 'jadwal' ? 'calendar' : 'badge'} size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="user-content">
          <div className="user-welcome-banner">
            <div>
              <h2>HALO, {profile.fullName.toUpperCase()}!</h2>
              <p>
                Selamat datang di dashboard Anda. Pantau terus jadwal kegiatan mendatang dan pastikan data diri
                valid untuk administrasi.
              </p>
            </div>
            <div className="user-banner-avatar">
              <Icon name="user" size={42} />
            </div>
          </div>

          {activeTab === 'profil' && renderProfileTab()}
          {activeTab === 'jadwal' && renderScheduleTab()}
          {activeTab === 'sertifikat' && renderCertificateTab()}
        </section>
      </main>

      {activeTicket && (
        <div className="user-ticket-overlay" onClick={(event) => event.target === event.currentTarget && setActiveTicket(null)}>
          <div className="user-ticket-modal">
            <button type="button" className="user-ticket-close" onClick={() => setActiveTicket(null)} aria-label="Tutup tiket">
              <Icon name="x" size={14} />
            </button>

            <div className="user-ticket-head">
              <span>E-Ticket Resmi INKINDO Jatim</span>
              <h3>{activeTicket.ticketTitle}</h3>
            </div>

            <div className="user-ticket-body">
              <div className="user-ticket-qr">
                <div className="user-ticket-qr-box">
                  {activeTicket.qrUrl ? (
                    <img src={activeTicket.qrUrl} alt="QR Code Tiket" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div className="user-ticket-qr-grid" />
                  )}
                </div>
              </div>

              <div className="user-ticket-code">
                <small>Manual Entry Code</small>
                <strong>{activeTicket.ticketCode}</strong>
              </div>

              <div className="user-ticket-person">
                <div className="user-ticket-person-icon">
                  <Icon name="user" size={18} />
                </div>
                <div>
                  <small>Nama Peserta</small>
                  <strong>{profile.fullName.toUpperCase()}</strong>
                </div>
              </div>

              <div className="user-ticket-meta">
                <div>
                  <small>Kategori</small>
                  <span>{activeTicket.ticketCategory}</span>
                </div>
                <div>
                  <small>Instansi</small>
                  <span>{profile.company}</span>
                </div>
              </div>

              <div className="user-ticket-actions">
                <button
                  type="button"
                  onClick={() => showToast('info', 'Mengunduh PDF', 'E-ticket sedang diproses untuk diunduh.')}
                >
                  <Icon name="file" size={15} />
                  Unduh PDF
                </button>
                <button
                  type="button"
                  onClick={() => showToast('info', 'Mengirim tiket', 'Tiket akan dikirim ke WhatsApp dan email Anda.')}
                >
                  <Icon name="send" size={15} />
                  Kirim WA/Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`user-toast user-toast-${toast.type}`}>
          <div className="user-toast-icon">
            <Icon name={toast.type === 'success' ? 'check' : toast.type === 'error' ? 'x' : 'info'} size={14} />
          </div>
          <div>
            <strong>{toast.title}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
