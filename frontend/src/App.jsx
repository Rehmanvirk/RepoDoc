// frontend/src/App.jsx

import React, { useEffect } from 'react'; // 1. Import useEffect
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

import { useThemeStore } from './store/themeStore'; // 2. Import our new store

function App() {
  // 3. Get the theme from the store
  const theme = useThemeStore((state) => state.theme);

  // 4. Add this useEffect hook
  useEffect(() => {
    // When the 'theme' state changes, update the <html> tag
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <Routes>
          {/* ... routes ... */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;