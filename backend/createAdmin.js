require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Delete any existing admin users
    await User.deleteMany({ role: 'admin' });
    console.log('Cleared existing admin users...');

    // Admin user data
    const adminData = {
      name: 'Admin',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin'
    };

    // Create new admin user
    const admin = new User(adminData);
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser(); 