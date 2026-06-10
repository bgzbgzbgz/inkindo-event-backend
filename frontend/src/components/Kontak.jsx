import React, { useState } from 'react';
import './Kontak.css';

const Kontak = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    noHp: '',
    kategori: '',
    pesan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending message (1.5 second delay)
    setTimeout(() => {
      setShowSuccess(true);
      setFormData({
        nama: '',
        email: '',
        noHp: '',
        kategori: '',
        pesan: ''
      });
      setIsSubmitting(false);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact">
      <div className="contact-inner">
        <div className="contact-grid">
          
          {/* Left Column: Contact Information */}
          <div className="contact-left">
            <div className="section-tag">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Hubungi Kami
            </div>
            <h2 className="contact-title">Mari Terhubung dengan INKINDO Jatim.</h2>
            <p className="contact-sub">Punya pertanyaan seputar keanggotaan, pendaftaran event, atau kemitraan? Tim kami siap membantu Anda pada jam kerja operasional.</p>
            
            <div className="contact-list">
              
              {/* Address Item */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="contact-details">
                  <h4>Kantor Sekretariat</h4>
                  <p>Jl. Raya Rungkut Madya No.XXX<br />Surabaya, Jawa Timur 60293</p>
                </div>
              </div>

              {/* Email Item */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <div className="contact-details">
                  <h4>Email Resmi</h4>
                  <p>sekretariat@inkindojatim.org<br />support.event@inkindojatim.org</p>
                </div>
              </div>

              {/* Phone Item */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="contact-details">
                  <h4>Layanan Telepon</h4>
                  <p>(031) 8765 4321<br />Senin - Jumat, 08.00 - 16.00 WIB</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-right">
            <h3 className="form-title">Kirim Pesan Langsung</h3>
            
            {/* Success Notification */}
            {showSuccess && (
              <div className="success-msg">
                Pesan Anda berhasil dikirim! Kami akan segera merespon.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nama">Nama Lengkap</label>
                  <input
                    type="text"
                    id="nama"
                    className="form-control"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Alamat Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="noHp">No. HP / WA</label>
                  <input
                    type="tel"
                    id="noHp"
                    className="form-control"
                    placeholder="08xxx-xxxx-xxxx"
                    value={formData.noHp}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="kategori">Kategori Topik</label>
                  <select
                    id="kategori"
                    className="form-control"
                    value={formData.kategori}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih kategori...</option>
                    <option value="pertanyaan-umum">Pertanyaan umum</option>
                    <option value="seputar-event">Seputar Event</option>
                    <option value="kendala-pendaftaran">Kendala Pendaftaran</option>
                    <option value="sponsorship">Sponsorship & Kerjasama</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pesan">Pesan Anda</label>
                <textarea
                  id="pesan"
                  className="form-control"
                  placeholder="Tulis pertanyaan atau pesan Anda di sini..."
                  value={formData.pesan}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-kirim"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Kontak;