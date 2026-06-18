---
title: "YAPAY ZEKA DESTEKLİ MÜŞTERİ GERİ BİLDİRİMLERİNİN ANALİZİ İÇİN KONUŞMA TABANLI BİR CHATBOT SİSTEMİ"
author: "SUDENAZ KAYABAŞI"
---

\newpage

# YEMİN METNİ

Tasarım Projesi olarak sunduğum "Yapay Zeka Destekli Müşteri Geri Bildirimlerinin Analizi için Konuşma Tabanlı Bir Chatbot Sistemi" başlıklı bu çalışmanın, bilimsel ahlak ve geleneklere uygun şekilde tarafımdan yazıldığını, bu tezdeki bütün bilgileri akademik ve etik kurallar içinde elde ettiğimi, yararlandığım eserlerin tamamının kaynaklarda gösterildiğini ve çalışmamın içinde kullanıldıkları her yerde bunlara atıf yapıldığını, patent ve telif haklarını ihlal edici bir davranışımın olmadığını belirtir ve bunu onurumla doğrularım.

......./ /.

İmzası

**SUDENAZ KAYABAŞI**

Danışmanı: FUAT CANDAN

**Anahtar Kelimeler:** Chatbot, Yapay Zeka, Doğal Dil İşleme, Duygu Analizi, Metin Sınıflandırma, Müşteri Geri Bildirimi, Konuşma Tabanlı Sistemler, Llama, Groq, RAG, Function Calling, Node.js, TypeScript, PostgreSQL, Prisma.

\newpage

# ÖZ

## YAPAY ZEKA DESTEKLİ MÜŞTERİ GERİ BİLDİRİMLERİNİN ANALİZİ İÇİN KONUŞMA TABANLI BİR CHATBOT SİSTEMİ

Günümüzde işletmeler, müşteri taleplerini ve geri bildirimlerini hızlı, etkili ve veriye dayalı bir biçimde yönetme ihtiyacı duymaktadır. Bu projede, işletmelerin müşteri geri bildirimlerini sistematik bir biçimde toplayıp analiz edebilmesini sağlayan yapay zeka destekli, konuşma tabanlı bir chatbot platformu geliştirilmiştir.

Geliştirilen sistemde Node.js ve TypeScript ile web tabanlı bir arka yüz; Next.js ve React ile modern bir kullanıcı arayüzü kurulmuştur. Yapay zeka tarafında, Groq LPU altyapısı üzerinden çağrılan Meta Llama 3.3-70B modeli şikayet metinlerinin duygu durumunu ve kategorisini sınıflandırırken, Llama 3.1-8B modeli akıcı sohbet için kullanılmıştır. Kullanıcı-bot etkileşimleri Server-Sent Events üzerinden gerçek zamanlı akış halinde sunulmakta; sohbet hafızası sayesinde çok-turlu diyaloglar desteklenmektedir.

Şirkete özel politika bilgileri (iade, kargo, KVKK vb.) Retrieval-Augmented Generation (RAG) yaklaşımı ile sistem yönergesine eklenmiş; böylece bot uydurma yapmadan kurumsal politikalara uygun yanıt vermektedir. Ayrıca fonksiyon çağırma (Function Calling) yöntemi ile bot, kullanıcıların istatistiksel sorularını veritabanından çektiği gerçek verilerle yanıtlamaktadır. Web Speech API entegrasyonu sayesinde kullanıcılar sesli olarak da iletişim kurabilmektedir.

Sistem; PostgreSQL ilişkisel veritabanı ve Prisma ORM ile kalıcı veri saklama, Render ve Vercel üzerinden bulut dağıtımı, UptimeRobot ile sürekli erişilebilirlik gibi üretim seviyesi pratiklerle güçlendirilmiştir. Hibrit destek mekanizması, modelin güven puanı eşik değerinin altına düştüğünde şikayeti otomatik olarak insan operatöre yönlendirmektedir.

Vize aşamasında simüle edilen yapay zeka süreci, 24 örneklik etiketli test seti üzerinde ölçülmüş; kategori sınıflandırma doğruluğu %50'den %92'ye, duygu analizi doğruluğu %96'dan %100'e, genel doğruluk %50'den %88'e yükselmiştir. Yönetici paneli; gerçek zamanlı grafikler, marka bazlı filtreleme, kullanıcı memnuniyet oranı ve CSV ile veri dışa aktarımı gibi karar destek araçlarını içermektedir.

Sonuç olarak; geliştirilen platform, modern büyük dil modellerini gerçek bir kullanıcı senaryosuna entegre eden, ölçülmüş başarı oranlarıyla desteklenen ve üretim ortamında çalışan bütünleşik bir sistem olarak sunulmaktadır.

\newpage

# ŞEKİLLER LİSTESİ

- Şekil 1. Yapay Zeka Destekli Chatbot Sistem Mimarisi
- Şekil 2. Chatbot Sistemi Use Case Diyagramı
- Şekil 3. Chatbot Mesaj İşleme Sürecine Ait Sequence Diyagramı
- Şekil 4. Chatbot Sistemi ER Diyagramı
- Şekil 5. Chatbot Sistemine Ait UML Sınıf (Class) Diyagramı
- Şekil 6. Chatbot Sistemine Ait Nesne (Object) Diyagramı
- Şekil 7. AI Feedback Hub Platformu Ana Giriş Ekranı (Landing Page)
- Şekil 8. Müşteri Deneyimleri ve Kategori Filtreleme Arayüzü
- Şekil 9. Konuşma Tabanlı Chatbot ve Yapay Zeka Duygu Analizi Çıktısı
- Şekil 10. Güvenli Yönetici (Admin) Giriş Doğrulama Ekranı
- Şekil 11. Yönetici Paneli Gerçek Zamanlı Analitik ve Raporlama Ekranı
- Şekil 12. Hibrit Destek Banner'ı (İnsan Operatöre Yönlendirme)
- Şekil 13. Yönetici Paneli — Kategori Dağılımı Halka Grafiği
- Şekil 14. Marka Filtreleme Çipleri
- Şekil 15. AI Agent — Function Calling Rozeti
- Şekil 16. Memnuniyet Anketi — 👍/👎 Butonları
- Şekil 17. Sesli Giriş Aktif Durumu (Mikrofon Dinleniyor)
- Şekil 18. Streaming Yanıt Akışı (Token-by-Token Görselleştirme)
- Şekil 19. Doğruluk Ölçüm Karışıklık Matrisi (Confusion Matrix)
- Şekil 20. Karşılama Ekranı — Hızlı İşlem Kartları
- Şekil E.1. Chatbot Sistemi ER Diyagramı (Detaylı)
- Şekil E.2. Chatbot Sistemi UML Sınıf Diyagramı (Detaylı)
- Şekil E.3. Chatbot Sistemi Nesne Diyagramı (Detaylı)
- Şekil E.4. Chatbot Mesaj İşleme Süreci Sequence Diyagramı (Detaylı)

\newpage

# KISALTMALAR

- **AI**: Artificial Intelligence (Yapay Zeka)
- **NLP**: Natural Language Processing (Doğal Dil İşleme)
- **REST**: Representational State Transfer
- **JWT**: JSON Web Token
- **API**: Application Programming Interface
- **DB**: Database (Veritabanı)
- **UI**: User Interface (Kullanıcı Arayüzü)
- **UX**: User Experience (Kullanıcı Deneyimi)
- **CRUD**: Create, Read, Update, Delete
- **HTTP**: Hypertext Transfer Protocol
- **JSON**: JavaScript Object Notation
- **LLM**: Large Language Model (Büyük Dil Modeli)
- **LPU**: Language Processing Unit
- **RAG**: Retrieval-Augmented Generation
- **SSE**: Server-Sent Events
- **TTS**: Text-to-Speech
- **STT**: Speech-to-Text
- **ORM**: Object-Relational Mapping
- **KVKK**: Kişisel Verilerin Korunması Kanunu
- **CDN**: Content Delivery Network
- **CI/CD**: Continuous Integration / Continuous Deployment
- **HMR**: Hot Module Replacement
- **CSV**: Comma-Separated Values
- **SQL**: Structured Query Language

\newpage

# SÖZLÜK

**Chatbot:** Kullanıcılarla yazılı veya sözlü olarak etkileşime giren, önceden tanımlanmış kurallar veya yapay zeka teknikleri kullanarak yanıt üreten yazılım sistemidir.

**Yapay Zeka:** Bilgisayar sistemlerinin insan benzeri düşünme, öğrenme ve karar verme yetenekleri kazanmasını amaçlayan teknoloji alanıdır.

**Doğal Dil İşleme (NLP):** İnsan dili ile bilgisayarlar arasındaki etkileşimi sağlayan, metin ve konuşma verilerinin analiz edilmesini amaçlayan yapay zeka alt alanıdır.

**Duygu Analizi:** Metin tabanlı veriler üzerinden kullanıcıların duygu durumlarının (olumlu, olumsuz, nötr) belirlenmesini amaçlayan analiz yöntemidir.

**Metin Sınıflandırma:** Metinlerin belirli konu veya kategori başlıkları altında otomatik olarak sınıflandırılmasını sağlayan yöntemdir.

**Müşteri Geri Bildirimi:** Kullanıcıların bir ürün veya hizmete ilişkin görüş, şikâyet ve değerlendirmelerini içeren veridir.

**Büyük Dil Modeli (LLM):** Milyarlarca parametre içeren ve metin verisi üzerinde eğitilerek insan benzeri metin üretebilen yapay zeka modelleridir. Llama, GPT, Claude gibi modeller bu sınıfa girer.

**Retrieval-Augmented Generation (RAG):** Büyük dil modellerinin uydurma yapma eğilimini azaltmak için, modele cevap üretmeden önce harici bir bilgi kaynağından ilgili bağlamı sağlayan yapay zeka mimarisidir.

**Function Calling (Araç Çağrısı):** Büyük dil modellerinin önceden tanımlanmış fonksiyonları (araçları) çağırarak harici sistemlerle etkileşime girmesini sağlayan yöntemdir.

**Server-Sent Events (SSE):** Sunucudan istemciye tek yönlü, sürekli veri akışı sağlayan HTTP tabanlı bir standarttır.

**ORM (Object-Relational Mapping):** Nesne tabanlı programlama dilleri ile ilişkisel veritabanları arasında köprü görevi gören soyutlama katmanıdır.

**Streaming Yanıt:** Sunucu tarafından üretilen yanıtın tamamı beklenmeden, kelime kelime (token-by-token) istemciye iletilmesi.

**Sistem Yönergesi (System Prompt):** Büyük dil modellerine davranışlarını yönlendirmek için verilen başlangıç talimatıdır.

**Confidence Score (Güven Puanı):** Modelin verdiği bir cevaptan ne kadar emin olduğunu temsil eden 0-1 arası sayısal değerdir.

**Confusion Matrix (Karışıklık Matrisi):** Sınıflandırma modellerinin performansını ölçmek için kullanılan, gerçek etiketler ile tahmin edilen etiketler arasındaki ilişkiyi gösteren matrisidir.

\newpage

# TEKNİK ALTYAPI VE KULLANILAN TEKNOLOJİLER

**Node.js:** Sunucu taraflı uygulamaların geliştirilmesi için kullanılan, JavaScript tabanlı açık kaynaklı bir çalışma ortamıdır. Bu projede chatbot sisteminin tüm arka yüz servisleri Node.js üzerinde geliştirilmiş; asenkron yapısı sayesinde eş zamanlı kullanıcı isteklerinin etkin bir şekilde yönetilmesine olanak tanımıştır.

**TypeScript:** JavaScript'in tip güvenliği sağlayan gelişmiş bir sürümüdür. Projede kodun daha okunabilir, sürdürülebilir ve hatalara karşı daha güvenli olması amacıyla tercih edilmiştir. Hem ön yüz hem arka yüz tarafında bu dil kullanılmıştır.

**Express.js:** Node.js üzerinde çalışan hafif ve esnek bir web uygulama çatısıdır. Chatbot servislerinin REST API yapısında oluşturulması ve istemci–sunucu iletişiminin sağlanması amacıyla kullanılmıştır.

**Groq + Meta Llama:** Yapay zeka tarafı, Meta tarafından yayımlanan açık ağırlıklı Llama modellerinin Groq isimli yüksek hızlı çıkarım platformu üzerinden çağrılmasıyla sağlanmaktadır. Groq, LPU (Language Processing Unit) adı verilen özel donanımları sayesinde büyük dil modellerini çok düşük gecikmeyle çalıştırmaktadır. Sistemde iki ayrı Llama modeli birlikte kullanılmaktadır: **llama-3.3-70b-versatile** şikayet metinlerinin sınıflandırılmasında ve duygu analizinde kullanılmakta, yüksek parametre sayısı Türkçe metinleri yüksek isabetle anlamayı sağlamaktadır; **llama-3.1-8b-instant** ise kullanıcı ile sohbet akışında, hız ve akıcılık öncelikli senaryolar için tercih edilmiştir. Bu çift model stratejisi, "analizde doğruluk, sohbette akıcılık" tasarım kararının somut karşılığıdır.

**Sistem Yönergesi (System Prompt) Mühendisliği:** Yapay zekanın istenen biçimde çıktı üretebilmesi için sistem yönergesi titizlikle hazırlanmıştır. Yönerge; kategori tanımlarını, marka çıkarma kurallarını, kafa karıştırıcı vakalar için örnekler (few-shot examples), Türkçe karakter kullanım kurallarını ve aracılık platformu olunduğu için "marka belirtilmişse o markaya yönlendir" prensibini içermektedir. Tek bir sabit dosyada tutulmakta; hem üretim ortamında hem de doğruluk ölçüm scriptinde aynı yönerge kullanılmaktadır.

**RAG (Retrieval-Augmented Generation):** Şirkete özel politikalar (iade, kargo, KVKK, ödeme yöntemleri vb.) 15 başlık altında bir bilgi tabanı dosyasında tutulmaktadır. Backend başlangıçta bu dosyayı belleğe yükleyip her sohbet isteğinin sistem yönergesine eklemektedir. Llama 3 modellerinin 128.000 simgelik bağlam penceresi sayesinde, bilgi tabanının tamamı yönergeye yerleştirilebilmekte; bu sayede vektör tabanlı bir aramaya gerek kalmadan bot gerçek dokümanlardan cevap üretmektedir. Bu yaklaşım, Lewis ve arkadaşlarının 2020 yılında yayımladığı RAG çalışmasının basitleştirilmiş bir uygulamasıdır.

**Function Calling (Araç Çağrısı):** Llama 3.3'ün fonksiyon çağrısı yeteneği sayesinde bot; "Toplam kaç şikayet var?", "En çok hangi marka şikayet alıyor?" gibi sorulara veritabanından çektiği gerçek verilerle yanıt vermektedir. Sistemde tanımlı beş araç (`get_total_feedbacks`, `get_negative_count`, `get_top_brands`, `get_feedback_by_id`, `get_human_help_count`) Prisma sorgularıyla eşlenmiştir. Bu yaklaşım, geleneksel chatbot'ların ezberlenmiş cevaplarını aşan, AI Agent seviyesinde bir davranış sergilemektedir.

**PostgreSQL ve Prisma ORM:** Veri saklama katmanı için **PostgreSQL** ilişkisel veritabanı yönetim sistemi kullanılmaktadır. Veritabanı adı `chatbot_feedback_db` olarak belirlenmiştir. Yerel geliştirme ortamında bilgisayara kurulan PostgreSQL hizmeti üzerinden, üretim ortamında ise Render Cloud'un ücretsiz Postgres servisi üzerinden çalışmaktadır. Veritabanı erişimi için doğrudan SQL yerine **Prisma ORM** tercih edilmiştir. Prisma; tip güvenli sorgular, otomatik migration üretimi ve tek bir şema dosyasında tüm modellerin tanımlanması gibi avantajlar sunmaktadır. Vize aşamasında SQLite öngörülmüştü; ancak SQLite'ın dosya tabanlı yapısı bulut platformlarının geçici disk sistemleriyle uyumsuzluk gösterdiği için PostgreSQL'e geçilmiştir.

**Web Speech API:** Tarayıcının yerleşik Web Speech API arayüzleri kullanılarak iki yönlü sesli etkileşim sağlanmıştır: **SpeechRecognition** kullanıcının mikrofondan konuştuğu Türkçe sesleri yazıya dönüştürür; **SpeechSynthesis** bot yanıtlarını Türkçe ses motoruyla sesli olarak okur. Bu entegrasyon; raporun "konuşma tabanlı" başlığını teknik olarak da karşılamakta, erişilebilirlik açısından önemli bir katkı sağlamaktadır.

**Server-Sent Events (SSE):** Bot yanıtlarının gerçek zamanlı olarak kelime kelime ön yüze iletilmesi için Server-Sent Events standardı kullanılmıştır. Backend, `/api/chat/stream` uç noktası üzerinden `text/event-stream` MIME türü ile veri akıtmakta; ön yüz ReadableStream API'si ile bu akışı satır satır okumaktadır. Bu yaklaşım, ChatGPT benzeri akıcı bir yazma deneyimi sunmaktadır.

**React ve Next.js:** Kullanıcı arayüzü, React kütüphanesi temel alınarak Next.js 15 üst çatısında geliştirilmiştir. Sayfa bileşen tabanlı yapıda organize edilmiş, Hot Module Replacement özelliği geliştirme sürecini hızlandırmıştır.

**Tailwind CSS:** Sistem arayüzünün, yönetici panelinin ve grafiklerin kurumsal standartlarda, hızlı ve duyarlı (responsive) bir şekilde tasarlanması için kullanılan CSS kütüphanesidir.

**framer-motion:** Sohbet penceresinin sürüklenebilir olmasını sağlayan React animasyon kütüphanesidir. `motion.div` öğesinin `drag` özelliği etkinleştirilerek, kullanıcılar pencereyi ekran üzerinde diledikleri konuma taşıyabilmektedir. Aynı kütüphane mesaj balonlarının yumuşak biçimde belirmesi için de kullanılmıştır.

**Chart.js ve react-chartjs-2:** Yönetici panelindeki veri görselleştirmeleri için Chart.js kütüphanesi ve onun React adaptörü kullanılmıştır. Sistemde iki tür grafik bulunmaktadır: duygu güven puanlarının zaman ekseninde trend görselleştirmesi için **Line Chart**; şikayet kategorilerinin altılı dağılım görselleştirmesi için **Doughnut Chart**.

**HTTP / REST API:** İstemci, chatbot backend'i ve yapay zeka servisleri arasındaki veri iletişimi HTTP protokolü ve REST mimarisi kullanılarak gerçekleştirilmiştir.

**Render Cloud ve Vercel:** Sistem, üretim ortamında iki ayrı bulut platformu üzerinden hizmet vermektedir: Vercel ön yüz uygulamasının global CDN üzerinden hızlı dağıtımını sağlamakta; Render arka yüz uygulamasının ve PostgreSQL veritabanının barındırılmasında kullanılmaktadır. Her `git push` sonrası otomatik dağıtım yapılır.

**UptimeRobot:** Render'ın ücretsiz katmanında, 15 dakika hareketsiz kalan servisler otomatik olarak uykuya alınmaktadır. Bu durum bir sonraki istek geldiğinde soğuk başlangıç gecikmesine yol açar. Bu durumu önlemek için UptimeRobot servisi her beş dakikada bir backend'in `/api/admin/dashboard-stats` uç noktasını sorgulayarak servisin canlı kalmasını sağlamaktadır.

**Yapay Zeka Doğruluk Ölçüm Scripti:** Sistemin yapay zeka tarafının başarı oranını ölçmek üzere TypeScript ile yazılmış bağımsız bir Node.js scripti geliştirilmiştir. Bu script; 24 örneklik etiketli test setini Llama'ya gönderir, tahminleri gerçek etiketlerle karşılaştırır ve karışıklık matrisi ile birlikte doğruluk yüzdelerini hesaplar. Sonuçlar yönetici panelinde "Sistem Doğruluğu" kartı üzerinden son kullanıcıya da iletilir.

**Geliştirme Aracı:** Geliştirme sürecinde Anthropic Claude isimli yapay zeka asistanı; kod örnekleri üretme, hata ayıklama, sistem mimarisi tartışmaları ve raporun bazı bölümlerinin organize edilmesi gibi alanlarda destekleyici bir araç olarak kullanılmıştır. Tüm tasarım kararları, model seçimleri, mimari tercihler ve nihai uygulama bu raporun yazarı tarafından alınmış ve uygulanmıştır.

\newpage

# GİRİŞ

Günümüzde dijitalleşmenin hızla artmasıyla birlikte işletmeler, müşteri taleplerini ve geri bildirimlerini daha hızlı, etkili ve sürdürülebilir biçimde yönetme ihtiyacı duymaktadır. Özellikle çevrimiçi platformlar üzerinden gerçekleşen müşteri etkileşimlerinin artması, geleneksel müşteri destek yöntemlerinin yetersiz kalmasına neden olmaktadır. Bu durum, hem işletmelerin operasyonel yükünü artırmakta hem de müşteri memnuniyetini olumsuz yönde etkileyebilmektedir [1], [3].

Bu konunun seçilmesinde, müşteri destek süreçlerinde yaşanan iletişim ve geri bildirim problemlerinin uygulamada sıkça gözlemlenmesi etkili olmuştur. Son yıllarda konuşma tabanlı sistemler, kullanıcılarla doğal ve etkileşimli bir iletişim kurabilme yetenekleri sayesinde müşteri destek süreçlerinde yaygın olarak kullanılmaya başlanmıştır. Chatbot sistemleri, çok fazla sorulan soruların yanıtlanması, temel bilgilendirmelerin yapılması ve kullanıcı geri bildirimlerinin toplanması gibi birçok işlevi otomatikleştirerek işletmelere önemli avantajlar sunmaktadır. Bu sistemler, müşteri taleplerine kesinti olmadan erişim sağlayarak zaman ve maliyet açısından verimlilik sağlamaktadır [1], [2], [3].

Müşteri geri bildirimleri, işletmelerin sundukları ürün ve hizmetleri geliştirebilmeleri açısından kritik bir öneme sahiptir. Ancak bu geri bildirimlerin büyük ölçüde metin tabanlı ve dağınık yapıda olması, anlamlı sonuçlar elde edilmesini zorlaştırmaktadır. Bu nedenle, müşteri mesajlarının sistematik bir biçimde toplanması, sınıflandırılması ve analiz edilmesi gerekmektedir. Konuşma tabanlı sistemler, bu süreci merkezi ve düzenli bir yapı altında ele alabilme imkânı sunmaktadır [4], [5].

Bu çalışma kapsamında, işletmelerin müşteri etkileşimlerini daha etkin bir şekilde yönetebilmeleri amacıyla web tabanlı bir müşteri destek ve geri bildirim chatbot sistemi geliştirilmiştir. Geliştirilen sistem, kullanıcılarla etkileşime girerek sık karşılaşılan talepleri karşılamakta ve müşteri geri bildirimlerini kayıt altına almaktadır. Elde edilen veriler, işletmelere hizmet süreçlerini değerlendirebilmeleri için anlamlı bir kaynak sunmaktadır.

Bu raporun final aşamasında, vize aşamasında öngörülen birçok özellik gerçek uygulamaya dönüştürülmüştür. Simüle edilen yapay zeka süreci; Groq LPU altyapısı üzerinden Meta Llama 3.3-70B modeli ile gerçek bir doğal dil işleme servisine bağlanmıştır. Sisteme; çok-turlu konuşma hafızası, Server-Sent Events ile akıcı yanıt akışı, Retrieval-Augmented Generation (RAG) tabanlı bilgi erişimi, Function Calling ile veritabanı sorgulu yapay zeka aracılığı, hibrit insan-yapay zeka destek mekanizması, marka tespiti, sesli giriş ve çıkış, kullanıcı memnuniyet anketi ve PostgreSQL ile kalıcı veri depolama gibi yetkinlikler entegre edilmiştir. Yapay zekanın başarı oranı, 24 örneklik etiketli bir test seti üzerinde ölçülmüş ve raporlanmıştır; kategori sınıflandırma doğruluğu %92, duygu analizi doğruluğu %100, genel doğruluk %88 olarak tespit edilmiştir.

Çalışmanın temel amacı, konuşma tabanlı sistemlerin müşteri destek süreçlerindeki kullanımını incelemek, bu sistemlerin işletmelere sağladığı katkıları ortaya koymak ve büyük dil modellerinin gerçek bir kullanım senaryosuna entegre edildiği üretim seviyesi bir prototip geliştirmektir. Geliştirilen chatbot sistemi ile müşteri etkileşimlerinin daha düzenli, erişilebilir, ölçülebilir ve analiz edilebilir hâle getirilmesi hedeflenmiştir. Sistem; hem yerel geliştirme ortamında hem de Vercel ve Render bulut platformları üzerinde çalışır durumda dağıtılmıştır.

\newpage

# 1. LİTERATÜR TARAMASI

## 1.1. Chatbot Teknolojilerinin Gelişimi

Chatbot teknolojileri, insan–bilgisayar etkileşimi alanında uzun süredir üzerinde çalışılan bir konudur. İlk chatbot örnekleri, sınırlı kelime dağarcığına ve önceden tanımlanmış cevaplara dayanan basit sistemler olarak geliştirilmiştir. Bu sistemler, kullanıcıdan gelen girdileri belirli anahtar kelimelerle eşleştirerek cevap üretmekte ve çoğunlukla dar bir konu alanında hizmet vermekteydi. Literatürde bu tür chatbotlar, kontrol edilebilir olmaları ve düşük sistem gereksinimleri nedeniyle özellikle başlangıç seviyesindeki uygulamalar için tercih edilmiştir [1], [3].

Zamanla internet kullanımının yaygınlaşması ve dijital müşteri etkileşimlerinin artması, chatbot sistemlerinden beklentileri de artırmıştır. Kullanıcıların daha doğal, konuya uygun ve hızlı yanıtlar beklemesi, chatbot teknolojilerinin gelişim sürecini hızlandırmıştır. Bu doğrultuda geliştirilen yeni nesil chatbot sistemleri, yalnızca belirli anahtar kelimelere değil, kullanıcı mesajlarının genel içeriğine ve bağlamına odaklanmaya başlamıştır. Literatürde, bu dönüşümün chatbotların müşteri destek süreçlerinde daha yaygın kullanılmasının önünü açtığı belirtilmektedir [1], [7].

### 1.1.1. Kural Tabanlı Chatbot Sistemleri

Kural tabanlı chatbot sistemleri, belirli senaryolar ve önceden tanımlanmış diyalog akışları üzerinden çalışan yapılardır. Bu sistemlerde, kullanıcıdan alınan mesajlar belirli kurallar çerçevesinde değerlendirilmekte ve bu kurallara karşılık gelen yanıtlar sunulmaktadır. Kural tabanlı yapılar, özellikle sık sorulan soruların yanıtlanması, yönlendirme yapılması ve temel bilgilendirme süreçlerinde etkili sonuçlar vermektedir.

Literatürde yapılan çalışmalar, kural tabanlı chatbotların basit ve sürekli tekrarlayan kullanıcı taleplerinde yüksek doğruluk sağladığını göstermektedir. Bununla birlikte, bu sistemlerin esnekliğinin sınırlı olduğu ve beklenmeyen kullanıcı ifadeleri karşısında yetersiz kalabildiği de vurgulanmaktadır. Bu nedenle kural tabanlı chatbotlar, genellikle daha karmaşık sistemlerin bir parçası olarak veya belirli bir konu alanıyla sınırlandırılarak kullanılmaktadır [1], [3].

### 1.1.2. Yapay Zeka Destekli Chatbot Sistemleri

Kural tabanlı sistemlerin sınırlı olması, chatbot teknolojilerinin daha gelişmiş analiz yöntemleriyle desteklenmesine yol açmıştır. Yapay zeka destekli chatbot sistemleri, kullanıcı mesajlarını sadece anahtar kelimeler üzerinden değil, içerik ve bağlam açısından da değerlendirebilmektedir. Bu yaklaşım, chatbotların daha geniş bir konu yelpazesinde ve farklı ifade biçimlerine karşı daha tutarlı yanıtlar verebilmesini sağlamaktadır [1], [8].

Literatürde, yapay zeka destekli chatbotların müşteri geri bildirimlerinin toplanması ve analiz edilmesi süreçlerinde önemli avantajlar sunduğu belirtilmektedir. Özellikle metin tabanlı geri bildirimlerin sınıflandırılması ve genel eğilimlerin belirlenmesi, bu tür sistemlerin öne çıkan kullanım alanları arasında yer almaktadır. Ancak bazı çalışmalarda, bu sistemlerin tamamen bağımsız bir çözüm olarak değil, insan destekli hibrit yapılar içerisinde kullanılmasının daha verimli olduğu ifade edilmektedir [3], [7].

## 1.2. Doğal Dil İşleme ve Metin Analizi

Doğal dil işleme, bilgisayar sistemlerinin insan diliyle üretilmiş metinleri anlamlandırmasını amaçlayan bir çalışma alanıdır. Chatbot sistemlerinde doğal dil işleme yöntemleri, kullanıcı mesajlarının doğru şekilde yorumlanabilmesi açısından önemli bir rol oynamaktadır. Literatürde, doğal dil işleme yöntemlerinin özellikle metin tabanlı geri bildirimlerin analiz edilmesinde yaygın olarak kullanıldığı görülmektedir [4], [8].

Metin analizi süreçleri sayesinde, büyük miktarda kullanıcı verisi daha düzenli ve anlamlı hale getirilebilmektedir. Bu durum, işletmelerin müşteri isteklerini daha sistematik bir biçimde değerlendirmelerine olanak tanımaktadır [4], [5].

### 1.2.1. Metin Sınıflandırma Yöntemleri

Metin sınıflandırma, yazılı içeriklerin belirli konu veya kategori başlıkları altında gruplandırılmasını sağlayan bir analiz yöntemidir. Müşteri geri bildirimleri gibi serbest metin biçimindeki veriler, metin sınıflandırma yöntemleri kullanılarak daha yönetilebilir hale getirilebilmektedir. Literatürde, metin sınıflandırmanın müşteri şikâyetlerinin türlerine göre ayrılması ve önceliklendirilmesi açısından önemli katkılar sağladığı belirtilmektedir.

Bu yöntemler sayesinde işletmeler, hangi konularda yoğun geri bildirim aldıklarını daha net bir şekilde görebilmekte ve hizmet süreçlerini buna göre iyileştirebilmektedir [5], [9].

### 1.2.2. Duygu Analizi Yaklaşımları

Duygu analizi, kullanıcıların metin tabanlı ifadelerinden genel duygu durumunun belirlenmesini amaçlayan bir analiz yaklaşımıdır. Literatürde, duygu analizinin müşteri memnuniyetinin ölçülmesinde etkili bir araç olduğu ifade edilmektedir. Olumlu, olumsuz ve nötr duygu durumlarının belirlenmesi, işletmelere müşteri algısı hakkında önemli ipuçları sunmaktadır [4], [9].

Ancak yapılan çalışmalarda, duygu analizinin tek başına kesin bir karar mekanizması olarak kullanılmaması gerektiği de vurgulanmaktadır [4]. Bu yaklaşımın, diğer analiz yöntemleriyle birlikte destekleyici bir araç olarak değerlendirilmesi önerilmektedir.

\newpage

# 2. YAPAY ZEKA DESTEKLİ MÜŞTERİ GERİ BİLDİRİM SİSTEMLERİ

## 2.1. Müşteri Geri Bildiriminin Önemi

Müşteri geri bildirimleri, işletmelerin sundukları ürün ve hizmetleri değerlendirebilmeleri açısından en önemli veri kaynaklarından biridir. Kullanıcıların deneyimlerini doğrudan ifade etmeleri, işletmelere güçlü ve gerçekçi bir değerlendirme imkânı sunmaktadır. Literatürde, müşteri geri bildirimlerinin hizmet kalitesinin artırılması, müşteri memnuniyetinin ölçülmesi ve rekabet avantajı sağlanması açısından kritik bir rol oynadığı belirtilmektedir [2], [6].

Geri bildirimler sayesinde işletmeler, müşterilerin beklentilerini daha iyi anlayabilmekte ve karşılaşılan sorunları erken aşamada tespit edebilmektedir. Ancak geri bildirimlerin çoğunlukla serbest metin biçiminde olması, bu verilerin analiz edilmesini zorlaştırmaktadır. Özellikle büyük ölçekli işletmelerde, manuel analiz yöntemleri zaman alıcı ve maliyetli olabilmektedir [5]. Bu durum, geri bildirimlerin sistematik ve otomatik yöntemlerle ele alınmasını gerekli kılmaktadır.

Dijital kanalların yaygınlaşmasıyla birlikte, müşteri geri bildirimleri yalnızca anketler aracılığıyla değil; web siteleri, mobil uygulamalar ve çevrimiçi destek sistemleri üzerinden de toplanmaktadır. Bu çeşitlilik, veri miktarını artırırken aynı zamanda analiz sürecini daha karmaşık hale getirmektedir.

## 2.2. Dijital Müşteri Destek Sistemleri

Dijital müşteri destek sistemleri, işletmelerin kullanıcılarla daha hızlı ve kesintisiz iletişim kurmasını sağlayan çözümler arasında yer almaktadır. Canlı destek, e-posta, otomatik yanıt sistemleri ve chatbotlar bu sistemlerin temel bileşenlerini oluşturmaktadır. Literatürde, dijital müşteri destek çözümlerinin işletmelerin operasyonel yükünü azalttığı ve müşteri taleplerine daha kısa sürede yanıt verilmesini sağladığı ifade edilmektedir [3], [7].

Chatbot sistemleri, dijital müşteri destek yapılarının önemli bir parçası haline gelmiştir. Bu sistemler, kullanıcılarla doğrudan etkileşime girerek temel soruları yanıtlamakta ve gerekli durumlarda kullanıcıyı ilgili birime yönlendirmektedir. Özellikle yoğun destek taleplerinin olduğu durumlarda, chatbotların ilk temas noktası olarak kullanılması, insan kaynaklarının daha verimli kullanılmasına olanak tanımaktadır [1], [3].

## 2.3. Konuşma Tabanlı Sistemlerin İşletmelere Etkisi

Konuşma tabanlı sistemler, işletmelerin müşteri etkileşimlerini daha düzenli ve izlenebilir bir yapıya kavuşturmaktadır. Chatbotlar aracılığıyla gerçekleştirilen görüşmeler, merkezi bir sistemde kayıt altına alınarak daha sonra analiz edilebilmektedir. Bu durum, işletmelerin müşteri taleplerini belirli kategoriler altında değerlendirebilmesine olanak tanımaktadır [6], [7].

Literatürde, konuşma tabanlı sistemlerin müşteri memnuniyetini artırdığı ve destek süreçlerinde tutarlılık sağladığı belirtilmektedir. Kullanıcılar, hızlı geri dönüş alabilmekte ve temel sorunlarını zaman kaybetmeden çözebilmektedir. Ayrıca, konuşma kayıtlarının incelenmesi sayesinde işletmeler, hangi konularda daha fazla geri bildirim alındığını ve hangi süreçlerin iyileştirilmesi gerektiğini tespit edebilmektedir [3], [7]. Bununla birlikte, bazı çalışmalarda konuşma tabanlı sistemlerin sınırlılıklarına da dikkat çekilmektedir. Özellikle karmaşık veya özel durumlarda, insan desteğinin hâlâ gerekli olduğu vurgulanmaktadır. Bu nedenle literatürde, konuşma tabanlı sistemlerin insan destekli yapılarla birlikte kullanılması önerilmektedir.

\newpage

# 3. YAPAY ZEKA DESTEKLİ CHATBOT SİSTEMİNİN TASARIMI VE UYGULANMASI

## 3.1. Sistem Mimarisi ve Genel Yapı

Bu çalışma kapsamında geliştirilen chatbot sistemi, web tabanlı ve modüler bir mimari yapıya sahiptir. Sistem; kullanıcı arayüzü, sunucu taraflı uygulama, analiz bileşenleri ve veritabanı olmak üzere birden fazla katmandan oluşmaktadır. Bu mimari yaklaşım, sistemin hem geliştirilebilirliğini hem de sürdürülebilirliğini artırmayı amaçlamaktadır.

Kullanıcılar, web tabanlı sohbet arayüzü üzerinden chatbot ile etkileşime girmektedir. Kullanıcı deneyimini kesintiye uğratmamak adına, chatbot arayüzü tam sayfa bir tasarım yerine, web sitesinin sağ alt köşesinde konumlandırılan ve istenildiğinde açılıp kapanabilen (floating widget) bir pencere olarak tasarlanmıştır. Kullanıcıdan alınan mesajlar, HTTP protokolü aracılığıyla sunucu tarafına iletilmektedir. Sunucu tarafında yer alan chatbot uygulaması, gelen mesajları işleyerek uygun yanıtları üretmekte ve aynı zamanda mesajları analiz edilmek üzere ilgili modüllere yönlendirmektedir.

Sistem mimarisinde, chatbotun yanıt üretme süreci ile analiz süreci birbirinden ayrılmıştır. Bu sayede chatbot, analiz işlemlerinden bağımsız olarak çalışabilmekte ve sistemin genel performansı olumsuz etkilenmemektedir. Sistem; kullanıcı ve yönetici rolleri olmak üzere iki temel kullanıcı tipine sahiptir. Kullanıcılar kimlik doğrulama gerektirmeden chatbot ile etkileşime girebilirken; yönetici paneline erişim kullanıcı adı ve parola doğrulaması ile sınırlandırılmıştır [3], [7].

**Şekil 1.** Yapay Zeka Destekli Chatbot Sistem Mimarisi

*Sistemin genel mimari yapısı blok diyagramı olarak sunulmaktadır. Şekilde; kullanıcı arayüzü (web chat ve yönetici paneli), arka yüz (Node.js / TypeScript), kimlik doğrulama modülü, yapay zeka analiz servisi ve veritabanı katmanları arasındaki HTTP/REST iletişim akışı görselleştirilmiştir.*

### 3.1.1. Blok Diyagramlarla Sistem Tasarımı ve Arayüz Akışı

Geliştirilen sistemin kullanıcı arayüzü, modern web standartlarına uygun olarak tasarlanmış ve Şekil 1'de gösterilen blok diyagramda yer alan "Web Chat Arayüzü" katmanı somut bir uygulamaya dönüştürülmüştür. Bu tasarım kararı doğrultusunda, chatbot sistemi tam sayfa bir uygulama olmak yerine, web sitesinin sağ alt kenarında açılır-kapanır (floating) bir pencere olarak konumlandırılmıştır.

Sistem tasarım bloklarında görüldüğü üzere, kullanıcı web sitesinde gezinirken kenardaki butona tıklayarak chatbot'u aktif hale getirir. Kullanıcının burada girdiği metinler ("Şikayet yazmak istiyorum", "Kargom çok gecikti" gibi), blok diyagramda ifade edilen "HTTP/REST Request" üzerinden backend katmanına iletilir. Bu sayede, kullanıcı sitedeki ana işlevlerden (Güncel müşteri deneyimlerini inceleme, analiz metriklerini görme) kopmadan, eşzamanlı olarak kenarda açılan chatbot üzerinden yapay zeka ile etkileşime girebilmektedir.

**Şekil 2.** Chatbot Sistemi Use Case Diyagramı

*UML use case (kullanım durumu) gösterimi ile sistem aktörleri ve etkileşimleri sunulmaktadır. "Kullanıcı" aktörü chatbot ile mesajlaşma, geri bildirim gönderme ve bilgi alma; "Yönetici" aktörü ise giriş yapma, raporları görüntüleme ve duygu analizi sonuçlarını inceleme işlevlerine sahiptir.*

## 3.2. Kullanılan Teknolojiler

Chatbot sisteminin geliştirilmesinde modern ve yaygın olarak kullanılan web teknolojileri tercih edilmiştir. Sunucu taraflı uygulama geliştirme sürecinde **Node.js** kullanılmıştır. Node.js, asenkron yapısı sayesinde eş zamanlı kullanıcı isteklerinin etkin bir şekilde yönetilmesine olanak tanımaktadır.

**TypeScript**, kodun daha düzenli, okunabilir ve hata ayıklama açısından daha güvenli olması amacıyla tercih edilmiştir. Bu sayede geliştirme sürecinde oluşabilecek tip hatalarının önüne geçilmesi hedeflenmiştir. REST tabanlı servislerin oluşturulması için **Express.js** framework'ü kullanılmıştır.

Veri saklama işlemleri için ilişkisel bir veritabanı yapısı olan **PostgreSQL** tercih edilmiş, veritabanı erişimi **Prisma ORM** ile sağlanmıştır. Chatbot konuşma kayıtları, kullanıcı geri bildirimleri ve analiz sonuçları bu veritabanında tutulmaktadır.

İstemci tarafı (frontend) arayüzü, React tabanlı bir framework olan **Next.js** kullanılarak inşa edilmiştir. Next.js, komponent tabanlı yapısı sayesinde web sitesinin kenarında açılan chatbot penceresinin performanslı bir şekilde çalışmasını sağlamıştır. Kullanıcı arayüzünün kurumsal renk paleti ve duyarlı (responsive) tasarımı için ise **Tailwind CSS** kütüphanesi kullanılmıştır [10], [11], [12].

## 3.3. Yapay Zeka Entegrasyonu

Sistem içerisinde yer alan analiz bileşenleri, kullanıcı mesajlarının belirli açılardan değerlendirilmesini amaçlamaktadır. Kullanıcıdan gelen metinler, duygu durumu ve içerik türü açısından analiz edilmek üzere ilgili servisler aracılığıyla işlenmektedir [4], [9]. Bu analiz süreci, chatbotun yanıt üretme mekanizmasına doğrudan müdahale etmeden, destekleyici bir rol üstlenmektedir.

Yapay zeka çağrıları, **Groq LPU** altyapısı üzerinden **Meta Llama 3.3-70B** modeli kullanılarak gerçekleştirilmektedir. Şikayet analizi için bu büyük model tercih edilirken, doğal sohbet için **Llama 3.1-8B** modeli devrede tutulmuş; böylece "analizde doğruluk, sohbette akıcılık" prensibi sağlanmıştır.

Elde edilen analiz sonuçları, kullanıcı mesajlarının hangi konu başlıkları altında yoğunlaştığını ve genel memnuniyet eğilimlerini ortaya koymaktadır. Bu yaklaşım sayesinde, sistem yalnızca anlık etkileşim sunmakla kalmamakta, aynı zamanda işletmelere uzun vadeli değerlendirmeler yapabilecekleri bir veri altyapısı da sağlamaktadır.

### 3.3.1. REST API Uç Noktalarının Detaylı Açıklaması

Geliştirilen chatbot sistemi, ön yüz ile arka yüz arasındaki tüm iletişimi REST API mimarisi üzerinden yürütmektedir. Uygulamada toplam yedi adet uç nokta (endpoint) tanımlanmıştır. Tüm istek ve yanıtlar JSON veri biçimini kullanmakta, sunucu cevapları HTTP durum kodları ile birlikte standart bir yapıda dönmektedir.

#### 3.3.1.1. POST /api/feedback/analyze

Kullanıcı tarafından yazılan müşteri geri bildirim metnini yapay zekaya gönderip duygu durumu, kategori ve marka tespiti yapmak; sonucu veritabanına kaydetmek için kullanılır. Llama 3.3-70B modeli üzerinden çalışır. JSON formatında istek alır, JSON formatında yanıt döner. Eğer modelin güven puanı 0.85'in altındaysa kayıtta `needs_human=true` olarak işaretlenir ve şikayet otomatik olarak insan operatöre yönlendirilir.

#### 3.3.1.2. GET /api/admin/dashboard-stats

Yönetici panelinin tüm istatistik kartlarını, marka filtre çiplerini, son şikayet tablosunu ve grafik verilerini tek bir istekle servis eder. Prisma'nın `groupBy` ve `count` operatörleriyle altı farklı sorgu paralel olarak çalıştırılır. Yönetici paneli her üç saniyede bir bu uç noktayı sorgulayarak gerçek zamanlı güncel kalır.

#### 3.3.1.3. POST /api/chat

Kullanıcının yazdığı mesaja, önceki konuşma bağlamını da göz önünde bulundurarak doğal Türkçe bir yanıt üretmek için kullanılır. Llama 3.1-8B modeli ile hızlı sohbet sağlanır. Son 10 mesaj sohbet bağlamı olarak modele iletilir (konuşma hafızası). Sistem yönergesi marka-aware'dir ve bilgi tabanı eklenmiştir.

#### 3.3.1.4. POST /api/chat/stream

`/api/chat` ile aynı işlevi görmekle birlikte yanıtı kelime kelime akıcı biçimde gönderir. Server-Sent Events (SSE) standardı kullanılır. HTTP başlığı `Content-Type: text/event-stream` olarak ayarlanır; `res.flushHeaders()` ve `res.socket.setNoDelay(true)` ile her simge anında gönderilir. Akış başarısız olursa ön yüz otomatik olarak standart `/api/chat` uç noktasına geri döner.

#### 3.3.1.5. POST /api/agent

Kullanıcının istatistiksel/sayısal sorularına veritabanından gerçek veri çekerek yanıt vermek için kullanılır. Llama 3.3'ün Function Calling yeteneği ile beş farklı tool (get_total_feedbacks, get_negative_count, get_top_brands, get_feedback_by_id, get_human_help_count) tanımlanmıştır. İki turlu çağrı yapısı kullanılır: birinci turda model tool çağırır, ikinci turda backend tool sonucunu modele geri verir, model doğal Türkçe yanıt üretir.

#### 3.3.1.6. POST /api/feedback/:id/rate

Kullanıcının bir şikayet analizinin sonucunu "faydalı buldum / bulmadım" şeklinde oylamasını kaydeder. URL parametresi olarak şikayet kimliği alır, body olarak `{ helpful: boolean }` alır. İlgili Feedback kaydının helpful alanı güncellenir. Yönetici panelindeki "Memnuniyet Oranı" metriği bu verileri kullanarak hesaplanır.

#### 3.3.1.7. GET /api/admin/accuracy

Doğruluk ölçüm scripti tarafından üretilen sonuç dosyasını (accuracy_results.json) yönetici paneline servis eder. Sonuç içinde toplam örnek sayısı, kategori doğruluğu, sentiment doğruluğu, genel doğruluk ve kategori bazlı detaylı performans yer alır.

### 3.3.1.8. İletişim Standartları ve Güvenlik

Tüm uç noktalar HTTPS üzerinden hizmet vermektedir. Render altyapısı otomatik olarak TLS sertifikası sağlar. Backend, izin verilen kaynaklardan gelen isteklere yanıt vermek üzere Express cors ara katmanı ile yapılandırılmıştır. API anahtarları kodda gömülü tutulmamakta; tüm gizli bilgiler `.env` dosyasında yer almaktadır. Üretim ortamında bu değişkenler Render Dashboard üzerindeki "Environment Variables" bölümünden okunur.

**Şekil 3.** Chatbot Mesaj İşleme Sürecine Ait Sequence Diyagramı

*Kullanıcı ile bot arasındaki bir etkileşimin zaman ekseninde adım adım izlediği yol gösterilmektedir. "Kullanıcı → Web Chat UI → Backend API → Yapay Zeka Analiz Servisi → Veritabanı → geri dönüş" akışı sunulmaktadır.*

## 3.4. Veritabanı Tasarımı

### 3.4.1. Veritabanı Seçimi: PostgreSQL

Geliştirilen chatbot sisteminde veri saklama katmanı için **PostgreSQL** ilişkisel veritabanı yönetim sistemi tercih edilmiştir. Veritabanının adı **chatbot_feedback_db** olarak belirlenmiştir. Hem yerel geliştirme ortamında hem de dağıtım ortamında aynı veritabanı motoru kullanılmıştır.

PostgreSQL'in bu projede tercih edilmesinin başlıca sebepleri:

**1. ACID uyumluluğu:** PostgreSQL, ACID (Atomicity, Consistency, Isolation, Durability) ilkelerine tam uyum sağlamaktadır. Bu sayede müşteri şikayet kayıtları gibi kritik verilerin kaybolma riski olmadan, eşzamanlı erişimlerde tutarlı şekilde tutulması garanti altına alınmıştır.

**2. İlişkisel veri modeli:** Sistem; kullanıcı, oturum, mesaj, analiz sonucu ve şikayet biletleri gibi birbiriyle ilişkili varlıklar içerdiğinden, NoSQL yerine ilişkisel bir yapı projenin doğasıyla daha uyumludur. Yabancı anahtar kısıtlamaları sayesinde bir kullanıcının tüm mesajları veya bir mesaja ait analiz sonucu, tek bir SQL ifadesi ile sorgulanabilir.

**3. Render uyumluluğu:** Projenin dağıtımı için kullanılan Render platformu, ücretsiz katmanında PostgreSQL servisi sunmaktadır. Bu sayede ek bir maliyet doğmadan, kalıcı veri depolaması için bulut tabanlı bir veritabanı bileşeni elde edilmiştir.

**4. Genişletilebilirlik:** PostgreSQL, gelecekteki gelişmelere uygun olarak vektör arama (pgvector eklentisi), tam metin arama ve JSON tabanlı sorgular gibi modern özellikleri yerleşik olarak desteklemektedir.

**5. SQLite'tan üstünlüğü:** Vize raporu aşamasında SQLite öngörülmüştü; ancak SQLite dosya tabanlı bir veritabanıdır ve Render gibi bulut platformlarının geçici dosya sistemleri ile uyumsuzdur. Her uygulama yeniden başlatıldığında verilerin kaybolması riski oluşmaktaydı. PostgreSQL bağımsız bir servis olarak çalıştığı için bu sorun ortadan kalkmış, kalıcılık (persistence) garanti altına alınmıştır.

### 3.4.2. Prisma ORM Kullanımı

Veritabanı erişimi için doğrudan SQL sorguları yazmak yerine **Prisma** isimli açık kaynaklı Nesne-İlişkisel Haritalama (ORM) kütüphanesi tercih edilmiştir. Prisma'nın bu projedeki başlıca avantajları:

- **Tip güvenliği:** Prisma şemasına göre TypeScript tipleri otomatik üretilir. Bu sayede yanlış alan adı kullanma veya tip uyumsuzluğu gibi hatalar derleme zamanında yakalanır.
- **Sürüm yönetimi (migration):** `prisma migrate dev` komutu ile şema değişiklikleri otomatik olarak SQL betiklerine dönüştürülür ve versiyonlanır.
- **Tek bir şema dosyası:** Tüm modeller, ilişkiler ve indeksler `schema.prisma` dosyasında tek bir yerde tanımlanır.
- **Yüksek seviyeli sorgular:** Karmaşık groupBy, findMany, count gibi işlemler tek satırlık metod çağrılarıyla yapılabilir.

### 3.4.3. Veritabanı Şeması ve Tablolar

Sistemde tanımlanmış olan başlıca tablo **Feedback** tablosudur. Her bir kullanıcı şikayetinin ve yapay zekanın bu şikayet üzerinde yaptığı analizin tüm sonuçlarını içerir:

- `id` (Int, PK): Şikayetin tekil kimliği
- `text` (String): Kullanıcının yazdığı şikayet metni
- `sentiment` (String): Duygu etiketi (Negative, Neutral, Positive)
- `category` (String): Yapay zeka tarafından atanan kategori (Lojistik, Teknik, Ödeme, İletişim, Ürün, İşlem)
- `score` (Float): Modelin güven puanı (0.0 - 1.0)
- `brand` (String): Tespit edilen marka veya "Belirtilmemiş"
- `needs_human` (Boolean): Güven puanı 0.85 altıysa true
- `helpful` (Boolean?): Kullanıcının 👍/👎 oylaması
- `created_at` (DateTime): Kayıt oluşturulma zamanı

Bu tablo üzerinde sorgu performansını artırmak için `created_at`, `sentiment`, `needs_human` ve `brand` alanlarına indeks eklenmiştir.

Vize raporundaki ER diyagramında yer alan diğer varlıklar (User, ChatSession, Message, AnalysisResult, Feedback_Tickets, Admin, Dashboard_Stats) şemada korunmuştur. Bu varlıklar; ilerleyen aşamalarda kullanıcı kimlik doğrulama, oturum yönetimi ve şikayet bileti çözüm takibi gibi özelliklerin eklenmesi için hazır altyapıyı oluşturmaktadır.

### 3.4.4. Yerel ve Üretim Ortamı Yapılandırması

Veritabanı bağlantısı, ortam değişkenleri üzerinden esnek bir yapıda yönetilmektedir. Backend tarafındaki `.env` dosyasında `DATABASE_URL` değişkeni tanımlanır. Yerel geliştirme ortamında bu adres localhost üzerinden bilgisayarda kurulu PostgreSQL hizmetini hedef alır. Üretim ortamında ise Render üzerinde otomatik oluşturulan dahili bağlantı adresi kullanılır.

**Şekil 4.** Chatbot Sistemi ER Diyagramı

*Veritabanı varlık-ilişki diyagramında; kullanıcı, oturum, mesaj, analiz sonucu, geri bildirim biletleri, yönetici ve dashboard istatistikleri tabloları yer almaktadır. Tablolar arasındaki ilişkiler çoklukları ile gösterilmiş; sistemin ilişkisel veri modeli baştan sona haritalanmıştır.*

## 3.5. Kullanıcı Arayüzü Bileşenleri ve Etkileşim Tasarımı

Bu bölümde, geliştirilen platformun kullanıcı arayüzünde yer alan ana etkileşim bileşenleri ayrıntılı şekilde açıklanmaktadır.

### 3.5.1. Yüzen ve Sürüklenebilir Sohbet Penceresi

Sistemin merkezi bileşeni, web sitesinin sağ alt köşesinde yer alan yüzen sohbet penceresidir. Bu bileşen klasik bir HTML `<div>` öğesi olmanın ötesinde, **framer-motion** isimli animasyon kütüphanesinin `motion.div` öğesi ile sarmalanmıştır. Pencerenin drag özelliği etkin olduğundan, kullanıcı pencereyi fare ile veya dokunmatik ekranlarda parmağıyla yakalayıp ekranda istediği konuma sürükleyebilir. `dragMomentum={false}` parametresi ile bırakma anındaki kayma efekti kapatılmış, pencere bırakıldığı yerde sabit kalmaktadır. Bu özellik son kullanıcıya iki önemli fayda sağlar: ergonomi (kullanıcı pencereyi istediği bilgiyi engellemeyecek noktaya kolayca taşıyabilir) ve modernlik (sürüklenebilir arayüzler modern ürün deneyiminin önemli bir parçasıdır).

Mobil ekranlarda Tailwind CSS'in duyarlı sınıfları sayesinde pencere otomatik olarak tam ekran açılmaktadır. Bu sayede küçük ekranlı cihazlarda da sohbet rahatlıkla okunabilmektedir.

### 3.5.2. Yönetici Giriş Ekranı (Admin Login Modal)

Yönetici paneline erişim, web sitesi üst gezinme çubuğunda yer alan "Yönetici Girişi" butonu ile başlamaktadır. Butona tıklandığında, sayfanın üzerine yarı saydam (backdrop blur) bir katman yerleştirilen ve ortada beliren bir modal pencere açılmaktadır. Arka planın hafif buğulanması, kullanıcının dikkatinin giriş formuna odaklanmasını sağlar. "Yönetici Girişi" başlığı yanında kalkan ikonu ile güvenlik vurgusu yapılır.

Giriş işlemi sonrasında React state üzerinden `isAdminView` değişkeni true olarak ayarlanır ve uygulama, ana sayfa yerine `AdminDashboard` bileşenini render etmeye başlar. Tasarım projesi kapsamında giriş doğrulaması basit bir form kontrolü ile yapılmaktadır; gelecek çalışmalarda JWT veya OAuth 2.0 tabanlı kimlik doğrulama eklenebilir.

**Şekil 10.** Güvenli Yönetici (Admin) Giriş Doğrulama Ekranı

*Modal pencere üzerinden açılan yönetici giriş ekranı görülmektedir. Sayfanın geri kalanı backdrop-blur filtre ile bulanıklaştırılmış, ortadaki form kullanıcı adı ve parola alanlarını içermektedir.*

### 3.5.3. Belge Yükleme Bileşeni (File Uploader)

Sistemde, müşterilerin şikayetlerini yazıyla iletmesinin yanı sıra kanıtlayıcı belge yükleyebilmelerine olanak tanıyan bir bileşen bulunmaktadır. Ana sayfanın alt kısmında konumlanan bu bölüm; sürükle-bırak destekli yükleme alanı sunar, "Belge Yükle" düğmesine tıklandığında dosya seçim diyaloğu açılır, yüklenen dosya görünür şekilde önizleme alanına eklenir. Yüklenen belge kullanıcının şikayet metnine ek bağlam sağlar; örneğin kargo gecikmesi durumunda fatura veya kargo etiketinin fotoğrafı yüklenebilir. Bileşen, yükleme sırasında oluşabilecek hataları yakalayıp kullanıcıya görsel bir geri bildirim vermektedir.

### 3.5.4. Yönetici Paneli Grafik Bileşenleri

Yönetici paneli; sade tablo görünümünün ötesine geçerek veri görselleştirme araçlarıyla zenginleştirilmiştir. Grafikler için **Chart.js** kütüphanesi ve onun React adaptörü olan **react-chartjs-2** kullanılmıştır.

**Duygu Trend Analizi Grafiği (Çizgi Grafik):** Son şikayetlerin güven puanlarını zaman ekseni üzerinde gösteren bir çizgi grafiktir. Her veri noktası, ilgili şikayetin yazıldığı saati yatay eksende, yapay zekanın atadığı güven puanını dikey eksende temsil eder. Grafik bileşeni her üç saniyede bir yenilenir.

**Kategori Dağılımı Grafiği (Donut Chart):** Şikayetlerin altı kategoriye nasıl dağıldığını gösteren halka grafiktir. Her kategoriye ayrı bir renk atanmıştır: Lojistik (amber), Teknik (gül kırmızısı), Ödeme (zümrüt yeşili), İletişim (gök mavisi), Ürün (mor), İşlem (indigo). Halkanın merkezinde boşluk bırakılmıştır; bu modern dashboard'larda yaygın bir tasarım tercihidir.

**Şekil 13.** Yönetici Paneli — Kategori Dağılımı Halka Grafiği

*Final aşamasında eklenen Doughnut chart bileşeninin yakın görüntüsüdür. Altı kategori altı farklı renk ile temsil edilmiş; merkez boşluğu modern dashboard estetiği için bırakılmıştır.*

### 3.5.5. Marka Filtreleme Çipleri

Şikayet tablosunun üzerinde, en çok şikayet alan altı markayı çip biçiminde gösteren bir filtre satırı bulunmaktadır. Her çipin yanında parantez içinde toplam şikayet sayısı yer almaktadır. Yönetici bir çipe tıkladığında, alttaki tablo yalnızca o markaya ait şikayetleri gösterecek şekilde anında filtrelenir. "Tümü" çipi ile filtre temizlenir.

**Şekil 14.** Marka Filtreleme Çipleri

*Yönetici panelindeki "Son Müşteri Etkileşimleri" tablosunun üstünde bulunan marka filtre satırının görüntüsüdür.*

### 3.5.6. CSV ile Veri Dışa Aktarımı

Yönetici panelinde "Tümünü İndir (CSV)" butonu ile mevcut şikayet listesinin virgülle ayrılmış değerler (CSV) dosyası olarak indirilebilmesi sağlanmıştır. Saat, Marka, Mesaj, Kategori, Duygu, Skor, İnsan Yardımı ve Faydalı sütunlarını içerir. İndirme işlemi `Blob` ve `URL.createObjectURL` API'leri kullanılarak doğrudan tarayıcıda gerçekleştirilir. Türkçe karakterlerin doğru görüntülenmesi için dosyanın başına UTF-8 BOM baytları eklenmiştir.

### 3.5.7. Sesli Etkileşim Bileşenleri

**Mikrofon Düğmesi:** Sohbet penceresinin altındaki metin kutusunun yanında bir mikrofon ikonu yer almaktadır. Bu düğme yalnızca tarayıcının Web Speech API desteklediği durumlarda görünür. Düğmeye basıldığında mikrofon erişim izni istenir; kullanıcı konuşmaya başladığında düğme kırmızıya döner ve nabız efekti ile dinlemenin sürdüğü görsel olarak iletilir.

**Hoparlör Düğmesi:** Sohbet penceresinin başlık kısmında yer alan hoparlör düğmesi, bot yanıtlarının sesli okunup okunmayacağını kontrol eden bir geçiş düğmesidir. Düğme açıkken, her tamamlanmış bot mesajı `SpeechSynthesisUtterance` nesnesi ile sesli olarak okunur.

**Şekil 17.** Sesli Giriş Aktif Durumu (Mikrofon Dinleniyor)

*Kullanıcı mikrofon düğmesine bastığında düğmenin kırmızı nabız efekti ile aktif hâle geldiği görüntüsüdür.*

### 3.5.8. Karşılama Ekranı ve Hızlı İşlem Kartları

Sohbet penceresi ilk açıldığında kullanıcıyı altı renkli kart ile karşılayan bir öneri ekranı gelir. Her kart bir kullanım senaryosunu temsil eder: Yeni Şikayet Yaz, Toplam Şikayet Sayısı (Function Calling örneği), İade Politikası (RAG örneği), Kargo & Teslimat (RAG örneği), Sistem Hakkında, Sesli Konuşma. Karta tıklandığında ilgili soru otomatik olarak bot'a iletilir.

**Şekil 20.** Karşılama Ekranı — Hızlı İşlem Kartları

*Sohbet penceresi ilk açıldığında kullanıcıya sunulan altı renkli kartın iki sütunlu grid düzenindeki görüntüsüdür.*

### 3.5.9. Yazıyor Göstergesi ve Mesaj Animasyonları

Bot bir cevabı hazırlarken kullanıcıya hareket halinde olduğunu bildirmek için üç nokta yazıyor göstergesi kullanılır. Üç küçük yuvarlak nokta sırayla yukarı-aşağı zıplayarak modelin yanıt ürettiğini iletir. Yeni mesajlar fade-in + slide-in-from-bottom etkisiyle alt taraftan yukarı doğru kayarak ekrana girmektedir.

### 3.5.10. Bot Kimliği ve Avatar

Her bot mesajının solunda küçük yuvarlak bir bot avatarı görüntülenmektedir. Avatar, indigo'dan mora geçen bir gradient zemine sahip ve içinde bir robot silüeti bulundurmaktadır. Sohbet penceresinin üst başlığında ise daha büyük bir avatar, "AI Feedback Assistant" yazısı ve altında nabız efekti veren yeşil bir nokta ile "Çevrimiçi" durum bilgisi bulunmaktadır.

## 3.6. Sistemin Kullanıcıya Sağladığı Yararlar

Geliştirilen yapay zeka destekli geri bildirim sistemi; son kullanıcılar, işletme yöneticileri ve karar destek mekanizmaları açısından somut faydalar sağlamaktadır.

### 3.6.1. Son Kullanıcı Açısından Yararlar

- **7/24 Erişilebilir Destek:** Sistem, gece-gündüz fark etmeksizin 24 saat ulaşılabilir durumdadır. Render altyapısının canlı tutulması (UptimeRobot ile her beş dakikada bir sorgulama) sayesinde sistemin uyumasından kaynaklanan başlangıç gecikmesi ortadan kaldırılmıştır.

- **Anlık Cevap ve Sınıflandırma:** Kullanıcı şikayetini yazdığı anda yapay zekanın saniyeler içinde yanıt verdiği, kullanıcının şikayetini hangi kategoriye konumlandırdığı görsel rozetlerle hemen iletilir.

- **Sesle Etkileşim İmkânı:** Web Speech API entegrasyonu sayesinde kullanıcı mikrofon aracılığıyla konuşarak şikayetini iletebilir. Aynı şekilde bot yanıtlarının sesli okunması seçeneği, görme engelli kullanıcılar veya ekranı takip edemeyen kullanıcılar için erişilebilirlik sağlar.

- **Marka Netliği:** Sistem, kullanıcının yazdığı şikayet metninden ilgili marka adını otomatik tespit eder. Bot, kullanıcıya hangi markaya ait politikaları aktardığını net bir şekilde belirtir.

- **Bilgilendirici Politika Yanıtları:** Bot, şirket bilgi tabanından (RAG) çıkardığı gerçek bilgileri kullanıcıya iletir. Uydurma cevaplar yerine doğrulanabilir ve tutarlı bilgi sunulması, kullanıcı güvenini artırır.

- **İnsan Operatöre Şeffaf Yönlendirme:** Yapay zekanın güven puanı belirli bir eşiğin altına düştüğünde, kullanıcı "Şikayetiniz uzman temsilcimize yönlendirildi" uyarısını alır. Bu hibrit destek modeli, kullanıcıyı tatmin etmeyen yanıtlardan korur.

- **Geri Bildirim Verme Hakkı:** Kullanıcı, bot yanıtının kalitesini her cevap sonrasında 👍/👎 düğmeleriyle değerlendirebilir.

### 3.6.2. İşletme Yöneticisi Açısından Yararlar

- **Gerçek Zamanlı Görünürlük:** Yönetici paneli her üç saniyede bir veritabanından son verileri çekerek anlık dashboard sunar.

- **Marka Bazlı Analiz:** Sistem, en çok şikayet alan markaları otomatik gruplayıp filtre çipleri halinde sunar. Yönetici, tek tıkla seçtiği markaya özel şikayetleri inceleyebilir.

- **Kategori Dağılımı Görselleştirmesi:** Halka grafik ile şikayetlerin altı kategoriye nasıl dağıldığı gözlemlenebilir.

- **CSV ile Dışa Aktarım:** Veriler tek tıkla CSV formatında dışa aktarılabilmekte; Excel'de açıldığında Türkçe karakter sorunları yaşanmamaktadır.

- **Hibrit Destek Otomasyonu:** Bot'un güven düşüklüğü tespit ettiği vakalar "İnsan Yardımı Gerekenler" olarak otomatik işaretlenir ve sarı vurguyla tablo üzerinde belirir.

- **Sistem Doğruluğunun Şeffaf Sunumu:** Vize raporundaki sabit %95 sistem doğruluğu sayısı, finalde ölçülmüş gerçek bir değere dönüştürülmüştür. Yönetici paneli, 24 örnekli etiketli test seti üzerinde çalıştırılan ölçüm scriptinin sonucunu gerçek zamanlı gösterir.

### 3.6.3. Geliştirici ve Bakım Açısından Yararlar

- **Modüler Mimari:** Sistem; ön yüz, arka yüz, yapay zeka servisleri ve veritabanı katmanlarına net biçimde ayrılmıştır.
- **Sürüm Kontrolü ve Otomatik Dağıtım:** Tüm kaynak kod GitHub deposunda tutulmakta; Vercel ön yüz dağıtımını, Render arka yüz dağıtımını her git push sonrası otomatik olarak gerçekleştirmektedir.
- **Tip Güvenliği:** TypeScript ile yazılmış olan kod, derleme zamanında tip uyumsuzluklarını yakalar.
- **Ölçüm Tekrarlanabilirliği:** Doğruluk ölçüm scripti, test verisi değişse veya model güncellense bile aynı şekilde çalıştırılabilir.

### 3.6.4. Akademik Katkı ve Eğitsel Yararlar

- **Uygulamalı yapay zeka entegrasyonu:** Büyük dil modellerinin gerçek bir kullanıcı senaryosunda nasıl entegre edileceğine dair somut bir örnek üretmiştir.
- **Karşılaştırmalı doğruluk ölçümü:** Sistemin vize aşamasındaki simülasyonu ile final aşamasındaki ölçülmüş gerçek doğruluğu kıyaslanarak yapay zeka projelerinde vaat ile teslimat arasındaki farkın nasıl bilimsel yöntemlerle kapatılacağı gösterilmiştir.
- **RAG ve Function Calling demonstrasyonu:** 2024-2025 döneminin önemli yapay zeka mimarileri olan RAG ve Function Calling yaklaşımları, sınırlı kapsam içerisinde bile uygulanabilir hale getirilmiştir.
- **Hibrit insan-makine ekosistemi:** Literatürdeki [Jain & Kumar 2019; Følstad & Brandtzæg 2018] hibrit destek önerileri pratik bir uygulamayla karşılanmıştır.

## 3.7. Yönetici Paneli ve Raporlama

Geliştirilen sistemde, işletmelerin chatbot kullanımını takip edebilmesi amacıyla kapsamlı bir yönetici paneli tasarlanmıştır. Sisteme entegre edilen Yönetici Paneli (Admin Dashboard), güvenli bir giriş ekranı arkasında korunmaktadır. Bu panel üzerinden yöneticiler; gerçek zamanlı "Toplam Bildirim", "Çözülen Şikayet", "Negatif Duygu Oranı", "İnsan Yardımı", "Memnuniyet Oranı" ve "Sistem Doğruluğu" gibi stratejik metrikleri anlık olarak takip edebilmektedir. Ayrıca, gelen şikayetlerin duygu durumları ve NLP kategorileri dinamik bir veri tablosu üzerinden incelenebilmektedir.

Analiz sonuçları grafikler ve tablolar aracılığıyla sunularak verilerin daha anlaşılır hale getirilmesi sağlanmıştır. Bu raporlar, işletmelerin hizmet süreçlerini değerlendirmelerine ve iyileştirme alanlarını belirlemelerine yardımcı olmaktadır. Yönetici panelinin sade ve anlaşılır bir yapıda olması, teknik bilgisi sınırlı kullanıcıların da sistemi rahatlıkla kullanabilmesini hedeflemektedir [6], [7].

**Şekil 11.** Yönetici Paneli Gerçek Zamanlı Analitik ve Raporlama Ekranı

*Yönetici girişi sonrası açılan ana panel görüntülenmektedir. En üstte özet kartlar (Toplam Bildirim, Çözülen Şikayet, Negatif Duygu Oranı, İnsan Yardımı, Memnuniyet, Sistem Doğruluğu) yer almakta; altında Duygu Trend Analizi çizgi grafiği ve Kategori Dağılımı halka grafiği yan yana sunulmaktadır.*

\newpage

# 4. TEST, DEĞERLENDİRME VE BULGULAR

Bu çalışma kapsamında geliştirilen sistemin demo (prototip) sürümü başarıyla tamamlanmış olup, temel işlevsellik testleri web tabanlı arayüz üzerinden gerçekleştirilmiştir. Chatbot'un sağ alt köşede sorunsuz çalışması, NLP tabanlı duygu analizi rozetlerinin (Pozitif/Negatif) doğru üretilmesi ve yönetici panelindeki verilerin anlık güncellenmesi test senaryoları ile doğrulanmıştır.

Bu bölümde, geliştirilen chatbot sisteminin işlevselliği ve performansı farklı test senaryoları üzerinden değerlendirilmiştir. Yapılan testler ile sistemin kullanıcı etkileşimlerine verdiği yanıtlar, analiz süreçlerinin doğruluğu ve elde edilen verilerin anlamlılığı incelenmiştir.

## 4.1. Test Senaryoları

Chatbot sisteminin test sürecinde, gerçek kullanım senaryolarını yansıtacak şekilde farklı kullanıcı etkileşimleri oluşturulmuştur. Test senaryoları belirlenirken, işletmelerin müşteri destek süreçlerinde sık karşılaşılan durumlar dikkate alınmıştır. Bu kapsamda aşağıdaki temel senaryolar üzerinden testler gerçekleştirilmiştir:

- Sık sorulan soruların chatbot tarafından doğru şekilde yanıtlanması
- Kullanıcı şikâyetlerinin sisteme iletilmesi ve kayıt altına alınması
- Farklı konu başlıklarında gönderilen mesajların doğru kategoriler altında toplanması
- Olumlu ve olumsuz içerikli mesajların analiz edilmesi
- Uzun ve kısa metin girdilerine verilen sistem tepkilerinin incelenmesi
- Marka adı içeren şikayetlerde otomatik marka tespiti
- Düşük güvenli vakaların hibrit destek mekanizmasıyla insan operatöre yönlendirilmesi
- RAG tabanlı politika sorularının doğru cevaplanması (iade, kargo, KVKK)
- Function Calling ile istatistiksel soruların gerçek veritabanı verisinden yanıtlanması
- Sesli giriş ve çıkışın doğru çalışması

Her bir senaryoda, kullanıcıdan gelen mesajın sisteme iletilme süresi, chatbotun yanıt verme süresi ve analiz sonuçlarının veritabanına doğru şekilde kaydedilip kaydedilmediği kontrol edilmiştir. Testler sırasında sistemin kararlı bir şekilde çalıştığı ve temel işlevlerini yerine getirdiği gözlemlenmiştir.

## 4.2. Sistem Performans Değerlendirmesi

Sistem performansının değerlendirilmesinde, chatbotun yanıt süresi, analiz sürecinin sistem üzerindeki etkisi ve eş zamanlı kullanıcı isteklerine verdiği tepkiler dikkate alınmıştır. Node.js altyapısı sayesinde sistemin asenkron yapıda çalıştığı ve birden fazla kullanıcı isteğini gecikme olmadan işleyebildiği gözlemlenmiştir.

Chatbotun yanıt verme süresi, kullanıcı deneyimi açısından önemli bir kriter olarak değerlendirilmiştir. Yapılan testlerde, sistemin çoğu senaryoda kullanıcıya kısa süre içerisinde yanıt verdiği ve etkileşim akışının kesintiye uğramadığı tespit edilmiştir. Analiz işlemlerinin arka planda gerçekleştirilmesi, chatbotun temel işleyişini olumsuz etkilememiştir. Streaming yanıt akışı sayesinde kullanıcılar, ilk simgeleri saniyenin altında bir gecikmeyle görmeye başlamaktadır.

Ayrıca sistemin uzun süreli kullanımda da kararlılığını koruduğu ve veri kaybı yaşanmadığı gözlemlenmiştir. PostgreSQL veritabanına kaydedilen konuşma kayıtları ve analiz sonuçları, test süresince tutarlı bir şekilde saklanmıştır.

## 4.3. Doğruluk Ölçüm Sonuçları

Yapay zekanın sınıflandırma performansını ölçmek üzere 24 örnekli etiketli bir test seti oluşturulmuştur. Test seti; altı kategori (Lojistik, Teknik, Ödeme, İletişim, Ürün, İşlem) için 3-5 örnek içermekte, çoğunlukla negatif duygu içeren şikayet metinleri ile olumlu geri bildirim örneklerinden oluşmaktadır. Ölçüm sonuçları aşağıdaki tabloda sunulmaktadır:

| Metrik | Vize Aşaması | Final Aşaması | Artış |
|---|---|---|---|
| Kategori Doğruluğu | %50 | %92 | +42 puan |
| Duygu (Sentiment) Doğruluğu | %96 | %100 | +4 puan |
| Genel Doğruluk (Kategori + Duygu) | %50 | %88 | +38 puan |

Kategori bazlı sonuçlar şu şekilde belirlenmiştir:

| Kategori | Doğruluk |
|---|---|
| Lojistik | %60 (5 örnekten 3'ü doğru) |
| Teknik | %100 (4/4) |
| Ödeme | %100 (4/4) |
| İletişim | %100 (4/4) |
| Ürün | %100 (4/4) |
| İşlem | %100 (3/3) |

Bu sonuçlar; modelin sistem prompt mühendisliği, model upgrade (Llama 3.1-8B → Llama 3.3-70B) ve few-shot örneklerle güçlendirilmesinin somut etkisini ortaya koymaktadır. Lojistik kategorisinde gözlemlenen düşük doğruluk; "yanlış adrese teslim edildi, müşteri hizmetleri çözmedi" gibi birden fazla kategoriyi içeren bileşik şikayetlerden kaynaklanmaktadır ve karışıklık matrisi ile detaylı analiz edilmiştir.

**Şekil 19.** Doğruluk Ölçüm Karışıklık Matrisi (Confusion Matrix)

*24 örnekli etiketli test seti üzerinde çalıştırılan ölçüm scriptinin ürettiği sonuçların karışıklık matrisi olarak görselleştirilmesidir. Satırlar gerçek etiketleri, sütunlar tahmin edilen etiketleri temsil eder. Kategorilerin çoğunluğunda %100 doğruluk elde edilmiştir.*

## 4.4. Kullanıcı Geri Bildirimlerinin Analizi

Test sürecinde elde edilen kullanıcı geri bildirimleri, sistemin başarısını değerlendirmek açısından önemli bir veri kaynağı olmuştur. Kullanıcı mesajlarının konu dağılımı incelendiğinde, geri bildirimlerin Lojistik, Teknik ve Ödeme başlıkları altında yoğunlaştığı görülmüştür. Olumlu ve olumsuz içerikli mesajların dağılımı incelenmiş, sistemin bu mesajları doğru şekilde ayırt edebildiği gözlemlenmiştir.

Memnuniyet anketi ile elde edilen 👍/👎 oyları üzerinden hesaplanan memnuniyet oranı, yönetici panelinde gerçek zamanlı olarak görüntülenmektedir. Kullanıcılar, özellikle hızlı yanıt alma, sesli etkileşim, doğru marka tespiti ve şeffaf insan operatör yönlendirmesi gibi özellikleri olumlu olarak değerlendirmiştir.

\newpage

# 5. UYGULAMA KODLARININ DETAYLI ANALİZİ

Bu bölüm, çalışma kapsamında tasarlanan chatbot sisteminin yazılım katmanlarını, kullanılan kütüphaneleri ve uygulanan yapay zeka yöntemlerini kod düzeyinde ayrıntılı olarak ele almaktadır. Sistemin tüm bileşenleri modüler bir yapıda kurgulanmış olup; ön yüz (frontend), arka yüz (backend), yapay zeka servisleri ve veritabanı olmak üzere dört ana katmandan oluşmaktadır.

## 5.1. Ön Yüz (Frontend) Kod Yapısı

Sistemin ön yüzü, Next.js 15 çatısı altında React kütüphanesi kullanılarak geliştirilmiştir. Tüm sayfa içeriği `frontend/app/page.tsx` dosyasında tek bir bileşen olarak yapılandırılmıştır. Bu tercih, küçük ila orta ölçekli akademik projelerde sayfa içi etkileşim ve durum yönetimini kolaylaştıran tek-dosya yaklaşımına dayanmaktadır. Stilendirme için Tailwind CSS kütüphanesinin atomik sınıfları benimsenmiştir.

Ön yüzde kullanıcı arayüzünün durumlarını yönetmek için React'in `useState`, `useEffect` ve `useRef` kancalarından faydalanılmaktadır. Mesaj geçmişi, yazma göstergesi, ses tanıma durumu, yönetici paneli verileri ve doğruluk ölçüm sonuçları gibi tüm dinamik veriler bu kancalar aracılığıyla bileşenin yaşam döngüsü boyunca takip edilmektedir.

Sayfa, görsel olarak iki ana parçadan oluşmaktadır: tanıtım sayfası (landing page) ve sağ alt köşedeki yüzen sohbet penceresi. Sohbet penceresi framer-motion kütüphanesinin motion.div bileşeni ile sarmalanmış olup, kullanıcının pencereyi ekranda sürükleyip taşıyabilmesine olanak tanır.

Mobil cihazlarda kullanım deneyimini bozmamak adına Tailwind'in sm: ön ekiyle koşullu sınıflar tanımlanmıştır. Sohbet penceresi telefon ekranlarında tüm görünür alanı kaplarken, masaüstü ekranlarda 380×600 piksellik bir kutucuk olarak konumlanmaktadır.

## 5.2. Arka Yüz (Backend) Kod Yapısı

Arka yüz, Node.js çalışma ortamı üzerinde Express.js çatısı ile geliştirilmiş, TypeScript ile tip güvenliği sağlanmıştır. Tüm uygulama mantığı `backend/src/index.ts` dosyasında merkezi olarak yapılandırılmıştır. Veri tabanına erişim için Prisma ORM kullanılmıştır.

Backend uygulamasının başlangıç adımları sırasıyla şu şekildedir:

1. `dotenv/config` modülü ile `.env` dosyasındaki ortam değişkenleri belleğe yüklenir.
2. Express uygulaması başlatılır; cors ara katman yazılımı ile farklı kaynaklardan gelen isteklere izin verilir; `express.json()` ara katmanı JSON tabanlı isteklerin gövdesini ayrıştırır.
3. Prisma istemcisi oluşturulur. Bu istemci başarısız olursa sistem hata vermeden bellek üzerinde tutulan bir yedek diziye (in-memory fallback) düşer; böylece veritabanı erişiminde geçici bir aksaklık yaşansa dahi sistem kullanıcıya yanıt vermeye devam eder (graceful degradation).
4. `backend/data/knowledge_base.md` dosyası okunarak bilgi tabanı belleğe yüklenir.
5. Uygulama 3001 numaralı port üzerinden HTTP isteklerini dinlemeye başlar.

## 5.3. Yapay Zeka Entegrasyonu (Groq + Llama)

Yapay zeka katmanı, Meta tarafından geliştirilen açık ağırlıklı Llama dil modellerinin Groq adlı yüksek hızlı çıkarım altyapısı üzerinden çağrılmasıyla sağlanmaktadır. Groq, LPU adı verilen özel donanımları kullanarak büyük dil modellerinden çok düşük gecikmeyle yanıt almaya olanak tanımaktadır.

Sistemde iki ayrı model birlikte çalıştırılmaktadır:

- **llama-3.3-70b-versatile (70 milyar parametre):** Şikayet metinlerinin sınıflandırılması ve duygu analizinde kullanılmaktadır.
- **llama-3.1-8b-instant (8 milyar parametre):** Kullanıcıyla doğal sohbet için tercih edilmiştir.

Sistem yönergesi (system prompt) mühendislik edilmiş; modele Türkçe karakter kullanımı, marka adı tespiti, kategori tanımları ve kafa karıştırıcı durumlar için çok sayıda örnek (few-shot examples) verilmiştir. Bu yönerge `backend/src/prompts/analyzePrompt.ts` dosyasında tek bir sabit olarak tutulmakta ve hem üretim ortamında hem de doğruluk ölçüm scriptinde aynı şekilde kullanılmaktadır.

## 5.4. Bir Şikayetin Yaşam Döngüsü

1. Kullanıcı, web arayüzündeki sohbet penceresine bir metin yazar ve gönder düğmesine basar.
2. Ön yüz tarafında `processResponse` fonksiyonu tetiklenir; mesajın istatistiksel bir sorgu olup olmadığı düzenli ifadeler ile sınanır.
3. Eğer mesaj genel bir geri bildirim ise, paralel olarak iki istek gönderilir: `/api/chat/stream` ve `/api/feedback/analyze`.
4. Analiz uç noktası, mesajı Llama 3.3-70B modeline iletir ve JSON formatında bir nesne alır: duygu etiketi, güven puanı, kategori ve marka adı.
5. Güven puanı 0.85 eşiğinin altında ise sistem otomatik olarak `needs_human=true` bayrağını ayarlar.
6. Tüm sonuçlar Prisma istemcisi aracılığıyla PostgreSQL veritabanındaki Feedback tablosuna kaydedilir.
7. Aynı veri, in-memory yedek diziye de eklenir.
8. Ön yüz, sohbet akışını ve analiz sonucunu birlikte göstererek kullanıcıya rozetler sunar.
9. Yönetici paneli, her üç saniyede bir backend'den güncel verileri çekerek tabloyu ve grafikleri otomatik olarak günceller.

## 5.5. Bilgi Tabanı Erişimli Üretim (RAG)

Sistem, son kullanıcının sorduğu politika sorularına uydurma yapmadan yanıt verebilmek için RAG yaklaşımının basitleştirilmiş bir uygulamasını kullanmaktadır. `backend/data/knowledge_base.md` dosyasında 15 farklı başlık altında (iade politikası, kargo teslimat süreleri, ödeme yöntemleri, müşteri hizmetleri çalışma saatleri, KVKK hakları vb.) şirkete özel bilgiler tutulmaktadır. Backend başlangıcında bu dosya tek seferde belleğe yüklenir ve her sohbet isteğinde sistem yönergesinin sonuna eklenir.

Llama 3 modellerinin 128.000 simgelik geniş bağlam penceresi, bilgi tabanının tamamının yönergeye yerleştirilmesine olanak tanımaktadır. Bu sayede vektör tabanlı bir aramaya gerek kalmadan, model her seferinde tüm politika dokümanını okuyarak ilgili kısmı kullanıcıya aktarabilmektedir.

## 5.6. Yapay Zeka Aracı Çağrısı (Function Calling)

Kullanıcılar yalnızca şikayet yazmazlar; aynı zamanda sistem hakkında sayısal sorular da sorabilirler. Bu tür sorulara modelin kendi tahmini yerine veritabanından gerçek veriyle yanıt verilmesini sağlamak için OpenAI uyumlu fonksiyon çağrısı mekanizması kullanılmıştır.

Sistemde tanımlı beş araç:
- `get_total_feedbacks` — toplam şikayet sayısını döndürür
- `get_negative_count` — negatif duyguya sahip şikayet sayısını döndürür
- `get_top_brands` — en çok şikayet alan ilk beş markayı döndürür
- `get_feedback_by_id` — belirli bir şikayet kimliğine ait detayları döndürür
- `get_human_help_count` — insan operatöre yönlendirilmiş şikayet sayısını döndürür

`/api/agent` uç noktası, kullanıcının mesajını Llama 3.3'e bu araç tanımlarıyla birlikte gönderir. Model gerekirse bir aracı çağırır; backend bu çağrıyı yakalar, Prisma sorgusunu çalıştırır ve sonucu modele geri verir. Model, bu gerçek veriyi doğal Türkçe bir cümleye dönüştürerek kullanıcıya iletir.

**Şekil 15.** AI Agent — Function Calling Rozeti

*Kullanıcı sayısal bir soru sorduğunda bot'un cevabının altında beliren mor gradient rozetin görüntüsüdür. Rozet üzerinde kullanılan aracın adı kullanıcıya görsel olarak iletilmektedir.*

## 5.7. Akıcı (Streaming) Yanıt Sistemi

Daha doğal bir sohbet deneyimi için bot yanıtları Server-Sent Events kullanılarak parça parça ön yüze gönderilmektedir. `/api/chat/stream` uç noktası, Groq'un stream: true parametresini etkinleştirir ve gelen her bir simgeyi anında ön yüze iletir.

Bu yöntemin sorunsuz çalışması için iki kritik düzeltme uygulanmıştır: `res.flushHeaders()` çağrısı ile HTTP başlıkları gecikmeden istemciye gönderilmektedir; `res.socket.setNoDelay(true)` ile TCP'nin Nagle algoritması devre dışı bırakılmaktadır.

**Şekil 18.** Streaming Yanıt Akışı (Token-by-Token Görselleştirme)

*Bot'un cevabını harf harf ekrana akıttığı bir örneğin görüntüsüdür. Bu görsel; SSE tabanlı akıcı yanıt mekanizmasını gözlemlenir kılar.*

## 5.8. Sesli Giriş ve Çıkış

Sistem, "konuşma tabanlı" yaklaşımını derinleştirmek üzere tarayıcının yerleşik Web Speech API arayüzlerini kullanmaktadır. SpeechRecognition sınıfı, mikrofon ile alınan sesleri yazıya dönüştürür. Dil parametresi `tr-TR` olarak ayarlanmıştır. SpeechSynthesis sınıfı, bot yanıtlarını sesli olarak okur. Tarayıcıda yüklü Türkçe ses motoru (Yelda veya benzer bir TTS sesi) otomatik olarak seçilir.

Akıcı yanıt akışıyla birlikte ortaya çıkan "yarım metin okuma" hatalarını engellemek için yanıtın tamamlandığını işaretleyen bir bayrak (`complete: true`) ön yüz tarafında kullanılmaktadır. Yalnızca tamamlanmış mesajlar sesli okumaya alınır.

## 5.9. Hibrit Destek Mekanizması

Literatürde [Jain & Kumar 2019; Følstad & Brandtzæg 2018] vurgulandığı üzere, saf chatbot sistemleri tek başına müşteri destek süreçlerinin tamamını karşılamak için yeterli değildir; insan desteğinin işin içinde kalması önerilmektedir. Bu öneri sistemimize güven puanı tabanlı otomatik yönlendirme olarak entegre edilmiştir.

Her şikayet analizinden sonra Llama modelinin döndürdüğü `confidence_score` değeri 0.85 eşiğinin altında ise, ilgili kayıt veritabanında `needs_human=true` bayrağıyla işaretlenir. Bu işaret yönetici paneline yansır; ilgili satır sarı renkle vurgulanır ve özet kartlarda "İnsan Yardımı" sayacı artar.

**Şekil 12.** Hibrit Destek Banner'ı (İnsan Operatöre Yönlendirme)

*Yapay zekanın güven puanı 0.85 eşiğinin altında olduğunda kullanıcıya gösterilen "Şikayetiniz uzman temsilcimize yönlendirildi" mesajının ekran görüntüsüdür.*

## 5.10. Memnuniyet Anketi

Her şikayet analizinin altında kullanıcıya "Faydalı mıydı?" sorusu ile iki düğme (👍 / 👎) sunulmaktadır. Düğmeye basıldığında `/api/feedback/:id/rate` uç noktasına bir HTTP POST isteği gönderilir; veritabanındaki Feedback kaydının helpful alanı güncellenir. Yönetici panelinde tüm oylar üzerinden bir memnuniyet oranı hesaplanır ve özet kart üzerinden anlık olarak gözlemlenebilir.

**Şekil 16.** Memnuniyet Anketi — 👍/👎 Butonları

*Bot yanıtının altında beliren "Faydalı mıydı?" sorusu ve iki yumuşak renkli düğmenin görüntüsüdür.*

## 5.11. Marka Tespiti ve Filtreleme

Sistem, AI Feedback Hub'ın aracılık özelliğinin gereği olarak şikayetin hangi markayla ilgili olduğunu otomatik tespit etmektedir. Llama 3.3 modeline verilen sistem yönergesi, metinde geçen marka adlarını JSON çıktısında ayrı bir alan (brand) olarak döndürmesini ister. Marka belirtilmemişse "Belirtilmemiş" değeri atanır.

Yönetici panelinde, en çok şikayet alan ilk altı marka filtre çipleri olarak gösterilir. Yönetici, herhangi bir markaya tıklayarak tabloyu o markaya ait şikayetlerle sınırlandırabilir.

## 5.12. Yapay Zeka Doğruluk Ölçüm Scripti

Sistemin yapay zeka tarafının ne kadar isabetli çalıştığını ölçmek için ayrı bir Node.js scripti yazılmıştır: `backend/src/scripts/measureAccuracy.ts`. Bu script test setini okur, her örneği `/api/feedback/analyze` uç noktasının kullandığı birebir aynı sistem yönergesi ve modeliyle Llama'ya gönderir, dönen yanıtlardaki kategori ve duygu etiketlerini gerçek değerlerle karşılaştırır, doğruluk yüzdelerini hesaplar ve karışıklık matrisi üretir.

## 5.13. Kod Düzenleme Pratikleri

Geliştirme süresince aşağıdaki pratiklere bağlı kalınmıştır:

- **Ortam değişkenleri:** Kodda sabit olarak yazılmamış; tüm gizli bilgiler `.env` dosyasından okunmaktadır. Bu dosya `.gitignore` ile sürüm kontrolünden hariç tutulmuştur.
- **Tip güvenliği:** TypeScript ile sağlanmıştır; çalışma anında oluşabilecek hataların büyük kısmı derleme sırasında yakalanır.
- **Modüler bilgi tabanı:** Yapay zekaya verilen prompt'lar ayrı dosyalarda tutulmuştur.
- **Zarif düşüş:** Veritabanı veya Llama servisi geçici olarak ulaşılamaz duruma düşse bile sistem in-memory yedek mekanizmasıyla kullanıcıya yanıt vermeye devam eder.
- **Sürüm kontrolü ve sürekli dağıtım:** Proje GitHub deposunda tutulmakta, ön yüz Vercel'e, arka yüz Render'a otomatik olarak dağıtılmaktadır.
- **Çevrimiçi izleme:** Render servisinin uyku moduna geçmesini engellemek için UptimeRobot servisi her beş dakikada bir backend'i sorgulamaktadır.

\newpage

# SONUÇ

Bu çalışmada, işletmelerin müşteri geri bildirimlerini daha etkin biçimde toplayıp analiz edebilmesi amacıyla yapay zeka destekli, konuşma tabanlı bir chatbot platformu tasarlanmış ve hem yerel hem bulut ortamında çalışır hâle getirilmiştir. Dijital müşteri etkileşimlerinin artmasıyla ortaya çıkan veri yoğunluğu, geleneksel analiz yöntemlerinin yetersiz kalmasına yol açmaktadır; bu çalışmada geliştirilen sistem, müşteri geri bildirimlerinin merkezi, düzenli ve analiz edilebilir bir yapı altında ele alınmasını sağlayan kapsamlı bir çözüm sunmaktadır.

Vize aşamasında öngörülen birçok özelliğin gerçek uygulamaya dönüştürülmesi, finalin önemli kazanımıdır. Simüle edilen NLP süreci, Groq + Llama 3.3-70B modeli ile gerçek bir doğal dil işleme servisine dönüştürülmüş; konuşma hafızası ve Server-Sent Events tabanlı akıcı yanıt akışı eklenerek tek-turlu analiz aracından çok-turlu konuşma asistanına evrilmiştir. Yapay zekanın doğruluğu, 24 örneklik etiketli bir test seti üzerinde ölçülmüş ve sonuçlar karışıklık matrisi ile birlikte yönetici panelinde gerçek zamanlı olarak sunulmuştur. Kategori sınıflandırma doğruluğunun %50'den %92'ye, genel doğruluğun %50'den %88'e yükselmesi; sistem prompt mühendisliği ve model seçimi gibi yaklaşımların etkisini somut biçimde ortaya koymaktadır.

Çalışma süresince sisteme entegre edilen ek yetenekler şu başlıklar altında özetlenebilir: Retrieval-Augmented Generation (RAG) ile şirkete özel bilgi tabanı; Function Calling ile veritabanı sorgularına dayalı akıllı ajan davranışı; hibrit destek mekanizması ile düşük güvenli vakaların otomatik olarak insan operatöre yönlendirilmesi; sesli giriş/çıkış ile erişilebilirlik; marka tespiti ve filtreleme ile çok markalı analiz; memnuniyet anketi ile kullanıcıdan geri bildirim toplama. Bu özelliklerin tümü; literatürde ifade edilen "yapay zeka destekli, hibrit ve veriye dayalı müşteri destek sistemleri" önerilerinin somut bir uygulaması niteliğindedir.

Veri katmanında Prisma ORM ile PostgreSQL ilişkisel veritabanı kullanılmış; bu sayede geri bildirimlerin kalıcı saklanması ve sistemin yeniden başlatılması durumunda veri kaybı yaşanmaması sağlanmıştır. Veritabanı bağlantısı kopsa dahi bellek içi yedek mekanizma (graceful degradation) sayesinde sistem çalışmaya devam etmektedir. Ön yüz Vercel'e, arka yüz Render'a dağıtılmış; UptimeRobot servisi ile sürekli erişilebilirlik sağlanmıştır.

Geliştirilen sistem; yalnızca bir öğrenci projesi olarak değil, üretim ortamında çalışabilen bir prototip olarak son kullanıcılar için anlık ve erişilebilir, işletmeler için veri odaklı ve marka bazlı, geliştiriciler için sürdürülebilir ve genişletilebilir bir platform sunmaktadır. Bu nitelikleri ile, dijital müşteri destek süreçlerinin daha akıllı, ölçülebilir ve sürdürülebilir hâle getirilmesine somut bir katkı sağlamaktadır.

İlerleyen çalışmalarda; vektör tabanlı semantik arama (pgvector ile), JWT/OAuth tabanlı yönetici kimlik doğrulaması, çoklu dil desteği, daha geniş bir etiketli test setiyle doğruluk yeniden ölçümü, fine-tuning veya model damıtma yoluyla maliyet optimizasyonu ve farklı sektörlere uyarlanabilirlik incelenebilir. Geliştirilen mimari, tüm bu genişlemelere açık esnek bir altyapı sunmaktadır [3], [7], [9].

\newpage

# KAYNAKÇA

[1] Adamopoulou, A., & Moussiades, M. (2020). Customer service chatbots: A systematic literature review. *Artificial Intelligence Applications and Innovations*, Springer. https://link.springer.com/chapter/10.1007/978-3-030-49161-1_2

[2] Brandtzaeg, J. B., & Følstad, A. (2017). An empirical study of customer satisfaction with chatbots. *Proceedings of the International Conference on Human-Computer Interaction*. https://dl.acm.org/doi/10.1145/3025453.3025496

[3] Jain, S., & Kumar, A. (2019). Conversational agents in customer support: A practical review. *IEEE Access*. https://ieeexplore.ieee.org/document/8642736

[4] Liu, B., & Zhang, L. (2018). Sentiment analysis of customer feedback in online platforms. *Journal of Information Science*. https://journals.sagepub.com/doi/10.1177/0165551517747287

[5] Kowsari, M., Brown, D. E., Heidarysafa, M., Meimandi, K. J., Gerber, M. S., & Barnes, L. E. (2019). Text classification techniques: A literature review. *ACM Computing Surveys*. https://dl.acm.org/doi/10.1145/3290616

[6] Dale, R. (2016). Measuring the effectiveness of chatbots in customer support. *Natural Language Engineering*, Cambridge University Press.

[7] Følstad, T., & Brandtzæg, P. B. (2018). Conversational systems for business process support. *Human–Computer Interaction Journal*. https://www.tandfonline.com/doi/full/10.1080/07370024.2018.1452734

[8] Zhao, T., & Liu, M. (2024). Large Language Models in Customer Service Chatbots. *IEEE Access*. https://ieeexplore.ieee.org/

[9] Singh, R., & Patel, A. (2025). AI-Based Conversational Systems for Customer Feedback Analysis. *Journal of Intelligent Information Systems*. https://link.springer.com/

[10] W3Schools. (2025). HTML, CSS, and JavaScript Documentation. Web Technologies Reference. https://www.w3schools.com/

[11] Vercel. (2025). Next.js Official Documentation. React Framework for the Web. https://nextjs.org/docs

[12] Tailwind Labs. (2025). Tailwind CSS Documentation. Utility-First CSS Framework. https://tailwindcss.com/docs

[13] FastAPI. (2025). FastAPI Documentation. High-performance web framework. https://fastapi.tiangolo.com/

[14] Touvron, H., et al. (2023, 2024). Llama: Open and efficient foundation language models / Llama 3 / Llama 3.3 model documentation. *Meta AI Research*. https://ai.meta.com/llama/

[15] Lewis, P., Perez, E., Piktus, A., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *Advances in Neural Information Processing Systems (NeurIPS)*. https://arxiv.org/abs/2005.11401

[16] Vaswani, A., Shazeer, N., Parmar, N., et al. (2017). Attention Is All You Need. *Advances in Neural Information Processing Systems (NeurIPS)*. https://arxiv.org/abs/1706.03762

[17] Groq, Inc. (2025). Groq API Documentation. LPU Inference Engine for Large Language Models. https://console.groq.com/docs

[18] Prisma Labs. (2025). Prisma ORM Documentation. Type-safe database access for Node.js & TypeScript. https://www.prisma.io/docs

[19] Render Cloud Services. (2025). Render PostgreSQL & Web Services Documentation. https://render.com/docs

[20] OpenAI. (2024). Function Calling and Tool Use Documentation. https://platform.openai.com/docs/guides/function-calling

[21] Mozilla Developer Network. (2025). Web Speech API: SpeechRecognition and SpeechSynthesis Interfaces. https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

[22] Vercel Edge. (2025). Server-Sent Events (SSE) — Real-time Streaming Documentation. https://vercel.com/docs

[23] UptimeRobot. (2025). Uptime Monitoring Documentation. Continuous endpoint pinging. https://uptimerobot.com/

[24] Anthropic. (2024). Claude — AI Assistant Documentation. Bu çalışmanın geliştirme sürecinde kod yazımı, hata analizi, sistem mimarisi kararları ve rapor düzenlemesi gibi alanlarda destekleyici bir araç olarak kullanılmıştır. https://www.anthropic.com/claude

\newpage

# EKLER

## Ek-1: ER Diyagramı

**Şekil E.1.** Chatbot Sistemi ER Diyagramı (Detaylı)

*Veritabanı varlıkları, ilişkileri ve alan tiplerini içeren ayrıntılı varlık-ilişki diyagramıdır.*

## Ek-2: UML Class Diyagramı

**Şekil E.2.** Chatbot Sistemi UML Sınıf Diyagramı (Detaylı)

*Sistemdeki sınıflar, metodlar ve nitelikler dahil ayrıntılı UML diyagramıdır.*

## Ek-3: Nesne Diyagramı

**Şekil E.3.** Chatbot Sistemi Nesne Diyagramı (Detaylı)

*Çalışma anındaki örnek nesneler ve değerlerini gösteren ayrıntılı nesne diyagramıdır.*

## Ek-4: Sequence Diyagramı

**Şekil E.4.** Chatbot Mesaj İşleme Süreci Sequence Diyagramı (Detaylı)

*Mesaj işleme akışının ekler bölümündeki ayrıntılı sequence gösterimidir.*

## Ek-5: Chatbot NLP Algoritması ve Mesaj İşleme Fonksiyonu

```typescript
// Chatbot Mesaj İşleme ve Duygu Analizi (Sentiment) Implementasyonu
app.post('/api/feedback/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: ANALYZE_SYSTEM_PROMPT },
        { role: "user", content: text }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const aiData = JSON.parse(chatCompletion.choices[0].message.content);

    // Hibrit destek: confidence < 0.85 ise insan operatöre yönlendir
    const needsHuman = aiData.confidence_score < 0.85;
    const brand = aiData.brand || "Belirtilmemiş";

    // Prisma ile veritabanına kayıt
    if (prisma) {
      await prisma.feedback.create({
        data: {
          text,
          sentiment: aiData.sentiment_label,
          category: aiData.nlp_category,
          score: aiData.confidence_score,
          brand,
          needs_human: needsHuman,
        }
      });
    }

    res.json({
      success: true,
      data: { analysis: aiData, needs_human: needsHuman, brand }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

## Ek-6: Sistemde Test Edilen Örnek Şikayet Veri Seti

**Lojistik ve Operasyon Verileri:**
- Kargo Gecikmesi ve Kayıp Ürün
- Yanlış Adrese Teslimat Edildi
- Hasarlı Koli ve Kötü Paketleme
- Kurye İletişim Kurmadan Gitti

**Yazılım ve Teknik Altyapı Verileri:**
- Mobil Uygulama Çökme Sorunu
- Şifre Sıfırlama E-postası Gelmiyor
- Ödeme Sayfası Yüklenme Gecikmesi
- Sepete Ekleme Hatası Alıyorum

**Finans ve Ödeme Verileri:**
- Kredi Kartı İade Problemi
- Hesabımdan Çifte Çekim Yapıldı
- Kurumsal Fatura Kesilmedi
- Taksit Seçeneği Ekranda Çıkmıyor

**Müşteri İlişkileri ve İletişim Verileri:**
- Müşteri Temsilcisi Kaba Davranışı
- Destek Talebime 3 Gündür Dönülmedi
- Canlı Destek Asistanı Yetersiz Kaldı

\newpage

# ÖZGEÇMİŞ

2003 yılında Ankara'da doğdu. İlk, orta ve lise eğitimini Ankara'da tamamladı. Lisans eğitimine İstanbul Beykent Üniversitesi, Mühendislik ve Mimarlık Fakültesi, Bilgisayar Mühendisliği Bölümü'nde tam burslu başladı ve eğitimine devam etmektedir. Lisans eğitimi süresince yazılım geliştirme, web teknolojileri ve yapay zeka destekli sistemler alanlarında akademik ve uygulamalı çalışmalar yürütmüştür.

Eğitimi kapsamında özellikle konuşma tabanlı sistemler, doğal dil işleme, metin analizi, büyük dil modelleri (LLM) ve müşteri destek sistemleri konularına ilgi duymaktadır. Final tasarım projesi olarak yapay zeka destekli, konuşma tabanlı bir chatbot platformu geliştirmiştir. Bu projede Retrieval-Augmented Generation (RAG), Function Calling, Server-Sent Events ile akıcı yanıt akışı, Web Speech API ile sesli etkileşim ve hibrit destek mekanizması gibi modern yapay zeka mimarilerini bütünleşik bir sistemde uygulamalı olarak gerçekleştirmiştir.

**SUDENAZ KAYABAŞI**
