/**
 * Database Seed Script
 * Populates database with sample flights and users for testing
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/services/reservation-service/.env' });

// Import models
const Flight = require('./backend/services/reservation-service/src/models/Flight.model');
const User = require('./backend/services/user-service/src/models/User.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airline_reservation';

// Sample flight data
const sampleFlights = [
  {
    flightNumber: 'AI101',
    airline: 'Air India',
    origin: {
      city: 'New Delhi',
      airport: 'Indira Gandhi International Airport',
      airportCode: 'DEL'
    },
    destination: {
      city: 'Mumbai',
      airport: 'Chhatrapati Shivaji Maharaj International Airport',
      airportCode: 'BOM'
    },
    departureTime: new Date('2024-07-15T06:00:00Z'),
    arrivalTime: new Date('2024-07-15T08:30:00Z'),
    duration: 150,
    price: {
      economy: 4500,
      business: 12000,
      firstClass: 25000
    },
    availableSeats: {
      economy: 120,
      business: 20,
      firstClass: 10
    },
    totalSeats: {
      economy: 150,
      business: 20,
      firstClass: 10
    },
    aircraft: 'Boeing 737-800',
    status: 'SCHEDULED',
    amenities: ['WIFI', 'MEALS', 'ENTERTAINMENT']
  },
  {
    flightNumber: '6E202',
    airline: 'IndiGo',
    origin: {
      city: 'New Delhi',
      airport: 'Indira Gandhi International Airport',
      airportCode: 'DEL'
    },
    destination: {
      city: 'Bangalore',
      airport: 'Kempegowda International Airport',
      airportCode: 'BLR'
    },
    departureTime: new Date('2024-07-15T09:00:00Z'),
    arrivalTime: new Date('2024-07-15T12:00:00Z'),
    duration: 180,
    price: {
      economy: 5200,
      business: 15000,
      firstClass: 28000
    },
    availableSeats: {
      economy: 140,
      business: 18,
      firstClass: 8
    },
    totalSeats: {
      economy: 160,
      business: 20,
      firstClass: 10
    },
    aircraft: 'Airbus A320neo',
    status: 'SCHEDULED',
    amenities: ['WIFI', 'ENTERTAINMENT', 'POWER_OUTLETS']
  },
  {
    flightNumber: 'UK305',
    airline: 'Vistara',
    origin: {
      city: 'Mumbai',
      airport: 'Chhatrapati Shivaji Maharaj International Airport',
      airportCode: 'BOM'
    },
    destination: {
      city: 'Bangalore',
      airport: 'Kempegowda International Airport',
      airportCode: 'BLR'
    },
    departureTime: new Date('2024-07-15T14:00:00Z'),
    arrivalTime: new Date('2024-07-15T15:45:00Z'),
    duration: 105,
    price: {
      economy: 3800,
      business: 10000,
      firstClass: 20000
    },
    availableSeats: {
      economy: 100,
      business: 15,
      firstClass: 6
    },
    totalSeats: {
      economy: 120,
      business: 16,
      firstClass: 8
    },
    aircraft: 'Boeing 787-9',
    status: 'SCHEDULED',
    amenities: ['WIFI', 'MEALS', 'ENTERTAINMENT', 'EXTRA_LEGROOM']
  },
  {
    flightNumber: 'SG410',
    airline: 'SpiceJet',
    origin: {
      city: 'New Delhi',
      airport: 'Indira Gandhi International Airport',
      airportCode: 'DEL'
    },
    destination: {
      city: 'Hyderabad',
      airport: 'Rajiv Gandhi International Airport',
      airportCode: 'HYD'
    },
    departureTime: new Date('2024-07-16T07:30:00Z'),
    arrivalTime: new Date('2024-07-16T10:00:00Z'),
    duration: 150,
    price: {
      economy: 4200,
      business: 11000,
      firstClass: 22000
    },
    availableSeats: {
      economy: 130,
      business: 16,
      firstClass: 8
    },
    totalSeats: {
      economy: 150,
      business: 18,
      firstClass: 10
    },
    aircraft: 'Boeing 737 MAX',
    status: 'SCHEDULED',
    amenities: ['WIFI', 'MEALS']
  },
  {
    flightNumber: 'AI615',
    airline: 'Air India',
    origin: {
      city: 'Mumbai',
      airport: 'Chhatrapati Shivaji Maharaj International Airport',
      airportCode: 'BOM'
    },
    destination: {
      city: 'Goa',
      airport: 'Dabolim Airport',
      airportCode: 'GOI'
    },
    departureTime: new Date('2024-07-16T10:00:00Z'),
    arrivalTime: new Date('2024-07-16T11:30:00Z'),
    duration: 90,
    price: {
      economy: 3500,
      business: 9000,
      firstClass: 18000
    },
    availableSeats: {
      economy: 80,
      business: 12,
      firstClass: 6
    },
    totalSeats: {
      economy: 100,
      business: 14,
      firstClass: 8
    },
    aircraft: 'Airbus A319',
    status: 'SCHEDULED',
    amenities: ['MEALS', 'ENTERTAINMENT']
  },
  {
    flightNumber: '6E789',
    airline: 'IndiGo',
    origin: {
      city: 'Bangalore',
      airport: 'Kempegowda International Airport',
      airportCode: 'BLR'
    },
    destination: {
      city: 'Chennai',
      airport: 'Chennai International Airport',
      airportCode: 'MAA'
    },
    departureTime: new Date('2024-07-17T06:00:00Z'),
    arrivalTime: new Date('2024-07-17T07:15:00Z'),
    duration: 75,
    price: {
      economy: 3200,
      business: 8500,
      firstClass: 16000
    },
    availableSeats: {
      economy: 110,
      business: 14,
      firstClass: 7
    },
    totalSeats: {
      economy: 130,
      business: 16,
      firstClass: 8
    },
    aircraft: 'Airbus A320',
    status: 'SCHEDULED',
    amenities: ['WIFI', 'POWER_OUTLETS']
  }
];

// Sample user data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '9876543210',
    dateOfBirth: new Date('1990-01-15'),
    address: {
      street: '123 Main Street',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    preferences: {
      seatPreference: 'WINDOW',
      mealPreference: 'VEG'
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    phone: '9876543211',
    dateOfBirth: new Date('1992-05-20'),
    address: {
      street: '456 Park Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    },
    preferences: {
      seatPreference: 'AISLE',
      mealPreference: 'NON_VEG'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Flight.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Insert flights
    console.log('✈️  Inserting flights...');
    const insertedFlights = await Flight.insertMany(sampleFlights);
    console.log(`✅ Inserted ${insertedFlights.length} flights\n`);

    // Insert users
    console.log('👤 Inserting users...');
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${insertedUsers.length} users\n`);

    // Display summary
    console.log('📊 Seeding Summary:');
    console.log('='.repeat(40));
    console.log(`Total Flights: ${insertedFlights.length}`);
    console.log(`Total Users: ${insertedUsers.length}`);
    console.log('='.repeat(40));
    console.log('\n✨ Database seeding completed successfully!\n');

    console.log('📝 Sample User Credentials:');
    sampleUsers.forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: password123\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
