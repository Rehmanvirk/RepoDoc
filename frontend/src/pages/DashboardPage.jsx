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
    alert('Copied to clipboard!');
  };

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <p>Enter a public GitHub repository URL to generate a README.md</p>

      {/* --- Generation Form --- */}
      <form onSubmit={handleSubmit} className="generation-form">
        <input
          type="text"
          placeholder="https://github.com/facebook/react"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          style={{ width: '400px', padding: '8px' }}
          required
        />
        <button type="submit" disabled={isLoading} style={{ padding: '8px 12px', marginLeft: '10px' }}>
          {isLoading ? 'Generating...' : 'Generate README'}
        </button>
      </form>

      {/* --- Results Area --- */}
      <div style={{ marginTop: '2rem' }}>
        {/* 1. Loading State */}
        {isLoading && (
          <div>
            <h3>Processing your repository...</h3>
            <p>This may take 30-60 seconds. Please wait.</p>
            {/* We'll add a real <Loader /> component here */}
          </div>
        )}

        {/* 2. Error State */}
        {error && (
          <div style={{ color: 'red' }}>
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* 3. Completed State */}
        {generatedReadme && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>Your Generated README.md</h3>
              <button onClick={copyToClipboard}>Copy to Clipboard</button>
            </div>
            {/* We use ReactMarkdown to render the text as HTML */}
            <article className="markdown-preview">
              <ReactMarkdown>{generatedReadme}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}



export default DashboardPage;