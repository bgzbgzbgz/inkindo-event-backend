import './Footer.css';

function Footer() {
  // SVG Icons
  const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const TwitterIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.953 4.57a10 10 0 002.856-3.515 9.953 9.953 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.458" y="2.458" width="19.084" height="19.084" rx="4.27" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3.846" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="18.406" cy="5.594" r="0.896" fill="currentColor"/>
    </svg>
  );

  const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.437-.103.25-.129.599-.129.949v5.419h-3.554s.05-8.736 0-9.643h3.554v1.364c.429-.646 1.199-1.538 2.914-1.538 2.129 0 3.723 1.395 3.723 4.396v5.421zM5.337 6.556a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zm1.754 13.896H3.582V8.809h3.509v11.643zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  return (
    <footer className="footer">
      <div className="footer-wrapper">
        <div className="footer-container">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-box">
              <img src="logoinkindo.png" alt="INKINDO" className="logo-image" />
            </div>
            <div className="logo-text">
              <h2 className="logo-title">INKINDO</h2>
              <p className="logo-description">
                Ikatan Nasional Konsultan Indonesia (INKINDO) berkomitmen untuk meningkatkan kualitas jasa konsultansi melalui edukasi dan kolaborasi profesional.
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="footer-nav">
            <a href="#home" className="nav-link">Home</a>
            <a href="#events" className="nav-link">Events</a>
            <a href="#calendar" className="nav-link">Calendar</a>
            <a href="#contact" className="nav-link">Contact us</a>
          </nav>

          {/* Social Media Section */}
          <div className="social-media-container">
            <a href="https://facebook.com" className="social-icon facebook" title="Facebook" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" className="social-icon twitter" title="Twitter" target="_blank" rel="noopener noreferrer">
              <TwitterIcon />
            </a>
            <a href="https://instagram.com" className="social-icon instagram" title="Instagram" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
            <a href="https://linkedin.com" className="social-icon linkedin" title="LinkedIn" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon />
            </a>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Copyright Section */}
          <div className="copyright-section">
            <p className="copyright-text">Copyright © 2026 INKINDO | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
