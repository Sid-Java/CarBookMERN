import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:5000/api/bookings/user/${email}`)
        .then(res => setBookings(res.data))
        .catch(err => console.error('Fetch bookings error:', err));
    }
  }, [email]);

  if (!email) {
    return (
      <div className="main-content" style={{ paddingTop: 60, textAlign: 'center', minHeight: '80vh' }}>
        <p style={{ fontSize: '1.1rem' }}>
          Please <Link to="/login">log in</Link> to see your bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h2 className="gradient-text" style={{ marginBottom: 24 }}>My Bookings</h2>

      {bookings.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No bookings found.</p>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {bookings.map(b => (
            <div key={b._id} className="card">
              <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>
                {b.vehicleId?.brand} {b.vehicleId?.name}
              </h3>
              <p><strong>Booking Date:</strong> {new Date(b.bookingDate).toLocaleDateString()}</p>
              <p><strong>Amount:</strong> ₹{b.price.toLocaleString()}</p>
              <p><strong>Contact Details:</strong></p>
              <p style={{ marginLeft: '1rem' }}>{b.name}</p>
              <p style={{ marginLeft: '1rem' }}>{b.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
