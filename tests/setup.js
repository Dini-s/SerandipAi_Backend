import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../config/db.js';

let mongoServer;

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

// Increase timeout
jest.setTimeout(30000);

// Connect to in-memory database before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Disconnect from any existing connection
    await mongoose.disconnect();

    // Connect to in-memory database
    await mongoose.connect(mongoUri);
});

// Clear all data after each test
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
    jest.clearAllMocks();
});

// Disconnect and close database after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});