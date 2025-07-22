const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

/* -------- GET all vehicles -------- */
router.get('/', async (_req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    console.error('Fetch all vehicles error →', err);
    res.status(500).json({ error: 'Server error fetching vehicles' });
  }
});

/* -------- GET vehicle by ID -------- */
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    console.error('Fetch vehicle error →', err);
    res.status(500).json({ error: 'Server error fetching vehicle' });
  }
});

/* -------- POST add vehicle -------- */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Validate required fields
    const { name, brand, type, price } = req.body;
    if (!name || !brand || !type || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create vehicle data
    const vehicleData = {
      name,
      brand,
      type,
      price: Number(price),
      description: req.body.description || '',
      image: req.file ? `/images/${req.file.filename}` : '/images/default-vehicle.jpg'
    };

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    // Return complete vehicle data
    res.status(201).json({
      ...vehicle.toObject(),
      id: vehicle._id
    });
  } catch (err) {
    console.error('Vehicle creation error:', err);
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
    res.status(500).json({ error: err.message });
  }
});

/* -------- PUT update vehicle -------- */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Update fields
    const updateData = {
      name: req.body.name || vehicle.name,
      brand: req.body.brand || vehicle.brand,
      type: req.body.type || vehicle.type,
      price: req.body.price ? Number(req.body.price) : vehicle.price,
      description: req.body.description || vehicle.description,
    };

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (vehicle.image && !vehicle.image.includes('default-vehicle.jpg')) {
        const oldImagePath = path.join(__dirname, '..', vehicle.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting old image:', err);
          });
        }
      }
      updateData.image = `/images/${req.file.filename}`;
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      ...updatedVehicle.toObject(),
      id: updatedVehicle._id
    });
  } catch (err) {
    console.error('Vehicle update error:', err);
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
    res.status(500).json({ error: err.message });
  }
});

/* -------- DELETE vehicle -------- */
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Delete associated image
    if (vehicle.image && !vehicle.image.includes('default-vehicle.jpg')) {
      const imagePath = path.join(__dirname, '..', vehicle.image);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image:', err);
        });
      }
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('Vehicle delete error →', err);
    res.status(500).json({ error: 'Server error deleting vehicle' });
  }
});

module.exports = router;
