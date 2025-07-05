const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

// Connect to MongoDB
mongoose.connect("mongodb+srv://sidharthganesh07:hmxde@cluster0.lkmqny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("✅ MongoDB connected");
    seedCars();
  })
  .catch(err => console.error("❌ Connection error:", err));

const carData = [
  {
    name: "Mahindra Thar",
    brand: "Mahindra",
    price: 5000,
    type: "Car",
    image: "/images/thar.jpg"
  },
  {
    name: "Tata Nexon",
    brand: "Tata",
    price: 3200,
    type: "Car",
    image: "/images/nexon.jpg"
  },
  {
    name: "Maruti Suzuki Brezza",
    brand: "Maruti Suzuki",
    price: 3100,
    type: "Car",
    image: "/images/brezza.jpg"
  },
  {
    name: "Hyundai Creta",
    brand: "Hyundai",
    price: 4000,
    type: "Car",
    image: "/images/creta.jpg"
  },
  {
    name: "Kia Seltos",
    brand: "Kia",
    price: 3900,
    type: "Car",
    image: "/images/seltos.jpg"
  },
  {
    name: "Toyota Fortuner",
    brand: "Toyota",
    price: 7200,
    type: "Car",
    image: "/images/fortuner.jpg"
  },
  {
    name: "Renault Kiger",
    brand: "Renault",
    price: 2800,
    type: "Car",
    image: "/images/kiger.jpg"
  },
  {
    name: "Honda Elevate",
    brand: "Honda",
    price: 3500,
    type: "Car",
    image: "/images/elevate.jpg"
  },
  {
    name: "MG Hector",
    brand: "MG",
    price: 4500,
    type: "Car",
    image: "/images/hector.jpg"
  },
  {
    name: "Volkswagen Virtus",
    brand: "Volkswagen",
    price: 4300,
    type: "Car",
    image: "/images/virtus.jpg"
  }
];

async function seedCars() {
  try {
    await Vehicle.insertMany(carData);
    console.log("🚗 10 car records inserted successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Failed to insert:", err);
  }
}
