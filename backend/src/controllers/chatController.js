"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatMessage = void 0;
const aiService_1 = require("../services/aiService");
const db_1 = __importDefault(require("../config/db")); // Eğer burası hala kırmızıysa 'db.ts' dosya adını kontrol et.
const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Mesaj boş olamaz." });
        }
        const { sentiment } = await (0, aiService_1.analyzeSentiment)(message);
        const category = await (0, aiService_1.classifyCategory)(message);
        // Veritabanı kaydı
        const query = 'INSERT INTO messages (content, sentiment, category) VALUES ($1, $2, $3) RETURNING *';
        const values = [message, sentiment, category];
        const dbResult = await db_1.default.query(query, values);
        res.json({
            reply: `Analiz: ${sentiment} | Kategori: ${category} | Kayıt No: ${dbResult.rows[0].id}`
        });
    }
    catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: "Sistem hatası oluştu." });
    }
};
exports.handleChatMessage = handleChatMessage;
