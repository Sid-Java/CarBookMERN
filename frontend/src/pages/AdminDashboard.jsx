import React from 'react';
import { Typography, Box, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DirectionsCar, BookOnline } from '@mui/icons-material';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography>
            You need administrator privileges to access this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          Admin Dashboard
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ mb: 4 }}>
          Welcome, {user?.name || 'Admin'}! Choose what you'd like to manage:
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 3 
        }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                cursor: 'pointer'
              }
            }}
            onClick={() => navigate('/admin/bookings')}
          >
            <BookOnline sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              View All Bookings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track all vehicle bookings
            </Typography>
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                cursor: 'pointer'
              }
            }}
            onClick={() => navigate('/admin/vehicles')}
          >
            <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Manage Vehicles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add, edit, or remove vehicles from the fleet
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
