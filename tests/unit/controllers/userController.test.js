import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from '../../../server.js';
import User from '../../../models/User.js';

describe('Auth Controller', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                contactNo: '1234567890',
                Gender: 'Male',
                Country: 'USA',
                Language: 'English'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.name).toBe(userData.name);
            expect(response.body.email).toBe(userData.email);
            expect(response.body).toHaveProperty('password');
            expect(typeof response.body.password).toBe('string');
            expect(response.body.password).not.toBe(userData.password);

            // Verify password is hashed in database
            const savedUser = await User.findOne({ email: userData.email });
            expect(savedUser).toBeTruthy();
            expect(savedUser.password).not.toBe(userData.password);

            const isMatch = await bcrypt.compare(userData.password, savedUser.password);
            expect(isMatch).toBe(true);
        });

        it('should return 400 if user already exists', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                contactNo: '1234567890',
                Gender: 'Male',
                Country: 'USA',
                Language: 'English'
            };

            // Create user first
            await User.create({
                name: userData.name,
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10),
                contactNo: userData.contactNo,
                Gender: userData.Gender,
                country: userData.Country,
                prefferedLanguage: userData.Language
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.message).toBe('You already Register to the system');
        });

        it('should return 500 if required fields are missing', async () => {
            const invalidData = {
                name: 'John Doe'
                // Missing other fields
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(invalidData)
                .expect(500);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                contactNo: '1234567890',
                Gender: 'Male',
                country: 'USA',
                prefferedLanguage: 'English'
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'password123'
                })
                .expect(200);

            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id', user._id.toString());
            expect(response.body.user.email).toBe(user.email);
            expect(response.body.user.name).toBe(user.name);
            expect(response.body.user.contactNo).toBe(user.contactNo);
            expect(response.body.user.Gender).toBe(user.Gender);
            expect(response.body.user.country).toBe(user.country);
            expect(response.body.user.language).toBe(user.prefferedLanguage);

            // Verify token is valid
            const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
            expect(decoded.id).toBe(user._id.toString());
        });

        it('should return 400 with incorrect password', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);

            await User.create({
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                contactNo: '1234567890',
                Gender: 'Male',
                country: 'USA',
                prefferedLanguage: 'English'
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'wrongpassword'
                })
                .expect(400);

            expect(response.body.message).toBe('Invalid Username or password');
        });

        it('should return 400 with non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                })
                .expect(400);

            expect(response.body.message).toBe('Invalid Username or password');
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return user data with valid token', async () => {
            const user = await User.create({
                name: 'John Doe',
                email: 'john@example.com',
                password: await bcrypt.hash('password123', 10),
                contactNo: '1234567890',
                Gender: 'Male',
                country: 'USA',
                prefferedLanguage: 'English'
            });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body).toHaveProperty('_id', user._id.toString());
            expect(response.body.name).toBe(user.name);
            expect(response.body.email).toBe(user.email);
            expect(response.body.password).toBeUndefined(); // Password should not be returned
        });

        it('should return 401 without token', async () => {
            await request(app)
                .get('/api/auth/me')
                .expect(401);
        });

        it('should return 401 with invalid token', async () => {
            await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });
});