import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { register, login } from "../controllers/auth.controller.sqlite";
import db from "../sqliteDB/sqlite";

// Mock external dependencies
jest.mock('uuid', () => ({
    v4: () => 'mocked-uuid-123',
}));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../sqliteDB/sqlite', () => ({
    prepare: jest.fn(),
}));

describe('Auth Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Safe default fallback for db.prepare
        (db.prepare as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(undefined),
            run: jest.fn().mockReturnValue({ changes: 1 }),
        });

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('register', () => {
        test('should return 400 if username or password is missing', async () => {
            mockRequest.body = { username: 'user1' };

            await register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: expect.any(String) })
            );
        });

        test('should return 400 if user already exists', async () => {
            mockRequest.body = { username: 'existinguser', password: 'password123' };

            const mockStmt = { get: jest.fn().mockReturnValue({ id: 1, username: 'existinguser' }) };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);

            await register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Username already taken',
            });
        });

        test('should return 201 and create user when data is valid', async () => {
            mockRequest.body = { username: 'newuser', password: 'password123' };

            const mockSelectStmt = { get: jest.fn().mockReturnValue(undefined) };
            const mockInsertStmt = { run: jest.fn().mockReturnValue({ changes: 1 }) };

            (db.prepare as jest.Mock)
                .mockReturnValueOnce(mockSelectStmt)
                .mockReturnValueOnce(mockInsertStmt);

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password_123');

            await register(mockRequest as Request, mockResponse as Response);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: expect.objectContaining({ username: 'newuser' }),
                })
            );
        });
    });

    describe('login', () => {
        test('should return 401 if user is not found', async () => {
            mockRequest.body = { username: 'unknownuser', password: 'password123' };

            const mockStmt = { get: jest.fn().mockReturnValue(undefined) };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);

            await login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid username or password',
            });
        });

        test('should return 401 if password does not match', async () => {
            mockRequest.body = { username: 'testuser', password: 'wrongpassword' };

            const mockStmt = {
                get: jest.fn().mockReturnValue({
                    id: 'uuid-1',
                    username: 'testuser',
                    password: 'hashed_password_123'
                }),
            };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid username or password',
            });
        });

        test('should return a JWT token on valid credentials', async () => {
            mockRequest.body = { username: 'testuser', password: 'correctpassword' };

            const mockUser = {
                id: 'uuid-1',
                username: 'testuser',
                password: 'hashed_password_123',
            };
            const mockStmt = { get: jest.fn().mockReturnValue(mockUser) };

            (db.prepare as jest.Mock).mockReturnValue(mockStmt);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mocked_jwt_token');

            await login(mockRequest as Request, mockResponse as Response);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'uuid-1', username: 'testuser' },
                expect.any(String),
                expect.any(Object)
            );
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: 'mocked_jwt_token',
                })
            );
        });
    });
});