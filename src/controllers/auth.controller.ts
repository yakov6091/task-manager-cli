import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const dbPath = path.join(__dirname, "../../db/db.json");

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    // res.status(200).json({ message: "Hello from backend registration!" });
    try {
        const { username, password } = req.body;

        // validation
        if (!username || !password) {
            res.status(400).json({ message: "Username annd password are required." });
            return;
        };

        // Read existing database
        const dbData = fs.readFileSync(dbPath, "utf-8");
        const db = JSON.parse(dbData);

        // Ensure the users array exists
        if (!db.users) {
            db.users = [];
        };

        // Check if user already exists
        const userExists = db.users.find((user: any) => user.username.toLowerCase() === username.toLowerCase());
        if (userExists) {
            res.status(400).json({ message: "Username is already taken." });
            return;
        }

        // Hash the password (10 "salt rounds" is the standard speed/security balance)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = {
            id: db.users.length > 0 ? db.users[db.users.length - 1].id + 1 : 1,
            username,
            hashedPassword
        };

        // Push to array and save back to db.json
        db.users.push(newUser);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: newUser.id,
                username: newUser.username
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error during registration" });
    }
}