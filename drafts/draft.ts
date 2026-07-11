// app.get('/tasks', (req: Request, res: Response) => {
//     try {
//         const rawTasks = fs.readFileSync('./db/db.json', 'utf8');

//         const data = JSON.parse(rawTasks);
//         console.log(data)

//         return res.status(200).json(data.tasks);


//     } catch (error) {
//         console.error('Failed to load tasks:', error);
//         res.status(500).json({ message: 'Server error reading database file' });
//     }
// })

// app.post('/tasks/add', (req: Request, res: Response) => {
//     try {
//         const { description, completed } = req.body;

//         if (!description || completed === undefined) {
//             return res.status(400).json({ messasge: 'Missing fields' });
//         }

//         const rawTasks = fs.readFileSync('./db/db.json', 'utf8');
//         const data = JSON.parse(rawTasks);

//         const newTask = {
//             id: data.tasks.length > 0 ? data.tasks[data.tasks.length - 1].id + 1 : 1,
//             description: description,
//             completed: completed
//         };

//         data.tasks.push(newTask);

//         fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2), 'utf8');

//         return res.status(201).json(newTask);

//     } catch (error) {
//         console.error('Failed to add task:', error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// })

// app.patch('/tasks/patch/:id', (req: Request, res: Response) => {
//     try {
//         const { description, completed } = req.body;
//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).json({ message: 'Task ID is required' });
//         }

//         const rawTasks = fs.readFileSync('./db/db.json', 'utf8');
//         const data = JSON.parse(rawTasks);

//         const taskIndex = data.tasks.findIndex((task: any) => task.id === +id);

//         if (taskIndex === -1) {
//             return res.status(404).json({ message: 'Task not found' });
//         }

//         const updatedTask = {
//             ...data[taskIndex],
//             ...(description !== undefined && { description }),
//             ...(completed !== undefined && { completed })
//         };

//         data.tasks[taskIndex] = updatedTask;

//         fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2), 'utf8');

//         return res.status(200).json({ message: 'Task has been updated' });

//     } catch (error) {
//         console.error('Failed to update task:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// })

// app.delete('/tasks/delete/:id', (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).json({ message: 'Task ID is required' });
//         }

//         const rawTasks = fs.readFileSync('./db/db.json', 'utf8');
//         const data = JSON.parse(rawTasks);

//         const taskExists = data.tasks.some((task: any) => task.id === +id);
//         if (!taskExists) {
//             return res.status(404).json({ message: 'Task not found' });
//         }

//         const filteredTasks = data.tasks.filter((task: any) => task.id !== +id);

//         const updatedData = {
//             ...data,
//             tasks: filteredTasks
//         };

//         fs.writeFileSync('./db/db.json', JSON.stringify(updatedData, null, 2));

//         return res.status(200).json({ message: 'Task deleted' });
//     } catch (error) {
//         console.error('Failed to delete task:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// })