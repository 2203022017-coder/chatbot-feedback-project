# Güncellenmiş Özet, Sonuç ve Kaynakça

Bu dosya; vize raporunun "ÖZ", "SONUÇ" ve "KAYNAKÇA" bölümlerinin **final aşamasındaki son hâline** uygun olarak güncellenmesi için hazırlanmıştır. Mevcut metinler tamamen değiştirilebilir.

---

## 1. Güncellenmiş ÖZ (Abstract)

**YAPAY ZEKA DESTEKLİ MÜŞTERİ GERİ BİLDİRİMLERİNİN ANALİZİ İÇİN KONUŞMA TABANLI BİR CHATBOT SİSTEMİ**

Günümüzde işletmeler, müşteri taleplerini ve geri bildirimlerini hızlı, etkili ve veriye dayalı bir biçimde yönetme ihtiyacı duymaktadır. Bu projede, işletmelerin müşteri geri bildirimlerini sistematik bir biçimde toplayıp analiz edebilmesini sağlayan **yapay zeka destekli, konuşma tabanlı bir chatbot platformu** geliştirilmiştir.

Geliştirilen sistemde **Node.js ve TypeScript** ile web tabanlı bir arka yüz; **Next.js ve React** ile modern bir kullanıcı arayüzü kurulmuştur. Yapay zeka tarafında, Groq LPU altyapısı üzerinden çağrılan **Meta Llama 3.3-70B** modeli şikayet metinlerinin duygu durumunu ve kategorisini sınıflandırırken, **Llama 3.1-8B** modeli akıcı sohbet için kullanılmıştır. Kullanıcı-bot etkileşimleri **Server-Sent Events** üzerinden gerçek zamanlı akış halinde sunulmakta; sohbet hafızası sayesinde çok-turlu diyaloglar desteklenmektedir.

Şirkete özel politika bilgileri (iade, kargo, KVKK vb.) **Retrieval-Augmented Generation (RAG)** yaklaşımı ile sistem yönergesine eklenmiş; böylece bot uydurma yapmadan kurumsal politikalara uygun yanıt vermektedir. Ayrıca **fonksiyon çağırma (Function Calling)** yöntemi ile bot, kullanıcıların istatistiksel sorularını veritabanından çektiği gerçek verilerle yanıtlamaktadır. **Web Speech API** entegrasyonu sayesinde kullanıcılar sesli olarak da iletişim kurabilmektedir.

Sistem; **PostgreSQL** ilişkisel veritabanı ve **Prisma ORM** ile kalıcı veri saklama, **Render** ve **Vercel** üzerinden bulut dağıtımı, **UptimeRobot** ile sürekli erişilebilirlik gibi üretim seviyesi pratiklerle güçlendirilmiştir. Hibrit destek mekanizması, modelin güven puanı eşik değerinin altına düştüğünde şikayeti otomatik olarak insan operatöre yönlendirmektedir.

Vize aşamasında simüle edilen yapay zeka süreci, **24 örneklik etiketli test seti** üzerinde ölçülmüş; kategori sınıflandırma doğruluğu **%50'den %92'ye**, duygu analizi doğruluğu **%96'dan %100'e**, genel doğruluk **%50'den %88'e** yükselmiştir. Yönetici paneli; gerçek zamanlı grafikler, marka bazlı filtreleme, kullanıcı memnuniyet oranı ve CSV ile veri dışa aktarımı gibi karar destek araçlarını içermektedir.

Sonuç olarak; geliştirilen platform, modern büyük dil modellerini gerçek bir kullanıcı senaryosuna entegre eden, ölçülmüş başarı oranlarıyla desteklenen ve üretim ortamında çalışan bütünleşik bir sistem olarak sunulmaktadır.

---

## 2. Güncellenmiş SONUÇ

Bu çalışmada, işletmelerin müşteri geri bildirimlerini daha etkin biçimde toplayıp analiz edebilmesi amacıyla yapay zeka destekli, konuşma tabanlı bir chatbot platformu tasarlanmış ve hem yerel hem bulut ortamında çalışır hâle getirilmiştir. Dijital müşteri etkileşimlerinin artmasıyla ortaya çıkan veri yoğunluğu, geleneksel analiz yöntemlerinin yetersiz kalmasına yol açmaktadır; bu çalışmada geliştirilen sistem; müşteri geri bildirimlerinin merkezi, düzenli ve analiz edilebilir bir yapı altında ele alınmasını sağlayan kapsamlı bir çözüm sunmaktadır.

Vize aşamasında öngörülen birçok özelliğin **gerçek uygulamaya** dönüştürülmesi, finalin önemli kazanımıdır. Simüle edilen NLP süreci, Groq + Llama 3.3-70B modeli ile gerçek bir doğal dil işleme servisine dönüştürülmüş; konuşma hafızası ve **Server-Sent Events** tabanlı akıcı yanıt akışı eklenerek tek-turlu analiz aracından çok-turlu konuşma asistanına evrilmiştir. Yapay zekanın doğruluğu, 24 örneklik etiketli bir test seti üzerinde ölçülmüş ve sonuçlar **karışıklık matrisi (confusion matrix)** ile birlikte yönetici panelinde gerçek zamanlı olarak sunulmuştur. Kategori sınıflandırma doğruluğunun %50'den %92'ye, genel doğruluğun %50'den %88'e yükselmesi; sistem prompt mühendisliği ve model seçimi gibi yaklaşımların etkisini somut biçimde ortaya koymaktadır.

Çalışma süresince sisteme entegre edilen ek yetenekler şu başlıklar altında özetlenebilir: **Retrieval-Augmented Generation (RAG)** ile şirkete özel bilgi tabanı; **Function Calling** ile veritabanı sorgularına dayalı akıllı ajan davranışı; **hibrit destek mekanizması** ile düşük güvenli vakaların otomatik olarak insan operatöre yönlendirilmesi; **sesli giriş/çıkış** ile erişilebilirlik; **marka tespiti ve filtreleme** ile çok markalı analiz; **memnuniyet anketi** ile kullanıcıdan geri bildirim toplama. Bu özelliklerin tümü; literatürde ifade edilen "yapay zeka destekli, hibrit ve veriye dayalı müşteri destek sistemleri" önerilerinin somut bir uygulaması niteliğindedir.

Veri katmanında **Prisma ORM** ile **PostgreSQL** ilişkisel veritabanı kullanılmış; bu sayede geri bildirimlerin kalıcı saklanması ve sistemin yeniden başlatılması durumunda veri kaybı yaşanmaması sağlanmıştır. Veritabanı bağlantısı kopsa dahi **bellek içi yedek mekanizma (graceful degradation)** sayesinde sistem çalışmaya devam etmektedir. Ön yüz Vercel'e, arka yüz Render'a dağıtılmış; UptimeRobot servisi ile sürekli erişilebilirlik sağlanmıştır.

Geliştirilen sistem; yalnızca bir öğrenci projesi olarak değil, üretim ortamında çalışabilen bir prototip olarak son kullanıcılar için **anlık ve erişilebilir**, işletmeler için **veri odaklı ve marka bazlı**, geliştiriciler için **sürdürülebilir ve genişletilebilir** bir platform sunmaktadır. Bu nitelikleri ile, dijital müşteri destek süreçlerinin daha akıllı, ölçülebilir ve sürdürülebilir hâle getirilmesine somut bir katkı sağlamaktadır.

İlerleyen çalışmalarda; vektör tabanlı semantik arama (pgvector ile), **JWT/OAuth tabanlı yönetici kimlik doğrulaması**, çoklu dil desteği, daha geniş bir etiketli test setiyle doğruluk yeniden ölçümü, fine-tuning veya model damıtma yoluyla maliyet optimizasyonu ve farklı sektörlere uyarlanabilirlik incelenebilir. Geliştirilen mimari, tüm bu genişlemelere açık esnek bir altyapı sunmaktadır.

---

## 3. Güncellenmiş KAYNAKÇA

Aşağıdaki kaynakça, vize raporundaki referansları korumakla birlikte, final aşamasında entegre edilen yeni teknolojiler için ek referansları içerir.

**[1] Adamopoulou, A., & Moussiades, M. (2020).**
Customer service chatbots: A systematic literature review. *Artificial Intelligence Applications and Innovations*, Springer.
https://link.springer.com/chapter/10.1007/978-3-030-49161-1_2

**[2] Brandtzaeg, J. B., & Følstad, A. (2017).**
An empirical study of customer satisfaction with chatbots. *Proceedings of the International Conference on Human-Computer Interaction*.
https://dl.acm.org/doi/10.1145/3025453.3025496

**[3] Jain, S., & Kumar, A. (2019).**
Conversational agents in customer support: A practical review. *IEEE Access*.
https://ieeexplore.ieee.org/document/8642736

**[4] Liu, B., & Zhang, L. (2018).**
Sentiment analysis of customer feedback in online platforms. *Journal of Information Science*.
https://journals.sagepub.com/doi/10.1177/0165551517747287

**[5] Kowsari, M., Brown, D. E., Heidarysafa, M., Meimandi, K. J., Gerber, M. S., & Barnes, L. E. (2019).**
Text classification techniques: A literature review. *ACM Computing Surveys*.
https://dl.acm.org/doi/10.1145/3290616

**[6] Dale, R. (2016).**
Measuring the effectiveness of chatbots in customer support. *Natural Language Engineering*, Cambridge University Press.
https://www.cambridge.org/core/journals/natural-language-engineering/article

**[7] Følstad, T., & Brandtzæg, P. B. (2018).**
Conversational systems for business process support. *Human–Computer Interaction Journal*.
https://www.tandfonline.com/doi/full/10.1080/07370024.2018.1452734

**[8] Zhao, T., & Liu, M. (2024).**
Large Language Models in Customer Service Chatbots. *IEEE Access*.
https://ieeexplore.ieee.org/

**[9] Singh, R., & Patel, A. (2025).**
AI-Based Conversational Systems for Customer Feedback Analysis. *Journal of Intelligent Information Systems*.
https://link.springer.com/

**[10] W3Schools. (2025).**
HTML, CSS, and JavaScript Documentation. Web Technologies Reference.
https://www.w3schools.com/

**[11] Vercel. (2025).**
Next.js Official Documentation. React Framework for the Web.
https://nextjs.org/docs

**[12] Tailwind Labs. (2025).**
Tailwind CSS Documentation. Utility-First CSS Framework.
https://tailwindcss.com/docs

**[13] FastAPI. (2025).**
FastAPI Documentation. High-performance web framework for building APIs with Python.
https://fastapi.tiangolo.com/

---

### Final Aşamasında Eklenen Yeni Referanslar

**[14] Touvron, H., et al. (2023, 2024).**
Llama: Open and efficient foundation language models / Llama 3 / Llama 3.3 model documentation. *Meta AI Research*.
https://ai.meta.com/llama/

**[15] Lewis, P., Perez, E., Piktus, A., et al. (2020).**
Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *Advances in Neural Information Processing Systems (NeurIPS)*.
https://arxiv.org/abs/2005.11401

**[16] Vaswani, A., Shazeer, N., Parmar, N., et al. (2017).**
Attention Is All You Need. *Advances in Neural Information Processing Systems (NeurIPS)*.
https://arxiv.org/abs/1706.03762

**[17] Groq, Inc. (2025).**
Groq API Documentation. LPU Inference Engine for Large Language Models.
https://console.groq.com/docs

**[18] Prisma Labs. (2025).**
Prisma ORM Documentation. Type-safe database access for Node.js & TypeScript.
https://www.prisma.io/docs

**[19] Render Cloud Services. (2025).**
Render PostgreSQL & Web Services Documentation.
https://render.com/docs

**[20] OpenAI. (2024).**
Function Calling and Tool Use Documentation. Reference implementation for structured AI tool invocation.
https://platform.openai.com/docs/guides/function-calling

**[21] Mozilla Developer Network. (2025).**
Web Speech API: SpeechRecognition and SpeechSynthesis Interfaces.
https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

**[22] Vercel Edge. (2025).**
Server-Sent Events (SSE) — Real-time Streaming Documentation.
https://vercel.com/docs

**[23] UptimeRobot. (2025).**
Uptime Monitoring Documentation. Continuous endpoint pinging.
https://uptimerobot.com/

**[24] Anthropic. (2024).**
Claude — AI Assistant Documentation. Bu çalışmanın geliştirme sürecinde kod yazımı, hata analizi, sistem mimarisi kararları ve rapor düzenlemesi gibi alanlarda destekleyici bir araç olarak kullanılmıştır.
https://www.anthropic.com/claude

---

## 4. Kaynakça Hakkında Akademik Not

Anthropic'in geliştirdiği **Claude** isimli yapay zeka asistanı, bu projenin geliştirme sürecinde **destekleyici bir araç olarak** kullanılmıştır. Asistanın kullanımı; kod örnekleri üretme, hata ayıklama, sistem mimarisi tartışmaları ve raporun bazı bölümlerinin organize edilmesi ile sınırlı kalmıştır. Tüm tasarım kararları, model seçimleri, mimari tercihleri ve nihai uygulama; bu raporun yazarı tarafından alınmış ve uygulanmıştır. Bu durum akademik şeffaflık ilkesi gereği belirtilmiştir.
