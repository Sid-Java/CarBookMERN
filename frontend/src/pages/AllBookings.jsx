import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      const bookingsWithId = response.data.map(booking => ({
        ...booking,
        id: booking._id,
        vehicle: booking.vehicleId?.name || 'Unknown'
      }));
      setBookings(bookingsWithId);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this booking?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
    { field: 'phone', headerName: 'Phone', flex: 0.8, minWidth: 120 },
    {
      field: 'vehicle',
      headerName: 'Vehicle',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => {
                setSelectedBooking(params.row);
                setViewDialog(true);
              }}
              color="primary"
              size="small"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteBooking(params.row.id)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Bookings
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 500, mt: 2 }}>
          <DataGrid
            rows={bookings}
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7]}
          />
        </Box>
      )}

      {/* View Booking Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <DialogContentText>
                <strong>Name:</strong> {selectedBooking.name}
              </DialogContentText>
              <DialogContentText>
                <strong>Email:</strong> {selectedBooking.email}
              </DialogContentText>
              <DialogContentText>
                <strong>Phone:</strong> {selectedBooking.phone}
              </DialogContentText>
              <DialogContentText>
                <strong>Vehicle:</strong> {selectedBooking.vehicle}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllBookings;
