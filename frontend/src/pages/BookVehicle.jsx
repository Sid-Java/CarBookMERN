import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@mui/material';

const BookVehicle = () => {
  const { vehicleId } = useParams();
  const location = useLocation();
  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: null,
  });
  const [msg, setMsg] = useState('');

  /* 🔹 Fetch vehicle if not supplied by state */
  useEffect(() => {
    if (!vehicle) {
      axios
        .get(`http://localhost:5000/api/vehicles/${vehicleId}`)
        .then(res => setVehicle(res.data))
        .catch(err => console.error(err));
    }
  }, [vehicle, vehicleId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* 🔹 Submit booking */
  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // logged‑in user

      if (!user || !form.name || !form.phone || !form.date) {
        setMsg('All fields are required');
        return;
      }

      const bookingData = {
        name: form.name,
        email: user.email, // use login email
        phone: form.phone,
        vehicleId: vehicle._id,
        bookingDate: form.date.toISOString().split('T')[0],
        price: vehicle.price,
      };

      await axios.post('http://localhost:5000/api/bookings', bookingData);
      setMsg('✅ Booking successful!');
    } catch (err) {
      console.error('Booking failed:', err);
      setMsg('❌ Booking failed');
    }
  };

  if (!vehicle) return <p style={{ textAlign: 'center' }}>Loading…</p>;

  return (
    <div className="container fade-in" style={{ maxWidth: 600, margin: 'auto' }}>
      <h2 className="gradient-text">Book {vehicle.name}</h2>

      {/* Vehicle summary */}
      <div
        style={{
          border: '1px solid var(--overlay-2)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <img
          src={vehicle.image}
          alt={vehicle.name}
          style={{ width: '100%', borderRadius: 8, marginBottom: 12 }}
        />
        <p><strong>Brand:</strong> {vehicle.brand}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Price:</strong> ₹{vehicle.price.toLocaleString()}</p>
      </div>

      {/* Booking form */}
      <input
        className="input"
        placeholder="Your Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        style={{ width: '100%', marginBottom: 12 }}
      />
      <input
        className="input"
        placeholder="Mobile Number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        style={{ width: '100%', marginBottom: 12 }}
      />

      <DatePicker
        selected={form.date}
        onChange={(date) => setForm({ ...form, date })}
        dateFormat="dd-MM-yyyy"
        placeholderText="Select booking date"
        className="input"
        style={{ width: '100%', marginBottom: 20 }}
      />

      <Button onClick={handleSubmit} variant="contained" fullWidth>
        Confirm Booking
      </Button>

      {msg && (
        <p style={{ marginTop: 16, textAlign: 'center' }}>
          {msg}
        </p>
      )}
    </div>
  );
};

export default BookVehicle;
