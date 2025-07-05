import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import VehicleDetails from './pages/VehicleDetails';
import BookVehicle from './pages/BookVehicle';
import MyBookings from './pages/MyBookings';
import './App.css';
import TabBar from './component/TabBar';

function App() {
  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    // Try to load from localStorage, else use prefers-color-scheme
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <BrowserRouter>
      <TabBar />
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          position: 'fixed',
          right: 16,
          top: 16,
          background: 'none',
          border: 'none',
          fontSize: 28,
          cursor: 'pointer',
          color: 'var(--primary-color)',
          padding: 8,
          transition: 'color 0.3s',
          zIndex: 1001,
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/book" element={<BookVehicle />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
