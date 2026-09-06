import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.middleware";
// import test, { beforeEach, describe } from "node:test";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

describe('authenticateToken Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunciton: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunciton = jest.fn();
    });

    test('should retrun 401 if Authorization header is missing', () => {
        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunciton
        );

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Access denied. No token provided.',
        });
        expect(nextFunciton).not.toHaveBeenCalled();
    });

    test('should return 403 if token is invalid or malformed', () => {
        mockRequest.headers = {
            authorization: 'Bearer bad_token_string',
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunciton
        );

        expect(mockResponse.status).toHaveBeenLastCalledWith(403);
        expect(mockResponse.json).toHaveBeenLastCalledWith({
            message: 'Invalid or expired token'
        });
        expect(nextFunciton).not.toHaveBeenCalled();
    });

    test('should call next() and attach user object to req when token is valid', () => {
        const payload = { id: 'user-uuid-123', username: 'testuser' };
        const validToken = jwt.sign(payload, JWT_SECRET);

        mockRequest.headers = {
            authorization: `Bearer ${validToken}`,
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunciton
        );

        expect((mockRequest as any).user).toEqual(
            expect.objectContaining(payload)
        );
        expect(nextFunciton).toHaveBeenCalledTimes(1);
    });
});