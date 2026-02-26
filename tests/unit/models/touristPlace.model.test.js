import TouristPlace from '../../../models/TouristPlace.js';

describe('TouristPlace Model', () => {
    it('should create a valid tourist place', async () => {
        const placeData = {
            name: 'Eiffel Tower',
            description: 'Famous landmark in Paris',
            category: 'Landmark',
            province: 'Paris',
            images: ['image1.jpg', 'image2.jpg'],
            location: {
                type: 'Point',
                coordinates: [2.2945, 48.8584]
            }
        };

        const place = new TouristPlace(placeData);
        const savedPlace = await place.save();

        expect(savedPlace._id).toBeDefined();
        expect(savedPlace.name).toBe(placeData.name);
        expect(savedPlace.description).toBe(placeData.description);
        expect(savedPlace.location.coordinates).toEqual(placeData.location.coordinates);
    });

    it('should require description field', async () => {
        const placeData = {
            name: 'Eiffel Tower',
            location: {
                type: 'Point',
                coordinates: [2.2945, 48.8584]
            }
        };

        const place = new TouristPlace(placeData);

        let error;
        try {
            await place.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.description).toBeDefined();
    });

    it('should have 2dsphere index on location', async () => {
        const indexes = await TouristPlace.collection.indexes();
        const locationIndex = indexes.find(index =>
            index.key && index.key.location === '2dsphere'
        );

        expect(locationIndex).toBeDefined();
    });
});