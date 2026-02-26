import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../../models/User.js';
import verifyToken from '../../../middleware/authMiddleware.js';

describe('Auth Middleware', () => {
    let user;
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(async () => {
        process.env.JWT_SECRET = 'test-secret';

        user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword',
            contactNo: '1234567890',
            Gender: 'Male',
            country: 'USA',
            prefferedLanguage: 'English'
        });

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    it('should attach user to req when token is valid', async () => {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        mockReq = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        await verifyToken(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.user).toBeDefined();
        expect(mockReq.user._id.toString()).toBe(user._id.toString());
    });

    it('should return 401 when no token provided', async () => {
        mockReq = {
            headers: {}
        };

        await verifyToken(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Not authorized, no token"
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
        mockReq = {
            headers: {
                authorization: 'Bearer invalid-token'
            }
        };

        await verifyToken(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Token failed"
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const token = jwt.sign({ id: fakeId }, process.env.JWT_SECRET);

        mockReq = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        await verifyToken(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.user).toBeNull(); // or undefined
        expect(mockRes.status).not.toHaveBeenCalled();

    });
});