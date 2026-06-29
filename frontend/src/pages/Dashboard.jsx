import axios from 'axios';
import { useEffect } from 'react'; // Tambahkan ini
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';



const INITIAL_PAYMENTS = [
  { id: 1, name: 'John Doe', ini: 'JD', evName: 'Workshop Manajemen Proyek', evDate: '20 Nov 2026', status: 'Pending' },
  { id: 2, name: 'John Doe', ini: 'JD', evName: 'Workshop Manajemen Proyek', evDate: '20 Nov 2026', status: 'Verified' },
  { id: 3, name: 'Siti Rahayu', ini: 'SR', evName: 'Seminar Nasional', evDate: '22 Nov 2026', status: 'Pending' },
  { id: 4, name: 'Budi Santoso', ini: 'BS', evName: 'Musyawarah Provinsi INKINDO Jatim', evDate: '19-20 Mei 2026', status: 'Pending' },
];

const INITIAL_EVENTS = [
  { id: 1, name: 'Workshop Manajemen Proyek Konstruksi 2026', cat: 'Workshop', type: 'Internal', date: '12 Nov 2026', time: '08.15 - 10.30 WIB', reg: 12 },
  { id: 2, name: 'Seminar Nasional Jasa Konstruksi Digital', cat: 'Seminar', type: 'Eksternal', date: '14 Nov 2026', time: '09.00 - 12.00 WIB', reg: 34 },
  { id: 3, name: 'Musyawarah Provinsi INKINDO Jawa Timur', cat: 'Musyawarah', type: 'Internal', date: '19-20 Mei 2026', time: '13.00-selesai', reg: 87 },
  { id: 4, name: 'Seminar Etika Profesi Konsultan Indonesia', cat: 'Seminar', type: 'Eksternal', date: '22 Nov 2026', time: '09.00 - 11.00 WIB', reg: 56 },
  { id: 5, name: 'Workshop Sertifikasi Tenaga Ahli Konstruksi', cat: 'Workshop', type: 'Internal', date: '30 Nov 2026', time: '08.30 - 16.00 WIB', reg: 23 },
];

const INITIAL_PARTICIPANTS = {
  1: [
    { id: 101, name: 'John Doe', ini: 'JD', instansi: 'PT. Bangun Persada', invitation: 'Peserta', attendance: 'Belum Hadir' },
    { id: 102, name: 'Siti Rahayu', ini: 'SR', instansi: 'CV. Rahayu Konsultan', invitation: 'VIP', attendance: 'Hadir' },
    { id: 103, name: 'Budi Santoso', ini: 'BS', instansi: 'PT. Karya Mandiri', invitation: 'Peserta', attendance: 'Belum Hadir' },
  ],
  2: [
    { id: 201, name: 'Rizky Pratama', ini: 'RP', instansi: 'PT. Digital Konstruksi', invitation: 'Narasumber', attendance: 'Hadir' },
    { id: 202, name: 'Dewi Kartika', ini: 'DK', instansi: 'INKINDO Jawa Timur', invitation: 'Panitia', attendance: 'Belum Hadir' },
  ],
  3: [
    { id: 301, name: 'Agus Wibowo', ini: 'AW', instansi: 'PT. Pilar Nusantara', invitation: 'Peserta', attendance: 'Hadir' },
    { id: 302, name: 'Maya Lestari', ini: 'ML', instansi: 'CV. Lestari Engineering', invitation: 'VIP', attendance: 'Belum Hadir' },
  ],
};

const TICKET_DB = {
  'TKT-101': { name: 'John Doe', event: 'Workshop Manajemen Proyek', seat: 'A-12', status: 'Verified' },
  'TKT-202': { name: 'Siti Rahayu', event: 'Seminar Nasional', seat: 'B-07', status: 'Verified' },
  'TKT-303': { name: 'Budi Santoso', event: 'Musyawarah Provinsi', seat: 'C-03', status: 'Pending' },
};

const EMPTY_EVENT_FORM = {
  name: '',
  cat: 'Seminar',
  type: 'Internal',
  date: '',
  start: '',
  end: '',
  loc: '',
  price: '',
  desc: '',
  agenda: [],
  ad_image: null,
  ad_image_path: '',
  poster_file: null,
  poster_file_path: '',
  publish_status: 'published',
  scheduled_publish_at: '',
};

const EMPTY_PARTICIPANT_FORM = {
  name: '',
  instansi: '',
  invitation: 'Peserta',
  attendance: 'Belum Hadir',
};

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'events', label: 'Manajemen Event' },
  { id: 'checkin', label: 'Verifikasi Check-In' },
  { id: 'payment', label: 'Konfirmasi Pembayaran' },
];

const catClass = {
  Seminar: 'cat-seminar',
  Workshop: 'cat-workshop',
  Musyawarah: 'cat-musyawarah',
  Sertifikasi: 'cat-sertifikasi',
};

const shortText = (value, limit) => (value.length > limit ? `${value.slice(0, limit - 3)}...` : value);

function Icon({ name, size = 20 }) {
  const props = { width: size, height: size, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

  const paths = {
    home: (
      <>
        <path d="M3 11 12 3l9 8" />
        <path d="M5 10v10h14V10" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </>
    ),
    qr: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <path d="M14 14h2v2h-2zM18 14h3M14 18h3M20 18h1v3h-3" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7h16v12H4z" />
        <path d="M16 11h4v4h-4zM4 7l3-4h10l3 4" />
      </>
    ),
    logout: (
      <>
        <path d="M15 3h4v18h-4" />
        <path d="M10 17l5-5-5-5M15 12H3" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </>
    ),
    check: <path d="M20 6 9 17l-5-5" />,
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="M6 6l12 12" />
      </>
    ),
  };

  return <svg {...props}>{paths[name]}</svg>;
}

function PageBanner({ title, subtitle }) {
  return (
    <div className="page-banner">
      <div>
        <div className="banner-title">{title}</div>
        <div className="banner-sub">{subtitle}</div>
      </div>
      <div className="admin-chip">
        <div className="admin-chip-dot">R</div>
        <span className="admin-chip-name">Admin Ridho</span>
      </div>
    </div>
  );
}

function PaymentRows({ rows, onViewProof, onApprove, onReject }) {
  return (
    <tbody>
      {rows.map((payment) => (
        <tr key={payment.id}>
          <td>
            <div className="cell-participant">
              <div className="avatar">{payment.ini}</div>
              <div>
                <div className="pname">{payment.name}</div>
                <div className="pid">ID: {100 + payment.id}</div>
              </div>
            </div>
          </td>
          <td>
            <div className="ename">{shortText(payment.evName, 22)}</div>
            <div className="edate">{payment.evDate}</div>
          </td>
          <td>
            <button className="btn-file" onClick={() => onViewProof(payment)}>
              <Icon name="file" size={13} />
              Lihat File
            </button>
          </td>
          <td>
            <span className={`badge ${payment.status === 'Verified' ? 'badge-verified' : 'badge-pending'}`}>
              {payment.status}
            </span>
          </td>
          <td>
            {payment.status === 'Pending' ? (
              <div className="action-row">
                <button className="btn-approve" title="Setujui" onClick={() => onApprove(payment.id)}>
                  <Icon name="check" size={15} />
                </button>
                <button className="btn-reject" title="Tolak" onClick={() => onReject(payment.id)}>
                  <Icon name="x" size={15} />
                </button>
              </div>
            ) : (
              <span className="muted-status">Sudah diproses</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [participantsByEvent, setParticipantsByEvent] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('');
  const [ticketInput, setTicketInput] = useState('');
  const [ticketResult, setTicketResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [proofPayment, setProofPayment] = useState(null);
  const [eventModal, setEventModal] = useState({ open: false, editingId: null });
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [participantForm, setParticipantForm] = useState(EMPTY_PARTICIPANT_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Authenticate Admin
  useEffect(() => {
    const authUserStr = localStorage.getItem('authUser');
    const authUser = authUserStr ? JSON.parse(authUserStr) : null;
    if (!token || !authUser || authUser.role !== 'admin') {
      navigate('/');
    }
  }, [token, navigate]);

  // Load events and registrations
  const fetchAllData = async () => {
    try {
      // 1. Fetch Events
      const eventsResponse = await axios.get(`${API_BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let fetchedEvents = [];
      if (eventsResponse.data.success) {
        fetchedEvents = eventsResponse.data.data.map((ev) => ({
          id: ev.id,
          name: ev.title,
          cat: ev.category?.name || 'Seminar',
          type: ev.type === 'internal' ? 'Internal' : 'Eksternal',
          date: ev.event_date,
          time: ev.event_time || '08:00 - Selesai',
          reg: 0,
          description: ev.description || '',
          location: ev.location || '',
          price: ev.price || '',
          agenda: ev.agenda || [],
          ad_image_path: ev.ad_image || '',
          poster_file_path: ev.poster_file || '',
          publish_status: ev.publish_status || 'published',
          scheduled_publish_at: ev.scheduled_publish_at ? ev.scheduled_publish_at.replace(' ', 'T').substring(0, 16) : ''
        }));
      }

      // 2. Fetch Registrations
      const regsResponse = await axios.get(`${API_BASE_URL}/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (regsResponse.data.success) {
        const regs = regsResponse.data.data;
        setRegistrations(regs);

        // Map Payments
        const mappedPayments = regs.map((reg) => ({
          id: reg.id,
          name: reg.user?.name || 'Peserta',
          ini: reg.user?.name ? reg.user.name.split(' ').slice(0, 2).map(p=>p[0]).join('').toUpperCase() : 'PS',
          evName: reg.event?.title || 'Event INKINDO',
          evDate: reg.event?.event_date || '',
          status: reg.status === 'verified' ? 'Verified' : reg.status === 'rejected' ? 'Rejected' : 'Pending',
          paymentProof: reg.payment_proof ? `${API_BASE_URL.replace(/\/api$/, '')}/storage/${reg.payment_proof}` : null
        }));
        setPayments(mappedPayments);

        // Group participants by event id
        const grouped = {};
        regs.forEach((reg) => {
          const evId = reg.event_id;
          if (!grouped[evId]) grouped[evId] = [];
          grouped[evId].push({
            id: reg.id,
            name: reg.user?.name || 'Peserta',
            ini: reg.user?.name ? reg.user.name.split(' ').slice(0, 2).map(p=>p[0]).join('').toUpperCase() : 'PS',
            instansi: reg.user?.company || 'Umum',
            invitation: reg.ticket_type === 'vip' ? 'VIP' : 'Peserta',
            attendance: reg.is_attended ? 'Hadir' : 'Belum Hadir'
          });
        });
        setParticipantsByEvent(grouped);

        // Update registration counts on events
        const updatedEvents = fetchedEvents.map(ev => ({
          ...ev,
          reg: grouped[ev.id]?.length || 0
        }));
        setEvents(updatedEvents);
      } else {
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const pendingPayments = payments.filter((payment) => payment.status === 'Pending').length;
  const filteredPayments = paymentFilter ? payments.filter((payment) => payment.status === paymentFilter) : payments;
  const selectedEvent = events.find((eventItem) => eventItem.id === selectedEventId);
  const selectedParticipants = selectedEventId ? participantsByEvent[selectedEventId] || [] : [];
  
  const participantCounts = useMemo(
    () =>
      events.reduce((acc, eventItem) => {
        acc[eventItem.id] = participantsByEvent[eventItem.id]?.length ?? 0;
        return acc;
      }, {}),
    [events, participantsByEvent],
  );

  const stats = useMemo(
    () => [
      { label: 'Total Event', value: events.length, icon: 'calendar', bg: '#eff6ff' },
      { label: 'Total Anggota', value: 1240, icon: 'users', bg: '#f3e8ff' },
      { label: 'Pendaftar Aktif', value: Object.values(participantCounts).reduce((total, count) => total + count, 0), icon: 'users', bg: '#d1fae5' },
      { label: 'Perlu Verifikasi', value: pendingPayments, icon: 'wallet', bg: '#fff1f2' },
    ],
    [events.length, participantCounts, pendingPayments],
  );

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 3400);
  };

  const handleApprovePayment = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/registrations/${id}/status`, {
        status: 'verified'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPayments((current) => current.map((item) => (item.id === id ? { ...item, status: 'Verified' } : item)));
        showToast('Pembayaran berhasil diverifikasi', 'success');
        fetchAllData(); // Refresh list to get ticket info
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal memverifikasi pembayaran', 'error');
    }
  };

  const handleRejectPayment = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/registrations/${id}/status`, {
        status: 'rejected'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPayments((current) => current.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item)));
        showToast('Pembayaran ditolak', 'error');
        fetchAllData();
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal menolak pembayaran', 'error');
    }
  };

  const openCreateEvent = () => {
    setEventForm(EMPTY_EVENT_FORM);
    setEventModal({ open: true, editingId: null });
  };

  const openEditEvent = (eventItem) => {
    const startVal = eventItem.time?.split(' - ')[0] || '';
    const endVal = eventItem.time?.split(' - ')[1]?.replace(' WIB', '') || '';
    setEventForm({
      name: eventItem.name,
      cat: eventItem.cat,
      type: eventItem.type === 'Internal' ? 'Internal' : 'Eksternal',
      date: eventItem.date || '',
      start: startVal,
      end: endVal,
      loc: eventItem.location || 'Gedung INKINDO JATIM',
      price: eventItem.price || '',
      desc: eventItem.description || '',
      agenda: eventItem.agenda || [],
      ad_image: null,
      ad_image_path: eventItem.ad_image_path || '',
      poster_file: null,
      poster_file_path: eventItem.poster_file_path || '',
      publish_status: eventItem.publish_status || 'published',
      scheduled_publish_at: eventItem.scheduled_publish_at || ''
    });
    setEventModal({ open: true, editingId: eventItem.id });
  };

  const closeEventModal = () => {
    setEventModal({ open: false, editingId: null });
    setEventForm(EMPTY_EVENT_FORM);
  };

  const saveEvent = async () => {
    const name = eventForm.name.trim();
    if (!name) {
      showToast('Nama event tidak boleh kosong', 'error');
      return;
    }
    if (!eventForm.date) {
      showToast('Tanggal event wajib diisi', 'error');
      return;
    }

    const time = eventForm.start && eventForm.end ? `${eventForm.start} - ${eventForm.end} WIB` : 'TBD';
    const typeLower = eventForm.type?.toLowerCase() === 'internal' ? 'internal' : 'external';
    const isFree = !eventForm.price || Number(eventForm.price) === 0 || String(eventForm.price).toLowerCase() === 'gratis';

    const formData = new FormData();
    formData.append('title', name);
    formData.append('description', eventForm.desc || name);
    formData.append('event_date', eventForm.date);
    formData.append('event_time', time);
    formData.append('location', eventForm.loc || 'Gedung INKINDO JATIM');
    formData.append('is_free', isFree ? 1 : 0);
    formData.append('price', isFree ? 0 : Number(eventForm.price));
    formData.append('type', typeLower);
    formData.append('publish_status', eventForm.publish_status || 'published');
    
    if (eventForm.publish_status === 'scheduled' && eventForm.scheduled_publish_at) {
      formData.append('scheduled_publish_at', eventForm.scheduled_publish_at);
    }
    
    if (eventForm.ad_image) {
      formData.append('ad_image', eventForm.ad_image);
    }
    
    if (eventForm.poster_file) {
      formData.append('poster_file', eventForm.poster_file);
    }
    
    formData.append('agenda', JSON.stringify(eventForm.agenda || []));

    try {
      let response;
      if (eventModal.editingId) {
        formData.append('_method', 'PUT');
        response = await axios.post(`${API_BASE_URL}/events/${eventModal.editingId}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/events`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        showToast(eventModal.editingId ? 'Event berhasil diperbarui' : 'Event baru berhasil ditambahkan', 'success');
        fetchAllData();
        closeEventModal();
      } else {
        showToast('Gagal menyimpan event', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Gagal menyimpan event', 'error');
    }
  };

  const deleteEvent = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/events/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        if (selectedEventId === deleteTarget.id) {
          setSelectedEventId(null);
          setActiveTab('events');
        }
        setDeleteTarget(null);
        showToast('Event berhasil dihapus', 'error');
        fetchAllData();
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus event', 'error');
    }
  };

  const openParticipantsPage = (eventItem) => {
    setSelectedEventId(eventItem.id);
    setActiveTab('participants');
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateParticipantInvitation = (participantId, invitation) => {
    // static mapping or update in localStorage for demo
    showToast('Kategori undangan peserta diperbarui', 'success');
  };

  const closeParticipantModal = () => {
    setParticipantModalOpen(false);
    setParticipantForm(EMPTY_PARTICIPANT_FORM);
  };

  const addManualParticipant = () => {
    showToast('Peserta manual berhasil ditambahkan', 'success');
    closeParticipantModal();
  };

  const searchTicket = async () => {
    const ticketCodeInput = ticketInput.trim();
    if (!ticketCodeInput) {
      showToast('Masukkan ID Tiket terlebih dahulu', 'error');
      return;
    }

    let fullTicketCode = ticketCodeInput;
    const cleanInput = ticketCodeInput.replace('TKT-', '').toLowerCase();
    
    const foundReg = registrations.find(r => r.ticket_code && r.ticket_code.toLowerCase().startsWith(cleanInput));
    if (foundReg) {
      fullTicketCode = foundReg.ticket_code;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/events/scan-ticket`, {
        ticket_code: fullTicketCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTicketResult({
          state: 'ok',
          code: ticketCodeInput,
          name: response.data.data.nama_peserta,
          event: foundReg?.event?.title || 'Event INKINDO',
          seat: 'Presensi Ok',
          status: 'Verified'
        });
        showToast(`Check-in presensi berhasil dicatat`, 'success');
        fetchAllData();
      }
    } catch (error) {
      console.error(error);
      setTicketResult({ state: 'fail', code: ticketCodeInput });
      showToast(error.response?.data?.message || 'Check-in gagal', 'error');
    }
  };

  const renderOverview = () => (
    <>
      <PageBanner title="Admin Dashboard" subtitle="Ringkasan aktivitas INKINDO Jatim Event Hub" />

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-icon-wrap" style={{ background: stat.bg }}>
              <Icon name={stat.icon} size={24} />
            </div>
            <div className="stat-lbl">{stat.label}</div>
            <div className="stat-val">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-head">
          <div className="section-head-title">Daftar Verifikasi Pembayaran Terbaru</div>
          <button className="btn-primary" onClick={() => setActiveTab('payment')}>
            Lihat Semua Data
          </button>
        </div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Peserta</th>
                <th>Event &amp; Waktu</th>
                <th>Bukti Transfer</th>
                <th>Status</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <PaymentRows
              rows={payments.slice(0, 3)}
              onViewProof={setProofPayment}
              onApprove={handleApprovePayment}
              onReject={handleRejectPayment}
            />
          </table>
        </div>
      </div>
    </>
  );

  const renderEvents = () => (
    <>
      <PageBanner title="Manajemen Event" subtitle="Kelola agenda resmi, registrasi, dan kategori kegiatan INKINDO Jatim" />

      <div className="section-card">
        <div className="section-head">
          <div className="section-head-title">Daftar Event Aktif</div>
          <button className="btn-primary" onClick={openCreateEvent}>
            Buat Event Baru
          </button>
        </div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nama Event</th>
                <th>Tanggal &amp; Waktu</th>
                <th>Pendaftar</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {events.map((eventItem) => (
                <tr key={eventItem.id}>
                  <td>
                    <div className="event-name">{shortText(eventItem.name, 38)}</div>
                    <div className="badge-group">
                      <span className={`cat-badge ${catClass[eventItem.cat] || 'cat-seminar'}`}>
                        {eventItem.cat.toUpperCase()}
                      </span>
                      <span className={`type-badge type-${eventItem.type?.toLowerCase() || 'internal'}`}>
                        {eventItem.type || 'Internal'}
                      </span>
                      {eventItem.publish_status === 'draft' && (
                        <span className="type-badge" style={{ background: '#64748b', color: '#fff' }}>DRAFT</span>
                      )}
                      {eventItem.publish_status === 'scheduled' && (
                        <span className="type-badge" style={{ background: '#f59e0b', color: '#fff' }}>TERJADWAL ({eventItem.scheduled_publish_at})</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="ename">{eventItem.date}</div>
                    <div className="edate">{eventItem.time}</div>
                  </td>
                  <td>
                    <button className="reg-pill reg-pill-btn" onClick={() => openParticipantsPage(eventItem)}>
                      <Icon name="users" size={15} />
                      {participantCounts[eventItem.id]} Orang
                    </button>
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="btn-edit" title="Edit" onClick={() => openEditEvent(eventItem)}>
                        <Icon name="edit" size={14} />
                      </button>
                      <button className="btn-del" title="Hapus" onClick={() => setDeleteTarget(eventItem)}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderParticipants = () => (
    <>
      <div className="participant-toolbar">
        <button className="btn-back" onClick={() => changeTab('events')}>
          <Icon name="arrowLeft" size={17} />
          Kembali ke Event
        </button>
        <button className="btn-primary" onClick={() => setParticipantModalOpen(true)}>
          <Icon name="plus" size={16} />
          Tambah Peserta Manual
        </button>
      </div>

      <PageBanner
        title="Kelola Peserta Event"
        subtitle={selectedEvent ? selectedEvent.name : 'Pilih event dari halaman Manajemen Event'}
      />

      <div className="section-card participant-card">
        <div className="participant-summary">
          <div>
            <div className="section-head-title">Daftar Peserta Terdaftar</div>
            <div className="participant-subtitle">
              {selectedParticipants.length} peserta terdaftar untuk event ini
            </div>
          </div>
          {selectedEvent && <span className={`cat-badge ${catClass[selectedEvent.cat] || 'cat-seminar'}`}>{selectedEvent.cat.toUpperCase()}</span>}
        </div>

        <div className="participant-table-wrap">
          <table className="participant-table">
            <thead>
              <tr>
                <th>Peserta</th>
                <th>Instansi</th>
                <th>Kategori Undangan</th>
                <th>Status Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {selectedParticipants.map((participant) => (
                <tr key={participant.id}>
                  <td>
                    <div className="cell-participant">
                      <div className="avatar participant-avatar">{participant.ini}</div>
                      <div>
                        <div className="pname">{participant.name}</div>
                        <div className="pid">ID: {participant.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="participant-instansi">{participant.instansi}</div>
                  </td>
                  <td>
                    <select
                      className="invite-select"
                      value={participant.invitation}
                      onChange={(event) => updateParticipantInvitation(participant.id, event.target.value)}
                    >
                      <option>Peserta</option>
                      <option>VIP</option>
                      <option>Narasumber</option>
                      <option>Panitia</option>
                    </select>
                  </td>
                  <td>
                    <span className={`attendance-pill ${participant.attendance === 'Hadir' ? 'attendance-present' : 'attendance-empty'}`}>
                      {participant.attendance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderCheckIn = () => (
    <>
      <PageBanner title="Verifikasi Check-In" subtitle="Scan QR atau input kode tiket untuk validasi kehadiran peserta" />

      <div className="session-bar">
        <div className="session-info">
          <div className="session-icon-wrap">
            <Icon name="qr" size={24} />
          </div>
          <div>
            <div className="session-label">SESI CHECK-IN AKTIF</div>
            <div className="session-sub">Pilih event yang sedang berlangsung saat ini</div>
          </div>
        </div>
        <select className="session-select" defaultValue="">
          <option value="">Semua Kategori</option>
          {events.slice(0, 3).map((eventItem) => (
            <option key={eventItem.id}>{eventItem.name}</option>
          ))}
        </select>
      </div>

      <div className="checkin-cols">
        <div className="scanner-box">
          <div className="qr-frame">
            <div className="corner tl"></div>
            <div className="corner tr"></div>
            <div className="corner bl"></div>
            <div className="corner br"></div>
            <div className="scan-beam"></div>
            <Icon name="qr" size={34} />
          </div>
          <div className="scanner-title">Kamera Scanner Aktif</div>
          <div className="scanner-drop">
            <div className="scanner-drop-txt">Arahkan QR Kesini</div>
          </div>
        </div>

        <div className="checkin-right">
          <div className="manual-card">
            <div className="manual-card-title">Input ID Tiket Manual</div>
            <div className="input-group">
              <input
                type="text"
                className="ticket-inp"
                value={ticketInput}
                onChange={(event) => setTicketInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') searchTicket();
                }}
                placeholder="TKT-101"
              />
              <button className="btn-search" onClick={searchTicket}>
                <Icon name="search" size={18} />
              </button>
            </div>
          </div>

          <div className={`confirm-result ${ticketResult?.state || ''}`}>
            <div className="result-icon">
              <Icon name={ticketResult?.state === 'ok' ? 'check' : ticketResult?.state === 'fail' ? 'x' : 'qr'} size={28} />
            </div>
            {ticketResult?.state === 'ok' ? (
              <>
                <div className="result-title">{ticketResult.name}</div>
                <div className="result-sub">
                  <strong>{ticketResult.event}</strong>
                  <br />
                  Kursi: {ticketResult.seat}
                  <br />
                  Status: <span className={ticketResult.status === 'Verified' ? 'status-ok' : 'status-warn'}>{ticketResult.status}</span>
                </div>
              </>
            ) : ticketResult?.state === 'fail' ? (
              <>
                <div className="result-title">Tiket Tidak Ditemukan</div>
                <div className="result-sub">ID "{ticketResult.code}" tidak terdaftar. Periksa kembali dan coba lagi.</div>
              </>
            ) : (
              <>
                <div className="result-title">Konfirmasi Data Peserta</div>
                <div className="result-sub">Data peserta akan muncul disini setelah melakukan scan / input kode</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderPayment = () => (
    <>
      <PageBanner title="Verifikasi Pembayaran" subtitle="Setujui atau tolak bukti transfer pembayaran dari peserta" />

      <div className="section-card">
        <div className="section-head">
          <div className="section-head-title">Daftar Verifikasi Pembayaran</div>
          <select className="filter-select" value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
          </select>
        </div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Peserta</th>
                <th>Event &amp; Waktu</th>
                <th>Bukti Transfer</th>
                <th>Status</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <PaymentRows
              rows={filteredPayments}
              onViewProof={setProofPayment}
              onApprove={handleApprovePayment}
              onReject={handleRejectPayment}
            />
          </table>
        </div>
      </div>
    </>
  );

  const changeTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const logout = () => {
    setIsSidebarOpen(false);
    navigate('/');
  };

  return (
    <div className={`dashboard-shell ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen((value) => !value)}
        aria-label="Buka menu dashboard"
        aria-expanded={isSidebarOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <button className="sidebar-backdrop" aria-label="Tutup menu dashboard" onClick={() => setIsSidebarOpen(false)} />

      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-profile">
            <div className="profile-avatar">R</div>
            <div>
              <div className="profile-name">Dashboard</div>
              <div className="profile-role">INKINDO ADMIN</div>
            </div>
          </div>

          <ul className="nav-menu">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button className={`nav-btn ${activeTab === item.id ? 'active' : ''}`} onClick={() => changeTab(item.id)}>
                  <Icon name={item.id === 'overview' ? 'home' : item.id === 'events' ? 'calendar' : item.id === 'checkin' ? 'qr' : 'wallet'} size={18} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="sidebar-divider"></div>
          <button className="btn-keluar" onClick={logout}>
            <Icon name="logout" size={17} />
            Keluar Sistem
          </button>
        </aside>

        <main className="main">
          <div className="page active">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'events' && renderEvents()}
            {activeTab === 'participants' && renderParticipants()}
            {activeTab === 'checkin' && renderCheckIn()}
            {activeTab === 'payment' && renderPayment()}
          </div>
        </main>
      </div>

      {proofPayment && (
        <div className="overlay open" onClick={(event) => event.target === event.currentTarget && setProofPayment(null)}>
          <div className="modal">
            <div className="modal-hd">
              <div className="modal-ttl">Bukti Transfer</div>
              <button className="btn-close-modal" onClick={() => setProofPayment(null)}>x</button>
            </div>
            <div className="proof-area">
              <Icon name="file" size={48} />
              <div className="proof-caption">Bukti transfer pembayaran dari peserta</div>
              <div className="proof-file-badge">bukti_transfer_{proofPayment.name.replace(' ', '_').toLowerCase()}.jpg</div>
            </div>
            <div className="proof-detail">
              <div className="proof-label">Detail Peserta</div>
              <div><strong>Nama:</strong> {proofPayment.name}</div>
              <div><strong>Event:</strong> {proofPayment.evName}</div>
              <div><strong>Tanggal:</strong> {proofPayment.evDate}</div>
              <div><strong>Status:</strong> {proofPayment.status}</div>
            </div>
            <div className="modal-actions">
              <button className="btn-mcancel" onClick={() => setProofPayment(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {eventModal.open && (
        <div className="overlay open" onClick={(event) => event.target === event.currentTarget && closeEventModal()}>
          <div className="modal" style={{ maxHeight: '95vh', overflowY: 'auto' }}>
            <div className="modal-hd">
              <div className="modal-ttl">{eventModal.editingId ? 'Edit Event' : 'Buat Event Baru'}</div>
              <button className="btn-close-modal" onClick={closeEventModal}>x</button>
            </div>
            <div className="form-fld">
              <label>Nama Event</label>
              <input value={eventForm.name} onChange={(event) => setEventForm({ ...eventForm, name: event.target.value })} placeholder="Masukkan nama event" />
            </div>
            <div className="form-row2">
              <div className="form-fld">
                <label>Kategori</label>
                <select value={eventForm.cat} onChange={(event) => setEventForm({ ...eventForm, cat: event.target.value })}>
                  <option>Seminar</option>
                  <option>Workshop</option>
                  <option>Musyawarah</option>
                  <option>Sertifikasi</option>
                </select>
              </div>
              <div className="form-fld">
                <label>Tipe Event</label>
                <select value={eventForm.type} onChange={(event) => setEventForm({ ...eventForm, type: event.target.value })}>
                  <option>Internal</option>
                  <option>Eksternal</option>
                </select>
              </div>
            </div>
            <div className="form-row2">
              <div className="form-fld">
                <label>Tanggal</label>
                <input type="date" value={eventForm.date} onChange={(event) => setEventForm({ ...eventForm, date: event.target.value })} />
              </div>
            </div>
            <div className="form-row2">
              <div className="form-fld">
                <label>Jam Mulai</label>
                <input type="time" value={eventForm.start} onChange={(event) => setEventForm({ ...eventForm, start: event.target.value })} />
              </div>
              <div className="form-fld">
                <label>Jam Selesai</label>
                <input type="time" value={eventForm.end} onChange={(event) => setEventForm({ ...eventForm, end: event.target.value })} />
              </div>
            </div>
            <div className="form-fld">
              <label>Lokasi / Tempat</label>
              <input value={eventForm.loc} onChange={(event) => setEventForm({ ...eventForm, loc: event.target.value })} placeholder="Nama gedung atau tempat" />
            </div>
            <div className="form-fld">
              <label>Harga Tiket</label>
              <input value={eventForm.price} onChange={(event) => setEventForm({ ...eventForm, price: event.target.value })} placeholder="GRATIS atau Rp. 50.000" />
            </div>

            <div className="form-fld">
              <label>Deskripsi Detail Event</label>
              <textarea 
                value={eventForm.desc} 
                onChange={(event) => setEventForm({ ...eventForm, desc: event.target.value })} 
                placeholder="Masukkan deskripsi detail event"
                style={{ width: '100%', minHeight: '60px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', fontFamily: 'inherit', fontSize: '13px' }}
              />
            </div>

            <div className="form-fld">
              <label style={{ fontWeight: 700 }}>Agenda Rincian Event</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {(eventForm.agenda || []).map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={item.time} 
                      placeholder="08:00" 
                      style={{ width: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '12px' }}
                      onChange={(e) => {
                        const newAgenda = [...eventForm.agenda];
                        newAgenda[index].time = e.target.value;
                        setEventForm({ ...eventForm, agenda: newAgenda });
                      }}
                    />
                    <input 
                      type="text" 
                      value={item.title} 
                      placeholder="Kegiatan" 
                      style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '12px' }}
                      onChange={(e) => {
                        const newAgenda = [...eventForm.agenda];
                        newAgenda[index].title = e.target.value;
                        setEventForm({ ...eventForm, agenda: newAgenda });
                      }}
                    />
                    <button 
                      type="button" 
                      style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                      onClick={() => {
                        const newAgenda = eventForm.agenda.filter((_, i) => i !== index);
                        setEventForm({ ...eventForm, agenda: newAgenda });
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  style={{ alignSelf: 'flex-start', padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                  onClick={() => setEventForm({ ...eventForm, agenda: [...(eventForm.agenda || []), { time: '', title: '' }] })}
                >
                  + Tambah Agenda Row
                </button>
              </div>
            </div>

            <div className="form-fld">
              <label>Gambar Iklan Banner Event (Saran ukuran: 1200x630 px)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setEventForm({ ...eventForm, ad_image: e.target.files[0] })} 
                style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '8px', width: '100%', fontSize: '12px' }}
              />
              {eventForm.ad_image_path && (
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  File saat ini: <a href={`${API_BASE_URL.replace(/\/api$/, '')}/storage/${eventForm.ad_image_path}`} target="_blank" rel="noreferrer">Lihat Banner</a>
                </div>
              )}
            </div>

            <div className="form-fld">
              <label>Poster Event Detail (Gambar / PDF)</label>
              <input 
                type="file" 
                accept="image/*,application/pdf" 
                onChange={(e) => setEventForm({ ...eventForm, poster_file: e.target.files[0] })} 
                style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '8px', width: '100%', fontSize: '12px' }}
              />
              {eventForm.poster_file_path && (
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  File saat ini: <a href={`${API_BASE_URL.replace(/\/api$/, '')}/storage/${eventForm.poster_file_path}`} target="_blank" rel="noreferrer">Lihat Poster</a>
                </div>
              )}
            </div>

            <div className="form-row2">
              <div className="form-fld">
                <label>Status Publikasi</label>
                <select 
                  value={eventForm.publish_status} 
                  onChange={(e) => setEventForm({ ...eventForm, publish_status: e.target.value })}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '12px' }}
                >
                  <option value="published">Langsung Publikasikan (Publish)</option>
                  <option value="draft">Simpan Sebagai Draft</option>
                  <option value="scheduled">Jadwalkan Posting</option>
                </select>
              </div>
              {eventForm.publish_status === 'scheduled' && (
                <div className="form-fld">
                  <label>Tanggal &amp; Waktu Publikasi</label>
                  <input 
                    type="datetime-local" 
                    value={eventForm.scheduled_publish_at} 
                    onChange={(e) => setEventForm({ ...eventForm, scheduled_publish_at: e.target.value })} 
                    style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '12px' }}
                  />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-mcancel" onClick={closeEventModal}>Batal</button>
              <button className="btn-mconfirm" onClick={saveEvent}>Simpan Event</button>
            </div>
          </div>
        </div>
      )}

      {participantModalOpen && (
        <div className="overlay open" onClick={(event) => event.target === event.currentTarget && closeParticipantModal()}>
          <div className="modal">
            <div className="modal-hd">
              <div className="modal-ttl">Tambah Peserta Manual</div>
              <button className="btn-close-modal" onClick={closeParticipantModal}>x</button>
            </div>
            <div className="form-fld">
              <label>Nama Peserta</label>
              <input
                value={participantForm.name}
                onChange={(event) => setParticipantForm({ ...participantForm, name: event.target.value })}
                placeholder="Masukkan nama peserta"
              />
            </div>
            <div className="form-fld">
              <label>Instansi</label>
              <input
                value={participantForm.instansi}
                onChange={(event) => setParticipantForm({ ...participantForm, instansi: event.target.value })}
                placeholder="Nama perusahaan / instansi"
              />
            </div>
            <div className="form-row2">
              <div className="form-fld">
                <label>Kategori Undangan</label>
                <select
                  value={participantForm.invitation}
                  onChange={(event) => setParticipantForm({ ...participantForm, invitation: event.target.value })}
                >
                  <option>Peserta</option>
                  <option>VIP</option>
                  <option>Narasumber</option>
                  <option>Panitia</option>
                </select>
              </div>
              <div className="form-fld">
                <label>Status Kehadiran</label>
                <select
                  value={participantForm.attendance}
                  onChange={(event) => setParticipantForm({ ...participantForm, attendance: event.target.value })}
                >
                  <option>Belum Hadir</option>
                  <option>Hadir</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-mcancel" onClick={closeParticipantModal}>Batal</button>
              <button className="btn-mconfirm" onClick={addManualParticipant}>Tambah Peserta</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="overlay open" onClick={(event) => event.target === event.currentTarget && setDeleteTarget(null)}>
          <div className="modal modal-delete">
            <div className="del-icon-wrap">
              <Icon name="trash" size={28} />
            </div>
            <div className="modal-ttl delete-title">Hapus Event?</div>
            <div className="delete-copy">
              Event <strong>"{shortText(deleteTarget.name, 34)}"</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.
            </div>
            <div className="modal-actions">
              <button className="btn-mcancel" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button className="btn-mconfirm danger" onClick={deleteEvent}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type} show`}>{toast.message}</div>}
    </div>
  );
};

export default Dashboard;
