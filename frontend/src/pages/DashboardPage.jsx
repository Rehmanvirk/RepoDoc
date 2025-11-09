// frontend/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../api/axiosClient';
import ReactMarkdown from 'react-markdown';

// A simple polling hook for our job
function useJobPoller(jobId, onComplete, onError) {
  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const { data } = await axiosClient.get(`/generate/status/${jobId}`);

        if (data.status === 'completed') {
          onComplete(data.generatedReadme);
        } else if (data.status === 'failed') {
          onError(data.error || 'Job failed');
        } else {
          // Status is 'pending' or 'processing', poll again
          setTimeout(poll, 3000); // Poll every 3 seconds
        }
      } catch (err) {
        onError(err.response?.data?.message || 'Error checking status');
      }
    };

    // Start polling
    setTimeout(poll, 3000);

  }, [jobId, onComplete, onError]);
}

function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  // Form state
  const [repoUrl, setRepoUrl] = useState('');

  // Generation state
  const [jobId, setJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedReadme, setGeneratedReadme] = useState('');

  // --- Polling Logic ---
  useJobPoller(
    jobId,
    (readme) => { // onComplete
      setIsLoading(false);
      setJobId(null);
      setGeneratedReadme(readme);
    },
    (err) => { // onError
      setIsLoading(false);
      setJobId(null);
      setError(err);
    }
  );

  // --- Form Submit Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset state for new generation
    setIsLoading(true);
    setError(null);
    setGeneratedReadme('');
    setJobId(null);

    try {
      // 1. Call the API to *start* the job
      const { data } = await axiosClient.post('/generate', { repoUrl });

      // 2. We got a '202 Accepted' response with the jobId
      setJobId(data.jobId);
      // The useJobPoller hook will now take over

    } catch (err) {
      // This catches immediate errors (like 402 "no generations left")
      setIsLoading(false);
      setError(err.response?.data?.message || 'Failed to start generation');
    }
  };

  // --- Copy to Clipboard ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReadme);
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'aperture-toast';
    toast.textContent = '✓ Copied to clipboard!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  return (
    <>
      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.heroSection} className="aperture-stagger-in">
          <h2 style={styles.heading}>
            Welcome, <span style={styles.userHighlight}>{user.email}</span>
          </h2>
          <p style={styles.subheading}>
            Enter a public GitHub repository URL to generate intelligent documentation
          </p>
        </div>

        {/* Generation Form */}
        <div style={styles.form} className="aperture-glass-card aperture-stagger-in">
          <div style={styles.inputWrapper}>
            <input
              type="text"
              placeholder="https://github.com/facebook/react"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSubmit(e);
                }
              }}
              style={styles.input}
              className="aperture-input"
              required
            />
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
                  Generating...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>✨</span>
                  Generate README
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div style={styles.resultsArea}>
          {/* 1. Loading State */}
          {isLoading && (
            <div style={styles.loadingCard} className="aperture-glass-card aperture-pulse">
              <div style={styles.loaderWrapper}>
                <div style={styles.orbitLoader}>
                  <div style={styles.orbitRing}></div>
                  <div style={styles.orbitCore}></div>
                </div>
              </div>
              <h3 style={styles.loadingHeading}>Processing your repository...</h3>
              <p style={styles.loadingText}>
                Analyzing code structure and generating documentation. This may take 30-60 seconds.
              </p>
              <div style={styles.progressBar}>
                <div style={styles.progressFill} className="aperture-progress-animate"></div>
              </div>
            </div>
          )}

          {/* 2. Error State */}
          {error && (
            <div style={styles.errorCard} className="aperture-glass-card aperture-shake">
              <div style={styles.errorIcon}>⚠</div>
              <h3 style={styles.errorHeading}>Generation Failed</h3>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {/* 3. Completed State */}
          {generatedReadme && (
            <div style={styles.resultCard} className="aperture-glass-card aperture-stagger-in">
              <div style={styles.resultHeader}>
                <h3 style={styles.resultHeading}>
                  <span style={styles.successIcon}>✓</span>
                  Your Generated README.md
                </h3>
                <button 
                  onClick={copyToClipboard} 
                  style={styles.copyButton}
                  className="aperture-secondary-button"
                >
                  <span style={styles.copyIcon}>📋</span>
                  Copy to Clipboard
                </button>
              </div>
              
              <article style={styles.markdownPreview} className="markdown-preview aperture-markdown">
                <ReactMarkdown>{generatedReadme}</ReactMarkdown>
              </article>
            </div>
          )}
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

        /* Stagger In Animation */
        @keyframes staggerIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .aperture-stagger-in {
          animation: staggerIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* Glass Card Hover */
        .aperture-glass-card {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .aperture-glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.3), 0px 0px 0px 1px var(--border-glass) !important;
        }

        /* Input Focus */
        .aperture-input:focus {
          outline: none;
          border: 2px solid var(--accent-primary) !important;
          box-shadow: 0px 0px 20px rgba(0, 224, 199, 0.3) !important;
        }

        /* Primary Button Hover */
        .aperture-primary-button {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .aperture-primary-button:not(:disabled):hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0px 12px 32px rgba(0, 224, 199, 0.4), 0px 0px 0px 2px var(--accent-primary) !important;
        }
        .aperture-primary-button:not(:disabled):active {
          transform: scale(0.98);
        }

        /* Secondary Button Hover */
        .aperture-secondary-button {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .aperture-secondary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0px 8px 24px rgba(0, 224, 199, 0.2), 0px 0px 0px 1px var(--accent-primary) !important;
          border-color: var(--accent-primary) !important;
        }

        /* Spinner Animation */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .aperture-primary-button span:first-child {
          display: inline-block;
        }

        .aperture-primary-button:disabled span:first-child {
          animation: spin 1s linear infinite;
        }

        /* Pulse Animation */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .aperture-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        /* Orbit Loader */
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        /* Progress Bar Animation */
        @keyframes progressSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        .aperture-progress-animate {
          animation: progressSlide 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
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

        /* Toast Notification */
        .aperture-toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: var(--bg-glass);
          backdrop-filter: blur(18px);
          border: 1px solid var(--accent-primary);
          border-radius: 8px;
          padding: 1rem 1.5rem;
          color: var(--accent-primary);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          box-shadow: 0px 8px 24px rgba(0, 224, 199, 0.3);
          z-index: 10000;
          animation: staggerIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Markdown Styling */
        .aperture-markdown {
          line-height: 1.8;
        }

        .aperture-markdown h1, .aperture-markdown h2, .aperture-markdown h3 {
          color: var(--text-primary);
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .aperture-markdown p {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .aperture-markdown code {
          background: rgba(0, 224, 199, 0.1);
          color: var(--accent-primary);
          padding: 0.2rem 0.4rem;
          borderRadius: 4px;
          fontSize: 0.9em;
        }

        .aperture-markdown pre {
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          borderRadius: 8px;
          padding: 1rem;
          overflowX: auto;
          margin: 1rem 0;
        }

        .aperture-markdown pre code {
          background: none;
          padding: 0;
        }

        .aperture-markdown a {
          color: var(--accent-primary);
          textDecoration: none;
          borderBottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .aperture-markdown a:hover {
          borderBottomColor: var(--accent-primary);
        }

        .aperture-markdown ul, .aperture-markdown ol {
          color: var(--text-secondary);
          paddingLeft: 1.5rem;
          marginBottom: 1rem;
        }

        .aperture-markdown li {
          marginBottom: 0.5rem;
        }
      `}</style>
    </>
  );
}

// --- Aperture Design System Styles ---
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
    fontFamily: "'Inter', sans-serif",
  },
  heroSection: {
    marginBottom: '3rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '1rem',
    letterSpacing: '-0.5px',
  },
  userHighlight: {
    color: 'var(--accent-primary)',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subheading: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  form: {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    marginBottom: '2rem',
  },
  inputWrapper: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'stretch',
  },
  input: {
    flex: 1,
    padding: '1rem 1.25rem',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    border: '1px solid var(--border-glass)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  submitButton: {
    padding: '1rem 2rem',
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
    gap: '0.5rem',
    whiteSpace: 'nowrap',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  spinnerIcon: {
    fontSize: '1.2rem',
  },
  resultsArea: {
    marginTop: '2rem',
  },
  loadingCard: {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    padding: '3rem 2rem',
    textAlign: 'center',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
  },
  loaderWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  orbitLoader: {
    width: '80px',
    height: '80px',
    position: 'relative',
  },
  orbitRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '3px solid var(--border-glass)',
    borderTop: '3px solid var(--accent-primary)',
    borderRadius: '50%',
    animation: 'orbitRotate 1.5s linear infinite',
  },
  orbitCore: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    background: 'var(--accent-primary)',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0px 0px 20px rgba(0, 224, 199, 0.6)',
    animation: 'orbitPulse 1.5s ease-in-out infinite',
  },
  loadingHeading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  loadingText: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    background: 'var(--bg-glass)',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    width: '25%',
    background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
    borderRadius: '2px',
  },
  errorCard: {
    background: 'rgba(138, 43, 226, 0.1)',
    backdropFilter: 'blur(18px)',
    border: '1px solid var(--accent-secondary)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0px 4px 20px rgba(138, 43, 226, 0.2)',
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  errorHeading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--accent-secondary)',
    marginBottom: '0.5rem',
  },
  errorText: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  resultCard: {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    border: '1px solid var(--border-glass)',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-glass)',
  },
  resultHeading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  successIcon: {
    color: 'var(--accent-primary)',
    fontSize: '1.5rem',
  },
  copyButton: {
    padding: '0.75rem 1.5rem',
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(18px)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-glass)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  copyIcon: {
    fontSize: '1.1rem',
  },
  markdownPreview: {
    maxWidth: '100%',
    padding: '1.5rem',
    background: 'rgba(10, 10, 15, 0.3)',
    borderRadius: '8px',
    border: '1px solid var(--border-glass)',
    fontSize: '1rem',
  },
};

export default DashboardPage;