import { type Task } from "../TaskManager";

const URL = 'http://localhost:4000/tasks';

// object way
export const taskService = {
    // GET tasks
    query: async (): Promise<Task[]> => {
        const response = await fetch(URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },
    // Create task
    create: async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        const response = await fetch(`${URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        })
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },
    // Patch task
    patch: async (taskId: number, fieldsToUpdate: Partial<Task>): Promise<Task> => {
        const response = await fetch(`${URL}/patch/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fieldsToUpdate)// pass the partial changes here!
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    // DELETE task
    remove: async (taskId: number): Promise<void> => {
        const response = await fetch(`${URL}/delete/${taskId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete task');
    }
}