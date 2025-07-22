import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

// Base64 encoded simple gray image with car icon
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNHB4IiBmaWxsPSIjODg4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2UgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/vehicles/${id}`)
      .then(res => {
        setVehicle(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching vehicle details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <p>Vehicle not found.</p>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h2 className="gradient-text">{vehicle.name}</h2>
      <img
        src={`${BACKEND_URL}${vehicle.image}`}
        alt={vehicle.name}
        style={{
          width: '100%',
          maxHeight: 400,
          objectFit: 'cover',
          borderRadius: '16px',
          marginBottom: 20,
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMAGE;
        }}
      />
      <p><strong>Brand:</strong> {vehicle.brand}</p>
      <p><strong>Type:</strong> {vehicle.type}</p>
      <p><strong>Price:</strong> ₹{vehicle.price.toLocaleString()}/day</p>
      <p><strong>Description:</strong> {vehicle.description || 'No description available.'}</p>

      <button
        className="button"
        style={{ marginTop: 20 }}
        onClick={() => navigate(`/book/${vehicle._id}`, { state: { vehicle } })}
      >
        Book Now
      </button>
    </div>
  );
};

export default VehicleDetails;