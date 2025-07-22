import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Container, TextField, Select, MenuItem, Button, Typography, FormControl, InputLabel } from '@mui/material';

const BACKEND_URL = 'http://localhost:5000';

// Base64 fallback image
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNnB4IiBmaWxsPSIjODg4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2UgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

const Browse = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BACKEND_URL}/api/vehicles`)
      .then(res => {
        setVehicles(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching vehicles:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let data = [...vehicles];

    if (search.trim()) {
      data = data.filter(v =>
        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.brand?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== 'All') {
      data = data.filter(v => v.type?.toLowerCase() === typeFilter.toLowerCase());
    }

    if (sortOrder === 'low') {
      data.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortOrder === 'high') {
      data.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    setFiltered(data);
  }, [search, typeFilter, sortOrder, vehicles]);

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setSortOrder('');
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" className="gradient-text">
        Browse Vehicles
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          position: 'sticky',
          top: 80,
          zIndex: 10,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 3,
          mb: 4,
          boxShadow: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label="Type"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Car">Cars</MenuItem>
            <MenuItem value="Bike">Bikes</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Price</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Price"
          >
            <MenuItem value="">No Sort</MenuItem>
            <MenuItem value="low">Low to High</MenuItem>
            <MenuItem value="high">High to Low</MenuItem>
          </Select>
        </FormControl>

        <Button variant="outlined" onClick={clearFilters} size="small">
          Clear Filters
        </Button>
      </Box>

      {/* Vehicle Cards */}
      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>Loading vehicles...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {filtered.map(vehicle => (
            <Box
              key={vehicle._id}
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '60%',
                  backgroundColor: 'grey.100',
                }}
              >
                <img
                  src={vehicle?.image ? `${BACKEND_URL}${vehicle.image}` : FALLBACK_IMAGE}
                  alt={vehicle?.name || "Vehicle"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              <Box sx={{ p: 2 }}>
                <Typography variant="h6" noWrap>{vehicle?.name || "Unnamed Vehicle"}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {vehicle?.brand || "Unknown Brand"}
                </Typography>
                <Typography variant="h6" color="primary.main" gutterBottom>
                  ₹{Number(vehicle?.price || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {vehicle?.type || "Unknown"}
                </Typography>

                <Button
                  component={Link}
                  to={`/vehicle/${vehicle._id}`}
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Know More
                </Button>
              </Box>
            </Box>
          ))}
          {filtered.length === 0 && (
            <Typography sx={{ gridColumn: '1/-1', textAlign: 'center', mt: 4 }}>
              No vehicles found.
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Browse;
