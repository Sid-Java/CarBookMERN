import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Alert,
  MenuItem,
  Tooltip,
  Container,
  Paper,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// VehicleForm Component
const VehicleForm = ({ vehicle, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    vehicle || {
      name: '',
      brand: '',
      type: 'Car',
      price: '',
      description: ''
    }
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(vehicle ? `http://localhost:5000${vehicle.image}` : '');
  const [errors, setErrors] = useState({});
  const fileInputRef = React.useRef();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });
      if (selectedFile) {
        data.append('image', selectedFile);
      }
      onSubmit(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {/* Image Preview and Upload */}
          <Box sx={{ textAlign: 'center' }}>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Vehicle preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  marginBottom: '1rem'
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current.click()}
              fullWidth
            >
              {previewUrl ? 'Change Image' : 'Upload Image'}
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            error={!!errors.brand}
            helperText={errors.brand}
          />
          <TextField
            select
            fullWidth
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={!!errors.type}
            helperText={errors.type}
          >
            <MenuItem value="Car">Car</MenuItem>
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="Bike">Bike</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {vehicle ? 'Update' : 'Add'} Vehicle
        </Button>
      </DialogActions>
    </form>
  );
};

// ManageVehicles Component
function ManageVehicles() {
  const { isAdmin, token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialog, setDialog] = useState({ open: false, vehicle: null });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/vehicles');
      const vehiclesWithId = response.data.map(vehicle => ({
        ...vehicle,
        id: vehicle._id,
        price: Number(vehicle.price) // Ensure price is a number
      }));
      setVehicles(vehiclesWithId);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError('Failed to fetch vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/vehicles', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Ensure essential fields exist in response
      const addedVehicle = {
        ...response.data,
        id: response.data._id || response.data.id,
        name: response.data.name || 'Unnamed',
        brand: response.data.brand || 'Unknown',
        type: response.data.type || 'Unknown',
        price: response.data.price || 0,
        image: response.data.image || ''
      };
  
      setVehicles(prev => [...prev, addedVehicle]);
      setAlert({ show: true, message: 'Vehicle added successfully', severity: 'success' });
      setDialog({ open: false, vehicle: null });
  
    } catch (err) {
      console.error('Add vehicle error:', err);
      setAlert({ show: true, message: err.response?.data?.error || 'Failed to add vehicle', severity: 'error' });
    }
  };
  

  const handleUpdateVehicle = async (formData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/vehicles/${dialog.vehicle._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setAlert({ show: true, message: 'Vehicle updated successfully', severity: 'success' });
      setVehicles(prev => prev.map(v => v.id === dialog.vehicle._id ? { ...response.data, id: response.data._id } : v));
      setDialog({ open: false, vehicle: null });
    } catch (err) {
      console.error('Update vehicle error:', err);
      setAlert({ show: true, message: err.response?.data?.error || 'Failed to update vehicle', severity: 'error' });
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAlert({ show: true, message: 'Vehicle deleted successfully', severity: 'success' });
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error('Delete vehicle error:', err);
      setAlert({ show: true, message: err.response?.data?.error || 'Failed to delete vehicle', severity: 'error' });
    }
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography noWrap>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'brand', 
      headerName: 'Brand', 
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Typography noWrap>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography noWrap>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.8,
      minWidth: 100,
      type: 'number',
      renderCell: (params) => (
        <Typography noWrap>
          ₹{params.value?.toLocaleString() || 0}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => setDialog({ open: true, vehicle: params.row })}
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteVehicle(params.row.id)}
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

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {alert.show && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, show: false })}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Vehicles ({vehicles.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ open: true, vehicle: null })}
        >
          Add Vehicle
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={vehicles}
          columns={columns}
          loading={loading}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableSelectionOnClick
          getRowId={(row) => row.id || row._id}
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: () => (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>No vehicles found</Typography>
              </Box>
            )
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 }
            }
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: 'none'
            }
          }}
        />
      </Paper>

      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, vehicle: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialog.vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </DialogTitle>
        <VehicleForm
          vehicle={dialog.vehicle}
          onSubmit={dialog.vehicle ? handleUpdateVehicle : handleAddVehicle}
          onClose={() => setDialog({ open: false, vehicle: null })}
        />
      </Dialog>
    </Container>
  );
};

export default ManageVehicles;
