import express from "express";
// import {
//     getTasks,
//     addTask,
//     patchTask,
//     deleteTask

// } from "../controllers/task.manager.controller";
import { authenticateToken } from "../middleware/auth.middleware";

// SQL DB
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask

} from "../controllers/task.controller.sqlite";

const router = express.Router();

// router.get('/', authenticateToken, getTasks);
// router.post('/add', authenticateToken, addTask);
// router.patch('/patch/:id', authenticateToken, patchTask);
// router.delete('/delete/:id', authenticateToken, deleteTask);

router.get('/', authenticateToken, getTasks);
router.post('/add', authenticateToken, createTask);
router.patch('/patch/:id', authenticateToken, updateTask);
router.delete('/delete/:id', authenticateToken, deleteTask);

export const taskRouter = router;






