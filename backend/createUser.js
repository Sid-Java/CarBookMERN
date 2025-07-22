require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // User data
    const userData = {
      name: 'Test User',
      email: 'user@test.com',
      password: '123456',
      role: 'user'
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('❗ Test user already exists. Creating with different email...');
      userData.email = 'user2@test.com';
    }

    // Create new user
    const user = new User(userData);
    await user.save();
    console.log('✅ Test user created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email:', userData.email);
    console.log('Password:', userData.password);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
};

// Run the script
createTestUser(); 