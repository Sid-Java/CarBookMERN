require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

const vehicles = [
  {
    name: "Baleno",
    brand: "Maruti Suzuki",
    type: "Car",
    price: 800,
    image: "/images/baleno.jpg",
    description: "Premium hatchback with great fuel efficiency"
  },
  {
    name: "Brezza",
    brand: "Maruti Suzuki",
    type: "SUV",
    price: 1000,
    image: "/images/brezza.jpg",
    description: "Compact SUV with modern features"
  },
  {
    name: "Creta",
    brand: "Hyundai",
    type: "SUV",
    price: 1200,
    image: "/images/creta.jpg",
    description: "Mid-size SUV with premium features"
  },
  {
    name: "Elevate",
    brand: "Honda",
    type: "SUV",
    price: 1100,
    image: "/images/elevate.jpg",
    description: "Stylish SUV with advanced safety features"
  },
  {
    name: "Fortuner",
    brand: "Toyota",
    type: "SUV",
    price: 2500,
    image: "/images/fortuner.jpg",
    description: "Luxury SUV with powerful performance"
  },
  {
    name: "Hector",
    brand: "MG",
    type: "SUV",
    price: 1800,
    image: "/images/hector.jpg",
    description: "Feature-rich SUV with connected car technology"
  },
  {
    name: "Kiger",
    brand: "Renault",
    type: "SUV",
    price: 900,
    image: "/images/kiger.jpg",
    description: "Compact SUV with modern design"
  },
  {
    name: "Nexon",
    brand: "Tata",
    type: "SUV",
    price: 1000,
    image: "/images/nexon.jpg",
    description: "Safe and reliable compact SUV"
  },
  {
    name: "Seltos",
    brand: "Kia",
    type: "SUV",
    price: 1300,
    image: "/images/seltos.jpg",
    description: "Feature-loaded mid-size SUV"
  },
  {
    name: "Thar",
    brand: "Mahindra",
    type: "SUV",
    price: 1500,
    image: "/images/thar.jpg",
    description: "Iconic off-road SUV"
  },
  {
    name: "Virtus",
    brand: "Volkswagen",
    type: "Car",
    price: 1200,
    image: "/images/virtus.jpg",
    description: "Premium sedan with German engineering"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles...');

    // Insert new vehicles
    const result = await Vehicle.insertMany(vehicles);
    console.log(`✅ Successfully seeded ${result.length} vehicles!`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();
