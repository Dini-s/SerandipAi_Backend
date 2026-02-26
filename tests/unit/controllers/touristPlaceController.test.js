import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../server.js'; // Import app from server.js
import TouristPlace from '../../../models/TouristPlace.js';
import cloudinary from '../../../config/cloudinary.js';
import fs from 'fs';

// Mock cloudinary and fs
jest.mock('../../../config/cloudinary.js', () => ({
    uploader: {
        upload: jest.fn()
    }
}));

jest.mock('fs');

describe('TouristPlace Controller', () => {
    beforeEach(async () => {
        await TouristPlace.deleteMany({});
    });

    describe('GET /api/touristPlace/:id', () => {
        it('should return 500 for invalid id format', async () => {
            await request(app)
                .get('/api/touristPlace/invalid-id')
                .expect(500);
        });
    });

    describe('GET /api/touristPlace/nearby', () => {
        it('should find places within 5km radius', async () => {
            // Create a place near the coordinates
            await TouristPlace.create({
                name: 'Nearby Place',
                description: 'Close to center',
                location: {
                    type: 'Point',
                    coordinates: [2.2945, 48.8584]
                }
            });

            // Create a place far away
            await TouristPlace.create({
                name: 'Far Place',
                description: 'Far from center',
                location: {
                    type: 'Point',
                    coordinates: [12.4922, 41.8902]
                }
            });

            const response = await request(app)
                .get('/api/touristPlace/nearby')
                .query({ lat: 48.8584, lng: 2.2945 })
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0].name).toBe('Nearby Place');
        });

        it('should return empty array when no places nearby', async () => {
            const response = await request(app)
                .get('/api/touristPlace/nearby')
                .query({ lat: 48.8584, lng: 2.2945 })
                .expect(200);

            expect(response.body).toEqual([]);
        });
    });
});