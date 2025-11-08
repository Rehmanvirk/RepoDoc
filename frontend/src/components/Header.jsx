// frontend/src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore'; // 1. Import theme store

function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 2. Get theme state and the toggle function
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>
        RepoDoc.ai
      </Link>
      <nav style={styles.nav}>
        {/* 3. Add the theme toggle button */}
        <button onClick={toggleTheme} style={styles.themeToggle}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <>
            <span style={styles.userInfo}>{user.email}</span>
            <button onClick={handleLogout} style={styles.navButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>
              Login
            </Link>
            <Link to="/register" style={styles.navLink}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

// --- Basic Styles ---
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'var(--card-bg)', // Use CSS var
    borderBottom: '1px solid var(--header-border)', // Use CSS var
    transition: 'background-color 0.2s',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'var(--text-color)', // Use CSS var
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    textDecoration: 'none',
    color: 'var(--text-color)', // Use CSS var
    fontSize: '1rem',
  },
  navButton: {
    border: 'none',
    background: 'transparent',
    color: '#d9534f',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: '0.9rem',
    color: '#888', // Use a specific gray
  },
  // 4. Style for the new button
  themeToggle: {
    background: 'var(--border-color)',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.5rem',
    lineHeight: 0,
  }
};

export default Header;