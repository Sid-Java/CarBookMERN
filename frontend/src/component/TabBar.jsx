import React from 'react';
import { Link } from 'react-router-dom';

const TabBar = () => (
  <nav style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    background: 'var(--bg-color)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 2px 8px var(--overlay-1)',
    padding: '12px 0',
  }}>
    <Link to="/" className="button">Home</Link>
    <Link to="/browse" className="button">Browse</Link>
    <Link to="/my-bookings" className="button">My Bookings</Link>
  </nav>
);

export default TabBar; 