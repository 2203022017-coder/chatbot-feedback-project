# 3.3.1. REST API Uç Noktalarının Detaylı Açıklaması

Geliştirilen chatbot sistemi, ön yüz ile arka yüz arasındaki tüm iletişimi **REST API** mimarisi üzerinden yürütmektedir. Uygulamada toplam yedi adet uç nokta (endpoint) tanımlanmıştır. Tüm istek ve yanıtlar **JSON** veri biçimini kullanmakta, sunucu cevapları HTTP durum kodları ile birlikte standart bir yapıda dönmektedir. Aşağıda her bir uç noktanın işlevi, parametreleri ve sistemdeki rolü ayrıntılı şekilde açıklanmaktadır.

## 3.3.1.1. POST /api/feedback/analyze

**Amaç:** Kullanıcı tarafından yazılan müşteri geri bildirim metnini yapay zekaya gönderip duygu durumu, kategori ve marka tespiti yapmak; sonucu veritabanına kaydetmek.

**İstek formatı:**
```json
{
  "text": "Trendyol'dan aldığım kargo 3 gündür gelmedi"
}
```

**Yanıt formatı:**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "analysis": {
      "sentiment_label": "Negative",
      "confidence_score": 0.93,
      "nlp_category": "Lojistik"
    },
    "needs_human": false,
    "brand": "Trendyol"
  }
}
```

**Kullandığı yapay zeka modeli:** `llama-3.3-70b-versatile` (Groq üzerinden çağrılır).

**Veritabanı işlemi:** Prisma istemcisi aracılığıyla `Feedback` tablosuna yeni bir kayıt eklenir. Eğer `confidence_score` 0.85'in altındaysa kayıtta `needs_human=true` olarak işaretlenir.

**Akış:** Kullanıcının her şikayet mesajında bu uç nokta otomatik olarak çağrılır ve sonuç yönetici paneline anlık olarak yansır.

## 3.3.1.2. GET /api/admin/dashboard-stats

**Amaç:** Yönetici panelinin tüm istatistik kartlarını, marka filtre çiplerini, son şikayet tablosunu ve grafik verilerini tek bir istekle servis etmek.

**İstek formatı:** Parametre almaz.

**Yanıt formatı (özetlenmiş):**
```json
{
  "total_feedbacks": 24,
  "resolved_tickets": 0,
  "negative_ratio": "62.5",
  "human_help_count": 3,
  "helpful_ratio": "85",
  "helpful_rated_count": 13,
  "top_brands": [
    {"brand": "Trendyol", "count": 5},
    {"brand": "Getir", "count": 3}
  ],
  "category_distribution": [
    {"category": "Lojistik", "count": 8},
    {"category": "Teknik", "count": 4}
  ],
  "sentiment_distribution": [
    {"sentiment": "Negative", "count": 15},
    {"sentiment": "Positive", "count": 6}
  ],
  "recent_feedbacks": [/* son 8 şikayet */]
}
```

**Veritabanı işlemi:** Prisma'nın `groupBy` ve `count` operatörleriyle altı farklı sorgu paralel olarak çalıştırılır. Bu sayede tek bir HTTP çağrısı ile tüm panel verisi toplanır.

**Akış:** Yönetici paneli her üç saniyede bir bu uç noktayı sorgulayarak ekranın **gerçek zamanlı** güncel kalmasını sağlar.

## 3.3.1.3. POST /api/chat

**Amaç:** Kullanıcının yazdığı mesaja, önceki konuşma bağlamını da göz önünde bulundurarak doğal Türkçe bir yanıt üretmek.

**İstek formatı:**
```json
{
  "message": "kargom ne zaman gelir?",
  "history": [
    {"role": "user", "text": "merhaba"},
    {"role": "bot", "text": "Hoş geldiniz, size nasıl..."}
  ]
}
```

**Yanıt formatı:**
```json
{
  "success": true,
  "reply": "Standart teslimat süremiz 2-4 iş günüdür..."
}
```

**Kullandığı yapay zeka modeli:** `llama-3.1-8b-instant` (hızlı sohbet için).

**Özellikler:**
- Son 10 mesaj sohbet bağlamı olarak modele iletilir (konuşma hafızası).
- Sistem yönergesi (system prompt) marka-aware'dir; kullanıcı bir marka adı belirttiyse yanıt o markaya yönlendirir.
- Bilgi tabanı (`knowledge_base.md`) sistem yönergesine eklenmiştir, bot uydurma yapmadan şirket politikalarına uygun yanıt verir.

## 3.3.1.4. POST /api/chat/stream

**Amaç:** `/api/chat` ile aynı işlevi görmekle birlikte yanıtı **kelime kelime akıcı** biçimde göndermek. ChatGPT'deki gibi yazma efekti sağlar.

**İstek formatı:** `/api/chat` ile aynıdır.

**Yanıt formatı:** Standart JSON değil; **Server-Sent Events (SSE)** akışıdır.
```
data: {"token":"Mer"}

data: {"token":"hab"}

data: {"token":"a"}

data: [DONE]
```

**Önemli teknik detaylar:**
- HTTP başlığı `Content-Type: text/event-stream` olarak ayarlanır.
- `res.flushHeaders()` çağrısı ile başlıklar derhal istemciye iletilir.
- `res.socket.setNoDelay(true)` ile TCP Nagle algoritması devre dışı bırakılır, böylece her simge tampona alınmadan anında gönderilir.

**Yedekleme stratejisi:** Eğer akış başarısız olursa ön yüz otomatik olarak standart `/api/chat` uç noktasına geri döner.

## 3.3.1.5. POST /api/agent

**Amaç:** Kullanıcının istatistiksel/sayısal sorularına (örn. "*Toplam kaç şikayet var?*", "*En çok hangi marka şikayet alıyor?*") veritabanından gerçek veri çekerek yanıt vermek.

**İstek formatı:**
```json
{
  "message": "En çok hangi marka şikayet alıyor?",
  "history": []
}
```

**Yanıt formatı:**
```json
{
  "success": true,
  "reply": "En çok şikayet alan üç marka: Trendyol (5), Getir (3) ve Migros (2).",
  "usedTools": ["get_top_brands"]
}
```

**Kullandığı yapay zeka modeli:** `llama-3.3-70b-versatile`.

**Çalışma prensibi (iki turlu çağrı):**
1. **Birinci tur:** Kullanıcı mesajı, sistem yönergesi ve beş araç (tool) tanımı modele iletilir. Model gerekiyorsa bir aracı çağırır.
2. **Backend araç çağrısını yakalar**, ilgili Prisma sorgusunu çalıştırır (örneğin `prisma.feedback.groupBy({ by: ['brand'] })`).
3. **İkinci tur:** Araç çıktısı modele geri verilir, model bunu doğal Türkçe bir cümleye çevirerek son yanıtı üretir.

**Tanımlı araçlar:**
- `get_total_feedbacks` — toplam şikayet sayısı
- `get_negative_count` — negatif şikayet sayısı
- `get_top_brands` — ilk beş marka
- `get_feedback_by_id` — belirli bir kayıt detayı
- `get_human_help_count` — insan yardımı gereken kayıt sayısı

Bu yapı, sistemin sıradan bir chatbot olmaktan çıkarak **karar destek aracı** niteliğine geçmesini sağlar.

## 3.3.1.6. POST /api/feedback/:id/rate

**Amaç:** Kullanıcının bir şikayet analizinin sonucunu **"faydalı buldum / bulmadım"** şeklinde oylamasını kaydetmek.

**URL parametresi:** `:id` — Feedback tablosundaki şikayet kimliği.

**İstek formatı:**
```json
{
  "helpful": true
}
```

**Yanıt formatı:**
```json
{
  "success": true
}
```

**Veritabanı işlemi:** İlgili `Feedback` kaydının `helpful` alanı `true` veya `false` olarak güncellenir.

**Kullanım:** Bot cevap verdikten sonra altta beliren 👍/👎 düğmeleriyle tetiklenir. Yönetici panelindeki "Memnuniyet Oranı" metriği bu verileri kullanarak hesaplanır.

## 3.3.1.7. GET /api/admin/accuracy

**Amaç:** Doğruluk ölçüm scripti tarafından üretilen sonuç dosyasını (`accuracy_results.json`) yönetici paneline servis etmek.

**İstek formatı:** Parametre almaz.

**Yanıt formatı:**
```json
{
  "success": true,
  "timestamp": "2025-04-15T14:32:11Z",
  "model": "llama-3.3-70b-versatile",
  "total_samples": 24,
  "category_accuracy_pct": 92,
  "sentiment_accuracy_pct": 100,
  "overall_accuracy_pct": 88,
  "per_category_accuracy": {
    "Lojistik": {"total": 5, "correct": 5, "accuracy": 100},
    "Teknik": {"total": 4, "correct": 4, "accuracy": 100}
  }
}
```

**Akış:** Yönetici paneli ilk açılışta bu uç noktayı bir kez sorgular, sonucu "Sistem Doğruluğu" kartında gösterir. Ölçüm scripti çalıştırıldığında dosya güncellenir ve panel yenilendiğinde değer yeni rakama döner.

## 3.3.1.8. İletişim Standartları ve Güvenlik

Tüm uç noktalar **HTTPS** üzerinden hizmet vermektedir. Render altyapısı otomatik olarak TLS sertifikası sağlar. Backend, izin verilen kaynaklardan gelen isteklere yanıt vermek üzere Express `cors` ara katmanı ile yapılandırılmıştır.

API anahtarları **kodda gömülü tutulmamakta**; tüm gizli bilgiler `.env` dosyasında yer almaktadır. Üretim ortamında bu değişkenler Render Dashboard üzerindeki "Environment Variables" bölümünden okunur. `.env` dosyası `.gitignore` ile sürüm kontrolünden hariç tutulduğundan, herhangi bir API anahtarı GitHub deposuna sızmamaktadır.

Hata durumlarında uç noktalar tutarlı bir yapı korumakta; aşağıdaki gibi standart bir hata yanıtı dönmektedir:
```json
{
  "success": false,
  "error": "Açıklayıcı hata metni"
}
```

Bu standart, ön yüz tarafının her uç noktayı aynı şekilde işleyebilmesine ve kullanıcıya tutarlı hata mesajları gösterebilmesine olanak tanımaktadır.
