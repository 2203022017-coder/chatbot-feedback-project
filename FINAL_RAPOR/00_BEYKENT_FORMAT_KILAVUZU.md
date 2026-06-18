# Final Rapor — Beykent Tez Formatı Kılavuzu ve Dosya İndeksi

Bu dosya; hazırlanan tüm yeni bölümleri Word dosyana sorunsuz biçimde aktarman için pratik bir rehberdir. Hocanın geri bildiriminde belirttiği layout (sayfa kayması, sayfa numarası, şekil numarası) problemleri için Word'de uygulayacağın adımları içerir.

---

## 1. Dosya Yapısı ve Eklenme Sırası

`/Users/sude/Desktop/chatbot-feedback-project/FINAL_RAPOR/` klasöründe sırayla aşağıdaki markdown dosyaları hazırlandı. Her birini Word'e kopyalarken vize raporunda hangi bölümün yerine geleceği parantez içinde belirtilmiştir.

| Dosya | İçerik | Word'de Yerleştirme Yeri |
|---|---|---|
| `09_sonuc_ozet_kaynakca.md` | Güncellenmiş **ÖZ** | Vize'deki ÖZ bölümünün YERİNE |
| `03_api_detayli.md` | **REST API uç noktaları (3.3.1)** detaylı bölüm | Mevcut "3.3 Yapay Zeka Entegrasyonu" bölümünden SONRA |
| `04_veritabani.md` | **Veritabanı Tasarımı (3.4)** | Mevcut "1.4 Veritabanı Tasarımı" bölümünün YERİNE |
| `06_ui_bilesenleri.md` | **Kullanıcı Arayüzü Bileşenleri (3.5)** | Mevcut "1.5 Yönetici Paneli" bölümünden ÖNCE |
| `07_kullaniciya_yarari.md` | **Sistemin Kullanıcıya Sağladığı Yararlar (3.6)** | "1.5 Yönetici Paneli"nden SONRA |
| `05_bolum_kod_analizi.md` | **5. UYGULAMA KODLARININ DETAYLI ANALİZİ** (yeni 5. bölüm) | "TEST, DEĞERLENDİRME VE BULGULAR" bölümünden SONRA, SONUÇ'tan ÖNCE |
| `09_sonuc_ozet_kaynakca.md` | Güncellenmiş **SONUÇ** | Vize'deki SONUÇ bölümünün YERİNE |
| `08_sekil_aciklamalari.md` | **Şekil caption'ları** | Şekil/SS bulunan her yere açıklama metni olarak |
| `09_sonuc_ozet_kaynakca.md` | Güncellenmiş **KAYNAKÇA** | Vize'deki KAYNAKÇA bölümünün YERİNE |

---

## 2. Beykent Üniversitesi Tez Format Standartları

Aşağıdaki Word ayarları **Beykent Üniversitesi Mühendislik Fakültesi tez kılavuzuna** göredir. Dosyana uygula:

### 2.1. Sayfa Düzeni (Page Layout)

- **Sayfa boyutu:** A4
- **Kenar boşlukları:**
  - Sol: **4 cm** (cilt için)
  - Sağ: **2 cm**
  - Üst: **3 cm**
  - Alt: **3 cm**
- Word'de: `Layout` (Düzen) sekmesi → `Margins` → `Custom Margins`

### 2.2. Yazı Tipi ve Aralıklar

- **Yazı tipi:** Times New Roman (tüm metin için)
- **Punto:**
  - Ana metin: **12 pt**
  - Başlıklar: Bölüm başlıkları 14 pt bold, alt başlıklar 12 pt bold
  - Şekil/tablo caption'ları: 10 pt italic
  - Dipnotlar: 10 pt
- **Satır aralığı:** **1.5**
- **Paragraf girintisi:** Yok (girinti kullanılmaz), paragraflar arası 6 pt boşluk

### 2.3. Hizalama

- Ana metin: **İki yana yasla** (Justify)
- Başlıklar: **Sola yasla** (Left)
- Şekil ve tablo: **Ortala** (Center)
- Caption: **Ortala**, italic

### 2.4. Sayfa Numaralandırma (Bu HOCANIN ① ② NOTUNUN ÇÖZÜMÜ)

Beykent formatında iki farklı numaralandırma sistemi vardır:

**Ön sayfalar (Yemin Metni → İçindekiler → Şekiller Listesi → Kısaltmalar → Sözlük):**
- Roma rakamı: **i, ii, iii, iv, v...**
- Sayfa altında ortalanmış

**Ana metin (Giriş'ten itibaren):**
- Arap rakamı: **1, 2, 3...**
- Sayfa altında ortalanmış
- Giriş = sayfa **1** olarak yeniden başlar

**Word'de bunu nasıl ayarlarsın:**

1. İçindekiler'in son sayfasının sonuna git.
2. `Layout` → `Breaks` → `Next Page` (bölüm sonu ekle)
3. İmleci yeni sayfaya götür (Giriş başlıyor).
4. Aşağı çift tıkla → `Footer` (alt bilgi) açılır.
5. **"Link to Previous"** seçeneğini KAPAT (çok kritik, bu adımı atlarsan numaralandırma kaymaya devam eder).
6. `Insert` → `Page Number` → `Format Page Numbers` → "Start at: 1" seç.
7. Aynı işlemi ön sayfalar için Roman rakamı (i, ii, iii) ile tekrarla.

> **Hocanın notundaki "Giriş kaymış / Sayfa sayıları kaymış" probleminin asıl çözümü:** Bölüm sonları (Section Breaks) ile farklı sayfa numarası formatları belirlemek. Eğer tek bir uzun belge varsa ve "Link to Previous" açıksa sayfa numaraları kayar.

### 2.5. Başlık Stilleri (Heading Styles)

Word'de **Stilleri kullanmak** kritik — sonradan içindekiler tablosu otomatik oluşur ve sayfa numaraları otomatik güncellenir.

- **Heading 1 (Bölüm başlığı):** TIMES NEW ROMAN 14 pt BOLD BÜYÜK HARF, sola yasla, üstünde 18 pt boşluk
- **Heading 2 (Alt başlık):** Times New Roman 12 pt Bold, sola yasla, üstünde 12 pt boşluk
- **Heading 3 (Üçüncü düzey):** Times New Roman 12 pt Bold italic, sola yasla

**Stil uygulamak için:** Başlığı seç → üstteki "Styles" panelinden "Heading 1" veya "Heading 2"ye tıkla.

### 2.6. İçindekiler Tablosu (TOC) Otomatik Oluşturma

Tüm başlıkları doğru stil ile işaretledikten sonra:

1. İmleci içindekiler tablosunun olacağı sayfaya götür.
2. `References` (Referanslar) → `Table of Contents` → bir şablon seç.
3. **Sayfa numaraları otomatik gelecek.**
4. Daha sonra içerik değişirse: TOC'a sağ tıkla → `Update Field` → `Update entire table`.

Bu sayede hoca *"içindekilerdeki sayfa numaraları yanlış"* demez.

### 2.7. Şekil ve Tablo Numaralandırması (HOCANIN ④ NOTUNUN ÇÖZÜMÜ)

Şekil/tablo eklerken **Caption özelliğini kullan:**

1. Şekli ekle (Insert → Picture).
2. Şekle sağ tıkla → `Insert Caption`.
3. Label: `Şekil`, Position: `Below selected item`.
4. Numara otomatik atanır (Şekil 1, Şekil 2, …).
5. Yeni şekil eklediğinde tüm numaralar otomatik güncellenir.

Bu yöntemle hocanın *"Şekil sayılarını gözden geçir"* notu otomatik çözülür.

### 2.8. Kod Blokları İçin Tavsiye

Final raporundaki kod örnekleri için **Consolas veya Courier New 10 pt** yazı tipi kullan; arka planı açık gri (#F5F5F5) yap, sınır çizgisi ekle. Kod blokları **iki yana yaslanmamalı**, sola yaslı olmalı.

---

## 3. Hocanın Madde Madde Notlarına Karşılık

| # | Hocanın Notu | Çözüm |
|---|---|---|
| 1 | Giriş kaymış | Section break + sayfa numaralandırma ayrı (bkz. 2.4) |
| 2 | Sayfa sayıları başlık kısmı kaymış | Aynı çözüm + TOC'u manuel yerine otomatik yap (bkz. 2.6) |
| 3 | Kayan kısımları düzelt | Tüm başlıklara Heading stillerini uygula (bkz. 2.5) |
| 4 | Şekil sayılarını gözden geçir | Caption özelliği kullan, otomatik numaralandır (bkz. 2.7) |
| 5 | 5. Bölüm "Kod açıklaması" aç | `05_bolum_kod_analizi.md` dosyası hazır |
| 6 | API detaylı anlat | `03_api_detayli.md` dosyası hazır |
| 7 | Kullanıcıya yararı detaylı | `07_kullaniciya_yarari.md` dosyası hazır |
| 8 | Belge yükleme kısmı hata almasın | `06_ui_bilesenleri.md` Bölüm 3.5.3'te açıklandı |
| 9 | Claude'u not et | `09_sonuc_ozet_kaynakca.md` referans [24] olarak eklendi |
| 10 | Bot oynatılabiliyor, bu teknolojiyi açıkla | `06_ui_bilesenleri.md` Bölüm 3.5.1'de framer-motion drag açıklandı |
| 11 | Veritabanı ismi, neden tercih, avantajları | `04_veritabani.md` dosyası hazır |
| 12 | Kullanıcı giriş ekranı | `06_ui_bilesenleri.md` Bölüm 3.5.2'de admin login modal açıklandı |
| 13 | SS'lerin altına not düş | `08_sekil_aciklamalari.md` tüm şekiller için caption hazır |
| 14 | Grafikler ve dosya yükleme | `06_ui_bilesenleri.md` Bölüm 3.5.4, 3.5.6 ve 3.5.3'te açıklandı |
| 15 | Sonuç kısmını sunuma ekle | `09_sonuc_ozet_kaynakca.md`'deki SONUÇ kullanıma hazır; sunum dosyası ayrıca hazırlanacak |
| 16 | Kaynakçayı düzenle | `09_sonuc_ozet_kaynakca.md` güncellenmiş kaynakça (24 madde) |

---

## 4. Çalışma Akışı Önerisi

Aşağıdaki sırayı takip ederek finalini hazırla:

1. **Vize Word dosyasının yedeğini al** (`ödev_final_yedek.docx` gibi).
2. Önce **ÖZ** bölümünü güncelle (`09_sonuc_ozet_kaynakca.md`'den kopyala).
3. **Teknik Altyapı** bölümünde PostgreSQL, Llama 3.3, Prisma, Web Speech API gibi yeni teknolojilerden bahset (bu dosyada da geçiyor, doğrudan kullanabilirsin).
4. **Veritabanı Tasarımı** bölümünü `04_veritabani.md` ile değiştir.
5. **REST API** bölümüne `03_api_detayli.md` içeriğini ekle.
6. **Kullanıcı Arayüzü** bölümüne `06_ui_bilesenleri.md` içeriğini ekle.
7. **Kullanıcıya Yararı** bölümünü ekle (`07_kullaniciya_yarari.md`).
8. **Test, Değerlendirme ve Bulgular**'ın sonuna confusion matrix sonuçlarını yansıt (kategori %92, sentiment %100).
9. Yeni bölüm: **5. UYGULAMA KODLARININ DETAYLI ANALİZİ** (`05_bolum_kod_analizi.md`'yi olduğu gibi yapıştır).
10. **SONUÇ** bölümünü güncelle.
11. **Şekiller Listesi**'ne yeni şekilleri ekle, her birinin altına `08_sekil_aciklamalari.md`'den caption yapıştır.
12. **Kaynakça**'yı güncelle.
13. **Sayfa numaralarını ve TOC'u son adım olarak güncelle** (Bkz. 2.4 ve 2.6).
14. PDF'e dönüştür ve sayfa düzenini kontrol et.

---

## 5. Sunum İçin (Madde 15)

Hocanın *"Sonuç kısmını sunuma ekle"* notu için, sunum dosyası ayrı bir oturumda hazırlanacaktır. Önerilen yapı:

- Slayt 1: Proje başlığı + öğrenci bilgisi
- Slayt 2: Problem ve motivasyon
- Slayt 3: Vize → Final değişim özeti (%50 → %88 doğruluk)
- Slayt 4: Sistem mimarisi (Şekil 1)
- Slayt 5-6: Demo akışı görselleri
- Slayt 7-8: Yapay zeka katmanı (Llama, RAG, Function Calling)
- Slayt 9: Yönetici paneli (donut chart, marka filtresi)
- Slayt 10: Hibrit destek
- Slayt 11: Sesli giriş/çıkış
- Slayt 12: Doğruluk ölçüm sonuçları (confusion matrix)
- Slayt 13: SONUÇ (rapor'daki sonuç bölümünden özet)
- Slayt 14: Gelecek çalışmalar
- Slayt 15: Teşekkür / Soru-cevap

Bu yapı için ayrı bir `.pptx` dosyası ileri bir oturumda hazırlanacaktır.

---

## 6. Hızlı Kontrol Listesi (Final Teslim Öncesi)

- [ ] Tüm başlıklar Heading stillerinde mi?
- [ ] İçindekiler tablosu otomatik mi? (Update Field çalıştırıldı mı?)
- [ ] Sayfa numaraları ön sayfalar Roma, ana metin Arap olarak ayrı mı?
- [ ] Tüm şekiller Caption özelliğiyle eklenmiş mi?
- [ ] Şekiller Listesi otomatik güncellendi mi?
- [ ] Kaynakça en güncel hâlinde mi (24 madde)?
- [ ] ÖZ ve SONUÇ bölümleri güncellendi mi?
- [ ] Yeni 5. Bölüm eklendi mi?
- [ ] PDF çıktısında sayfa kaymaları yok mu?
- [ ] Yazı tipi (Times New Roman 12 pt) tutarlı mı?
- [ ] Satır aralığı (1.5) her yerde aynı mı?

Bu listeyi onayladıktan sonra rapor teslime hazır olacaktır.
