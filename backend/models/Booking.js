const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  bookingDate: String,
  price: Number,
});

module.exports = mongoose.model('Booking', bookingSchema);
