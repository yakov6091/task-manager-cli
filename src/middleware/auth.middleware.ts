import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = 'super_secret_temporary_key_12345';

export interface AuthenticationRequest extends Request {
    user?: {
        userId: number,
        username: string
    };
};

export const authenticateToken = (
    req: AuthenticationRequest,
    res: Response,
    next: NextFunction
): void => {
    // Get token from header: "Bearer <TOKEN>"
    const authHeader = req.headers["authorization"];
    // console.log('Header', authHeader)
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token)

    // If no token provided, block access
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        // Verify token integrity
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };

        // Attach decoded user info directly to the request object
        req.user = decoded;

        // Pass control to the next function (the task controller!)
        next()
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
}