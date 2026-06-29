import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState('member');
  const [authMode, setAuthMode] = useState('login');
  
  // Form login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  
  // Form registrasi state
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [registerErrors, setRegisterErrors] = useState({});
  const [sessionRole, setSessionRole] = useState(() => window.sessionStorage.getItem('inkindo-auth-role'));

  const navigate = useNavigate();

  const getDashboardRoute = (role) => (role === 'admin' ? '/dashboard' : '/dashboard-user');

  // Deteksi scroll untuk efek shadow pada navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (!isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    document.body.style.overflow = '';
  };

  // Handle login button click
  const handleLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', phone: '', password: '' });
    setLoginErrors({});
    setRegisterErrors({});
  };

  // Validasi login
  const validateLogin = () => {
    const errors = {};
    if (!loginForm.email.trim()) {
      errors.email = 'Email/Username harus diisi';
    } else if (authRole === 'member' && !loginForm.email.includes('@')) {
      errors.email = 'Format email tidak valid';
    }
    if (!loginForm.password.trim()) {
      errors.password = 'Kata sandi harus diisi';
    } else if (loginForm.password.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validasi registrasi
  const validateRegister = () => {
    const errors = {};
    if (!registerForm.name.trim()) {
      errors.name = 'Nama lengkap harus diisi';
    }
    if (!registerForm.email.trim()) {
      errors.email = 'Email harus diisi';
    } else if (!registerForm.email.includes('@')) {
      errors.email = 'Format email tidak valid';
    }
    if (!registerForm.phone.trim()) {
      errors.phone = 'Nomor telepon harus diisi';
    } else if (!/^[+\d\s-]+$/.test(registerForm.phone)) {
      errors.phone = 'Nomor telepon hanya boleh angka';
    }
    if (!registerForm.password.trim()) {
      errors.password = 'Kata sandi harus diisi';
    } else if (registerForm.password.length < 8) {
      errors.password = 'Kata sandi minimal 8 karakter';
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit login
  const handleLoginSubmit = async () => {
    if (validateLogin()) {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: loginForm.email,
          password: loginForm.password
        });
        
        if (response.data.success) {
          const user = response.data.data;
          const token = response.data.token;
          
          localStorage.setItem('authToken', token);
          localStorage.setItem('authUser', JSON.stringify(user));
          window.sessionStorage.setItem('inkindo-auth-role', user.role);
          
          setSessionRole(user.role);
          closeAuthModal();
          navigate(getDashboardRoute(user.role));
        } else {
          alert(response.data.message || 'Login gagal!');
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Email atau Kata Sandi salah!');
      }
    }
  };

  // Handle submit registrasi
  const handleRegisterSubmit = async () => {
    if (validateRegister()) {
      try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
          name: registerForm.name,
          email: registerForm.email,
          phone: registerForm.phone,
          password: registerForm.password
        });
        
        if (response.data.success) {
          alert('Registrasi Berhasil! Silakan masuk ke akun Anda.');
          // Auto login:
          try {
            const loginRes = await axios.post(`${API_BASE_URL}/login`, {
              email: registerForm.email,
              password: registerForm.password
            });
            if (loginRes.data.success) {
              const user = loginRes.data.data;
              const token = loginRes.data.token;
              
              localStorage.setItem('authToken', token);
              localStorage.setItem('authUser', JSON.stringify(user));
              window.sessionStorage.setItem('inkindo-auth-role', user.role);
              
              setSessionRole(user.role);
              closeAuthModal();
              navigate(getDashboardRoute(user.role));
              return;
            }
          } catch (loginErr) {
            console.error('Auto login failed:', loginErr);
          }
          
          // Fallback to login mode
          setAuthMode('login');
          setLoginForm({ email: registerForm.email, password: '' });
        } else {
          alert(response.data.message || 'Registrasi gagal!');
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
      }
    }
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
    setSessionRole(null);
    navigate('/');
  };

  const overlayClose = (e) => {
    if (e.target.className === 'auth-overlay') {
      closeAuthModal();
    }
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeDrawer();
  };

  return (
    <>
      {/* Navbar Utama */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${sessionRole ? 'logged-in' : ''}`}>
        {/* Logo */}
        <a className="nav-logo" href="#">
          <img
            src={`${import.meta.env.BASE_URL || '/'}logoinkindo.png`}
            alt="Logo"
            className="nav-logo-img"
            onError={(e) => (e.target.style.display = 'none')}
          />
          <div className="nav-logo-text">
            <div className="t1">
              INKINDO
              <br />
              JAWA TIMUR
            </div>
            <div className="t2">Event Hub</div>
          </div>
        </a>

        {/* Menu Links (Desktop) */}
        <ul className="nav-links">
          <li>
            <a href="#home" onClick={(event) => {
              event.preventDefault();
              scrollToSection('home');
            }}>Home</a>
          </li>
          <li>
            <a href="#events" onClick={(event) => {
              event.preventDefault();
              scrollToSection('events');
            }}>Events</a>
          </li>
          <li>
            <a href="#calendar" onClick={(event) => {
              event.preventDefault();
              scrollToSection('calendar');
            }}>Calendar</a>
          </li>
          <li>
            <a href="#contact" onClick={(event) => {
              event.preventDefault();
              scrollToSection('contact');
            }}>Contact Us</a>
          </li>
        </ul>

        {/* Right Section */}
        <div className="nav-right">
          {/* Login / Dashboard Button (Desktop) */}
          {sessionRole ? (
            <div className="nav-auth desktop-only">
              <button
                className="btn-masuk"
                onClick={() => navigate(getDashboardRoute(sessionRole))}
                aria-label="Dashboard"
              >
                Dashboard
              </button>
              <button
                className="btn-logout"
                onClick={handleLogout}
                aria-label="Keluar"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              className="btn-masuk desktop-only"
              onClick={handleLogin}
              aria-label="Login"
            >
              {/* SVG Icon */}
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Masuk / Daftar
            </button>
          )}

          {/* Hamburger Button (Mobile) */}
          <button
            className={`nav-hamburger ${isDrawerOpen ? 'open' : ''}`}
            onClick={toggleDrawer}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <a href="#home" onClick={(event) => {
              event.preventDefault();
              scrollToSection('home');
            }}>
              Home
            </a>
          </li>
          <li>
            <a href="#events" onClick={(event) => {
              event.preventDefault();
              scrollToSection('events');
            }}>
              Events
            </a>
          </li>
          <li>
            <a href="#calendar" onClick={(event) => {
              event.preventDefault();
              scrollToSection('calendar');
            }}>
              Calendar
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(event) => {
              event.preventDefault();
              scrollToSection('contact');
            }}>
              Contact Us
            </a>
          </li>
        </ul>
        {sessionRole ? (
          <div className="nav-auth mobile-only">
            <button
              className="btn-masuk"
              onClick={() => {
                navigate(getDashboardRoute(sessionRole));
                closeDrawer();
              }}
            >
              Dashboard
            </button>
            <button
              className="btn-logout"
              onClick={() => {
                handleLogout();
                closeDrawer();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            className="btn-masuk"
            onClick={() => {
              handleLogin();
              closeDrawer();
            }}
          >
            Masuk / Daftar
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════
           AUTH MODAL
      ═══════════════════════════════════ */}
      {isAuthModalOpen && (
        <div className="auth-overlay" onClick={overlayClose}>
          <div className="auth-box">
            <button className="auth-close" onClick={closeAuthModal}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="auth-left">
              <img src="logoinkindo.png" alt="INKINDO" className="auth-left-logo-img" />
              <div className="auth-left-title">INKINDO<br />JATIM</div>
              <div className="auth-left-sub">Event Hub</div>
              <p className="auth-left-desc">
                Akses eksklusif manajemen event, sertifikasi, dan pengembangan kompetensi konsultan Jawa Timur.
              </p>
            </div>

            <div className="auth-right">
              {authMode === 'login' ? (
                <>
                  <h2 className="auth-title">Masuk ke Akun</h2>
                  <p className="auth-sub">Gunakan akun yang sudah terdaftar pada sistem INKINDO Jatim Event Hub</p>

                  <div className="auth-tabs">
                    <button
                      className={`auth-tab ${authRole === 'member' ? 'active' : ''}`}
                      onClick={() => setAuthRole('member')}
                    >
                      ANGGOTA
                    </button>
                    <button
                      className={`auth-tab ${authRole === 'admin' ? 'active' : ''}`}
                      onClick={() => setAuthRole('admin')}
                    >
                      ADMINISTRATOR
                    </button>
                  </div>

                  <div className="auth-form-container">
                    <div className="auth-input-group">
                      <label>{authRole === 'member' ? 'EMAIL TERDAFTAR' : 'EMAIL/USERNAME ADMIN'}</label>
                      <input 
                        type={authRole === 'member' ? 'email' : 'text'} 
                        placeholder="Type here..." 
                        value={loginForm.email}
                        onChange={(e) => {
                          setLoginForm({ ...loginForm, email: e.target.value });
                          if (loginErrors.email) setLoginErrors({ ...loginErrors, email: '' });
                        }}
                      />
                      {loginErrors.email && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{loginErrors.email}</span>}
                    </div>
                    
                    <div className="auth-input-group">
                      <label>KATA SANDI</label>
                      <input 
                        type="password" 
                        placeholder="Type here..." 
                        value={loginForm.password}
                        onChange={(e) => {
                          setLoginForm({ ...loginForm, password: e.target.value });
                          if (loginErrors.password) setLoginErrors({ ...loginErrors, password: '' });
                        }}
                      />
                      {loginErrors.password && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{loginErrors.password}</span>}
                    </div>

                    <div className="auth-form-row">
                      <label className="auth-checkbox">
                        <input type="checkbox" />
                        <span>INGAT SAYA</span>
                      </label>
                      <button className="auth-link">Lupa Sandi?</button>
                    </div>

                    <button 
                      className="auth-submit-btn"
                      onClick={handleLoginSubmit}
                      disabled={!loginForm.email || !loginForm.password}
                      style={{ opacity: (!loginForm.email || !loginForm.password) ? 0.5 : 1, cursor: (!loginForm.email || !loginForm.password) ? 'not-allowed' : 'pointer' }}
                    >
                      MASUK
                    </button>

                    <div className="auth-footer">
                      <span className="auth-footer-text">Belum memiliki akun?</span>
                      <button className="auth-link" onClick={() => {
                        setAuthMode('register');
                        setLoginErrors({});
                      }}>Daftar</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="auth-title">Registrasi Akun</h2>
                  <p className="auth-sub">Lengkapi data valid Anda untuk proses verifikasi otomatis.</p>

                  <div className="auth-form-container">
                    <div className="auth-input-group">
                      <label>NAMA LENGKAP</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={registerForm.name}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, name: e.target.value });
                          if (registerErrors.name) setRegisterErrors({ ...registerErrors, name: '' });
                        }}
                      />
                      {registerErrors.name && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{registerErrors.name}</span>}
                    </div>

                    <div className="auth-input-group">
                      <label>EMAIL</label>
                      <input 
                        type="email" 
                        placeholder="admin@inkindo.org" 
                        value={registerForm.email}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, email: e.target.value });
                          if (registerErrors.email) setRegisterErrors({ ...registerErrors, email: '' });
                        }}
                      />
                      {registerErrors.email && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{registerErrors.email}</span>}
                    </div>
                    
                    <div className="auth-input-group">
                      <label>NOMOR TELEPON</label>
                      <input 
                        type="tel" 
                        placeholder="*********" 
                        value={registerForm.phone}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, phone: e.target.value });
                          if (registerErrors.phone) setRegisterErrors({ ...registerErrors, phone: '' });
                        }}
                      />
                      {registerErrors.phone && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{registerErrors.phone}</span>}
                    </div>

                    <div className="auth-input-group">
                      <label>BUAT KATA SANDI</label>
                      <input 
                        type="password" 
                        placeholder="Minimal 8 karakter kombinasi" 
                        value={registerForm.password}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, password: e.target.value });
                          if (registerErrors.password) setRegisterErrors({ ...registerErrors, password: '' });
                        }}
                      />
                      {registerErrors.password && <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{registerErrors.password}</span>}
                    </div>

                    <button 
                      className="auth-submit-btn"
                      onClick={handleRegisterSubmit}
                      disabled={!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.password}
                      style={{ opacity: (!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.password) ? 0.5 : 1, cursor: (!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.password) ? 'not-allowed' : 'pointer' }}
                    >
                      Registrasi Akun Baru
                    </button>

                    <div className="auth-footer">
                      <span className="auth-footer-text">Sudah memiliki akun?</span>
                      <button className="auth-link" onClick={() => {
                        setAuthMode('login');
                        setRegisterErrors({});
                      }}>Masuk disini</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
