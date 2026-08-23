import { useState, useEffect } from 'react';
import { Header } from './cmps/header';
import { TaskCard } from './cmps/TaskCard';
import { TaskForm } from './cmps/TaskForm';
import { TaskFilters } from './cmps/TaskFilters';
import { taskService } from './services/task.service';
import { authService } from './services/auth.service';

export interface Task {
    id: number,
    title: string,
    description: string,
    isComplete: boolean,
    createdAt: Date,
}

export type FilterStatus = 'all' | 'active' | 'completed';

export function EmailManager() {
    // const [tasks, setTasks] = useState<Task[]>([]); // way 1
    // const [tasks, setTasks] = useState<Task[]>(getInitialTasks); // way 2 with local storage
    const [tasks, setTasks] = useState<Task[]>([]); // way 3 with node.ts (backend)
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Testing 
    const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);

    useEffect(() => {
        async function loadTasks() {
            // 🛑 Guard check: Stop immediately if no user is logged in!
            if (!currentUser) {
                setTasks([]);
                return;
            }

            try {
                const backendTasks = await taskService.query(); // Talk to Node (backend)
                setTasks(backendTasks);
            } catch (error) {
                console.error('Failed to load initial tasks:', error);
            }
        }
        loadTasks()
    }, [currentUser]); // Empty array means "Run once on load" OR Re-run every time currentUser changes

    const filteredTasks = tasks.filter(task => {
        // NOTE: Using .includes() instead of RegExp() because RegExp can crash 
        // the entire React app if a user types unescaped characters like '[' or '?'

        // 1. Check the status filter
        const matchStatus =
            filter === 'all' ||
            (filter === 'active' && !task.isComplete) ||
            (filter === 'completed' && task.isComplete);

        // if (filter === 'active') return !task.isComplete;
        // if (filter === 'completed') return task.isComplete;

        // 2. Check the search text (looks at title or description)
        const matchSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchStatus && matchSearch;
    })

    // useEffect(() => {
    //     localStorage.setItem('tasks', JSON.stringify(tasks));
    // }, [tasks]);

    const handleLogout = () => {
        // Destroy the token in localStorage
        authService.logout();

        // Update React state to hide the user UI
        setCurrentUser(null);
        setTasks([]);
    }

    return (
        <>
            <Header
                currentUser={currentUser}
                onLoginSuccess={(user) => setCurrentUser(user)}
                onLogout={handleLogout}
            />

            <main className="w-full p-8 min-h-screen bg-slate-50">
                {editTask ? (
                    <TaskForm
                        initialTask={editTask}
                        // onAddTask={(formData) => {  // react version 
                        //     setTasks(tasks.map(task =>
                        //         task.id === editTask.id
                        //             ? { ...editTask, ...formData }
                        //             : task
                        //     ))
                        //     setEditTask(null)
                        // }}
                        onAddTask={async (formData) => {
                            try {
                                const updatedTaskFormServer = await taskService.patch(editTask.id, {
                                    title: formData.title,
                                    description: formData.description,
                                    // isComplete: formData.isComplete,
                                });

                                // Update the state using the fresh data returned from the database
                                setTasks(prevTasks => prevTasks.map((task) =>
                                    task.id === editTask.id ? updatedTaskFormServer : task));

                                setEditTask(null);

                            } catch (error) {
                                console.error('Failed to update task on backend:', error)
                            }
                        }}
                    />
                ) : (
                    <TaskForm
                        onAddTask={async (formData) => {
                            try {
                                // Call your service and wait for the backend to save it
                                const savedTaskFromServer = await taskService.create({
                                    // id: Date.now(),
                                    title: formData.title,
                                    description: formData.description,
                                    isComplete: formData.isComplete,
                                    // createdAt: new Date()
                                });
                                // Take the official task returned by your backend and push it into state
                                setTasks(prev => [savedTaskFromServer, ...prev]);
                            } catch (error) {
                                // If the server is offline, your app won't crash!
                                console.error('Could not save task to backend:', error);
                            }
                        }} />
                )}

                <div className="max-w-md mx-auto mb-4">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-md text-slate-800"
                    />
                </div>

                <TaskFilters
                    currentFilter={filter}
                    onFilterChange={setFilter}
                />

                {/*Render tasks */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {filteredTasks.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-slate-500 text-lg">No tasks yet. Add one above!</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={(task) => setEditTask(task)}
                                onDelete={async (taskId) => {
                                    try {
                                        await taskService.remove(taskId); // Talk to backend
                                        setTasks(tasks.filter(task => task.id !== taskId)); // Update frontend UI
                                    } catch (error) {
                                        console.error('Could not delete:', error);
                                    }
                                }}
                                onToggleComplete={async (taskId) => {
                                    // setTasks(tasks.map(task => task.id === taskId ? { ...task, isComplete: !task.isComplete } : task)) // react way
                                    try {
                                        // Find the task in your current state to see its current completion status
                                        const taskToToggle = tasks.find(task => task.id == taskId);
                                        if (!taskToToggle) return;

                                        // Send the opposite value to the backend
                                        const updatedTaskFromServer = await taskService.patch(taskId, {
                                            isComplete: !taskToToggle.isComplete
                                        });

                                        // Update the frontend UI with the official task returned by the server
                                        setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? updatedTaskFromServer : task));
                                    } catch (error) {
                                        console.error('Could not toggle complete status:', error);
                                    }
                                }}
                            />
                        ))
                    )}
                </div>
            </main>
        </>
    )
}