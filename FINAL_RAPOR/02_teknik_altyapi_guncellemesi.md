# Güncellenmiş Teknik Altyapı ve Kullanılan Teknolojiler

Bu bölüm, vize raporundaki "TEKNİK ALTYAPI VE KULLANILAN TEKNOLOJİLER" başlığının final aşamasındaki **güncellenmiş** sürümüdür. Mevcut açıklamalar korunmakla birlikte, projenin son hâline entegre edilen yeni kütüphane ve servisler eklenmiştir. Bu bölüm Word dosyasındaki ilgili kısmın yerine tamamen kopyalanabilir.

---

## Node.js

Node.js, sunucu tarafı uygulamaların geliştirilmesi için kullanılan, JavaScript tabanlı açık kaynaklı bir çalışma ortamıdır. Bu projede chatbot sisteminin tüm arka yüz servisleri Node.js üzerinde geliştirilmiştir. Asenkron çalışma yapısı sayesinde aynı anda birden fazla kullanıcı isteği gecikmesiz olarak işlenebilmektedir.

## TypeScript

TypeScript, JavaScript'in tip güvenliği sağlayan gelişmiş bir sürümüdür. Projede kodun daha okunabilir, sürdürülebilir ve hatalara karşı dayanıklı olmasını sağlamak amacıyla tercih edilmiştir. Hem ön yüz hem arka yüz tarafında bu dil kullanılmış; Prisma ORM şemasından otomatik üretilen tipler sayesinde veritabanı erişiminde hata payı azaltılmıştır.

## Express.js

Express.js, Node.js üzerinde çalışan hafif ve esnek bir web uygulama çatısıdır. Sistemde REST API uç noktalarının (endpoint) tanımlanması, istek/yanıt akışının yönetimi ve CORS güvenlik kontrolü için kullanılmıştır.

## Groq + Meta Llama (Yapay Zeka Modeli)

Yapay zeka tarafı, Meta tarafından yayımlanan açık ağırlıklı **Llama** modellerinin **Groq** isimli yüksek hızlı çıkarım platformu üzerinden çağrılmasıyla sağlanmaktadır. Groq, LPU (Language Processing Unit) adı verilen özel donanımları sayesinde büyük dil modellerini çok düşük gecikmeyle çalıştırmakta ve gerçek zamanlı yanıtlar üretmektedir.

Sistemde iki ayrı Llama modeli birlikte kullanılmaktadır:

- **llama-3.3-70b-versatile (70 milyar parametre):** Şikayet metinlerinin sınıflandırılmasında ve duygu analizinde kullanılmaktadır. Yüksek parametre sayısı Türkçe metinleri **yüksek isabetle** anlamayı sağlar.
- **llama-3.1-8b-instant (8 milyar parametre):** Kullanıcı ile sohbet akışında, hız ve akıcılık öncelikli senaryolar için tercih edilmiştir.

Bu çift model stratejisi, "**analizde doğruluk, sohbette akıcılık**" tasarım kararının somut karşılığıdır.

## Sistem Yönergesi (System Prompt) Mühendisliği

Yapay zekanın istenen biçimde çıktı üretebilmesi için sistem yönergesi titizlikle hazırlanmıştır. Yönerge; kategori tanımlarını, marka çıkarma kurallarını, kafa karıştırıcı vakalar için örnekler (few-shot examples), Türkçe karakter kullanım kurallarını ve aracılık platformu olunduğu için "marka belirtilmişse o markaya yönlendir" prensibini içermektedir. Tek bir sabit dosyada (`backend/src/prompts/analyzePrompt.ts`) tutulmakta; hem üretim ortamında hem de doğruluk ölçüm scriptinde aynı yönerge kullanılmaktadır.

## RAG (Retrieval-Augmented Generation)

Şirkete özel politikalar (iade, kargo, KVKK, ödeme yöntemleri vb.) `backend/data/knowledge_base.md` dosyasında 15 başlık altında tutulmaktadır. Backend, başlangıçta bu dosyayı belleğe yükleyip her sohbet isteğinin sistem yönergesine eklemektedir. Llama 3 modellerinin 128.000 simgelik bağlam penceresi (context window) sayesinde, bilgi tabanının tamamı yönergeye yerleştirilebilmekte; bu sayede vektör tabanlı bir aramaya gerek kalmadan bot **gerçek dokümanlardan** cevap üretmektedir. Bu yaklaşım, Lewis ve arkadaşlarının 2020 yılında yayımladığı RAG çalışmasının basitleştirilmiş bir uygulamasıdır.

## Function Calling (Araç Çağrısı)

Llama 3.3'ün **fonksiyon çağrısı** yeteneği sayesinde bot; "Toplam kaç şikayet var?", "En çok hangi marka şikayet alıyor?" gibi sorulara veritabanından çektiği gerçek verilerle yanıt vermektedir. Sistemde tanımlı beş araç (`get_total_feedbacks`, `get_negative_count`, `get_top_brands`, `get_feedback_by_id`, `get_human_help_count`) Prisma sorgularıyla eşlenmiştir. Bu yaklaşım, geleneksel chatbot'ların ezberlenmiş cevaplarını aşan, **AI Agent** seviyesinde bir davranış sergilemektedir.

## PostgreSQL ve Prisma ORM

Veri saklama katmanı için **PostgreSQL** ilişkisel veritabanı yönetim sistemi kullanılmaktadır. Veritabanı adı `chatbot_feedback_db`'dir. Yerel geliştirme ortamında bilgisayara kurulan PostgreSQL hizmeti üzerinden, üretim ortamında ise Render Cloud'un ücretsiz Postgres servisi üzerinden çalışmaktadır.

Veritabanı erişimi için doğrudan SQL yerine **Prisma ORM** tercih edilmiştir. Prisma; tip güvenli sorgular, otomatik migration üretimi ve tek bir şema dosyasında tüm modellerin tanımlanması gibi avantajlar sunmaktadır. Bu sayede şikayet kayıtları kalıcı şekilde depolanmakta; uygulama yeniden başlatıldığında veri kaybı yaşanmamaktadır.

Vize aşamasında SQLite öngörülmüştü; ancak SQLite'ın dosya tabanlı yapısı bulut platformlarının geçici disk sistemleriyle uyumsuzluk gösterdiği için PostgreSQL'e geçilmiştir.

## Web Speech API

Tarayıcının yerleşik **Web Speech API** arayüzleri kullanılarak iki yönlü sesli etkileşim sağlanmıştır:

- **SpeechRecognition:** Kullanıcının mikrofondan konuştuğu Türkçe sesleri yazıya dönüştürür.
- **SpeechSynthesis:** Bot yanıtlarını Türkçe ses motoruyla (örn. macOS'taki "Yelda") sesli olarak okur.

Bu entegrasyon; raporun "konuşma tabanlı" başlığını teknik olarak da karşılamakta, erişilebilirlik açısından önemli bir katkı sağlamaktadır.

## Server-Sent Events (SSE) — Akıcı Yanıt Akışı

Bot yanıtlarının gerçek zamanlı olarak kelime kelime ön yüze iletilmesi için **Server-Sent Events** standardı kullanılmıştır. Backend, `/api/chat/stream` uç noktası üzerinden `text/event-stream` MIME türü ile veri akıtmakta; ön yüz `ReadableStream` API'si ile bu akışı satır satır okumaktadır. Bu yaklaşım, ChatGPT benzeri akıcı bir yazma deneyimi sunmaktadır.

## React ve Next.js

Kullanıcı arayüzü, **React** kütüphanesi temel alınarak **Next.js 15** üst çatısında geliştirilmiştir. Next.js'in App Router yapısı kullanılmış, tüm sayfa içeriği bileşen tabanlı şekilde organize edilmiştir. Hot Module Replacement (HMR) özelliği geliştirme sürecini hızlandırmıştır.

## Tailwind CSS

Sistem arayüzü, yönetici paneli ve grafiklerin kurumsal standartlarda, hızlı ve duyarlı (responsive) bir şekilde tasarlanması için **Tailwind CSS** atomik (utility-first) sınıf kütüphanesi kullanılmıştır. Grid sistemi, flexbox yardımcıları ve özelleştirilebilir renk paleti sayesinde dakikalar içinde profesyonel görünümlü ekranlar üretilebilmiştir.

## framer-motion

Sohbet penceresinin **sürüklenebilir** olmasını sağlayan React animasyon kütüphanesidir. `motion.div` öğesinin `drag` özelliği etkinleştirilerek, kullanıcılar pencereyi ekran üzerinde diledikleri konuma taşıyabilmektedir. Aynı kütüphane mesaj balonlarının yumuşak biçimde belirmesi (`animate-in fade-in slide-in-from-bottom`) için de kullanılmıştır.

## Chart.js ve react-chartjs-2

Yönetici panelindeki veri görselleştirmeleri için Chart.js kütüphanesi ve onun React adaptörü olan react-chartjs-2 kullanılmıştır. Sistemde iki tür grafik bulunmaktadır:
- **Line Chart:** Duygu güven puanlarının zaman ekseninde trend görselleştirmesi.
- **Doughnut Chart:** Şikayet kategorilerinin altılı dağılım görselleştirmesi.

## HTTP / REST API

İstemci ile sunucu arasındaki veri iletişimi tamamen HTTP protokolü üzerinden REST mimarisi ile gerçekleştirilmektedir. JSON; tüm istek ve yanıtların standart veri biçimidir.

## Render Cloud ve Vercel (Bulut Dağıtımı)

Sistem, üretim ortamında iki ayrı bulut platformu üzerinden hizmet vermektedir:

- **Vercel:** Ön yüz uygulamasının (Next.js) global CDN üzerinden hızlı dağıtımını sağlamaktadır. Her `git push` sonrası otomatik dağıtım yapılır.
- **Render:** Arka yüz uygulamasının (Node.js + Express) ve PostgreSQL veritabanının barındırılmasında kullanılmaktadır. HTTPS sertifikası otomatik olarak sağlanır.

Bu iki platformun ücretsiz katmanları kullanılarak proje **sıfıra yakın işletme maliyeti** ile ayakta tutulmaktadır.

## UptimeRobot (Sürekli Erişilebilirlik)

Render'ın ücretsiz katmanında, on beş dakika hareketsiz kalan servisler otomatik olarak uykuya alınmaktadır. Bu durum bir sonraki istek geldiğinde **soğuk başlangıç (cold start)** gecikmesine yol açar. Bu durumu önlemek için **UptimeRobot** servisi her beş dakikada bir backend'in `/api/admin/dashboard-stats` uç noktasını sorgulayarak servisin canlı kalmasını sağlamaktadır.

## .env Tabanlı Ortam Yönetimi ve Güvenlik

Tüm gizli yapılandırma bilgileri (Groq API anahtarı, veritabanı bağlantı dizgisi vb.) `.env` dosyalarında saklanmakta, kaynak kodda yer almamaktadır. `.env` dosyası `.gitignore` ile sürüm kontrolünden hariç tutulduğundan, herhangi bir API anahtarı GitHub deposuna sızmamaktadır. Üretim ortamında bu değişkenler Render Dashboard üzerindeki "Environment Variables" alanından okunur.

## Yapay Zeka Doğruluk Ölçüm Scripti

Sistemin yapay zeka tarafının başarı oranını ölçmek üzere **TypeScript ile yazılmış bağımsız bir Node.js scripti** geliştirilmiştir (`backend/src/scripts/measureAccuracy.ts`). Bu script; 24 örneklik etiketli test setini Llama'ya gönderir, tahminleri gerçek etiketlerle karşılaştırır ve karışıklık matrisi (confusion matrix) ile birlikte doğruluk yüzdelerini hesaplar. Sonuçlar yönetici panelinde "Sistem Doğruluğu" kartı üzerinden son kullanıcıya da iletilir. Bu döngü; raporun "yapay zeka analiz doğruluklarının ölçülmesi" iddiasının somut karşılığını oluşturmakta ve **tekrarlanabilir bilim** ilkesine uymaktadır.

## Geliştirme Süresinde Destek Olarak Kullanılan Araç

Geliştirme sürecinde, **Anthropic Claude** isimli yapay zeka asistanı; kod örnekleri üretme, hata ayıklama, sistem mimarisi tartışmaları ve raporun bazı bölümlerinin organize edilmesi gibi alanlarda **destekleyici bir araç olarak** kullanılmıştır. Tüm tasarım kararları, model seçimleri, mimari tercihler ve nihai uygulama bu raporun yazarı tarafından alınmış ve uygulanmıştır.
