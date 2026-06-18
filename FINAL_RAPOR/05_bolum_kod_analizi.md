# 5. UYGULAMA KODLARININ DETAYLI ANALİZİ

Bu bölüm, çalışma kapsamında tasarlanan chatbot sisteminin yazılım katmanlarını, kullanılan kütüphaneleri ve uygulanan yapay zeka yöntemlerini kod düzeyinde ayrıntılı olarak ele almaktadır. Sistemin tüm bileşenleri modüler bir yapıda kurgulanmış olup; ön yüz (frontend), arka yüz (backend), yapay zeka servisleri ve veritabanı olmak üzere dört ana katmandan oluşmaktadır. Aşağıdaki alt başlıklarda her katmanın işlevi, dosya organizasyonu ve önemli uygulama kararları açıklanmaktadır.

## 5.1. Ön Yüz (Frontend) Kod Yapısı

Sistemin ön yüzü, **Next.js 15** çatısı altında React kütüphanesi kullanılarak geliştirilmiştir. Tüm sayfa içeriği `frontend/app/page.tsx` dosyasında tek bir bileşen olarak yapılandırılmıştır. Bu tercih, küçük ila orta ölçekli akademik projelerde sayfa içi etkileşim ve durum (state) yönetimini kolaylaştıran tek-dosya yaklaşımına dayanmaktadır. Stilendirme için **Tailwind CSS** kütüphanesinin atomik (utility-first) sınıfları benimsenmiş; böylece tasarım kararları HTML etiketlerinin yanında doğrudan görülebilir hale gelmiştir.

Ön yüzde kullanıcı arayüzünün durumlarını yönetmek için React'in `useState`, `useEffect` ve `useRef` kancalarından (hooks) faydalanılmaktadır. Mesaj geçmişi, yazma göstergesi, ses tanıma durumu, yönetici paneli verileri ve doğruluk ölçüm sonuçları gibi tüm dinamik veriler bu kancalar aracılığıyla bileşenin yaşam döngüsü boyunca takip edilmektedir. Sayfa ilk yüklendiğinde tarayıcının `Web Speech API` desteği bir `useEffect` ile sınanmakta; eğer destek varsa konuşma tanıma nesnesi başlatılarak mikrofon butonu kullanıcıya gösterilmektedir.

Sayfa, görsel olarak iki ana parçadan oluşmaktadır: tanıtım sayfası (landing page) ve sağ alt köşedeki yüzen sohbet penceresi (floating chat widget). Sohbet penceresi `framer-motion` kütüphanesinin `motion.div` bileşeni ile sarmalanmış olup, kullanıcının pencereyi ekranda **sürükleyip taşıyabilmesine** olanak tanır. Bu özellik, ekran üzerinde yapay zeka asistanını istediği konuma yerleştirebilen kullanıcılar için ergonomik bir deneyim sağlar.

Mobil cihazlarda kullanım deneyimini bozmamak adına Tailwind'in `sm:` ön ekiyle koşullu sınıflar tanımlanmıştır. Sohbet penceresi telefon ekranlarında tüm görünür alanı kaplarken, masaüstü ekranlarda 380×600 piksellik bir kutucuk olarak konumlanmaktadır. Bu sayede sistem **duyarlı (responsive) bir web uygulaması** niteliği kazanmıştır.

## 5.2. Arka Yüz (Backend) Kod Yapısı

Arka yüz, **Node.js** çalışma ortamı üzerinde **Express.js** çatısı ile geliştirilmiş, **TypeScript** ile tip güvenliği sağlanmıştır. Tüm uygulama mantığı `backend/src/index.ts` dosyasında merkezi olarak yapılandırılmıştır. Veri tabanına erişim için ise nesne-ilişkisel haritalama (ORM) kütüphanesi olan **Prisma** kullanılmıştır.

Backend uygulamasının başlangıç adımları sırasıyla şu şekildedir:

1. `dotenv/config` modülü ile `.env` dosyasındaki ortam değişkenleri belleğe yüklenir. Bu değişkenler arasında `GROQ_API_KEY` (yapay zeka servisi anahtarı) ve `DATABASE_URL` (veritabanı bağlantı adresi) bulunmaktadır.
2. Express uygulaması başlatılır; `cors` ara katman yazılımı (middleware) ile farklı kaynaklardan gelen isteklere izin verilir; `express.json()` ara katmanı JSON tabanlı isteklerin gövdesini ayrıştırır.
3. Prisma istemcisi oluşturulur. Bu istemci başarısız olursa sistem hata vermeden bellek üzerinde tutulan bir yedek diziye (in-memory fallback) düşer; böylece veritabanı erişiminde geçici bir aksaklık yaşansa dahi sistem kullanıcıya yanıt vermeye devam eder. Bu yaklaşım literatürde **graceful degradation** (zarif düşüş) olarak adlandırılmaktadır.
4. `backend/data/knowledge_base.md` dosyası okunarak bilgi tabanı belleğe yüklenir; bu bilgi, yapay zekanın sistem yönergesine (system prompt) dahil edilerek modelin gerçek şirket politikalarına dayalı yanıt vermesi sağlanır.
5. Uygulama 3001 numaralı port üzerinden HTTP isteklerini dinlemeye başlar.

Arka yüz tarafında yedi adet REST API uç noktası (endpoint) tanımlanmıştır. Bu uç noktalar, ön yüzün ihtiyaç duyduğu tüm işlemleri karşılamaktadır ve detaylı şekilde 3.3. bölümünde açıklanmaktadır.

## 5.3. Yapay Zeka Entegrasyonu (Groq + Llama)

Yapay zeka katmanı, Meta tarafından geliştirilen açık ağırlıklı **Llama** dil modellerinin Groq adlı yüksek hızlı çıkarım altyapısı üzerinden çağrılmasıyla sağlanmaktadır. Groq, LPU (Language Processing Unit) adı verilen özel donanımları kullanarak büyük dil modellerinden çok düşük gecikmeyle yanıt almaya olanak tanımaktadır.

Sistemde iki ayrı model birlikte çalıştırılmaktadır:

- **llama-3.3-70b-versatile (70 milyar parametre):** Şikayet metinlerinin sınıflandırılması ve duygu analizinde kullanılmaktadır. Büyük parametre sayısı sayesinde Türkçe metinleri yüksek isabetle ayrıştırabilmektedir. `/api/feedback/analyze` ve `/api/agent` uç noktalarında bu model devrededir.
- **llama-3.1-8b-instant (8 milyar parametre):** Kullanıcıyla doğal sohbet için tercih edilmiştir. Sınıflandırma kadar derin anlama gerektirmeyen, hız ve akıcılığın ön planda olduğu senaryolar (gerçek zamanlı sohbet, akıcı yanıt akışı) için uygundur. `/api/chat` ve `/api/chat/stream` uç noktalarında bu model kullanılmaktadır.

İki modelin birlikte kullanılması; "**analizde doğruluk, sohbette akıcılık**" şeklinde özetlenebilen bir tasarım kararının ürünüdür. Böylece kullanıcı sohbet ederken anlık geri dönüş alır; arka planda ise her şikayet metni daha güçlü model tarafından sınıflandırılır.

Sistem yönergesi (system prompt) **mühendislik** edilmiş; modele Türkçe karakter kullanımı, marka adı tespiti, kategori tanımları ve kafa karıştırıcı durumlar için çok sayıda örnek (few-shot examples) verilmiştir. Bu yönerge `backend/src/prompts/analyzePrompt.ts` dosyasında tek bir sabit olarak tutulmakta ve hem üretim ortamında hem de doğruluk ölçüm scriptinde aynı şekilde kullanılmaktadır. Bu, "ölçtüğümüz şey gerçek üretim sisteminin kendisidir" güvencesini sağlar.

## 5.4. Bir Şikayetin Yaşam Döngüsü

Bir kullanıcı şikayetinin sistem içindeki yolculuğu aşağıdaki adımları kapsar:

1. Kullanıcı, web arayüzündeki sohbet penceresine bir metin yazar ve **gönder** düğmesine basar.
2. Ön yüz tarafında `processResponse` fonksiyonu tetiklenir; mesajın istatistiksel bir sorgu olup olmadığı düzenli ifadeler ile sınanır.
3. Eğer mesaj genel bir geri bildirim ise, paralel olarak iki istek gönderilir: `/api/chat/stream` (doğal Türkçe sohbet cevabı için) ve `/api/feedback/analyze` (sınıflandırma ve veritabanı kaydı için).
4. Analiz uç noktası, mesni Llama 3.3-70B modeline iletir ve JSON formatında bir nesne alır: duygu etiketi (Negative/Neutral/Positive), güven puanı (0-1), kategori (Lojistik/Teknik/Ödeme/İletişim/Ürün/İşlem) ve marka adı.
5. Güven puanı 0.85 eşiğinin altında ise sistem otomatik olarak `needs_human=true` bayrağını ayarlar; böylece şikayet yönetici panelinde "insan operatöre yönlendirildi" olarak işaretlenir.
6. Tüm sonuçlar Prisma istemcisi aracılığıyla PostgreSQL veritabanındaki **Feedback** tablosuna kaydedilir.
7. Aynı veri, in-memory yedek diziye de eklenir (graceful degradation amacıyla).
8. Ön yüz, sohbet akışını ve analiz sonucunu birlikte göstererek kullanıcıya rozetler (duygu, marka, kategori) sunar.
9. Yönetici paneli, her üç saniyede bir backend'den güncel verileri çekerek tabloyu ve grafikleri otomatik olarak günceller.

Bu döngü; kullanıcının cevabı saniyeler içinde almasını, işletmenin ise veriyi anlık olarak yönetici panelinde görmesini sağlar.

## 5.5. Bilgi Tabanı Erişimli Üretim (RAG)

Sistem, son kullanıcının sorduğu **politika sorularına uydurma yapmadan** yanıt verebilmek için **Retrieval-Augmented Generation (RAG)** yaklaşımının basitleştirilmiş bir uygulamasını kullanmaktadır. `backend/data/knowledge_base.md` dosyasında 15 farklı başlık altında (iade politikası, kargo teslimat süreleri, ödeme yöntemleri, müşteri hizmetleri çalışma saatleri, KVKK hakları vb.) şirkete özel bilgiler tutulmaktadır. Backend başlangıcında bu dosya tek seferde belleğe yüklenir ve her sohbet isteğinde sistem yönergesinin sonuna eklenir.

Llama 3 modellerinin 128.000 simgelik geniş bağlam penceresi (context window), bilgi tabanının tamamının yönergeye yerleştirilmesine olanak tanımaktadır. Bu sayede vektör tabanlı bir aramaya gerek kalmadan, model her seferinde tüm politika dokümanını okuyarak ilgili kısmı kullanıcıya aktarabilmektedir. Yönergeye eklenen kurallar arasında "Marka adı belirtilmediyse genel rehberlik ver; belirtildiyse o markaya yönlendir" kuralı da bulunmaktadır; bu sayede sistem, AI Feedback Hub platformunun bir aracılık hizmeti olduğu gerçeğini koruyarak başka markalara ait politikaları olduğu gibi sunmaz.

## 5.6. Yapay Zeka Aracı Çağrısı (Function Calling / AI Agent)

Kullanıcılar yalnızca şikayet yazmazlar; aynı zamanda sistem hakkında sayısal sorular da sorabilirler: *"Toplam kaç şikayet var?", "En çok hangi markadan şikayet alıyoruz?", "İnsan yardımı kaç şikayette gerekti?"* gibi. Bu tür sorulara modelin kendi tahmini yerine veritabanından gerçek veriyle yanıt verilmesini sağlamak için **OpenAI uyumlu fonksiyon çağrısı (function calling)** mekanizması kullanılmıştır.

Sistemde tanımlı beş araç (tool) bulunmaktadır:
- `get_total_feedbacks` — toplam şikayet sayısını döndürür
- `get_negative_count` — negatif duyguya sahip şikayet sayısını döndürür
- `get_top_brands` — en çok şikayet alan ilk beş markayı döndürür
- `get_feedback_by_id` — belirli bir şikayet kimliğine ait detayları döndürür
- `get_human_help_count` — insan operatöre yönlendirilmiş şikayet sayısını döndürür

`/api/agent` uç noktası, kullanıcının mesajını Llama 3.3'e bu araç tanımlarıyla birlikte gönderir. Model gerekirse bir aracı çağırır; backend bu çağrıyı yakalar, Prisma sorgusunu çalıştırır ve sonucu modele geri verir. Model, bu gerçek veriyi doğal Türkçe bir cümleye dönüştürerek kullanıcıya iletir. Bu iki turlu çağrı yapısı, geleneksel chatbotların ezberlenmiş cevaplarını aşan, **gerçek anlamda akıllı yapay zeka ajan** davranışı sergilemektedir.

## 5.7. Akıcı (Streaming) Yanıt Sistemi

Daha doğal bir sohbet deneyimi için bot yanıtları **Server-Sent Events (SSE)** kullanılarak parça parça (token-by-token) ön yüze gönderilmektedir. `/api/chat/stream` uç noktası, Groq'un `stream: true` parametresini etkinleştirir ve gelen her bir simgeyi anında `data: {token}` formatında ön yüze iletir.

Bu yöntemin sorunsuz çalışması için iki kritik düzeltme uygulanmıştır:
- `res.flushHeaders()` çağrısı ile HTTP başlıkları gecikmeden istemciye gönderilmektedir.
- `res.socket.setNoDelay(true)` ile TCP'nin Nagle algoritması devre dışı bırakılmakta, böylece küçük paketler tampona alınmadan anında iletilmektedir.

Ön yüz tarafında ise gelen veri akışı `ReadableStream.getReader()` ile satır satır okunmakta ve her simge geldikçe son mesaj kutusu güncellenmektedir. Bu yaklaşım, ChatGPT benzeri akıcı bir yazma deneyimi sunmaktadır.

## 5.8. Sesli Giriş ve Çıkış

Sistem, raporda öngörüldüğü gibi "**konuşma tabanlı**" yaklaşımını derinleştirmek üzere tarayıcının yerleşik **Web Speech API** arayüzlerini kullanmaktadır:

- **SpeechRecognition** sınıfı, mikrofon ile alınan sesleri yazıya dönüştürür. Dil parametresi `tr-TR` olarak ayarlanmıştır; bu sayede Türkçe konuşmalar yüksek isabetle metne aktarılır.
- **SpeechSynthesis** sınıfı, bot yanıtlarını sesli olarak okur. Tarayıcıda yüklü Türkçe ses motoru (`Yelda` veya benzer bir TTS sesi) otomatik olarak seçilir.

Akıcı yanıt akışıyla birlikte ortaya çıkan "yarım metin okuma" hatalarını engellemek için yanıtın **tamamlandığını işaretleyen bir bayrak (`complete: true`)** ön yüz tarafında kullanılmaktadır. Yalnızca tamamlanmış mesajlar sesli okumaya alınır; akış sırasında parça parça gelen geçici durumlar sessizdir.

Ayrıca, Chrome tarayıcısında bilinen `cancel() + speak()` ardışık çağrı hatasını engellemek için bir bekleme süresi (debounce) uygulanmıştır. Konuşma sırasında 10 saniye dolduğunda otomatik `pause/resume` çağrıları yapılarak Chrome'un uzun metinleri keserek durdurmasının önüne geçilmiştir.

## 5.9. Hibrit Destek Mekanizması

Literatürde [Jain & Kumar 2019; Følstad & Brandtzæg 2018] vurgulandığı üzere, saf chatbot sistemleri tek başına müşteri destek süreçlerinin tamamını karşılamak için yeterli değildir; insan desteğinin işin içinde kalması önerilmektedir. Bu öneri, sistemimize **güven puanı tabanlı otomatik yönlendirme** olarak entegre edilmiştir.

Her şikayet analizinden sonra Llama modelinin döndürdüğü `confidence_score` değeri 0.85 eşiğinin altında ise, ilgili kayıt veritabanında `needs_human=true` bayrağıyla işaretlenir. Bu işaret yönetici paneline yansır; ilgili satır sarı renkle vurgulanır ve özet kartlarda **"İnsan Yardımı"** sayacı artar. Ayrıca kullanıcıya gönderilen bot mesajının altında *"Şikayetiniz uzman temsilcimize yönlendirildi"* açıklaması gösterilir. Böylece chatbot, kendi kapasitesini aşan durumlarda kullanıcıyı serbest bırakmak yerine açıkça insan operatöre devredildiğini bildirir; bu da kullanıcı güvenini artıran önemli bir UX kararıdır.

## 5.10. Memnuniyet Anketi

Her şikayet analizinin altında kullanıcıya **"Faydalı mıydı?"** sorusu ile iki düğme (👍 / 👎) sunulmaktadır. Düğmeye basıldığında `/api/feedback/:id/rate` uç noktasına bir HTTP `POST` isteği gönderilir; veritabanındaki Feedback kaydının `helpful` alanı güncellenir. Yönetici panelinde tüm oylar üzerinden bir **memnuniyet oranı** hesaplanır (`helpful=true` sayısı ÷ toplam oy sayısı) ve özet kart üzerinden anlık olarak gözlemlenebilir. Bu basit mekanizma, vize raporunda öngörülen "kullanıcı memnuniyetinin ölçülmesi" hedefini somut bir veri akışıyla karşılamaktadır.

## 5.11. Marka Tespiti ve Filtreleme

Sistem, AI Feedback Hub'ın aracılık özelliğinin gereği olarak şikayetin **hangi markayla ilgili olduğunu** otomatik tespit etmektedir. Llama 3.3 modeline verilen sistem yönergesi, metinde geçen marka adlarını (örnek: "Trendyol", "Hepsiburada", "Getir", "Migros", "Turkcell") JSON çıktısında ayrı bir alan (`brand`) olarak döndürmesini ister. Marka belirtilmemişse "Belirtilmemiş" değeri atanır.

Yönetici panelinde, en çok şikayet alan ilk altı marka **filtre çipleri (chip)** olarak gösterilir. Yönetici, herhangi bir markaya tıklayarak tabloyu o markaya ait şikayetlerle sınırlandırabilir. Bu özellik, geleneksel bir destek sistemine kıyasla yöneticilere **marka bazlı segmentasyon** gücü kazandırır ve karar destek mekanizmasının somut bir parçasını oluşturur.

## 5.12. Yapay Zeka Doğruluk Ölçüm Scripti

Sistemin yapay zeka tarafının ne kadar isabetli çalıştığını ölçmek için ayrı bir Node.js scripti yazılmıştır: `backend/src/scripts/measureAccuracy.ts`. Bu script:

1. `backend/data/test_dataset.json` dosyasındaki 24 etiketli test örneğini okur.
2. Her örneği `/api/feedback/analyze` uç noktasının kullandığı **birebir aynı sistem yönergesi ve modeliyle** Llama'ya gönderir.
3. Dönen yanıtlardaki kategori ve duygu etiketlerini gerçek (etiketli) değerlerle karşılaştırır.
4. Kategori doğruluğu, duygu doğruluğu ve genel doğruluk (her ikisi birden) yüzdesini hesaplar.
5. **Karışıklık matrisi (confusion matrix)** üretir; hangi kategorinin hangi kategoriye karıştığını görselleştirir.
6. Tüm sonuçları `backend/data/accuracy_results.json` dosyasına yazar ve konsolda özet tablo basar.

Çıktı dosyası, backend'in `/api/admin/accuracy` uç noktası üzerinden ön yüz yönetici paneline ulaştırılır ve **"Sistem Doğruluğu"** kartında gerçek ölçüm değeri olarak gösterilir. Bu döngü; gelecekte test verisi büyütüldükçe veya model değiştikçe ölçümün tekrarlanabilir olmasını sağlar.

## 5.13. Kod Düzenleme Pratikleri

Geliştirme süresince aşağıdaki pratiklere bağlı kalınmıştır:

- **Ortam değişkenleri** kodda sabit olarak yazılmamış; tüm gizli bilgiler (API anahtarı, veritabanı bağlantı dizgisi) `.env` dosyasından okunmaktadır. Bu dosya `.gitignore` ile sürüm kontrolünden hariç tutulmuştur.
- **Tip güvenliği** TypeScript ile sağlanmıştır; bu sayede çalışma anında oluşabilecek hataların büyük kısmı derleme sırasında yakalanır.
- **Modüler bilgi tabanı**: Yapay zekaya verilen prompt'lar ayrı dosyalarda tutulmuş (`backend/src/prompts/analyzePrompt.ts`); böylece prompt güncellenince hem üretim hem de ölçüm scripti aynı yönergeyi kullanır.
- **Zarif düşüş (graceful degradation)**: Veritabanı veya Llama servisi geçici olarak ulaşılamaz duruma düşse bile sistem in-memory yedek mekanizmasıyla kullanıcıya yanıt vermeye devam eder.
- **Sürüm kontrolü ve sürekli dağıtım**: Proje GitHub deposunda tutulmakta, ön yüz Vercel'e, arka yüz Render'a otomatik olarak dağıtılmaktadır.
- **Çevrimiçi izleme**: Render servisinin "uyku" moduna geçmesini engellemek için UptimeRobot servisi her beş dakikada bir backend'i sorgulamakta, böylece kullanıcı için ilk açılış gecikmesi ortadan kalkmaktadır.

Bu pratikler birleştiğinde sistem; akademik bir prototipin ötesinde, üretim ortamında çalışabilen, ölçeklenebilir bir mimari sunmaktadır.
