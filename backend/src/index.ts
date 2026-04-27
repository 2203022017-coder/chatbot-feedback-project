import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
console.log("DİKKAT: YENİ KOD ÇALIŞIYOR!");
const app = express();
app.use(cors());

app.use(express.json());

// API Şifren
const groq = new Groq({ apiKey: "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" });

// GEÇİCİ VERİTABANI (Sayıları ve Tabloyu Tutar)
let feedbacksDB: any[] = [];

app.post('/api/feedback/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Sen bir müşteri şikayeti analiz asistanısın. Gelen metni analiz et ve JSON formatında şu bilgileri dön: {\"sentiment_label\": \"Negative\", \"Neutral\" veya \"Positive\", \"confidence_score\": 0.95 gibi bir sayı, \"nlp_category\": \"Lojistik\", \"Teknik\", \"Ödeme\", \"İletişim\", \"Ürün\" veya \"İşlem\"}"
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    // İçeriğin null olma ihtimalini ortadan kaldıralım
   const aiContent = chatCompletion.choices[0].message.content || "{}"; 
   const aiData = JSON.parse(aiContent);
    
    // YENİ ŞİKAYETİ VERİTABANINA KAYDET
    const newFeedback = {
      id: Date.now(),
      text: text,
      sentiment: aiData.sentiment_label,
      category: aiData.nlp_category,
      score: aiData.confidence_score,
      date: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' }) // Saat ve dakika
    };
    
    feedbacksDB.unshift(newFeedback); // En yeni şikayet en başa eklenir
    
    res.json({ success: true, data: { analysis: aiData } });
    
  } catch (error: any) {
    console.error("AI Hatası:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ADMIN PANELİNE SAYILARI VE "TABLOYU" YOLLAYAN KISIM
app.get('/api/admin/dashboard-stats', (req, res) => {
  try {
    const total = feedbacksDB.length;
    const negativeCount = feedbacksDB.filter(f => f.sentiment === 'Negative').length;
    const negativeRatio = total === 0 ? 0 : ((negativeCount / total) * 100).toFixed(1);

    res.json({
      total_feedbacks: total,
      resolved_tickets: 0,
      negative_ratio: negativeRatio,
      recent_feedbacks: feedbacksDB.slice(0, 5) // DOĞRUSU BU!
    });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.listen(3001, () => console.log('🚀 Backend API çalışıyor: http://localhost:3001'));