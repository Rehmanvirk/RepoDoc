// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../api/axiosClient';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', {
        email,
        password,
      });

      // response.data contains { _id, email, token }
      const { token, ...user } = response.data;
      loginStore(user, token);
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={styles.pageWrapper}>
        <div style={styles.container} className="aperture-stagger-in">
          {/* Logo Section */}
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>🔐</div>
            <h1 style={styles.brandName}>
              <span style={styles.brandText}>RepoDoc</span>
              <span style={styles.brandAccent}>.ai</span>
            </h1>
            <p style={styles.tagline}>Intelligent Documentation Generation</p>
          </div>

          {/* Login Card */}
          <div style={styles.loginCard} className="aperture-glass-card">
            <h2 style={styles.heading}>Welcome Back</h2>
            <p style={styles.subheading}>Sign in to continue to your dashboard</p>

            <div style={styles.formWrapper}>
              {/* Email Field */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputContainer}>
                  <span style={styles.inputIcon}>📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && password && !isLoading) {
                        handleSubmit(e);
                      }
                    }}
                    placeholder="your@email.com"
                    style={styles.input}
                    className="aperture-input"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputContainer}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && email && !isLoading) {
                        handleSubmit(e);
                      }
                    }}
                    placeholder="••••••••"
                    style={styles.input}
                    className="aperture-input"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={styles.errorBox} className="aperture-shake">
                  <span style={styles.errorIcon}>⚠</span>
                  <span style={styles.errorText}>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  ...styles.submitButton,
                  ...(isLoading ? styles.submitButtonDisabled : {})
                }}
                className="aperture-primary-button"
              >
                {isLoading ? (
                  <>
                    <span style={styles.spinnerIcon}>⚙</span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span style={styles.buttonIcon}>→</span>
                    Sign In
                  </>
                )}
              </button>

              {/* Register Link */}
              <div style={styles.footer}>
                <span style={styles.footerText}>Don't have an account?</span>
                <Link to="/register" style={styles.footerLink} className="aperture-link">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div style={styles.decorativeCircle1} className="aperture-float"></div>
          <div style={styles.decorativeCircle2} className="aperture-float-delayed"></div>
        </div>
      </div>

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

        /* Page Background */
        body {
          background: var(--bg-primary);
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(0, 224, 199, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.05) 0%, transparent 50%);
          background-attachment: fixed;
        }

        /* Stagger In Animation */
        @keyframes staggerIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .aperture-stagger-in {
          animation: staggerIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* Glass Card Hover */
        .aperture-glass-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .aperture-glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0px 16px 48px rgba(0, 224, 199, 0.1), 0px 0px 0px 1px var(--accent-primary) !important;
        }

        /* Input Focus */
        .aperture-input:focus {
          outline: none;
          border: 2px solid var(--accent-primary) !important;
          box-shadow: 0px 0px 24px rgba(0, 224, 199, 0.3) !important;
          padding-left: 2.75rem !important;
        }

        .aperture-input:focus + .input-icon {
          color: var(--accent-primary);
        }

        /* Primary Button */
        .aperture-primary-button {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .aperture-primary-button:not(:disabled):hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0px 16px 40px rgba(0, 224, 199, 0.5), 0px 0px 0px 2px var(--accent-primary) !important;
        }

        .aperture-primary-button:not(:disabled):active {
          transform: scale(0.98);
        }

        /* Spinner Animation */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .aperture-primary-button:disabled span:first-child {
          animation: spin 1s linear infinite;
        }

        /* Shake Animation */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        .aperture-shake {
          animation: shake 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Link Hover */
        .aperture-link {
          position: relative;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .aperture-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent-primary);
          transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .aperture-link:hover::after {
          width: 100%;
        }

        /* Floating Decorations */
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }

        .aperture-float {
          animation: float 6s ease-in-out infinite;
        }

        .aperture-float-delayed {
          animation: floatDelayed 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

// --- Aperture Design System Styles ---
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 10,
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    filter: 'drop-shadow(0px 4px 20px rgba(0, 224, 199, 0.3))',
  },
  brandName: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    letterSpacing: '-0.5px',
  },
  brandText: {
    color: 'var(--text-primary)',
  },
  brandAccent: {
    color: 'var(--accent-primary)',
  },
  tagline: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    fontWeight: 400,
  },
  loginCard: {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    border: '1px solid var(--border-glass)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.3)',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
    letterSpacing: '-0.5px',
  },
  subheading: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    fontWeight: 400,
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    letterSpacing: '0.3px',
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.1rem',
    pointerEvents: 'none',
    transition: 'color 0.3s',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '1rem 1rem 1rem 2.75rem',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    border: '1px solid var(--border-glass)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxSizing: 'border-box',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: 'rgba(138, 43, 226, 0.1)',
    border: '1px solid var(--accent-secondary)',
    borderRadius: '8px',
    backdropFilter: 'blur(18px)',
  },
  errorIcon: {
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  errorText: {
    fontSize: '0.9rem',
    color: 'var(--accent-secondary)',
    fontWeight: 500,
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    background: 'var(--accent-primary)',
    color: 'var(--bg-primary)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0px 4px 16px rgba(0, 224, 199, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  buttonIcon: {
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  spinnerIcon: {
    fontSize: '1.2rem',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-glass)',
  },
  footerText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  footerLink: {
    fontSize: '0.9rem',
    color: 'var(--accent-primary)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 224, 199, 0.1) 0%, transparent 70%)',
    top: '-150px',
    right: '-150px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(138, 43, 226, 0.08) 0%, transparent 70%)',
    bottom: '-200px',
    left: '-200px',
    pointerEvents: 'none',
    zIndex: 1,
  },
};

export default LoginPage;