import { Request, Response } from 'express';
import { analyzeSentiment, classifyCategory } from '../services/aiService';
import pool from '../config/db'; // Eğer burası hala kırmızıysa 'db.ts' dosya adını kontrol et.

export const handleChatMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Mesaj boş olamaz." });
        }

        const { sentiment } = await analyzeSentiment(message);
        const category = await classifyCategory(message);

        // Veritabanı kaydı
        const query = 'INSERT INTO messages (content, sentiment, category) VALUES ($1, $2, $3) RETURNING *';
        const values = [message, sentiment, category];
        
        const dbResult = await pool.query(query, values);

        res.json({
            reply: `Analiz: ${sentiment} | Kategori: ${category} | Kayıt No: ${dbResult.rows[0].id}`
        });
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: "Sistem hatası oluştu." });
    }
};