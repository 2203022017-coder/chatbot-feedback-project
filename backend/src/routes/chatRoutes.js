"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/chatRoutes.ts
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const router = (0, express_1.Router)();
// POST http://localhost:5000/api/chat
router.post('/chat', chatController_1.handleChatMessage);
exports.default = router;
