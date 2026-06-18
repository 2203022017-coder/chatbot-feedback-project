# 3.5. Kullanıcı Arayüzü Bileşenleri ve Etkileşim Tasarımı

Bu bölümde, geliştirilen platformun kullanıcı arayüzünde yer alan ana etkileşim bileşenleri ayrıntılı şekilde açıklanmaktadır. Her bileşen; teknik altyapı, kullanım senaryosu ve son kullanıcıya katkısı çerçevesinde ele alınmıştır.

## 3.5.1. Yüzen ve Sürüklenebilir Sohbet Penceresi

Sistemin merkezi bileşeni, web sitesinin sağ alt köşesinde yer alan **yüzen sohbet penceresi (floating chat widget)**'dir. Bu bileşen klasik bir HTML `<div>` öğesi olmanın ötesinde, **framer-motion** isimli animasyon kütüphanesinin `motion.div` öğesi ile sarmalanmıştır.

Pencerenin `drag` özelliği etkin olduğundan, kullanıcı pencereyi fare ile (veya dokunmatik ekranlarda parmağıyla) **yakalayıp ekranda istediği konuma sürükleyebilir**. `dragMomentum={false}` parametresi ile bırakma anındaki kayma efekti kapatılmış, pencere bırakıldığı yerde sabit kalmaktadır. Bu özellik son kullanıcıya iki önemli fayda sağlar:

- **Ergonomi:** Kullanıcı, pencereyi ekranda doldurmak istediği bilgiyi engellemeyecek bir noktaya kolayca taşıyabilir.
- **Modernlik:** Sürüklenebilir arayüzler, modern ürün deneyiminin önemli bir parçasıdır ve sistemin profesyonel bir izlenim bırakmasına katkı sağlar.

Mobil ekranlarda Tailwind CSS'in **duyarlı (responsive) sınıfları** sayesinde pencere otomatik olarak **tam ekran** açılmaktadır. Bu sayede küçük ekranlı cihazlarda da sohbet rahatlıkla okunabilmektedir. Kullanılan sınıflar şu mantığa dayanır:
- `inset-0 sm:inset-auto`: Mobilde dört kenardan tam ekran, masaüstünde otomatik konumlama.
- `w-full h-full sm:w-[380px] sm:h-[600px]`: Mobilde tam genişlik ve yükseklik, masaüstünde 380×600 piksel.
- `sm:rounded-3xl`: Sadece masaüstünde köşe yuvarlaması; mobilde köşesiz tam ekran görünüm.

Bu yaklaşım, raporda öngörülen platformun **çeşitli cihazlar üzerinden erişilebilir** olmasını sağlamaktadır.

## 3.5.2. Yönetici Giriş Ekranı (Admin Login Modal)

Yönetici paneline erişim, web sitesi üst gezinme çubuğunda yer alan **"Yönetici Girişi"** butonu ile başlamaktadır. Butona tıklandığında, sayfanın üzerine yarı saydam (backdrop blur) bir katman yerleştirilen ve ortada beliren bir **modal pencere** açılmaktadır.

Modal yapısının görsel özellikleri:
- Arka planın hafif buğulanması (`backdrop-blur-sm`), kullanıcının dikkatinin giriş formuna odaklanmasını sağlar.
- "Yönetici Girişi" başlığı yanında kalkan ikonu (`IconShield`) ile güvenlik vurgusu yapılır.
- Kullanıcı adı ve parola alanlarına Tailwind ile şık bir form çerçevesi uygulanmıştır.
- Sağ üstte kapatma simgesi (`IconX`) ile modal istenildiği an kapatılabilir.

Giriş işlemi sonrasında React `state` üzerinden `isAdminView` değişkeni `true` olarak ayarlanır ve uygulama, ana sayfa yerine `AdminDashboard` bileşenini render etmeye başlar. Bu yaklaşım, sayfa yenilemesi olmadan **tek sayfalı uygulama (single page application)** mantığıyla yönetici paneline geçişi sağlar. Kullanıcı oturum açtıktan sonra yönetici panelindeki tüm bileşenler (istatistik kartları, grafikler, şikayet tablosu, marka filtre çipleri) anında erişilebilir hale gelir.

Tasarım projesi kapsamında giriş doğrulaması basit bir form kontrolü ile yapılmaktadır; gelecek çalışmalarda **JSON Web Token (JWT)** veya **OAuth 2.0** tabanlı kimlik doğrulama eklenebilir.

## 3.5.3. Belge Yükleme Bileşeni (File Uploader)

Sistemde, müşterilerin şikayetlerini yazıyla iletmesinin yanı sıra **kanıtlayıcı belge yükleyebilmelerine** olanak tanıyan bir bileşen bulunmaktadır. Ana sayfanın alt kısmında konumlanan bu bölüm, `frontend/components/ui/file-uploader.tsx` dosyasında tanımlanmıştır.

Belge yükleme bileşeninin temel özellikleri:
- **Sürükle-bırak (drag & drop)** destekli yükleme alanı.
- "Belge Yükle" düğmesine tıklandığında dosya seçim diyaloğunun açılması.
- Yüklenen dosyanın görünür şekilde önizleme alanına eklenmesi.
- Yüklenen belge kullanıcının şikayet metnine ek bağlam sağlar; örneğin kargo gecikmesi durumunda fatura veya kargo etiketinin fotoğrafı yüklenebilir.

Bileşen, yükleme sırasında oluşabilecek hataları (dosya boyut sınırı, desteklenmeyen biçim) yakalayıp kullanıcıya görsel bir geri bildirim vermektedir. Böylece kullanıcının "yükleme başarısız" gibi soyut hatalar yerine, "Lütfen 5 MB'tan küçük bir dosya seçin" benzeri yönlendirici mesajlar görmesi sağlanır.

## 3.5.4. Yönetici Paneli Grafik Bileşenleri

Yönetici paneli; sade tablo görünümünün ötesine geçerek **veri görselleştirme** araçlarıyla zenginleştirilmiştir. Grafikler için **Chart.js** kütüphanesi ve onun React adaptörü olan **react-chartjs-2** kullanılmıştır.

### 3.5.4.1. Duygu Trend Analizi Grafiği (Çizgi Grafik)

Son şikayetlerin **güven puanlarını** zaman ekseni üzerinde gösteren bir çizgi grafiktir (`Line` bileşeni). Her veri noktası, ilgili şikayetin yazıldığı saati (`HH:MM` formatında) yatay eksende, yapay zekanın atadığı güven puanını ise dikey eksende temsil eder. Bu grafik sayesinde yönetici, son şikayetlerde güven puanının yüksek mi yoksa düşük mü seyrettiğini görerek **modelin performansını anlık olarak izleyebilir**.

Grafik bileşeni, `dashboardStats.recent_feedbacks` dizisi üzerinden tetiklenmektedir. Her üç saniyede bir veri yenilendiği için grafik **gerçek zamanlı (live)** çalışır.

### 3.5.4.2. Kategori Dağılımı Grafiği (Donut Chart)

Şikayetlerin altı kategoriye nasıl dağıldığını gösteren **halka grafiktir** (`Doughnut` bileşeni). Backend tarafından `category_distribution` alanında dönen veriler doğrudan grafik için kullanılır. Her kategoriye ayrı bir renk atanmıştır:

- Lojistik: amber
- Teknik: gül kırmızısı (rose)
- Ödeme: zümrüt yeşili (emerald)
- İletişim: gök mavisi (sky)
- Ürün: mor (violet)
- İşlem: indigo

Halkanın merkezinde boşluk bırakılmıştır (`cutout: '65%'`); bu modern dashboard'larda yaygın bir tasarım tercihidir. Üzerine gelindiğinde her parça için "Lojistik: 8 şikayet" şeklinde bir bilgi balonu (tooltip) görüntülenir. Bu grafik, hangi kategorinin işletmeye en çok yük getirdiğini bir bakışta gösteren **karar destek aracı** niteliğindedir.

## 3.5.5. Marka Filtreleme Çipleri

Şikayet tablosunun üzerinde, **en çok şikayet alan altı markayı** çip (chip) biçiminde gösteren bir filtre satırı bulunmaktadır. Her çipin yanında parantez içinde toplam şikayet sayısı yer almaktadır (örnek: "Trendyol (5)").

Yönetici bir çipe tıkladığında, alttaki tablo yalnızca o markaya ait şikayetleri gösterecek şekilde **anında filtrelenir**. "Tümü" çipi ile filtre temizlenir. Bu özellik, yöneticinin tek bir markaya yoğunlaşıp o markaya özel bir analiz yapmasına olanak tanır. Filtreleme tamamen ön yüz tarafında, React state üzerinden çalışmakta; ek bir API çağrısı gerektirmemektedir.

## 3.5.6. CSV ile Veri Dışa Aktarımı

Yönetici panelinde "Tümünü İndir (CSV)" butonu ile mevcut şikayet listesinin **virgülle ayrılmış değerler (CSV)** dosyası olarak indirilebilmesi sağlanmıştır. Aşağıdaki sütunları içerir:

| Saat | Marka | Mesaj | Kategori | Duygu | Skor | İnsan Yardımı | Faydalı |
|---|---|---|---|---|---|---|---|

İndirme işlemi, `Blob` ve `URL.createObjectURL` API'leri kullanılarak doğrudan tarayıcıda gerçekleştirilir; sunucuya ek bir istek gönderilmesine gerek yoktur. Türkçe karakterlerin doğru görüntülenmesi için dosyanın başına **UTF-8 BOM** baytları eklenmiştir (`0xEF 0xBB 0xBF`). Bu işlem sayesinde Excel'de açıldığında Türkçe karakter kaymaları yaşanmaz.

CSV dışa aktarımı; işletmenin müşteri geri bildirim verilerini **Excel veya BI araçları** üzerinden ileri analizlere taşıyabilmesi için pratik bir köprü oluşturmaktadır.

## 3.5.7. Sesli Etkileşim Bileşenleri

### 3.5.7.1. Mikrofon Düğmesi (Sesli Giriş)

Sohbet penceresinin altındaki metin kutusunun yanında bir **mikrofon ikonu** yer almaktadır. Bu düğme yalnızca tarayıcının **Web Speech API** desteklediği durumlarda görünür; aksi takdirde gizlenir. Düğmeye basıldığında:

- Mikrofon erişim izni istenir.
- Kullanıcı konuşmaya başladığında düğme **kırmızıya döner ve nabız efekti** ile dinlemenin sürdüğü görsel olarak iletilir.
- Yazma kutusunun yer tutucusu "🎤 Dinleniyor… konuşun" şeklinde değişir.
- Konuşma bittikten sonra metin otomatik olarak yazma kutusuna eklenir; kullanıcı isterse düzenleyip gönderebilir veya doğrudan **Enter** ile yollayabilir.

### 3.5.7.2. Hoparlör Düğmesi (Sesli Çıkış)

Sohbet penceresinin başlık kısmında yer alan **hoparlör düğmesi**, bot yanıtlarının sesli okunup okunmayacağını kontrol eden bir geçiş düğmesidir (toggle). Düğme açıkken (cyan renkli "AÇIK" yazısı), her tamamlanmış bot mesajı `SpeechSynthesisUtterance` nesnesi ile sesli olarak okunur. Türkçe sesli okuma için tarayıcıdaki Türkçe ses motoru (örn. macOS'taki "Yelda") otomatik seçilir.

Akış sırasında parça parça gelen metinlerin yarım okunmaması için **`complete: true` bayrağı** kontrol edilmektedir. Yalnızca tamamlanmış mesajlar okunur; akış geçerken sessizlik korunur.

## 3.5.8. Karşılama (Welcome) Ekranı ve Hızlı İşlem Kartları

Sohbet penceresi ilk açıldığında kullanıcıyı **altı renkli kart** ile karşılayan bir öneri ekranı gelir. Her kart bir kullanım senaryosunu temsil eder:

- **Yeni Şikayet Yaz** (kalem ikonu)
- **Toplam Şikayet Sayısı** (grafik ikonu) — Function Calling örneği
- **İade Politikası** (refresh ikonu) — RAG örneği
- **Kargo & Teslimat** (iş akışı ikonu) — RAG örneği
- **Sistem Hakkında** (bilgi ikonu)
- **Sesli Konuşma** (mikrofon ikonu)

Karta tıklandığında ilgili soru otomatik olarak bot'a iletilir. Bu sayede kullanıcı sistemde hangi tür sorular sorabileceğini örnekler üzerinden öğrenir ve **boş ekran sendromu** ortadan kalkar.

Kartların her birinde küçük bir renk paleti ve hover efekti tanımlanmıştır; üzerine gelindiğinde kart hafifçe yukarı kalkar ve gölgelenir. Bu mikro animasyonlar; arayüzün hem profesyonel hem de canlı algılanmasını sağlamaktadır.

## 3.5.9. Yazıyor Göstergesi ve Mesaj Animasyonları

Bot bir cevabı hazırlarken kullanıcıya hareket halinde olduğunu bildirmek için ChatGPT ve mesajlaşma uygulamalarında yaygın olan **üç nokta yazıyor göstergesi** kullanılır. Üç küçük yuvarlak nokta sırayla yukarı-aşağı zıplayarak modelin yanıt ürettiğini iletir. Animasyon, Tailwind'in `animate-bounce` sınıfı ve CSS `animation-delay` özelliğiyle yapılmıştır.

Yeni mesajlar; **fade-in + slide-in-from-bottom** etkisiyle alt taraftan yukarı doğru kayarak ekrana girmektedir. Bu küçük dokunuş, yazışmanın akıcı ve canlı algılanmasını sağlar.

## 3.5.10. Bot Kimliği ve Avatar

Her bot mesajının solunda küçük yuvarlak bir **bot avatarı** görüntülenmektedir. Avatar, indigo'dan mora geçen bir gradient zemine sahip ve içinde bir robot silüeti bulundurmaktadır. Sohbet penceresinin üst başlığında ise daha büyük bir avatar, "AI Feedback Assistant" yazısı ve altında nabız efekti veren yeşil bir nokta ile **"Çevrimiçi"** durum bilgisi bulunmaktadır.

Bu görsel kararlar; botun bir **kimlik kazanmasını** ve kullanıcıya tutarlı bir karakter sunmasını sağlamaktadır. Tek tip metin balonları yerine kimlikli bir asistanla yazışma hissi, kullanıcı bağlılığını artıran bir UX kararıdır.
