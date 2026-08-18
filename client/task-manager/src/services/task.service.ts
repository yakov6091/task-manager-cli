import { type Task } from "../TaskManager";

const URL = 'http://localhost:4000/tasks';

// Helper function to dynamically add headers with the JWT token
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

// object way
export const taskService = {
    // GET tasks
    query: async (): Promise<Task[]> => {
        const response = await fetch(URL, {
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },
    // Create task
    create: async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        const response = await fetch(`${URL}/add`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },
    // Patch task
    patch: async (taskId: number, fieldsToUpdate: Partial<Task>): Promise<Task> => {
        const response = await fetch(`${URL}/patch/${taskId}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(fieldsToUpdate)// pass the partial changes here!
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    // DELETE task
    remove: async (taskId: number): Promise<void> => {
        const response = await fetch(`${URL}/delete/${taskId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => null);
            throw new Error(errData?.message || `Server responded with status ${response.status}`);
            throw new Error('Failed to delete task');
        }
    }
};