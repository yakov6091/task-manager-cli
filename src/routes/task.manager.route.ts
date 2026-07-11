import express from "express";
import {
    getTasks,
    addTask,
    patchTask,
    deleteTask

} from "../controllers/task.manager.controller";

const router = express.Router();

router.get('/', getTasks);
router.post('/add', addTask);
router.patch('/patch/:id', patchTask);
router.delete('/delete/:id', deleteTask);

export const taskRouter = router;






