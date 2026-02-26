import mongoose from 'mongoose';
import TouristActivity from '../../../models/TouristActivity.js';
import UserActivityLog from '../../../models/UserActivityLog.js';

describe('Activity Models', () => {
    describe('TouristActivity', () => {
        it('should create a valid tourist activity', async () => {
            const activityData = {
                user: new mongoose.Types.ObjectId(),
                touristPlace: new mongoose.Types.ObjectId(),
                action: 'viewed',
                languageUsed: 'English'
            };

            const activity = new TouristActivity(activityData);
            const savedActivity = await activity.save();

            expect(savedActivity._id).toBeDefined();
            expect(savedActivity.action).toBe(activityData.action);
            expect(savedActivity.languageUsed).toBe(activityData.languageUsed);
            expect(savedActivity.createdAt).toBeDefined();
        });

        it('should only allow valid enum values for action', async () => {
            const activityData = {
                user: new mongoose.Types.ObjectId(),
                touristPlace: new mongoose.Types.ObjectId(),
                action: 'invalid_action',
                languageUsed: 'English'
            };

            const activity = new TouristActivity(activityData);

            let error;
            try {
                await activity.save();
            } catch (err) {
                error = err;
            }

            expect(error).toBeDefined();
            expect(error.errors.action).toBeDefined();
        });
    });

    describe('UserActivityLog', () => {
        it('should create a valid user activity log', async () => {
            const logData = {
                userId: new mongoose.Types.ObjectId(),
                placeId: new mongoose.Types.ObjectId(),
                action: 'viewed',
                languageUsed: 'English'
            };

            const log = new UserActivityLog(logData);
            const savedLog = await log.save();

            expect(savedLog._id).toBeDefined();
            expect(savedLog.action).toBe(logData.action);
            expect(savedLog.languageUsed).toBe(logData.languageUsed);
            expect(savedLog.createdAt).toBeDefined();
        });
    });
});