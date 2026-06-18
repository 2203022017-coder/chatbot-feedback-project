# Şekil Açıklamaları (Caption'lar)

Aşağıda raporda kullanılan tüm şekiller için **iki-üç cümlelik akademik açıklamalar** yer almaktadır. Hocanın *"SS'lerin altına not düş açıkla"* notuna uygun şekilde, her bir görselin ne anlattığı ve okuyucuya hangi bilgiyi ilettiği detaylandırılmıştır. Mevcut şekiller korunmuş, final aşamasında eklenen yeni özellikler için de yeni şekiller önerilmiştir.

---

## Mevcut Şekiller (Vize Raporundan Korunan)

**Şekil 1. Yapay Zeka Destekli Chatbot Sistem Mimarisi**
Sistemin genel mimari yapısı blok diyagramı olarak sunulmaktadır. Şekilde; kullanıcı arayüzü (web chat ve yönetici paneli), arka yüz (Node.js / TypeScript), kimlik doğrulama modülü, yapay zeka analiz servisi ve veritabanı katmanları arasındaki HTTP/REST iletişim akışı görselleştirilmiştir. Diyagram, modüler tasarımın katmanlar arası bağımsızlığını ortaya koyar.

**Şekil 2. Chatbot Sistemi Use Case Diyagramı**
UML use case (kullanım durumu) gösterimi ile sistem aktörleri ve etkileşimleri sunulmaktadır. "Kullanıcı" aktörü chatbot ile mesajlaşma, geri bildirim gönderme ve bilgi alma; "Yönetici (Admin)" aktörü ise giriş yapma, raporları görüntüleme ve duygu analizi sonuçlarını inceleme işlevlerine sahiptir. Diyagram, sistemin fonksiyonel gereksinimlerinin genel haritasını çıkarır.

**Şekil 3. Chatbot Mesaj İşleme Sürecine Ait Sequence Diyagramı**
Kullanıcı ile bot arasındaki bir etkileşimin zaman ekseninde adım adım izlediği yol gösterilmektedir. "Kullanıcı → Web Chat UI → Backend API → Yapay Zeka Analiz Servisi → Veritabanı → geri dönüş" akışı, mesajların hangi sırayla geçtiğini ve hangi sistem bileşenleri arasında veri alışverişi yapıldığını ortaya koyar.

**Şekil 4. Chatbot Sistemi ER Diyagramı**
Veritabanı varlık-ilişki diyagramında; kullanıcı, oturum, mesaj, analiz sonucu, geri bildirim biletleri, yönetici ve dashboard istatistikleri tabloları yer almaktadır. Tablolar arasındaki ilişkiler (1-N, 1-1) çoklukları (cardinality) ile gösterilmiş; sistemin ilişkisel veri modeli baştan sona haritalanmıştır.

**Şekil 5. Chatbot Sistemine Ait UML Sınıf (Class) Diyagramı**
Nesne tabanlı tasarım yaklaşımıyla sistemde tanımlı sınıflar (User, ChatSession, Message, AnalysisResult, Chatbot, Admin), bunlara ait özellikler (attributes) ve metodlar (operations) gösterilmiştir. Sınıflar arası ilişkiler ve erişim belirleyicileri (public, private) ile birlikte sistemin modüler ve yönetilebilir mimarisi belgelenmiştir.

**Şekil 6. Chatbot Sistemine Ait Nesne (Object) Diyagramı**
Çalışma anındaki örnek nesneler ve aralarındaki ilişkiler sunulmuştur. Sınıflardan türetilmiş gerçek değerli nesneler (örneğin `user1: User`, `chatbot1: Chatbot`, `message1: Message`, `analysis1: SentimentAnalysis`) somut bir senaryo üzerinden gösterildiği için, sınıf diyagramının soyut yapısını **çalışma zamanına bağlayan** bir görsel oluşturur.

**Şekil 7. AI Feedback Hub Platformu Ana Giriş Ekranı (Landing Page)**
Web sitesinin ilk açılış ekranı görüntülenmektedir. Üst kısımda gezinme çubuğu (Platform, Analitik, Deneyimler, Belge Yükle, Yönetici Girişi, Şikayet Yaz butonları), ortada "Deneyimle / Geri Bildirim Ver / Çözüm Bul" başlığı ve "Geri Bildirim Analizi" çağrı butonu yer almaktadır. Final sürümünde başlığın altına "Llama 3.3 — 70B", "%100 Doğruluk" ve "Gerçek Zamanlı" mini rozetleri eklenmiştir.

**Şekil 8. Müşteri Deneyimleri ve Kategori Filtreleme Arayüzü**
Ana sayfadaki "Güncel Deneyimler" bölümünde, kullanıcıların hangi kategorideki şikayetleri filtreleyebildiği gösterilmektedir. Filtre çipleri (Tümü, Lojistik, Teknik, Ödeme, İletişim, Ürün, İşlem) ve altında her bir şikayetin kart görünümü yer almaktadır. Kartlar üzerinde hover efektiyle yukarı kalkma ve gölgeli vurgu uygulanmıştır.

**Şekil 9. Konuşma Tabanlı Chatbot ve Yapay Zeka Duygu Analizi (Sentiment) Çıktısı**
Sohbet penceresinde örnek bir kullanıcı şikayetinin (kargo gelmedi gibi) yapay zeka tarafından analiz edilmesi sonucu gösterilmektedir. Negatif duygu rozeti, şikayet önceliği ve kategori güveni yüzdeleri renkli barlar halinde görselleştirilmiştir. Bu şekil, RAG ve real-time NLP'nin son kullanıcıya nasıl sunulduğunu örnekler.

**Şekil 10. Güvenli Yönetici (Admin) Giriş Doğrulama Ekranı**
Modal pencere üzerinden açılan yönetici giriş ekranı görülmektedir. Sayfanın geri kalanı `backdrop-blur` filtre ile bulanıklaştırılmış, ortadaki form kullanıcı adı ve parola alanlarını içermektedir. Sağ üstte kapatma simgesi (X) ve sol üstte kalkan ikonu (güvenlik vurgusu) yer almaktadır.

**Şekil 11. Yönetici Paneli Gerçek Zamanlı Analitik ve Raporlama Ekranı**
Yönetici girişi sonrası açılan ana panel görüntülenmektedir. En üstte beş özet kart (Toplam Bildirim, Çözülen Şikayet, Negatif Duygu Oranı, İnsan Yardımı, Sistem Doğruluğu) yer almakta; altında **Duygu Trend Analizi** çizgi grafiği ve **Kategori Dağılımı** halka grafiği yan yana sunulmaktadır. En altta marka filtreleme çipleri ile "Son Müşteri Etkileşimleri" tablosu yer almakta, sağ üstte CSV indirme butonu bulunmaktadır.

---

## Final Aşamasında Eklenen Yeni Şekiller (Öneri)

**Şekil 12. Hibrit Destek Banner'ı (İnsan Operatöre Yönlendirme)**
Yapay zekanın güven puanı 0.85 eşiğinin altında olduğunda kullanıcıya gösterilen "Şikayetiniz uzman temsilcimize yönlendirildi" mesajının ekran görüntüsüdür. Sarı renkli uyarı kutusu, içinde insan ikonu (👤) ve "en kısa sürede iletişime geçilecek" alt metni bulunur. Bu özellik, literatürdeki hibrit destek önerisinin somut karşılığıdır.

**Şekil 13. Yönetici Paneli — Kategori Dağılımı Halka Grafiği**
Final aşamasında eklenen Doughnut chart bileşeninin yakın görüntüsüdür. Altı kategori (Lojistik, Teknik, Ödeme, İletişim, Ürün, İşlem) altı farklı renk ile temsil edilmiş; merkez boşluğu modern dashboard estetiği için bırakılmıştır. Alt kısımda renk efsanesi (legend) yer almaktadır.

**Şekil 14. Marka Filtreleme Çipleri**
Yönetici panelindeki "Son Müşteri Etkileşimleri" tablosunun üstünde bulunan marka filtre satırının görüntüsüdür. "Tümü", "Trendyol (5)", "Getir (3)", "Migros (2)" gibi çipler yan yana dizilmiş; aktif olan çip indigo renkle vurgulanmıştır. Bir çipe tıklanınca tablo o markaya göre süzülür.

**Şekil 15. AI Agent — Function Calling Rozeti**
Kullanıcı sayısal bir soru sorduğunda (örn. "Toplam kaç şikayet var?") bot'un cevabının altında beliren mor gradient rozetin görüntüsüdür. Rozet üzerinde "🛠️ Tool kullanıldı: get_total_feedbacks" yazısı yer almakta, kullanılan aracın adı kullanıcıya görsel olarak iletilmektedir. Bu, sistemin gerçek bir AI Agent olduğunun kanıtıdır.

**Şekil 16. Memnuniyet Anketi — 👍/👎 Butonları**
Bot yanıtının altında beliren "Faydalı mıydı?" sorusu ve iki yumuşak renkli düğmenin (yeşil 👍, kırmızı 👎) görüntüsüdür. Düğmeye tıklandıktan sonra alan, "Teşekkürler, geri bildiriminiz kayda geçti." metni ile değişmektedir.

**Şekil 17. Sesli Giriş Aktif Durumu (Mikrofon Dinleniyor)**
Kullanıcı mikrofon düğmesine bastığında düğmenin **kırmızı nabız efekti** ile aktif hâle geldiği görüntüsüdür. Mesaj kutusu yer tutucusu "🎤 Dinleniyor... konuşun" şeklinde değişmiş, kullanıcı konuşmaya başladığında metin otomatik kutuya aktarılır.

**Şekil 18. Streaming Yanıt Akışı (Token-by-Token Görselleştirme)**
Bot'un cevabını harf harf ekrana akıttığı bir örneğin ardışık iki anının görüntüsüdür. İlk karede "Mer" görülürken ikinci karede tüm cümle "Merhaba, size nasıl..." biçimde tamamlanmıştır. Bu görsel; SSE (Server-Sent Events) tabanlı akıcı yanıt mekanizmasını gözlemlenir kılar.

**Şekil 19. Doğruluk Ölçüm Karışıklık Matrisi (Confusion Matrix)**
24 örnekli etiketli test seti üzerinde çalıştırılan ölçüm scriptinin ürettiği sonuçların karışıklık matrisi olarak görselleştirilmesidir. Satırlar gerçek etiketleri, sütunlar tahmin edilen etiketleri temsil eder. Diyagonal hücreler doğru sınıflandırmaları, diyagonal dışı hücreler ise hatalı sınıflandırmaları gösterir. Kategorilerin çoğunluğunda (Teknik, Ödeme, İletişim, Ürün, İşlem) %100 doğruluk elde edilmiştir.

**Şekil 20. Karşılama Ekranı — Hızlı İşlem Kartları**
Sohbet penceresi ilk açıldığında kullanıcıya sunulan altı renkli kartın (Yeni Şikayet Yaz, Toplam Şikayet Sayısı, İade Politikası, Kargo & Teslimat, Sistem Hakkında, Sesli Konuşma) iki sütunlu grid düzenindeki görüntüsüdür. Her kart için kategoriye özgü renk ve ikon ataması yapılmıştır.

---

## Ekler Bölümündeki Şekiller

**Şekil E.1. Chatbot Sistemi ER Diyagramı** *(Birinci ek olarak kullanılmaktadır; pdf'teki güncel sürüm.)*
Veritabanı varlıkları, ilişkileri ve alan tiplerini içeren ayrıntılı varlık-ilişki diyagramıdır. Şekil 4'ün büyütülmüş ve detaylandırılmış sürümüdür.

**Şekil E.2. Chatbot Sistemi UML Sınıf Diyagramı**
Sistemdeki sınıflar, metodlar ve nitelikler dahil ayrıntılı UML diyagramıdır. Şekil 5'in eklerdeki büyük formatlı tam görüntüsüdür.

**Şekil E.3. Chatbot Sistemi Nesne Diyagramı**
Çalışma anındaki örnek nesneler ve değerlerini gösteren ayrıntılı nesne diyagramıdır.

**Şekil E.4. Chatbot Mesaj İşleme Süreci Sequence Diyagramı**
Mesaj işleme akışının ekler bölümündeki ayrıntılı sequence gösterimidir.

---

## Şekil Numaralandırma Notu

Final raporu için şekil numaralandırması aşağıdaki şekilde **tutarlı** kılınmalıdır:
- **Şekil 1 — Şekil 11:** Vize raporundan korunan şekiller
- **Şekil 12 — Şekil 20:** Final aşamasında eklenen yeni özelliklerin ekran görüntüleri (yukarıda önerilen)
- **Şekil E.1 — Şekil E.4:** Ekler bölümündeki büyük formatlı diyagramlar

Word dosyasında Heading stilleriyle birlikte **"Stil > Resim Yazısı (Caption)"** özelliği kullanıldığında, şekil numaraları otomatik olarak güncellenecek ve "Şekiller Listesi" sayfası tek tıkla yenilenebilecektir.
