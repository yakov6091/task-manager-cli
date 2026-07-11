import { useEffect, useState } from "react";
import type { Task } from "../EmailManager";

interface TaskFormData {
    title: string,
    description: string,
    isComplete: boolean
}

interface TaskFormProps {
    onAddTask: (task: TaskFormData) => void,
    initialTask?: Task
}

export function TaskForm({ onAddTask, initialTask }: TaskFormProps) {
    const [form, setForm] = useState<TaskFormData>({
        title: initialTask?.title || '',
        description: initialTask?.description || '',
        isComplete: initialTask?.isComplete || false
    });

    useEffect(() => {
        if (initialTask) {
            setForm({
                title: initialTask.title,
                description: initialTask.description,
                isComplete: initialTask.isComplete
            })
        } else {
            setForm({ title: '', description: '', isComplete: false });
        }

    }, [initialTask]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="max-w-md mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 p-8 rounded-xl shadow-md border border-blue-200 mb-8">
            <h3 className="text-xl font-bold mb-6 bg-linear-to-r from-sky-300 to-emerald-500 bg-clip-text text-transparent">Create New Task</h3>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-md font-semibold text-slate-900 mb-1">Task Title:</label>
                    <input
                        className="w-full px-1 py-1 mb-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-slate-900 placeholder-slate-400"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Buy me a coffie"
                    />
                </div>
            </div>

            <div>
                <label className="block text-md font-semibold text-slate-900 mb-1 ">Description:</label>
                <textarea
                    className="w-full px-1 py-1 mb-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-slate-900 placeholder-slate-400 resize-none"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Add details about your task..."
                />
            </div>

            <button
                className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-xl cursor-pointer"
                onClick={() => {
                    onAddTask(form)
                    if (!initialTask) { // Only clear if adding new (not editing)
                        setForm({ title: '', description: '', isComplete: false })
                    }
                }}
            >
                {initialTask ? 'Update Task' : '+ Add Task'}
            </button>
        </div>
    )
}