# 🤖 AI Feedback Hub — Yapay Zeka Destekli Müşteri Geri Bildirimleri Chatbot Sistemi

> İstanbul Beykent Üniversitesi · Bilgisayar Mühendisliği · Bitirme Projesi (2026)

Müşteri geri bildirimlerini doğal dilde toplayan, yapay zeka ile sınıflandıran ve gerçek zamanlı yönetici paneliyle görselleştiren konuşma tabanlı bir chatbot sistemi.

## 🌐 Canlı Demo

- **Frontend:** [Vercel URL'ini buraya koy]
- **Backend API:** Render Cloud üzerinde dağıtık

## ✨ Özellikler

- 💬 **Konuşma Tabanlı Chatbot** — Llama 3.1-8B ile akıcı sohbet (Groq LPU üzerinde)
- 🎯 **Otomatik Sınıflandırma** — Llama 3.3-70B ile kategori + duygu analizi
- 📚 **RAG (Retrieval-Augmented Generation)** — 15 başlık şirket politikasıyla bilgi tabanı
- 🛠️ **AI Agent (Function Calling)** — 5 tool ile veritabanı sorgulu yanıtlar
- ⚡ **Server-Sent Events (SSE)** — Token-by-token akıcı yanıt akışı
- 🎤 **Sesli Etkileşim** — Web Speech API ile Türkçe sesli giriş ve çıkış
- 👥 **Hibrit Destek** — Düşük güvenli vakalarda otomatik insan operatöre yönlendirme
- 🏷️ **Marka Tespiti** — Şikayet metninden otomatik marka çıkarımı
- 📊 **Yönetici Paneli** — Gerçek zamanlı analitik, marka filtreleme, CSV dışa aktarım
- 👍 **Memnuniyet Anketi** — Kullanıcıdan 👍/👎 geri bildirim toplama

## 🏗️ Sistem Mimarisi

5 katmanlı modüler yapı:

1. **Sunum Katmanı** — Next.js 15 + React + Tailwind CSS (Vercel)
2. **İletişim Katmanı** — HTTP / REST + Server-Sent Events
3. **İş Mantığı Katmanı** — Node.js + TypeScript + Express (Render)
4. **Yapay Zeka Katmanı** — Groq LPU + Meta Llama 3.3-70B / 3.1-8B
5. **Veri Katmanı** — PostgreSQL + Prisma ORM

## 🛠️ Teknoloji Stack'i

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| UI Bileşenleri | framer-motion, Chart.js, react-chartjs-2 |
| Backend | Node.js, TypeScript, Express.js |
| Veritabanı | PostgreSQL + Prisma ORM |
| Yapay Zeka | Groq SDK + Meta Llama 3.3-70B / 3.1-8B |
| Ses | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| Dağıtım | Vercel (frontend) + Render Cloud (backend + DB) |
| Canlı Tutma | UptimeRobot (5dk polling) |

## 📊 Doğruluk Ölçüm Sonuçları

24 örneklik etiketli test seti üzerinde Llama 3.3-70B modeli ile ölçüm:

| Metrik | Sonuç |
|---|---|
| Kategori Sınıflandırma Doğruluğu | **%100** |
| Duygu (Sentiment) Doğruluğu | **%100** |
| Genel Doğruluk | **%100** |
| Confusion Matrix | Tamamen diyagonal (sıfır karışıklık) |

## 📁 Proje Yapısı
chatbot-feedback-project/

├── backend/

│   ├── src/

│   │   ├── index.ts                    # Tüm REST endpoint'leri

│   │   ├── prompts/analyzePrompt.ts    # Llama sistem yönergesi

│   │   ├── lib/prisma.ts               # Prisma client

│   │   └── scripts/measureAccuracy.ts  # Doğruluk ölçüm scripti

│   ├── data/

│   │   ├── knowledge_base.md           # RAG bilgi tabanı (15 başlık)

│   │   ├── test_dataset.json           # 24 etiketli test örneği

│   │   └── accuracy_results.json       # Ölçüm sonuçları

│   ├── prisma/

│   │   └── schema.prisma               # DB şeması

│   └── package.json

│

├── frontend/

│   ├── app/

│   │   ├── page.tsx                    # Tüm UI (landing + chatbot + admin)

│   │   └── layout.tsx

│   ├── components/ui/                  # UI bileşenleri

│   └── package.json

│

└── FINAL_RAPOR/

├── Final_Rapor_SUDENAZ_KAYABASI.docx

├── Sunum_SUDENAZ_KAYABASI.pptx

└── ekran_goruntuleri/

## 🚀 Yerel Kurulum

### Backend

```bash
cd backend
npm install

# .env dosyası oluştur
# GROQ_API_KEY=...
# DATABASE_URL=postgresql://...

npm run db:setup
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Doğruluk Ölçümü

```bash
cd backend
npm run measure
```

## 🔌 REST API Endpoint'leri

| Metot | Endpoint | Görev |
|---|---|---|
| POST | `/api/feedback/analyze` | Şikayet sınıflandırma (Llama 3.3) |
| POST | `/api/chat/stream` | SSE ile akıcı sohbet (Llama 3.1) |
| POST | `/api/agent` | Function Calling — 5 tool ile gerçek veri sorgusu |
| POST | `/api/feedback/:id/rate` | 👍/👎 memnuniyet anketi |
| GET | `/api/admin/dashboard-stats` | Yönetici paneli verisi |
| GET | `/api/admin/accuracy` | Doğruluk ölçüm sonuçları |
| GET | `/api/feedbacks/filter` | Kategoriye göre süzme |

## 🤖 Yapay Zeka Yetenekleri

### RAG (Retrieval-Augmented Generation)
15 başlık şirket politikası (iade, kargo, KVKK, ödeme yöntemleri vb.) `knowledge_base.md` dosyasında. Llama'nın 128K context window'una her sohbet isteğinde enjekte edilir.

### Function Calling — 5 Tool
- `get_total_feedbacks` — Toplam şikayet sayısı
- `get_negative_count` — Negatif şikayet sayısı
- `get_top_brands` — En çok şikayet alan ilk 5 marka
- `get_feedback_by_id` — Belirli şikayet detayı
- `get_human_help_count` — İnsan operatöre yönlendirilen şikayet sayısı

### Hibrit Destek
`confidence_score < 0.85` olduğunda `needs_human=true` bayrağı set edilir, kullanıcıya amber renkli "uzman temsilciye yönlendirildi" banner'ı gösterilir.

## 🗄️ Veritabanı Şeması

Ana tablo: **Feedback**

```prisma
model Feedback {
  id           Int      @id @default(autoincrement())
  text         String
  sentiment    String   // Negative / Neutral / Positive
  category     String   // Lojistik / Teknik / Ödeme / İletişim / Ürün / İşlem
  brand        String   @default("Belirtilmemiş")
  score        Float    // 0.0 - 1.0
  needs_human  Boolean  @default(false)
  helpful      Boolean? // 👍 / 👎 / null
  created_at   DateTime @default(now())

  @@index([created_at, sentiment, needs_human, brand])
}
```

## 👩‍💻 Geliştirici

**Sudenaz Kayabaşı**
- Öğrenci No: 2203022017
- Bölüm: Bilgisayar Mühendisliği
- Danışman: **Fuat Candan**
- E-posta: kayabasisudenaz@gmail.com

## 🙏 Teşekkürler

Geliştirme sürecinde Anthropic Claude yapay zeka asistanı; kod örnekleri, hata ayıklama, mimari kararlar ve rapor düzenleme süreçlerinde destekleyici bir araç olarak kullanılmıştır. Tüm tasarım kararları, model seçimleri ve nihai uygulama tarafımdan alınmış ve uygulanmıştır.

## 📄 Lisans

Akademik proje — İstanbul Beykent Üniversitesi · 2026
