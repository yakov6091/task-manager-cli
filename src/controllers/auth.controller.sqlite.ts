import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../sqliteDB/sqlite";
import { AuthenticationRequest } from "../middleware/auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const register = async (req: AuthenticationRequest, res: Response) => {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ message: 'Username and password required' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim());
    if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)').run(
        userId,
        username.trim(),
        hashedPassword
    );

    const token = jwt.sign(
        { id: userId, username: username.trim() },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: userId, username: username.trim() } });
}

export const login = async (req: AuthenticationRequest, res: Response) => {
    const { username, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim()) as any;
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username } });
}