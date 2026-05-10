import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ANALYZE_SYSTEM_PROMPT, ANALYZE_MODEL } from './prompts/analyzePrompt';
import prisma from './lib/prisma';
console.log("DİKKAT: YENİ KOD ÇALIŞIYOR!");
const app = express();
app.use(cors());

app.use(express.json());

// API anahtarı sadece ortam değişkeninden okunur — kodda gömülü tutmak güvenlik açığıdır.
// Lokalde:   backend/.env  içinde  GROQ_API_KEY=...
// Render'da: Dashboard -> Environment -> GROQ_API_KEY ekle.
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error(
    "❌ GROQ_API_KEY tanımlı değil. backend/.env dosyasına ekleyin (lokalde) veya Render dashboard'dan environment variable olarak girin."
  );
}
const groq = new Groq({ apiKey: GROQ_API_KEY });

// GEÇİCİ VERİTABANI — fallback olarak duruyor.
// Prisma + SQLite kurulu ve çalışıyorsa kayıtlar DB'ye gider; aşağıdaki dizi sadece
// "kemer + askılı" güvenlik için (DB yokken sistem yine ayakta kalsın diye).
let feedbacksDB: any[] = [];

/** Saat:dakika formatında zaman damgası (frontend tablosunda gösterim için). */
const fmtTime = (d: Date) =>
  d.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' });

app.post('/api/feedback/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: ANALYZE_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: text
        }
      ],
      // Sınıflandırma kalitesi için 70B modeli kullanıyoruz. Sohbet endpoint'i (/api/chat)
      // hız için 8B kalmaya devam ediyor — analizde doğruluk, sohbette latency önceliği.
      model: ANALYZE_MODEL,
      response_format: { type: "json_object" }
    });

    // İçeriğin null olma ihtimalini ortadan kaldıralım
    const aiContent = chatCompletion.choices[0].message.content || "{}";
    const aiData = JSON.parse(aiContent);

    // HİBRİT DESTEK MANTIĞI:
    // Model güven skoru 0.85'in altındaysa otomatik insan operatöre yönlendir.
    // Llama 3.3-70B çoğu şikayette yüksek confidence dönüyor; 0.85 eşiği
    // gerçekten kafa karıştırıcı / muğlak şikayetleri yakalar.
    // Literatürde [Jain & Kumar 2019], [Følstad & Brandtzæg 2018] de "saf chatbot
    // değil, hibrit insan destekli yapı" önerilmektedir.
    const HUMAN_HELP_THRESHOLD = 0.85;
    const confidence = Number(aiData.confidence_score) || 0;
    const needsHuman = confidence < HUMAN_HELP_THRESHOLD;
    // Marka adı: Llama'nın çıkardığı değer veya "Belirtilmemiş" (boş/null/undefined fallback).
    const brand = (aiData.brand && String(aiData.brand).trim()) || "Belirtilmemiş";

    console.log(
      `📊 Analiz: brand=${brand}, cat=${aiData.nlp_category}, sent=${aiData.sentiment_label}, ` +
      `conf=${confidence.toFixed(2)}, needs_human=${needsHuman ? "✅ YES" : "❌ NO"}`
    );

    // 1) Önce Prisma DB'ye yazmayı dene (kalıcı kayıt için).
    //    Başarısız olursa (Prisma kurulu değil veya migrate edilmemiş) sessizce in-memory'e geçeriz.
    let savedId: number | null = null;
    if (prisma) {
      try {
        const created = await prisma.feedback.create({
          data: {
            text,
            sentiment: aiData.sentiment_label,
            category: aiData.nlp_category,
            brand,
            score: aiData.confidence_score,
            needs_human: needsHuman,
          }
        });
        savedId = created.id;
      } catch (dbErr: any) {
        console.warn("Prisma yazma başarısız, in-memory devam:", dbErr?.message);
      }
    }

    // 2) Fallback / aynalama: in-memory'e de yaz (DB yokken admin panel veri görmeli).
    const newFeedback = {
      id: savedId ?? Date.now(),
      text,
      sentiment: aiData.sentiment_label,
      category: aiData.nlp_category,
      brand,
      score: aiData.confidence_score,
      needs_human: needsHuman,
      date: fmtTime(new Date())
    };
    feedbacksDB.unshift(newFeedback);

    // Yanıta id, needs_human ve brand bilgisi de eklendi → frontend gösterimi için.
    // id'yi frontend ileride memnuniyet anketi (helpful) için /api/feedback/:id/rate'e yollayacak.
    res.json({
      success: true,
      data: {
        id: newFeedback.id,
        analysis: aiData,
        needs_human: needsHuman,
        brand,
      }
    });

  } catch (error: any) {
    console.error("AI Hatası:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ADMIN PANELİNE SAYILARI VE "TABLOYU" YOLLAYAN KISIM
// Önce Prisma'dan okumayı dener, başarısızsa in-memory diziyle aynı şekilde cevap verir.
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    if (prisma) {
      try {
        const [total, negativeCount, humanHelpCount, recent, brandGroups, helpfulYes, helpfulRated] = await Promise.all([
          prisma.feedback.count(),
          prisma.feedback.count({ where: { sentiment: 'Negative' } }),
          prisma.feedback.count({ where: { needs_human: true } }),
          prisma.feedback.findMany({
            orderBy: { created_at: 'desc' },
            take: 8,
          }),
          // Marka dağılımı: en çok şikayet alan markaları say (top 6).
          prisma.feedback.groupBy({
            by: ['brand'],
            _count: { brand: true },
            orderBy: { _count: { brand: 'desc' } },
            take: 6,
          }),
          // MEMNUNİYET ANKETİ: 👍 sayısı
          prisma.feedback.count({ where: { helpful: true } }),
          // İşaretlenmiş toplam (👍 + 👎)
          prisma.feedback.count({ where: { NOT: { helpful: null } } })
        ]);

        const negativeRatio = total === 0 ? "0" : ((negativeCount / total) * 100).toFixed(1);
        const helpfulRatio = helpfulRated === 0 ? null : ((helpfulYes / helpfulRated) * 100).toFixed(0);

        return res.json({
          total_feedbacks: total,
          resolved_tickets: 0,
          negative_ratio: negativeRatio,
          human_help_count: humanHelpCount, // Hibrit destek metriği — kaç şikayet insan operatöre yönlendirildi
          // MEMNUNİYET METRİĞİ: helpful_ratio = 👍 / (👍+👎). Hiç oy yoksa null.
          helpful_ratio: helpfulRatio,
          helpful_rated_count: helpfulRated,
          // MARKA ENTEGRASYONU: en çok şikayet alan markalar listesi.
          top_brands: brandGroups.map((g: any) => ({
            brand: g.brand,
            count: g._count.brand,
          })),
          recent_feedbacks: recent.map((f: any) => ({
            id: f.id,
            text: f.text,
            brand: f.brand,
            sentiment: f.sentiment,
            category: f.category,
            score: f.score,
            needs_human: f.needs_human,
            helpful: f.helpful,
            date: fmtTime(f.created_at),
          }))
        });
      } catch (dbErr: any) {
        console.warn("Prisma okuma başarısız, in-memory'e düşülüyor:", dbErr?.message);
      }
    }

    // Fallback: in-memory dizi (DB yoksa). Marka istatistiklerini elle hesaplıyoruz.
    const total = feedbacksDB.length;
    const negativeCount = feedbacksDB.filter(f => f.sentiment === 'Negative').length;
    const humanHelpCount = feedbacksDB.filter(f => f.needs_human === true).length;
    const negativeRatio = total === 0 ? "0" : ((negativeCount / total) * 100).toFixed(1);

    const brandCounts: Record<string, number> = {};
    for (const f of feedbacksDB) {
      const b = f.brand || "Belirtilmemiş";
      brandCounts[b] = (brandCounts[b] || 0) + 1;
    }
    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([brand, count]) => ({ brand, count }));

    // Memnuniyet metriği (in-memory fallback)
    const helpfulYes = feedbacksDB.filter(f => f.helpful === true).length;
    const helpfulRated = feedbacksDB.filter(f => f.helpful === true || f.helpful === false).length;
    const helpfulRatio = helpfulRated === 0 ? null : ((helpfulYes / helpfulRated) * 100).toFixed(0);

    res.json({
      total_feedbacks: total,
      resolved_tickets: 0,
      negative_ratio: negativeRatio,
      human_help_count: humanHelpCount,
      helpful_ratio: helpfulRatio,
      helpful_rated_count: helpfulRated,
      top_brands: topBrands,
      recent_feedbacks: feedbacksDB.slice(0, 8)
    });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// =====================================================================
// YENİ: KONUŞMA TABANLI CHAT ENDPOINT'İ
// ---------------------------------------------------------------------
// Chatbot'un akıllı, bağlamlı sohbet edebilmesini sağlar.
// İstemciden gelen "history" (geçmiş mesajlar) ile birlikte yeni mesajı
// Groq + Llama 3.1 modeline gönderip empatik, doğal bir yanıt üretir.
// Mevcut /api/feedback/analyze endpoint'ine dokunulmamıştır;
// admin panelindeki istatistik akışı eskisi gibi devam eder.
// =====================================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { history = [], message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: "Mesaj boş olamaz." });
    }

    // Asistanın kişiliğini ve davranış kurallarını tanımlayan sistem prompt'u
    const systemPrompt = {
      role: "system" as const,
      content: `Sen "AI Feedback Assistant" adında, müşteri geri bildirimlerini dinleyen empatik bir destek asistanısın.

GÖREVLER:
- Kullanıcıyı dikkatle dinle, ne yaşadığını anla.
- Kısa, net, samimi yanıtlar ver (en fazla 2-3 cümle).
- Şikayet varsa empati göster ve çözüm sürecinden bahset.
- Olumlu geri bildirim varsa içtenlikle teşekkür et.
- Soru sorulduysa direkt cevapla.
- Türkçe konuş, profesyonel ama sıcak bir dil kullan.
- ASLA uydurma bilgi verme. Bilmiyorsan "ilgili ekibe yönlendireyim" de.

ŞİRKET BAĞLAMI (AI Feedback Hub):
- Müşteri geri bildirimlerini toplayıp yapay zeka ile analiz eden bir platform.
- Şikayetler şu kategorilere ayrılır: Lojistik, Teknik, Ödeme, İletişim, Ürün, İşlem.
- Çözüm süresi standart olarak 24-48 saattir.
- Her şikayet öncelik düzeyine göre ilgili birime yönlendirilir.

KESİNLİKLE YAPMA:
- "Ben bir yapay zekayım" gibi cümlelerle kendini deşifre etme.
- Cevap içinde markdown (**, ##, vb.) kullanma.
- 3 cümleden uzun yanıt üretme.`
    };

    // Geçmiş mesajları Groq formatına dönüştür (max son 10 mesaj — bağlam ama token tasarrufu)
    const recentHistory = (Array.isArray(history) ? history.slice(-10) : []).map((m: any) => ({
      role: (m.role === "bot" || m.role === "assistant") ? "assistant" as const : "user" as const,
      content: String(m.text || m.content || "")
    })).filter(m => m.content.trim().length > 0);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        systemPrompt,
        ...recentHistory,
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 250,
    });

    const reply = chatCompletion.choices[0]?.message?.content?.trim()
      || "Üzgünüm, şu an yanıt üretemedim. Tekrar dener misiniz?";

    res.json({ success: true, reply });

  } catch (error: any) {
    console.error("Chat Hatası:", error);
    res.status(500).json({ success: false, error: error.message || "Sunucu hatası" });
  }
});

// =====================================================================
// YENİ: MEMNUNİYET ANKETİ ENDPOINT'İ
// ---------------------------------------------------------------------
// Kullanıcı bot cevabını faydalı bulup bulmadığını işaretler (👍/👎).
// Frontend bu endpoint'e POST gönderir, helpful alanı DB'de güncellenir.
// Mevcut akışları bozmaz; opsiyonel bir geri bildirim katmanı.
// =====================================================================
app.post('/api/feedback/:id/rate', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { helpful } = req.body;

    if (isNaN(id)) return res.status(400).json({ success: false, error: "Geçersiz id" });
    if (typeof helpful !== "boolean") {
      return res.status(400).json({ success: false, error: "helpful alanı boolean olmalı" });
    }

    // 1) DB güncelle (varsa)
    if (prisma) {
      try {
        await prisma.feedback.update({
          where: { id },
          data: { helpful }
        });
      } catch (dbErr: any) {
        console.warn("Prisma rate güncelleme başarısız, in-memory'e devam:", dbErr?.message);
      }
    }

    // 2) In-memory dizide de güncelle (DB yoksa veya yedek olarak)
    const idx = feedbacksDB.findIndex(f => f.id === id);
    if (idx !== -1) feedbacksDB[idx].helpful = helpful;

    console.log(`👍/👎 [Rate] id=${id}, helpful=${helpful}`);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Rate endpoint hatası:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================================
// YENİ: STREAMING SOHBET ENDPOINT'İ (Server-Sent Events)
// ---------------------------------------------------------------------
// /api/chat ile aynı işi yapar AMA cevabı token-by-token akıtır (ChatGPT efekti).
// Mevcut /api/chat endpoint'i fallback olarak duruyor — frontend stream
// başarısız olursa ona düşer. Hiçbir mevcut akış bozulmuyor.
// =====================================================================
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { history = [], message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: "Mesaj boş olamaz." });
    }

    // SSE başlık ayarları
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // nginx/proxy buffering kapalı
    // KRİTİK: Header'ları hemen yolla ve TCP Nagle algoritmasını kapat
    // → Token'ların biriktirilmeden anında client'a akmasını sağlar.
    res.flushHeaders();
    res.socket?.setNoDelay(true);

    const systemPrompt = {
      role: "system" as const,
      content: `Sen "AI Feedback Assistant" adında, müşteri geri bildirimlerini dinleyen empatik bir destek asistanısın.

GÖREVLER:
- Kullanıcıyı dikkatle dinle, ne yaşadığını anla.
- Kısa, net, samimi yanıtlar ver (en fazla 2-3 cümle).
- Şikayet varsa empati göster ve çözüm sürecinden bahset.
- Olumlu geri bildirim varsa içtenlikle teşekkür et.
- Soru sorulduysa direkt cevapla.
- Türkçe konuş, profesyonel ama sıcak bir dil kullan.
- ASLA uydurma bilgi verme. Bilmiyorsan "ilgili ekibe yönlendireyim" de.

ŞİRKET BAĞLAMI (AI Feedback Hub):
- Müşteri geri bildirimlerini toplayıp yapay zeka ile analiz eden bir platform.
- Şikayetler şu kategorilere ayrılır: Lojistik, Teknik, Ödeme, İletişim, Ürün, İşlem.
- Çözüm süresi standart olarak 24-48 saattir.

KESİNLİKLE YAPMA:
- "Ben bir yapay zekayım" gibi cümlelerle kendini deşifre etme.
- Cevap içinde markdown (**, ##, vb.) kullanma.
- 3 cümleden uzun yanıt üretme.`
    };

    const recentHistory = (Array.isArray(history) ? history.slice(-10) : []).map((m: any) => ({
      role: (m.role === "bot" || m.role === "assistant") ? "assistant" as const : "user" as const,
      content: String(m.text || m.content || "")
    })).filter(m => m.content.trim().length > 0);

    const stream = await groq.chat.completions.create({
      messages: [systemPrompt, ...recentHistory, { role: "user", content: message }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 250,
      stream: true,
    });

    // Token'ları SSE formatında akıt
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || '';
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error: any) {
    console.error("Stream Hatası:", error);
    // Stream başlamamışsa normal hata, başlamışsa SSE hatası dön
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'stream error' })}\n\n`);
      res.end();
    }
  }
});

// =====================================================================
// YENİ: DOĞRULUK ÖLÇÜM SONUÇLARI ENDPOINT'İ
// ---------------------------------------------------------------------
// "npm run measure" ile çalıştırılan ölçüm scripti, sonuçları
// backend/data/accuracy_results.json'a yazar. Bu endpoint o dosyayı okuyup
// admin paneline gerçek doğruluk yüzdesini sunar (vize raporundaki sahte %95
// yerine). Eğer ölçüm henüz yapılmadıysa success:false dönüp UI'ı bilgilendirir.
// =====================================================================
app.get('/api/admin/accuracy', (req, res) => {
  try {
    const path = join(process.cwd(), 'data', 'accuracy_results.json');
    if (!existsSync(path)) {
      return res.json({
        success: false,
        message: "Doğruluk ölçümü henüz yapılmadı. backend klasöründe 'npm run measure' çalıştırın."
      });
    }
    const data = JSON.parse(readFileSync(path, 'utf-8'));
    res.json({
      success: true,
      timestamp: data.timestamp,
      model: data.model,
      total_samples: data.total_samples,
      category_accuracy_pct: data.category_accuracy_pct,
      sentiment_accuracy_pct: data.sentiment_accuracy_pct,
      overall_accuracy_pct: data.overall_accuracy_pct,
      per_category_accuracy: data.per_category_accuracy
    });
  } catch (error: any) {
    console.error("Accuracy okuma hatası:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => console.log('🚀 Backend API çalışıyor: http://localhost:3001'));