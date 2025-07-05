import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const BookVehicle = () => (
  <Box className="container fade-in" display="flex" justifyContent="center" alignItems="center">
    <Box component="form" className="card text-center" sx={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <h2 className="gradient-text">Book Vehicle</h2>
      <TextField className="mt-2" label="Your Name" variant="outlined" required fullWidth sx={{ mb: 2 }} />
      <TextField label="Mobile Number" variant="outlined" required fullWidth sx={{ mb: 2 }} type="tel" />
      <TextField label="Date" variant="outlined" required fullWidth sx={{ mb: 2 }} type="date" InputLabelProps={{ shrink: true }} />
      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>Book</Button>
    </Box>
  </Box>
);

export default BookVehicle; 