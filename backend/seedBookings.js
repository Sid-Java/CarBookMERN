require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Vehicle = require('./models/Vehicle');

const seedBookings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Get all vehicles
    const vehicles = await Vehicle.find();
    if (vehicles.length === 0) {
      console.log('No vehicles found. Please run seedCars.js first.');
      process.exit(1);
    }

    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('Cleared existing bookings...');

    // Create sample bookings
    const bookings = [];
    const users = [
      { name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210' },
      { name: 'Bob Wilson', email: 'bob@example.com', phone: '5555555555' }
    ];

    // Create multiple bookings for each user
    for (const user of users) {
      // Create 2 bookings per user
      for (let i = 0; i < 2; i++) {
        const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
        const booking = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          vehicleId: vehicle._id,
          bookingDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within next 30 days
          price: vehicle.price
        };
        bookings.push(booking);
      }
    }

    // Insert bookings
    const result = await Booking.insertMany(bookings);
    console.log(`✅ Successfully seeded ${result.length} bookings!`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bookings:', error);
    process.exit(1);
  }
};

// Run the seeding
seedBookings(); 