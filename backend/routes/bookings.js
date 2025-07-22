const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const sendEmail = require('../utils/sendEmail');
const { bookingConfirmationEmail, bookingCancellationEmail } = require('../utils/emailTemplates');

// POST a new booking
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, vehicleId, bookingDate, price } = req.body;

    // Get vehicle details for the email
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const newBooking = new Booking({
      name,
      email,
      phone,
      vehicleId,
      bookingDate,
      price,
    });

    await newBooking.save();

    // Send confirmation email
    try {
      const { subject, html } = bookingConfirmationEmail(
        name,
        vehicle.name,
        bookingDate,
        price
      );
      await sendEmail(email, subject, html);
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Don't return error to client, booking was successful
    }

    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET bookings by user email
router.get('/user/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.params.email })
      .populate('vehicleId', 'name brand type') // Populate vehicle details
      .sort({ bookingDate: -1 }); // Sort by booking date, newest first
    res.json(bookings);
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicleId', 'name brand type')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Fetch all bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// DELETE a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Fetch vehicle separately for email
    let vehicleName = 'Unknown Vehicle';
    try {
      const vehicle = await Vehicle.findById(booking.vehicleId);
      if (vehicle) {
        vehicleName = vehicle.name;
      }
    } catch (vehicleError) {
      console.error('Error fetching vehicle for cancellation email:', vehicleError);
    }

    // Send cancellation email before deleting
    try {
      const { subject, html } = bookingCancellationEmail(
        booking.name,
        vehicleName,
        booking.bookingDate
      );
      await sendEmail(booking.email, subject, html);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Proceed anyway
    }

    // Use safer deletion method
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error('Booking delete error →', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
