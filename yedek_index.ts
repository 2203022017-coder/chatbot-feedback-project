import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import Groq from 'groq-sdk';

const prisma = new PrismaClient();
const app = express();

// Güvenlik ve JSON ayarları
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// DİKKAT: Aşağıdaki tırnak içine kendi Groq API Key'ini yaz!
// ---------------------------------------------------------
const groq = new Groq({ apiKey: "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" });

// Veritabanında test yapabilmemiz için örnek kullanıcı ve oturum oluşturan fonksiyon
async function initDB() {
  const user = await prisma.user.upsert({
    where: { username: "test_customer" },
    update: {},
    create: { username: "test_customer", role: "user" }
  });
  await prisma.chatSession.upsert({
    where: { session_id: 1 },
    update: {},
    create: { session_id: 1, user_id: user.user_id, session_status: "active" }
  });
  console.log("✅ Veritabanı test kullanıcısı hazır.");
}
initDB();

// Şikayet Analizi (POST /api/feedback/analyze)
app.post('/api/feedback/analyze', async (req, res) => {
  const { text } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Sen kurumsal bir müşteri şikayet analiz uzmanısın. Gelen metni analiz et ve SADECE şu formatta JSON döndür: {\"sentiment\": \"Negative\", \"Positive\" veya \"Neutral\", \"category\": \"Lojistik\", \"Teknik\", \"Ödeme\", \"Müşteri Hizmetleri\" veya \"Genel\", \"confidence\": 0.95}. ÖNEMLİ KURALLAR: 1) Eğer gelen metin anlamsız rastgele harflerse (örn: 'asdasd'), sadece selamlama içeriyorsa veya şikayet değilse sentiment'i kesinlikle 'Neutral', category'yi 'Genel', confidence'ı 0.99 yap. 2) Asla JSON formatı dışına çıkma."
        },
        { role: "user", content: text }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(chatCompletion.choices[0].message.content || "{}");

    const savedMessage = await prisma.message.create({
      data: {
        session_id: 1,
        sender_type: "user",
        content: text,
        analysis: {
          create: {
            sentiment_label: aiResponse.sentiment || "Neutral",
            confidence_score: aiResponse.confidence || 0.80,
            nlp_category: aiResponse.category || "Diğer"
          }
        }
      },
      include: { analysis: true }
    });

    res.json({ success: true, data: savedMessage });
  } catch (error) {
    console.error("AI Hatası:", error);
    res.status(500).json({ error: "Yapay zeka analizi sırasında bir hata oluştu." });
  }
});

// Yönetici İstatistikleri (GET /api/admin/dashboard-stats)
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    const totalMessages = await prisma.message.count();
    const negativeAnalyses = await prisma.analysisResult.count({
      where: { sentiment_label: "Negative" }
    });
    
    const negativeRatio = totalMessages > 0 ? (negativeAnalyses / totalMessages) * 100 : 0;

    res.json({
      total_feedbacks: totalMessages,
      negative_ratio: negativeRatio.toFixed(1),
      resolved_tickets: 0
    });
  } catch (error) {
    res.status(500).json({ error: "İstatistikler getirilemedi." });
  }
});

// Kategori Filtreleme (GET /api/feedbacks/filter)
app.get('/api/feedbacks/filter', async (req, res) => {
  const category = req.query.category as string;
  
  try {
    const feedbacks = await prisma.analysisResult.findMany({
      where: category && category !== "TÜMÜ" ? { nlp_category: category } : {},
      include: { message: true },
      orderBy: { analysis_id: 'desc' }
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Geri bildirimler filtrelenemedi." });
  }
});

// Sunucuyu Başlat
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend API çalışıyor: http://localhost:${PORT}`);
});