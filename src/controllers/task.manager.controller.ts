import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { title } from "process";

interface Tasks {
    id: number,
    description: string,
    isComplete: boolean
}

type task = {
    id: number,
    description: string,
    isComplete: boolean
}

export const getTasks = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../../db/db.json');

        const rawTasks = await fs.readFile(filePath, 'utf8');
        console.log(rawTasks)

        const data = JSON.parse(rawTasks);
        console.log('Tasks:', data)
        return res.status(200).json(data.tasks);

    } catch (error) {
        console.error('Failed to load tasks:', error);
        res.status(500).json({ message: 'Server error reading database file' });
    }
};

export const addTask = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../../db/db.json');

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
            isComplete: isComplete
        };

        data.tasks.push(newTask);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

        return res.status(201).json(newTask);

    } catch (error) {
        console.error('Failed to add task:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const patchTask = async (req: Request, res: Response) => {
    try {
        const { title, description, isComplete } = req.body;
        const { id } = req.params;
        const filePath = path.join(__dirname, '../../db/db.json');

        if (!id) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const rawTasks = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(rawTasks);

        const taskIndex = data.tasks.findIndex((task: any) => task.id === +id);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = {
            ...data.tasks[taskIndex],
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(isComplete !== undefined && { isComplete })
        };

        data.tasks[taskIndex] = updatedTask;

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

        return res.status(200).json(updatedTask);

    } catch (error) {
        console.error('Failed to update task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../../db/db.json');
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const rawTasks = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(rawTasks);

        const taskExists = data.tasks.some((task: any) => task.id === +id);
        if (!taskExists) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const filteredTasks = data.tasks.filter((task: any) => task.id !== +id);

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