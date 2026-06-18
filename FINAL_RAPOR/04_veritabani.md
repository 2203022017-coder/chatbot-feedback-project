# 3.4. Veritabanı Tasarımı ve Kullanılan Teknolojiler

## 3.4.1. Veritabanı Seçimi: PostgreSQL

Geliştirilen chatbot sisteminde veri saklama katmanı için **PostgreSQL** ilişkisel veritabanı yönetim sistemi (RDBMS) tercih edilmiştir. Veritabanının adı `chatbot_feedback_db` olarak belirlenmiştir. Hem yerel geliştirme ortamında hem de dağıtım (deployment) ortamında aynı veritabanı motoru kullanılmıştır.

### 3.4.1.1. PostgreSQL Neden Tercih Edildi?

PostgreSQL, akademik ve endüstriyel projelerde yaygın olarak kullanılan açık kaynaklı bir RDBMS'tir. Bu projede tercih edilmesinin başlıca sebepleri aşağıda sıralanmıştır:

**1. ACID uyumluluğu:** PostgreSQL, ACID (Atomicity, Consistency, Isolation, Durability) ilkelerine tam uyum sağlamaktadır. Bu sayede müşteri şikayet kayıtları gibi kritik verilerin **kaybolma riski olmadan**, eşzamanlı erişimlerde tutarlı şekilde tutulması garanti altına alınmıştır.

**2. İlişkisel veri modeli:** Sistem; kullanıcı, oturum, mesaj, analiz sonucu ve şikayet biletleri gibi birbiriyle ilişkili varlıklar içerdiğinden, NoSQL yerine **ilişkisel bir yapı** projenin doğasıyla daha uyumludur. Yabancı anahtar (foreign key) kısıtlamaları sayesinde bir kullanıcının tüm mesajları veya bir mesaja ait analiz sonucu, tek bir SQL ifadesi ile sorgulanabilir.

**3. Render uyumluluğu:** Projenin dağıtımı için kullanılan **Render** platformu, ücretsiz katmanında PostgreSQL servisi sunmaktadır. Bu sayede ek bir maliyet doğmadan, kalıcı veri depolaması için bulut tabanlı bir veritabanı bileşeni elde edilmiştir.

**4. Genişletilebilirlik:** PostgreSQL, gelecekteki gelişmelere uygun olarak **vektör arama** (pgvector eklentisi), **tam metin arama** (full-text search) ve **JSON tabanlı sorgular** gibi modern özellikleri yerleşik olarak desteklemektedir. Vize raporundaki SQLite ön kabulüne karşın PostgreSQL'e geçilmesinin nedenlerinden biri de budur; ileride bilgi tabanının vektör temsilleri ile zenginleştirilmesi planlandığında bu altyapı hazır olacaktır.

**5. SQLite'tan üstünlüğü:** Vize raporu aşamasında SQLite öngörülmüştü; ancak SQLite dosya tabanlı bir veritabanıdır ve Render gibi bulut platformlarının geçici (ephemeral) dosya sistemleri ile uyumsuzdur. Her uygulama yeniden başlatıldığında verilerin kaybolması riski oluşmaktaydı. PostgreSQL bağımsız bir servis olarak çalıştığı için bu sorun ortadan kalkmış, **kalıcılık (persistence)** garanti altına alınmıştır.

### 3.4.1.2. Prisma ORM Kullanımı

Veritabanı erişimi için doğrudan SQL sorguları yazmak yerine **Prisma** isimli açık kaynaklı **Nesne-İlişkisel Haritalama (Object-Relational Mapping, ORM)** kütüphanesi tercih edilmiştir. Prisma'nın bu projedeki başlıca avantajları aşağıda özetlenmiştir:

- **Tip güvenliği:** Prisma şemasına göre TypeScript tipleri otomatik üretilir. Bu sayede yanlış alan adı kullanma veya tip uyumsuzluğu gibi hatalar **derleme zamanında** yakalanır, çalışma zamanında oluşacak hataların büyük kısmı engellenir.
- **Sürüm yönetimi (migration):** `prisma migrate dev` komutu ile şema değişiklikleri otomatik olarak SQL betiklerine dönüştürülür ve `prisma/migrations/` klasöründe versiyonlanır. Üretim ortamına dağıtırken `prisma migrate deploy` komutu çalıştırılarak veritabanı şeması otomatik güncellenir.
- **Tek bir şema dosyası:** Tüm modeller, ilişkiler ve indeksler `backend/prisma/schema.prisma` dosyasında tek bir yerde tanımlanır. Bu, akademik raporlama açısından "veri modeli neyi temsil ediyor?" sorusuna kolayca cevap verilmesini sağlar.
- **Yüksek seviyeli sorgular:** Karmaşık `groupBy`, `findMany`, `count` gibi işlemler tek satırlık metod çağrılarıyla yapılabilir. Bu, yönetici panelinin kategori dağılımı, marka grupları gibi istatistiklerini elde etmek için kullanılmıştır.

## 3.4.2. Veritabanı Şeması ve Tablolar

Sistemde tanımlanmış olan başlıca tablolar ve görevleri şunlardır:

### Feedback (Geri Bildirim) Tablosu

Sistemin merkezi tablosudur. Her bir kullanıcı şikayetinin ve yapay zekanın bu şikayet üzerinde yaptığı analizin tüm sonuçlarını içerir.

| Alan | Veri Tipi | Açıklama |
|---|---|---|
| `id` | Int (PK, otomatik artan) | Şikayetin tekil kimliği |
| `text` | String | Kullanıcının yazdığı şikayet metni |
| `sentiment` | String | Llama tarafından atanan duygu etiketi (Negative, Neutral, Positive) |
| `category` | String | Yapay zeka tarafından atanan kategori (Lojistik, Teknik, Ödeme, İletişim, Ürün, İşlem) |
| `score` | Float | Modelin güven puanı (0.0 - 1.0 arası) |
| `brand` | String | Tespit edilen marka (örn. Trendyol, Migros) veya "Belirtilmemiş" |
| `needs_human` | Boolean | Güven puanı 0.85 altıysa true; insan operatöre yönlendirme bayrağı |
| `helpful` | Boolean? (nullable) | Kullanıcının 👍/👎 oylaması; null ise henüz oy verilmemiş |
| `created_at` | DateTime | Kayıt oluşturulma zamanı |

Bu tablo üzerinde sorgu performansını artırmak için `created_at`, `sentiment`, `needs_human` ve `brand` alanlarına **indeks** eklenmiştir. Bu sayede yönetici panelinin sık kullandığı "son şikayetler" ve "negatif duygu sayısı" gibi sorgular milisaniyeler içinde sonuçlanmaktadır.

### Diğer Tablolar

Vize raporundaki ER diyagramında yer alan diğer varlıklar (`User`, `ChatSession`, `Message`, `AnalysisResult`, `Feedback_Tickets`, `Admin`, `Dashboard_Stats`) şemada **korunmuştur**. Bu varlıklar; ilerleyen aşamalarda kullanıcı kimlik doğrulama (authentication), oturum yönetimi ve şikayet bileti çözüm takibi gibi özelliklerin eklenmesi için hazır altyapıyı oluşturmaktadır. Şu an aktif kullanımdaki ana tablo `Feedback` tablosu olmakla birlikte; tüm modeller raporun ekinde sunulan ER diyagramında yer almakta ve gelecek çalışmalar için yol haritası olarak hizmet etmektedir.

## 3.4.3. Yerel ve Üretim Ortamı Yapılandırması

Veritabanı bağlantısı, **ortam değişkenleri** üzerinden esnek bir yapıda yönetilmektedir. Backend tarafındaki `.env` dosyasında `DATABASE_URL` değişkeni tanımlanır:

```
DATABASE_URL="postgresql://kullanici@host:5432/chatbot_feedback_db"
```

Yerel geliştirme ortamında bu adres `localhost` üzerinden bilgisayarda kurulu PostgreSQL hizmetini hedef alır. Üretim ortamında ise Render üzerinde otomatik oluşturulan **dahili bağlantı adresi** (Internal Database URL) kullanılır. Bu yapılandırma, kod tarafında hiçbir değişiklik yapmadan farklı ortamlar arasında geçiş yapılmasını sağlar.

## 3.4.4. Verinin Yaşam Döngüsü

Bir geri bildirimin veritabanındaki yaşam döngüsü şu adımlardan oluşmaktadır:

1. Kullanıcı sohbet penceresine bir mesaj yazar.
2. Ön yüz, mesajı `/api/feedback/analyze` uç noktasına gönderir.
3. Backend, Llama modelinden analiz sonucunu alır.
4. Prisma istemcisi aracılığıyla `prisma.feedback.create({ data: { ... } })` çağrısı yapılır ve yeni satır PostgreSQL veritabanına yazılır.
5. Yazma işlemi başarısız olursa (örneğin geçici bağlantı problemi), kayıt **bellek içi yedek diziye** eklenir; böylece sistem hata vermeden çalışmaya devam eder.
6. Yönetici paneli üç saniyede bir veritabanını sorgulayarak yeni kayıtları arayüzde günceller.
7. Kullanıcı şikayet sonucunu 👍/👎 ile değerlendirirse, `helpful` alanı güncellenir.

Bu döngü; veriyi gerçek zamanlı, kalıcı ve hata toleranslı bir biçimde işlemektedir.

## 3.4.5. Yedekleme ve Güvenlik

Render PostgreSQL servisi, üretim ortamında günlük otomatik yedekleme yapmaktadır. Bu sayede olası bir veri kaybı durumunda son yedek üzerinden geri yükleme yapılabilir. Bağlantı dizgisi (connection string) içerdiği kullanıcı adı ve şifre nedeniyle hassas bir bilgidir ve sadece ortam değişkenleri üzerinden okunmakta, kaynak kodda yer almamaktadır.
