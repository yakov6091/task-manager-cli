import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller";
import { register, login } from "../controllers/auth.controller.sqlite";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// Public auth routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// SQL db
router.post('/register', register);
router.post('/login', login);

// Protected auth route
router.get('/me', authenticateToken, getMe);

// export default router
export const authRouter = router;

