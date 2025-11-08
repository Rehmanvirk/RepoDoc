// frontend/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../api/axiosClient';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login); // Get the login action from our store

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axiosClient.post('/auth/register', {
        email,
        password,
      });

      // response.data contains { _id, email, token }
      const { token, ...user } = response.data;

      // 1. Call our zustand action to save user and token
      loginStore(user, token);

      // 2. Redirect to the dashboard
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register for RepoDoc.ai</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;