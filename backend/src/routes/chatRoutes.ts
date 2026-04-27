// src/routes/chatRoutes.ts
import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController';

const router = Router();

// POST http://localhost:5000/api/chat
router.post('/chat', handleChatMessage);

export default router;