require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

const bikes = [
  {
    name: "Royal Enfield Thunderbird 350",
    type: "bike",
    brand: "Royal Enfield",
    price: 180000,
    image: "/images/tb.jpg",
    description: "Classic cruiser bike with timeless design"
  },
  {
    name: "Kawasaki Ninja H2",
    type: "bike",
    brand: "Kawasaki",
    price: 7900000,
    image: "/images/h2.jpg",
    description: "Supercharged supersport with cutting-edge technology"
  },
  {
    name: "Suzuki GSX-R1000",
    type: "bike",
    brand: "Suzuki",
    price: 1900000,
    image: "/images/gsxr.jpg",
    description: "High-performance sportbike with racing heritage"
  },
  {
    name: "Honda CBR1000RR",
    type: "bike",
    brand: "Honda",
    price: 1890000,
    image: "/images/cbr.jpg",
    description: "Advanced superbike with excellent handling"
  },
  {
    name: "Yamaha YZF-R1",
    type: "bike",
    brand: "Yamaha",
    price: 2000000,
    image: "/images/r1.jpg",
    description: "Track-focused superbike with MotoGP technology"
  },
  {
    name: "BMW S1000RR",
    type: "bike",
    brand: "BMW",
    price: 2300000,
    image: "/images/s1krr.jpg",
    description: "Premium German engineering meets superbike performance"
  }
];

const seedBikes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Add bikes
    const result = await Vehicle.insertMany(bikes);
    console.log(`✅ Successfully added ${result.length} bikes!`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bikes:', error);
    process.exit(1);
  }
};

// Run the seeding
seedBikes(); 