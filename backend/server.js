// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
require('./db');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const vehicleRoutes = require('./routes/vehicleRoutes');
app.use('/api/vehicles', vehicleRoutes);

// Optional default route to verify server
app.get('/', (req, res) => {
  res.send('API is running 🚗');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
