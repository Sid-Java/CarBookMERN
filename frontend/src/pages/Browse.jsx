import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Browse = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/vehicles')
      .then(res => {
        setVehicles(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let data = [...vehicles];

    if (search.trim() !== '') {
      data = data.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== 'All') {
      data = data.filter(v => v.type === typeFilter);
    }

    if (sortOrder === 'low') {
      data.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high') {
      data.sort((a, b) => b.price - a.price);
    }

    setFiltered(data);
  }, [search, typeFilter, sortOrder, vehicles]);

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setSortOrder('');
  };

  return (
    <div className="container fade-in">
      <h2 className="gradient-text">Browse Vehicles</h2>

      {/* 🔍 Search + Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name or brand"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input"
        />

        <select onChange={e => setTypeFilter(e.target.value)} value={typeFilter} className="input">
          <option value="All">All</option>
          <option value="Car">Cars</option>
          <option value="Bike">Bikes</option>
        </select>

        <select onChange={e => setSortOrder(e.target.value)} value={sortOrder} className="input">
          <option value="">Sort by Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>

        <button onClick={clearFilters} className="button">Clear Filters</button>
      </div>

      {/* 🚗 Vehicle Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>Loading vehicles...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '32px',
          padding: '0 20px',
          justifyContent: 'center',
        }}>
          {filtered.map(vehicle => (
            <div key={vehicle._id} className="card">
              <img src={vehicle.image} alt={vehicle.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '12px' }} />
              <h3>{vehicle.name}</h3>
              <p>{vehicle.brand}</p>
              <p>₹{vehicle.price.toLocaleString()}</p>
              <p>{vehicle.type}</p>
            </div>
          ))}
          {filtered.length === 0 && <p>No vehicles found.</p>}
        </div>
      )}
    </div>
  );
};

export default Browse;
