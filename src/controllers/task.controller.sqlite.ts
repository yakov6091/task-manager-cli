import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid"
import db from "../sqliteDB/sqlite";
import { AuthenticationRequest } from "../middleware/auth.middleware";

export const getTasks = (req: AuthenticationRequest, res: Response) => {
    const userId = req.user?.userId; // Extracted from JWT auth middleware

    // statement
    const stmt = db.prepare('SELECT * FROM tasks WHERE userId = ?');
    const tasks = stmt.all(userId);

    // Convert integer back to boolean for React
    const formatted = tasks.map((task: any) => ({
        ...task,
        isComplete: Boolean(task.isComplete)
    }));

    res.json(formatted);
};

export const createTask = (req: AuthenticationRequest, res: Response) => {
    const { title, description } = req.body;
    const userId = req.user?.userId;
    const id = uuidv4();

    if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const stmt = db.prepare(`
        INSERT INTO tasks (id, title, description, isComplete, userId)
        VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, title.trim(), description?.trim() || '', 0, userId);

    res.status(200).json({
        id,
        title: title.trim(),
        description: description?.trim() || '',
        isComplete: false,
        userId
    });
}

export const updateTask = (req: AuthenticationRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, isComplete } = req.body;
    const userId = req.user?.userId;

    const stmt = db.prepare(`
        UPDATE tasks 
        SET title = ?, description = ?, isComplete = ?
        WHERE id = ? AND userId = ?
    `);

    const result = stmt.run(title.trim(), description?.trim() || '', isComplete ? 1 : 0, id, userId);

    if (result.changes === 0) {
        return res.status(400).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ id, title, description, isComplete, userId });
};

export const deleteTask = (req: AuthenticationRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND userId = ?');
    const result = stmt.run(id, userId);

    if (result.changes === 0) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted' });
};