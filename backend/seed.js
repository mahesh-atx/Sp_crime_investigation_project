const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing users
    await User.deleteMany();
    console.log('🗑️  Cleared existing users');

    // Create Admin User
    const adminUser = {
      name: 'SP Admin',
      email: 'admin@office.gov',
      password: 'password123',
      phone: '9876543210',
      role: 'admin'
    };

    // Create Officer User
    const officerUser = {
      name: 'Officer John',
      email: 'officer@office.gov',
      password: 'password123',
      phone: '9876543211',
      role: 'officer',
      policeStation: 'City West'
    };

    await User.create(adminUser);
    await User.create(officerUser);

    console.log('🚀 Seed data created successfully!');
    console.log('--- Demo Credentials ---');
    console.log('Admin Email: admin@office.gov');
    console.log('Officer Email: officer@office.gov');
    console.log('Password: password123');
    console.log('------------------------');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
