/**
 * Seed script to populate sample flights in MongoDB
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Flight = require('./src/models/Flight.model');
const Logger = require('../../shared/utils/logger');

const SERVICE_NAME = 'SEEDER';

async function seedFlights() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    Logger.success(SERVICE_NAME, 'Connected to MongoDB');

    // Clear existing flights
    await Flight.deleteMany({});
    Logger.info(SERVICE_NAME, 'Cleared existing flights');

    // Sample flights
    const sampleFlights = [
      {
        flightNumber: 'AI101',
        airline: 'Air India',
        origin: {
          city: 'Goa',
          airport: 'Dabolim Airport',
          airportCode: 'GOA'
        },
        destination: {
          city: 'Delhi',
          airport: 'Indira Gandhi International',
          airportCode: 'DEL'
        },
        departureTime: new Date('2026-04-04T10:00:00'),
        arrivalTime: new Date('2026-04-04T12:30:00'),
        duration: 150,
        price: {
          economy: 3500,
          business: 8000,
          firstClass: 12000
        },
        availableSeats: {
          economy: 120,
          business: 40,
          firstClass: 20
        },
        totalSeats: {
          economy: 150,
          business: 50,
          firstClass: 30
        },
        aircraft: 'Boeing 737',
        status: 'SCHEDULED',
        amenities: ['WIFI', 'MEALS', 'ENTERTAINMENT'],
        isActive: true
      },
      {
        flightNumber: 'AI102',
        airline: 'Air India',
        origin: {
          city: 'Goa',
          airport: 'Dabolim Airport',
          airportCode: 'GOA'
        },
        destination: {
          city: 'Delhi',
          airport: 'Indira Gandhi International',
          airportCode: 'DEL'
        },
        departureTime: new Date('2026-04-04T14:00:00'),
        arrivalTime: new Date('2026-04-04T16:30:00'),
        duration: 150,
        price: {
          economy: 3800,
          business: 8500,
          firstClass: 13000
        },
        availableSeats: {
          economy: 95,
          business: 38,
          firstClass: 18
        },
        totalSeats: {
          economy: 150,
          business: 50,
          firstClass: 30
        },
        aircraft: 'Airbus A320',
        status: 'SCHEDULED',
        amenities: ['WIFI', 'MEALS'],
        isActive: true
      },
      {
        flightNumber: 'SG201',
        airline: 'SpiceJet',
        origin: {
          city: 'Goa',
          airport: 'Dabolim Airport',
          airportCode: 'GOA'
        },
        destination: {
          city: 'Delhi',
          airport: 'Indira Gandhi International',
          airportCode: 'DEL'
        },
        departureTime: new Date('2026-04-04T08:00:00'),
        arrivalTime: new Date('2026-04-04T10:30:00'),
        duration: 150,
        price: {
          economy: 2500,
          business: 6000,
          firstClass: 9000
        },
        availableSeats: {
          economy: 150,
          business: 45,
          firstClass: 25
        },
        totalSeats: {
          economy: 180,
          business: 50,
          firstClass: 30
        },
        aircraft: 'Boeing 737',
        status: 'SCHEDULED',
        amenities: ['WIFI'],
        isActive: true
      },
      {
        flightNumber: 'BA501',
        airline: 'British Airways',
        origin: {
          city: 'Delhi',
          airport: 'Indira Gandhi International',
          airportCode: 'DEL'
        },
        destination: {
          city: 'Mumbai',
          airport: 'Bombay High Airport',
          airportCode: 'BOM'
        },
        departureTime: new Date('2026-04-04T11:00:00'),
        arrivalTime: new Date('2026-04-04T13:00:00'),
        duration: 120,
        price: {
          economy: 4000,
          business: 9000,
          firstClass: 14000
        },
        availableSeats: {
          economy: 100,
          business: 35,
          firstClass: 15
        },
        totalSeats: {
          economy: 150,
          business: 50,
          firstClass: 30
        },
        aircraft: 'Boeing 777',
        status: 'SCHEDULED',
        amenities: ['WIFI', 'MEALS', 'ENTERTAINMENT', 'POWER_OUTLETS'],
        isActive: true
      }
    ];

    const insertedFlights = await Flight.insertMany(sampleFlights);
    Logger.success(SERVICE_NAME, `Successfully seeded ${insertedFlights.length} flights`);

    process.exit(0);
  } catch (error) {
    Logger.error(SERVICE_NAME, 'Seeding failed', error);
    process.exit(1);
  }
}

seedFlights();
