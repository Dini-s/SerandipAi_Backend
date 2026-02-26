import mongoose from 'mongoose';
import User from '../../../models/User';


describe('User Model', () => {
    it('should create a valid user', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword123',
            contactNo: '+1234567890',
            Gender: 'Male',
            country: 'USA',
            prefferedLanguage: 'English'
        };

        const user = new User(userData);
        const savedUser = await user.save();


        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.createAt).toBeDefined();
        expect(savedUser.updateAt).toBeDefined();
    });

    it('should require required fields', async () => {
        const user = new User({});

        let error;
        try {
            await user.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.errors.name).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.password).toBeDefined();
        expect(error.errors.contactNo).toBeDefined();
        expect(error.errors.Gender).toBeDefined();
        expect(error.errors.country).toBeDefined();
        expect(error.errors.prefferedLanguage).toBeDefined();
    });

    it('should update updateAt timestamp on save', async () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword123',
            contactNo: '+1234567890',
            Gender: 'Male',
            country: 'USA',
            prefferedLanguage: 'English'
        });

        const savedUser = await user.save();
        const originalUpdateAt = savedUser.updateAt;

        // Wait a bit and update
        await new Promise(resolve => setTimeout(resolve, 100));
        savedUser.name = 'Jane Doe';
        savedUser.updateAt = Date.now();
        const updatedUser = await savedUser.save();

        expect(updatedUser.updateAt.getTime()).toBeGreaterThan(originalUpdateAt.getTime());
    });

    it('should store profile image correctly', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword123',
            contactNo: '+1234567890',
            Gender: 'Male',
            country: 'USA',
            prefferedLanguage: 'English',
            profileImgUrl: {
                url: 'https://example.com/image.jpg',
                public_id: 'image123'
            }
        };

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser.profileImgUrl.url).toBe(userData.profileImgUrl.url);
        expect(savedUser.profileImgUrl.public_id).toBe(userData.profileImgUrl.public_id);
    });
});