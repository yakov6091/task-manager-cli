import express, { Express, Request, Response } from "express";
import { taskRouter } from "./routes/task.manager.route";
import { authRouter } from "./routes/auth.route";
import cors from "cors";

const app: Express = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());
app.use('/tasks', taskRouter);
app.use('/auth', authRouter);

app.get('/health', (req: Request, res: Response) => {
    res.send('We are live!!!!');
});

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
});