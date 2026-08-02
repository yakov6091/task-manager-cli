import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected auth route
router.get('/me', authenticateToken, getMe);

// export default router
export const authRouter = router;

