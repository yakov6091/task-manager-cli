import { type Task } from "../TaskManager";

const TASKS_URL = 'https://task-manager-api-kw35.onrender.com/tasks';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

export const taskService = {
    // GET tasks
    query: async (): Promise<Task[]> => {
        const response = await fetch(TASKS_URL, {
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    // Create task
    create: async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        const response = await fetch(`${TASKS_URL}/add`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    // Patch task
    patch: async (taskId: number, fieldsToUpdate: Partial<Task>): Promise<Task> => {
        const response = await fetch(`${TASKS_URL}/patch/${taskId}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(fieldsToUpdate)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    // DELETE task
    remove: async (taskId: number): Promise<void> => {
        const response = await fetch(`${TASKS_URL}/delete/${taskId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => null);
            throw new Error(errData?.message || `Server responded with status ${response.status}`);
        }
    }
};