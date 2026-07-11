import { Request, Response } from "express"

export const registerUser = (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello from backend registration!" });
}