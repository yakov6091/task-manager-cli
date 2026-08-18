import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { AuthenticationRequest } from "../middleware/auth.middleware";

interface Tasks {
    id: number,
    description: string,
    isComplete: boolean
}

type task = {
    id: number,
    description: string,
    isComplete: boolean,
    userId: number
}

// Get tasks per user
export const getTasks = async (req: AuthenticationRequest, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../../db/db.json');

        const userId = req.user?.userId;
        const rawTasks = await fs.readFile(filePath, 'utf8');
        // console.log(rawTasks)

        const data = JSON.parse(rawTasks);
        // console.log('Tasks:', data)

        const userTasks = data.tasks.filter((task: task) => task.userId === userId);
        return res.status(200).json(userTasks);

    } catch (error) {
        console.error('Failed to load tasks:', error);
        res.status(500).json({ message: 'Server error reading database file' });
    }
};

// Add task
export const addTask = async (req: AuthenticationRequest, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../../db/db.json');

        const userId = req.user?.userId;
        const { title, description, isComplete } = req.body;

        if (!description || isComplete === undefined) {
            return res.status(400).json({ messasge: 'Missing fields' });
        }

        const rawTasks = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(rawTasks);

        const newTask = {
            id: data.tasks.length > 0 ? data.tasks[data.tasks.length - 1].id + 1 : 1,
            title: title,
            description: description,
            isComplete: isComplete,
            userId
        };

        data.tasks.push(newTask);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

        return res.status(201).json(newTask);

    } catch (error) {
        console.error('Failed to add task:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Patch task by user 
export const patchTask = async (req: AuthenticationRequest, res: Response) => {
    try {
        const { title, description, isComplete } = req.body;
        const { id } = req.params;
        const userId = req.user?.userId;
        const filePath = path.join(__dirname, '../../db/db.json');

        if (!id) {
            return res.status(400).json({ message: 'Task ID is required' });
        }


        const rawTasks = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(rawTasks);

        const taskIndex = data.tasks.findIndex((task: task) => task.id === +id);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = {
            ...data.tasks[taskIndex],
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(isComplete !== undefined && { isComplete }),
        };

        if (updatedTask.userId !== userId) {
            res.status(403).json({ message: 'Unauthorized to update this task.' });
            return;
        }

        data.tasks[taskIndex] = updatedTask;

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

        return res.status(200).json(updatedTask);

    } catch (error) {
        console.error('Failed to update task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user task
export const deleteTask = async (req: AuthenticationRequest, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../../db/db.json');
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const rawTasks = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(rawTasks);

        // 1. Use .find() to get the actual task object instead of .some()
        const taskToDelete = data.tasks.find((task: task) => task.id === +id);

        if (!taskToDelete) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        // 2. Compare user IDs safely using Number() casting
        if (Number(taskToDelete.userId) !== Number(userId)) {
            res.status(403).json({ message: 'Unauthorized to delete this task.' });
            return;
        }

        const filteredTasks = data.tasks.filter((task: task) => task.id !== +id);

        const updatedData = {
            ...data,
            tasks: filteredTasks
        };

        await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8');

        return res.status(200).json({ message: 'Task deleted' });

    } catch (error) {
        console.error('Failed to delete task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};