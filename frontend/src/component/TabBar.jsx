import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TabBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/browse" 
            className={`navbar-link ${isActive('/browse') ? 'active' : ''}`}
          >
            Browse
          </Link>
          <Link 
            to="/my-bookings" 
            className={`navbar-link ${isActive('/my-bookings') ? 'active' : ''}`}
          >
            My Bookings
          </Link>
        </div>

        <div className="navbar-right" ref={dropdownRef}>
          <button 
            className={`navbar-link ${showDropdown ? 'active' : ''}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Login
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <Link 
                to="/login" 
                className="dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TabBar;
