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

// =====================================================================
// RAG (Retrieval-Augmented Generation) — Bilgi Tabanı
// ---------------------------------------------------------------------
// Bot uydurma yapmasın, gerçek şirket politikalarına göre cevap versin diye
// backend/data/knowledge_base.md dosyasını startup'ta okuyup sistem prompt'una
// inject ediyoruz. Llama 3.x'in 128K context window'u bunu rahatlıkla taşır.
// =====================================================================
let KB_CONTENT = "";
try {
  const kbPath = join(process.cwd(), "data", "knowledge_base.md");
  if (existsSync(kbPath)) {
    KB_CONTENT = readFileSync(kbPath, "utf-8");
    console.log(`📚 Bilgi tabanı yüklendi (${KB_CONTENT.length} karakter)`);
  } else {
    console.warn(`⚠️  Bilgi tabanı bulunamadı: ${kbPath}`);
  }
} catch (err: any) {
  console.warn("⚠️  KB okuma hatası:", err?.message);
}

/** Saat:dakika formatında zaman damgası (frontend tablosunda gösterim için).
 *  Render sunucusu UTC çalışıyor; Türkiye saatine (UTC+3) çevirmek için
 *  timeZone parametresi ile Europe/Istanbul'a sabitliyoruz. */
const fmtTime = (d: Date) =>
  d.toLocaleTimeString("tr-TR", {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Istanbul'
  });

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
        const [total, negativeCount, humanHelpCount, recent, brandGroups, helpfulYes, helpfulRated, categoryGroups, sentimentGroups] = await Promise.all([
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
          prisma.feedback.count({ where: { NOT: { helpful: null } } }),
          // KATEGORİ DAĞILIMI: donut chart için
          prisma.feedback.groupBy({
            by: ['category'],
            _count: { category: true },
          }),
          // DUYGU DAĞILIMI: pie chart için (Negative/Neutral/Positive)
          prisma.feedback.groupBy({
            by: ['sentiment'],
            _count: { sentiment: true },
          })
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
          // KATEGORİ DAĞILIMI: admin paneldeki donut chart için
          category_distribution: categoryGroups.map((g: any) => ({
            category: g.category,
            count: g._count.category,
          })),
          // DUYGU DAĞILIMI: pie chart için
          sentiment_distribution: sentimentGroups.map((g: any) => ({
            sentiment: g.sentiment,
            count: g._count.sentiment,
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

DİL KURALLARI:
- Türkçe karakterleri (ş, Ş, ç, Ç, ğ, Ğ, ı, İ, ö, Ö, ü, Ü) HER ZAMAN doğru kullan. "Sirket" yerine "Şirket", "kargonuz gec" yerine "kargonuz geç" yaz. Kayma yapma.
- Yabancı marka adlarını Türkçe yazıma çevirme — "Trendyol", "Migros" orijinal kalsın.

MARKA AYIRT ETME (ÖNEMLİ):
AI Feedback Hub bir aracılık platformudur, direkt satıcı değildir. Kullanıcılar farklı markalardan (Trendyol, Migros, Getir, Hepsiburada, Turkcell vs.) şikayet eder; biz bunları analiz edip ilgili markaya iletiriz.
- Kullanıcı belirli bir markadan bahsetmiş ise (örn. "Trendyol kargom geç geldi") → O MARKAYA yönlendir: "Trendyol'un kendi politikası farklı olabilir, şikayetinizi onlara ulaştırıyoruz." gibi.
- Marka belirtmemişse → genel rehberlik için aşağıdaki bilgi tabanını kullan.
- HİÇBİR ZAMAN belirli bir markanın iade/kargo süresini bizim platform politikamız gibi sunma.

KESİNLİKLE YAPMA:
- "Ben bir yapay zekayım" gibi cümlelerle kendini deşifre etme.
- Cevap içinde markdown (**, ##, vb.) kullanma.
- 3 cümleden uzun yanıt üretme.

${KB_CONTENT ? `
=== ŞİRKET BİLGİ TABANI (RAG) ===
Aşağıdaki bilgileri kullanarak kullanıcının sorduğu konularda SADECE bu kaynağa göre cevap ver.
Doküman dışı konularda "Bu konuda kesin bilgim yok, ilgili ekibe yönlendireyim" de.
Sayısal değerleri (gün, saat, yüzde) BİREBİR aktar.

${KB_CONTENT}
=== BİLGİ TABANI SONU ===
` : ''}`
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
// YENİ: AI AGENT ENDPOINT'İ (Function Calling / Tool Use)
// ---------------------------------------------------------------------
// Bot artık gerçek bir AI Agent: kullanıcı "kaç şikayet var?", "en çok
// hangi marka şikayet alıyor?" gibi sorduğunda Llama 3.3'ün tool calling
// yeteneği ile DB'ye bakar ve gerçek sayılarla cevap verir. Uydurmaz.
//
// Akış:
//   1. Kullanıcı mesajı + tool tanımları Llama'ya gönderilir.
//   2. Llama bir tool çağırması gerekiyorsa tool_calls döner.
//   3. Backend tool'u execute eder (Prisma sorgusu / in-memory hesap).
//   4. Tool sonucu Llama'ya 2. round'da gönderilir.
//   5. Llama sonuçları cümle haline getirip kullanıcıya cevap verir.
// =====================================================================

// Tool tanımları — OpenAI function calling formatı (Groq SDK destekliyor)
const AGENT_TOOLS: any[] = [
  {
    type: "function",
    function: {
      name: "get_total_feedbacks",
      description: "Sistemdeki toplam şikayet/geri bildirim sayısını döndürür.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "get_negative_count",
      description: "Negatif duygu durumuna sahip şikayet sayısını döndürür.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "get_top_brands",
      description: "En çok şikayet alan ilk 5 markayı (marka adı + sayı) döndürür.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "get_feedback_by_id",
      description: "Belirli bir şikayet ID'sine ait detayları (kategori, duygu, marka, durum) döndürür.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number", description: "Şikayetin sayısal kimlik numarası" }
        },
        required: ["id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_human_help_count",
      description: "İnsan operatöre yönlendirilmiş (hibrit destek tetiklenmiş) şikayet sayısını döndürür.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  }
];

/** Tool'ları gerçek veritabanı (veya in-memory) sorgularına dönüştüren executor. */
async function executeAgentTool(name: string, args: any): Promise<any> {
  switch (name) {
    case "get_total_feedbacks": {
      if (prisma) {
        try { return { total: await prisma.feedback.count() }; }
        catch { /* fallback */ }
      }
      return { total: feedbacksDB.length };
    }
    case "get_negative_count": {
      if (prisma) {
        try { return { negative: await prisma.feedback.count({ where: { sentiment: "Negative" } }) }; }
        catch {}
      }
      return { negative: feedbacksDB.filter(f => f.sentiment === "Negative").length };
    }
    case "get_top_brands": {
      if (prisma) {
        try {
          const groups = await prisma.feedback.groupBy({
            by: ["brand"],
            _count: { brand: true },
            orderBy: { _count: { brand: "desc" } },
            take: 5,
          });
          return { brands: groups.map((g: any) => ({ brand: g.brand, count: g._count.brand })) };
        } catch {}
      }
      const counts: Record<string, number> = {};
      for (const f of feedbacksDB) counts[f.brand || "Belirtilmemiş"] = (counts[f.brand || "Belirtilmemiş"] || 0) + 1;
      const brands = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([brand, count]) => ({ brand, count }));
      return { brands };
    }
    case "get_feedback_by_id": {
      const id = Number(args?.id);
      if (!id) return { error: "Geçersiz id" };
      if (prisma) {
        try {
          const f = await prisma.feedback.findUnique({ where: { id } });
          if (f) return f;
        } catch {}
      }
      const f = feedbacksDB.find(f => f.id === id);
      return f || { error: "Şikayet bulunamadı" };
    }
    case "get_human_help_count": {
      if (prisma) {
        try { return { count: await prisma.feedback.count({ where: { needs_human: true } }) }; }
        catch {}
      }
      return { count: feedbacksDB.filter(f => f.needs_human).length };
    }
    default:
      return { error: `Bilinmeyen tool: ${name}` };
  }
}

app.post('/api/agent', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, error: "Mesaj boş olamaz." });
    }

    const systemPrompt = {
      role: "system" as const,
      content: `Sen "AI Feedback Hub" platformunun veri-bilgili asistanısın.
Kullanıcı sayısal/istatistiksel sorular sorduğunda araç (tool) çağırıp gerçek sayılarla cevap verirsin.

KURALLAR:
- Tool sonucu HER ZAMAN doğrudur, ona güven. Sonuç 0 olsa bile "0 şikayet var" diye net söyle.
- Liste döndüyse (örn. top_brands), markaları sayılarıyla birlikte sırala (Trendyol: 5, Migros: 3 ...).
- Asla uydurma yapma; uydurma yerine tool çağır.
- Cevapların 1-3 cümle, samimi ve Türkçe olsun.
- Markdown kullanma (** ve ## yok).
- "verim yok" deme — tool çağrı SONRASI sonuç ne olursa olsun onu kullanıcıya bildir.`
    };

    const recentHistory = (Array.isArray(history) ? history.slice(-6) : []).map((m: any) => ({
      role: m.role === "bot" ? "assistant" as const : "user" as const,
      content: String(m.text || m.content || "")
    })).filter(m => m.content.trim());

    // 1. Round: Llama'ya tool tanımları ile mesajı gönder.
    const round1 = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [systemPrompt, ...recentHistory, { role: "user", content: message }],
      tools: AGENT_TOOLS,
      tool_choice: "auto",
      temperature: 0.3,
    });

    const choice = round1.choices[0];
    const toolCalls = choice?.message?.tool_calls;

    // Llama tool çağırmadıysa direkt cevabını döndür.
    if (!toolCalls || toolCalls.length === 0) {
      return res.json({
        success: true,
        reply: choice?.message?.content?.trim() || "Yanıt üretemedim, tekrar dener misiniz?",
        usedTools: []
      });
    }

    // 2. Round: tool'ları execute et ve sonuçları Llama'ya gönder.
    const usedTools: string[] = [];
    const toolMessages: any[] = [];
    for (const call of toolCalls) {
      const fnName = call.function.name;
      const args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
      const result = await executeAgentTool(fnName, args);
      usedTools.push(fnName);
      console.log(`🛠️  [Agent] Tool: ${fnName} (${JSON.stringify(args)}) → ${JSON.stringify(result).slice(0, 100)}`);
      toolMessages.push({
        role: "tool" as const,
        tool_call_id: call.id,
        content: JSON.stringify(result)
      });
    }

    const round2 = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        systemPrompt,
        ...recentHistory,
        { role: "user", content: message },
        choice.message,         // Llama'nın tool çağıran mesajı
        ...toolMessages,        // Tool sonuçları
      ],
      temperature: 0.5,
    });

    const finalReply = round2.choices[0]?.message?.content?.trim() || "Cevap oluşturulamadı.";
    res.json({ success: true, reply: finalReply, usedTools });
  } catch (error: any) {
    console.error("Agent Hatası:", error);
    res.status(500).json({ success: false, error: error.message });
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

DİL KURALLARI:
- Türkçe karakterleri (ş, Ş, ç, Ç, ğ, Ğ, ı, İ, ö, Ö, ü, Ü) HER ZAMAN doğru kullan. "Sirket" yerine "Şirket", "kargonuz gec" yerine "kargonuz geç" yaz. Kayma yapma.
- Yabancı marka adlarını Türkçe yazıma çevirme — "Trendyol", "Migros" orijinal kalsın.

MARKA AYIRT ETME (ÖNEMLİ):
AI Feedback Hub bir aracılık platformudur, direkt satıcı değildir. Kullanıcılar farklı markalardan (Trendyol, Migros, Getir, Hepsiburada, Turkcell vs.) şikayet eder; biz bunları analiz edip ilgili markaya iletiriz.
- Kullanıcı belirli bir markadan bahsetmiş ise (örn. "Trendyol kargom geç geldi") → O MARKAYA yönlendir: "Trendyol'un kendi politikası farklı olabilir, şikayetinizi onlara ulaştırıyoruz." gibi.
- Marka belirtmemişse → genel rehberlik için aşağıdaki bilgi tabanını kullan.
- HİÇBİR ZAMAN belirli bir markanın iade/kargo süresini bizim platform politikamız gibi sunma.

KESİNLİKLE YAPMA:
- "Ben bir yapay zekayım" gibi cümlelerle kendini deşifre etme.
- Cevap içinde markdown (**, ##, vb.) kullanma.
- 3 cümleden uzun yanıt üretme.

${KB_CONTENT ? `
=== ŞİRKET BİLGİ TABANI (RAG) ===
Aşağıdaki bilgileri kullanarak kullanıcının sorduğu konularda SADECE bu kaynağa göre cevap ver.
Doküman dışı konularda "Bu konuda kesin bilgim yok, ilgili ekibe yönlendireyim" de.
Sayısal değerleri (gün, saat, yüzde) BİREBİR aktar.

${KB_CONTENT}
=== BİLGİ TABANI SONU ===
` : ''}`
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