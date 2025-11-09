// frontend/src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>RepoDoc</span>
          <span style={styles.logoAccent}>.ai</span>
        </Link>
        
        <nav style={styles.nav}>
          <button onClick={toggleTheme} style={styles.themeToggle} className="aperture-theme-toggle">
            <span style={styles.themeIcon}>{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>

          {user ? (
            <>
              <span style={styles.userInfo}>{user.email}</span>
              <button onClick={handleLogout} style={styles.logoutButton} className="aperture-glass-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink} className="aperture-nav-link">
                Login
              </Link>
              <Link to="/register" style={styles.navLinkPrimary} className="aperture-nav-link-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

        /* Aperture CSS Variables */
        :root {
          --bg-primary: #0A0A0F;
          --bg-glass: rgba(20, 20, 30, 0.6);
          --accent-primary: #00E0C7;
          --accent-secondary: #8A2BE2;
          --text-primary: #F0F0F5;
          --text-secondary: #A0A0B0;
          --border-glass: rgba(255, 255, 255, 0.1);
        }

        /* Kinetic Typography Animation */
        @keyframes liquidMorph {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-1px); }
        }

        /* Glass Button Hover */
        .aperture-glass-button {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .aperture-glass-button:hover {
          transform: translateY(-2px);
          box-shadow: 0px 8px 24px rgba(0, 224, 199, 0.2), 0px 0px 0px 1px var(--accent-primary) !important;
          backdrop-filter: blur(24px) !important;
        }
        .aperture-glass-button:active {
          transform: scale(0.98) translateY(0);
        }

        /* Nav Link Hover */
        .aperture-nav-link {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }
        .aperture-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent-primary);
          transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .aperture-nav-link:hover::after {
          width: 100%;
        }
        .aperture-nav-link:hover {
          color: var(--accent-primary) !important;
        }

        /* Primary Nav Link (Register) */
        .aperture-nav-link-primary {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .aperture-nav-link-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0px 8px 24px rgba(0, 224, 199, 0.3), 0px 0px 0px 1px var(--accent-primary) !important;
        }
        .aperture-nav-link-primary:active {
          transform: scale(0.98);
        }

        /* Theme Toggle */
        .aperture-theme-toggle {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .aperture-theme-toggle:hover {
          transform: rotate(180deg) scale(1.1);
          // box-shadow: 0px 4px 16px rgba(0, 224, 199, 0.2), 0px 0px 0px 1px var(--accent-primary) !important;
          background: rgba(0, 224, 199, 0.1) !important;
        }
        .aperture-theme-toggle:active {
          transform: rotate(180deg) scale(0.95);
        }

        /* Logo Kinetic Effect */
        header a[href="/"] span:first-child {
          display: inline-block;
          animation: liquidMorph 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

// --- Aperture Design System Styles ---
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 2.5rem',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    borderBottom: '1px solid var(--border-glass)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    fontFamily: "'Inter', sans-serif",
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: '1.75rem',
    fontWeight: 700,
    textDecoration: 'none',
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  logoText: {
    color: 'var(--text-primary)',
  },
  logoAccent: {
    color: 'var(--accent-primary)',
    fontWeight: 700,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    textDecoration: 'none',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    padding: '0.5rem 0',
  },
  navLinkPrimary: {
    textDecoration: 'none',
    color: 'var(--bg-primary)',
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    padding: '0.625rem 1.5rem',
    background: 'var(--accent-primary)',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 224, 199, 0.3)',
  },
  logoutButton: {
    border: '1px solid var(--border-glass)',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    color: 'var(--accent-secondary)',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    padding: '0.625rem 1.25rem',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    fontFamily: "'Inter', sans-serif",
  },
  userInfo: {
    fontSize: '0.9rem',
    fontWeight: 400,
    color: 'var(--text-secondary)',
    letterSpacing: '0.3px',
  },
  themeToggle: {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    border: '1px solid var(--border-glass)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1.25rem',
    padding: '0.625rem',
    lineHeight: 0,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Header;