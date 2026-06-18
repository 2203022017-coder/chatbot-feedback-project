# 3.6. Sistemin Kullanıcıya Sağladığı Yararlar

Geliştirilen yapay zeka destekli geri bildirim sistemi; son kullanıcılar (tüketiciler), işletme yöneticileri ve karar destek mekanizmaları açısından somut faydalar sağlamaktadır. Bu bölüm, her bir kullanıcı grubunun sistemden ne tür kazanımlar elde ettiğini ayrı başlıklar altında ele almaktadır.

## 3.6.1. Son Kullanıcı (Tüketici) Açısından Yararlar

### 7/24 Erişilebilir Destek

Sistem, gece-gündüz fark etmeksizin **24 saat ulaşılabilir** durumdadır. Geleneksel müşteri hizmetleri yalnızca mesai saatlerinde çalışırken, bot kullanıcının istediği saatte şikayetini iletebilmesine olanak tanır. Render altyapısının canlı tutulması (UptimeRobot ile her beş dakikada bir sorgulama) sayesinde sistemin uyumasından kaynaklanan başlangıç gecikmesi ortadan kaldırılmıştır.

### Anlık Cevap ve Sınıflandırma

Kullanıcı şikayetini yazdığı anda yapay zekanın **saniyeler içinde** yanıt verdiği, kullanıcının şikayetini hangi kategoriye konumlandırdığı ve hangi markaya yönlendirildiği görsel rozetlerle hemen iletilir. Bu hız ve şeffaflık, kullanıcıda "şikayetim bir yere ulaştı" hissi oluşturarak memnuniyeti artırır.

### Sesle Etkileşim İmkânı

Web Speech API entegrasyonu sayesinde kullanıcı; klavye kullanmak zorunda kalmadan **mikrofon aracılığıyla konuşarak** şikayetini iletebilir. Aynı şekilde bot yanıtlarının sesli okunması seçeneği, görme engelli kullanıcılar veya sürüş gibi durumlarda ekranı takip edemeyen kullanıcılar için **erişilebilirlik (accessibility)** sağlar. Raporun başlığındaki "konuşma tabanlı" ifadesi gerçek anlamıyla karşılanır.

### Marka Netliği

Sistem, kullanıcının yazdığı şikayet metninden ilgili **marka adını otomatik tespit eder** (örn. "Trendyol", "Migros", "Getir"). Bot, kullanıcıya hangi markaya ait politikaları aktardığını net bir şekilde belirtir. Marka belirtilmediğinde genel rehberlik yapar. Bu sayede kullanıcı, **politika karmaşası** yaşamaz; "doğru bilgiye doğru kaynaktan ulaştım" hissini elde eder.

### Bilgilendirici Politika Yanıtları

İade süreçleri, kargo süreleri, ödeme yöntemleri ve müşteri hakları gibi sıkça sorulan konularda bot; **şirket bilgi tabanından (RAG)** çıkardığı gerçek bilgileri kullanıcıya iletir. Uydurma cevaplar yerine doğrulanabilir ve tutarlı bilgi sunulması, kullanıcı güvenini artırır.

### İnsan Operatöre Şeffaf Yönlendirme

Yapay zekanın güven puanı belirli bir eşiğin altına düştüğünde (0.85), kullanıcı **"Şikayetiniz uzman temsilcimize yönlendirildi"** uyarısını alır. Böylece bot kapasitesinin sınırını gizlemez; kullanıcıya verilen söz somut bir aksiyona bağlanır. Bu **hibrit destek modeli**, kullanıcıyı tatmin etmeyen yanıtlardan korur.

### Geri Bildirim Verme Hakkı

Kullanıcı, bot yanıtının kalitesini her cevap sonrasında 👍 / 👎 düğmeleriyle değerlendirebilir. Bu sayede kullanıcı sistemin gelişimine doğrudan katkıda bulunur; sistem de bu verilerle kendini iyileştirmeye yön verir.

## 3.6.2. İşletme Yöneticisi Açısından Yararlar

### Gerçek Zamanlı Görünürlük

Yönetici paneli, her üç saniyede bir veritabanından son verileri çekerek **anlık dashboard** sunar. Yönetici; toplam şikayet sayısı, negatif duygu oranı, insan yardımı gereken vaka sayısı, müşteri memnuniyeti yüzdesi ve sistem doğruluğu gibi temel metrikleri tek bakışta görebilir.

### Marka Bazlı Analiz

Sistem, en çok şikayet alan markaları otomatik gruplayıp **filtre çipleri** halinde sunar. Yönetici, tek tıkla seçtiği markaya özel şikayetleri inceleyebilir. Bu özellik, çok markalı bir ortamda **marka bazlı sorun yoğunluğunu** hızlıca tespit etmeyi sağlar; iyileştirme önceliklerinin belirlenmesinde önemli bir karar destek aracıdır.

### Kategori Dağılımı Görselleştirmesi

Halka grafik (donut chart) ile şikayetlerin altı kategoriye (Lojistik, Teknik, Ödeme, İletişim, Ürün, İşlem) nasıl dağıldığı gözlemlenebilir. Yönetici "lojistik şikayetleri arttı" gibi bir trendi anında fark edebilir ve operasyonel iyileştirme planlayabilir.

### CSV ile Dışa Aktarım

Veriler tek tıkla **CSV formatında dışa aktarılabilmektedir**. Yönetici, bu dosyayı Excel'de açarak ya da kurumsal iş zekâsı (BI) araçlarına aktararak ileri düzey analizler yapabilir. CSV dosyası UTF-8 BOM ile başladığı için Türkçe karakter sorunları yaşanmamaktadır.

### Hibrit Destek Otomasyonu

Bot'un güven düşüklüğü tespit ettiği vakalar **"İnsan Yardımı Gerekenler"** olarak otomatik işaretlenir ve sarı vurguyla tablo üzerinde belirir. Bu sayede yönetici; insan operatörlerin önceliklendireceği vakaları manuel olarak ayıklamak zorunda kalmaz.

### Sistem Doğruluğunun Şeffaf Sunumu

Vize raporundaki sabit "%95 sistem doğruluğu" sayısı, finalde **ölçülmüş gerçek bir değere** dönüştürülmüştür. Yönetici paneli, 24 örnekli etiketli test seti üzerinde çalıştırılan ölçüm scriptinin sonucunu gerçek zamanlı gösterir. Bu yaklaşım; **ölçülmeyen bir sistem yönetilemez** ilkesine uygun olarak yöneticiye somut performans verisi sunar.

## 3.6.3. Geliştirici ve Bakım Açısından Yararlar

### Modüler Mimari

Sistem; ön yüz, arka yüz, yapay zeka servisleri ve veritabanı katmanlarına net biçimde ayrılmıştır. Bir katmanda değişiklik yapıldığında diğer katmanlar etkilenmez. Örneğin Llama yerine başka bir model entegre etmek istendiğinde sadece backend tarafındaki Groq SDK çağrısı değiştirilir; ön yüzde hiçbir değişiklik gerekmez.

### Sürüm Kontrolü ve Otomatik Dağıtım

Tüm kaynak kod GitHub deposunda tutulmakta; **Vercel** ön yüz dağıtımını, **Render** ise arka yüz dağıtımını her `git push` sonrası otomatik olarak gerçekleştirmektedir. Bu CI/CD (Continuous Integration / Continuous Deployment) yaklaşımı, geliştirici hatalarını hızlı tespit etmeyi ve düzeltmeyi mümkün kılar.

### Tip Güvenliği ve Bakım Kolaylığı

TypeScript ile yazılmış olan kod, derleme zamanında tip uyumsuzluklarını yakalar. Prisma şemasından otomatik türetilen tipler sayesinde veritabanı sorgularında alan adı yanılgıları engellenir. Bu, yeni geliştiricilerin koda dahil olmasını ve mevcut kodun bakımını kolaylaştırır.

### Ölçüm Tekrarlanabilirliği

Doğruluk ölçüm scripti (`npm run measure`), test verisi değişse veya model güncellense bile **aynı şekilde** çalıştırılabilir. Bu sayede sistemin zaman içindeki başarı eğilimi izlenebilir; akademik raporlamada **tekrarlanabilir bilim** ilkesine uygun bir uygulama sunulmuş olur.

### Açık Kaynak ve Maliyet Bilinci

Kullanılan tüm teknolojiler (Node.js, Express, React, Next.js, Tailwind, Prisma, PostgreSQL) açık kaynaktır. Yapay zeka modeli olarak tercih edilen Llama da Meta tarafından açık ağırlıklı olarak yayımlanmıştır. Groq'un ücretsiz API katmanı, Render ve Vercel'in ücretsiz dağıtım katmanları sayesinde sistem; sıfıra yakın işletme maliyetiyle bir öğrenci projesi olarak ayakta tutulabilmektedir.

## 3.6.4. Akademik Katkı ve Eğitsel Yararlar

Bu çalışma, akademik açıdan da kazanımlar sunmaktadır:

- **Uygulamalı yapay zeka entegrasyonu:** Büyük dil modellerinin gerçek bir kullanıcı senaryosunda nasıl entegre edileceğine dair somut bir örnek üretmiştir.
- **Karşılaştırmalı doğruluk ölçümü:** Sistemin vize aşamasındaki simülasyonu ile final aşamasındaki ölçülmüş gerçek doğruluğu kıyaslanarak; yapay zeka projelerinde **vaat ile teslimat arasındaki farkın** nasıl bilimsel yöntemlerle kapatılacağı gösterilmiştir.
- **RAG ve Function Calling demonstrasyonu:** 2024-2025 döneminin önemli yapay zeka mimarileri olan RAG (Retrieval-Augmented Generation) ve Function Calling (araç çağrısı) yaklaşımları, sınırlı kapsam içerisinde bile uygulanabilir hale getirilmiştir.
- **Hibrit insan-makine ekosistemi:** Literatürdeki [Jain & Kumar 2019; Følstad & Brandtzæg 2018] hibrit destek önerileri pratik bir uygulamayla karşılanmıştır; güven temelli otomatik yönlendirme mekanizması bu önerinin somut karşılığıdır.

Sonuç olarak; geliştirilen sistem yalnızca bir bitirme projesi olmanın ötesinde, son kullanıcılar için **kullanışlı**, işletmeler için **veri odaklı** ve geliştiriciler için **sürdürülebilir** bir yapay zeka destekli müşteri geri bildirim platformu örneği sunmaktadır.
