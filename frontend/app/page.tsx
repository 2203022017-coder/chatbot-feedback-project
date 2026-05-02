"use client";

import React, { useState, useEffect, useRef } from "react";
import FileUploader from "@/components/ui/file-uploader"; 
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { 
Chart as ChartJS, 
CategoryScale, 
LinearScale, 
PointElement, 
LineElement, 
Title, 
Tooltip, 
Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- BACKEND API ADRESİ ---
// Lokalde çalışırken otomatik olarak localhost:3001'e, deploy edilmiş sürümde Render'a yönlendirir.
// Böylece "npm run dev" ile lokal test yaparken kod değiştirmeye gerek kalmaz.
const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://feedback-backend-k680.onrender.com";

// --- GÜVENLİ SVG İKONLAR ---
const IconZap = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const IconArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconChat = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

// --- DAİRESEL ANALİZ GRAFİĞİ BİLEŞENİ ---
const AnalysisCircle = ({ percent, label, dark = false }: { percent: number, label: string, dark?: boolean }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn("relative w-28 h-28 flex items-center justify-center rounded-full shadow-inner border", dark ? "bg-white/5 border-white/10" : "bg-white/50 border-black/5")}>
        <svg className="w-full h-full -rotate-90">
          <circle cx="56" cy="56" r={radius} stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="8" fill="transparent" />
          <circle cx="56" cy="56" r={radius} stroke={dark ? "#22d3ee" : "#4f46e5"} strokeWidth="8" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset }} strokeLinecap="round" />
        </svg>
        <span className={cn("absolute text-lg font-black", dark ? "text-white" : "text-zinc-950")}>%{percent}</span>
      </div>
      <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", dark ? "text-zinc-400" : "text-zinc-800")}>{label}</span>
    </div>
  );
};
  // --- CANLI YÖNETİCİ PANELİ (ADMIN DASHBOARD) BİLEŞENİ ---
  const AdminDashboard = ({ onExit }: { onExit: () => void }) => {
  const [dashboardStats, setDashboardStats] = useState({
    total_feedbacks: 0,
    resolved_tickets: 0,
    negative_ratio: "0",
    recent_feedbacks: []
  });

  // Doğruluk ölçüm sonuçları — backend/data/accuracy_results.json'dan okunur.
  // 'npm run measure' çalıştırılınca dolar; çalıştırılmamışsa measured=false kalır.
  const [accuracyData, setAccuracyData] = useState<{
    measured: boolean;
    overall_accuracy_pct?: number;
    category_accuracy_pct?: number;
    sentiment_accuracy_pct?: number;
    total_samples?: number;
  }>({ measured: false });

  // --- CSV İNDİRME FONKSİYONU (DÜZELTİLDİ) ---
  const downloadCSV = () => {
    if (!dashboardStats.recent_feedbacks || dashboardStats.recent_feedbacks.length === 0) {
      alert("İndirilecek veri bulunamadı!");
      return;
    }

    const headers = ["Saat", "Mesaj", "Kategori", "Duygu", "Skor"];
    const rows = dashboardStats.recent_feedbacks.map((f: any) => [
      f.date,
      `"${f.text.replace(/"/g, '""')}"`, 
      f.category,
      f.sentiment,
      `%${(f.score * 100).toFixed(0)}`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AI_Analiz_Raporu.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CANLI VERİ ÇEKME ---
  useEffect(() => {
    const fetchStats = () => {
      fetch(`${API_URL}/api/admin/dashboard-stats`)
        .then(res => res.json())
        .then(data => {
  if (data && typeof data.total_feedbacks !== 'undefined') {
    setDashboardStats(prevStats => {
      // SADECE sayı bir öncekinden büyükse uyarı ver
      if (data.total_feedbacks > prevStats.total_feedbacks) {
        const latest = data.recent_feedbacks[0];
        if (latest.sentiment === 'Negative') {
          // Sayfanın kitlenmemesi için uyarıyı saliseler sonra çıkarıyoruz
          setTimeout(() => {
            alert(`🚨 DİKKAT: ${latest.category} biriminde negatif bir geri bildirim saptandı!`);
          }, 100);
        }
      }
      return data; // Güncel veriyi sisteme kaydet
    });
  }
})
        .catch(err => console.error("İstatistikler çekilemedi:", err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  // Doğruluk ölçüm sonuçlarını sayfa açılınca bir kez çek (statik veri, polling gerekmez).
  useEffect(() => {
    fetch(`${API_URL}/api/admin/accuracy`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setAccuracyData({
            measured: true,
            overall_accuracy_pct: data.overall_accuracy_pct,
            category_accuracy_pct: data.category_accuracy_pct,
            sentiment_accuracy_pct: data.sentiment_accuracy_pct,
            total_samples: data.total_samples,
          });
        }
      })
      .catch(err => console.error("Doğruluk verisi çekilemedi:", err));
  }, []);
// AdminDashboard içindeki return öncesi
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { min: 0, max: 100, grid: { display: false } },
    x: { grid: { display: false } }
  }
};

const chartData = {
  labels: dashboardStats.recent_feedbacks.map((f: any) => f.date).reverse(),
  datasets: [
    {
      label: 'Duygu Skoru',
      data: dashboardStats.recent_feedbacks.map(f => (f.score || 0) * 100).reverse(),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};
  return (
    <div className="min-h-screen bg-zinc-100 font-sans selection:bg-indigo-100">
      <nav className="bg-indigo-950 px-10 py-5 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-widest text-white uppercase">AI Admin Portal</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onExit} className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-6 py-2 rounded-full transition-all uppercase tracking-widest">
            Güvenli Çıkış
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-10 mt-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">Yönetici Paneli</h1>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Müşteri Deneyimi Analiz Merkezi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { t: "Toplam Bildirim", v: dashboardStats.total_feedbacks, c: "text-indigo-600" },
            { t: "Çözülen Şikayet", v: dashboardStats.resolved_tickets, c: "text-emerald-600" },
            { t: "Negatif Duygu Oranı", v: `%${dashboardStats.negative_ratio}`, c: "text-rose-600" },
            // Sahte sabit (%95) yerine ölçüm scriptinin ürettiği gerçek doğruluk sayısı.
            // Eğer ölçüm henüz yapılmadıysa "—" gösterip kullanıcıyı şaşırtmıyoruz.
            {
              t: accuracyData.measured
                ? `Sistem Doğruluğu (${accuracyData.total_samples} örnek)`
                : "Sistem Doğruluğu",
              v: accuracyData.measured ? `%${accuracyData.overall_accuracy_pct}` : "—",
              c: "text-cyan-600"
            }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-zinc-200/50 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.t}</span>
              <span className={cn("text-5xl font-black tracking-tighter", stat.c)}>{stat.v}</span>
            </div>
          ))}
        </div>
        {/* 4'lü İstatistik Kutularının Bittiği Yerden Hemen Sonra */}
<div className="grid grid-cols-1 gap-6 mt-8">
  <div className="bg-white p-8 rounded-[40px] border border-zinc-200/50 shadow-sm h-[400px]">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
        Duygu Trend Analizi (Canlı)
      </h3>
      <span className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
        GERÇEK ZAMANLI
      </span>
    </div>
    
    <div className="h-[280px] w-full">
      <Line data={chartData} options={chartOptions} /> 
    </div>
  </div>
</div>

        <div className="bg-white rounded-[40px] border border-zinc-200/50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-950">Son Müşteri Etkileşimleri</h2>
            <button 
              onClick={downloadCSV} 
              className="text-[10px] font-black bg-white border border-zinc-200 px-5 py-2.5 rounded-2xl uppercase tracking-widest text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all shadow-sm"
            >
              Tümünü İndir (CSV)
            </button>
          </div>

          {!dashboardStats.recent_feedbacks || dashboardStats.recent_feedbacks.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="text-4xl">🕒</div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Sistem aktif. Yeni etkileşimler bekleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 border-b border-zinc-100">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <th className="p-6">Saat</th>
                    <th className="p-6">Müşteri Mesajı</th>
                    <th className="p-6">Kategori</th>
                    <th className="p-6 text-right">Duygu & Güven</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold text-zinc-700">
                  {dashboardStats.recent_feedbacks.map((f: any) => (
                    <tr key={f.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                      <td className="p-6 text-zinc-400 font-medium">{f.date}</td>
                      <td className="p-6 max-w-md truncate text-zinc-900">{f.text}</td>
                      <td className="p-6">
                        <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter">
                          {f.category}
                        </span>
                      </td>
                      <td className="p-6 text-right flex flex-col items-end gap-1">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter",
                          f.sentiment === 'Negative' ? 'bg-rose-50 text-rose-600' : 
                          f.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                        )}>
                          {f.sentiment === 'Negative' ? '🔴 Negatif' : f.sentiment === 'Positive' ? '🟢 Pozitif' : '🟡 Nötr'}
                        </span>
                        <span className="text-[10px] text-zinc-300 font-medium italic">
                          Güven: %{(f.score * 100).toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
  
export default function AIFeedbackHubPortal() {
  // --- UYGULAMA DURUMLARI ---
  const [isAdminView, setIsAdminView] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false); // YENİ: Login Modal State
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const [showUploader, setShowUploader] = useState(false);
  const [isBotOpen, setIsBotOpen] = useState(false);
  
  // --- GERİ BİLDİRİMLER VERİSİ VE KATEGORİ FİLTRELEME (GENİŞLETİLDİ) ---
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const filterCategories = ["Tümü", "Lojistik", "Teknik", "Ödeme", "İletişim", "Ürün", "İşlem"];
  
  const allFeedbacks = [
    // Lojistik
    { t: 'Kargo Gecikmesi ve Kayıp Ürün', c: 'E-Ticaret Operasyonları', s: 'Lojistik' },
    { t: 'Yanlış Adrese Teslimat Edildi', c: 'Dağıtım Merkezi', s: 'Lojistik' },
    { t: 'Hasarlı Koli ve Kötü Paketleme', c: 'Depo Yönetimi', s: 'Lojistik' },
    { t: 'Kurye İletişim Kurmadan Gitti', c: 'Saha Operasyonları', s: 'Lojistik' },
    // Teknik
    { t: 'Mobil Uygulama Çökme Sorunu', c: 'Yazılım & Teknoloji', s: 'Teknik' },
    { t: 'Şifre Sıfırlama E-postası Gelmiyor', c: 'Kullanıcı Hesapları', s: 'Teknik' },
    { t: 'Ödeme Sayfası Yüklenme Gecikmesi', c: 'Altyapı', s: 'Teknik' },
    { t: 'Sepete Ekleme Hatası Alıyorum', c: 'E-Ticaret Altyapısı', s: 'Teknik' },
    // Ödeme
    { t: 'Kredi Kartı İade Problemi', c: 'Bankacılık & Finans', s: 'Ödeme' },
    { t: 'Hesabımdan Çifte Çekim Yapıldı', c: 'Ödeme Sistemleri', s: 'Ödeme' },
    { t: 'Kurumsal Fatura Kesilmedi', c: 'Muhasebe', s: 'Ödeme' },
    { t: 'Taksit Seçeneği Ekranda Çıkmıyor', c: 'Ödeme Entegrasyonu', s: 'Ödeme' },
    // İletişim
    { t: 'Müşteri Temsilcisi Kaba Davranışı', c: 'Müşteri İlişkileri', s: 'İletişim' },
    { t: 'Destek Talebime 3 Gündür Dönülmedi', c: 'Çağrı Merkezi', s: 'İletişim' },
    { t: 'Canlı Destek Asistanı Yetersiz Kaldı', c: 'Dijital İletişim', s: 'İletişim' },
    // Ürün
    { t: 'Ürün Kırık Teslim Edildi', c: 'Üretim & Kalite', s: 'Ürün' },
    { t: 'Kutudan Eksik Parça Çıktı', c: 'Paketleme', s: 'Ürün' },
    { t: 'Görselden Tamamen Farklı Bir Ürün', c: 'Kalite Kontrol', s: 'Ürün' },
    // İşlem
    { t: 'Abonelik İptali Yapılamıyor', c: 'Dijital Platformlar', s: 'İşlem' },
    { t: 'Kampanya Kodu Sepette Geçersiz', c: 'Pazarlama', s: 'İşlem' },
    { t: 'Hesap Silme İşlemi Başarısız Oldu', c: 'Veri Yönetimi', s: 'İşlem' }
  ];
  
  const filteredFeedbacks = activeCategory === "Tümü" ? allFeedbacks : allFeedbacks.filter(f => f.s === activeCategory);

  // --- CHATBOT MANTIK SİSTEMİ ---
  const [messages, setMessages] = useState([
    { role: "bot", text: "Merhaba! AI Feedback Hub destek merkezine hoş geldiniz. Markalarla yaşadığınız deneyimleri paylaşmanız ve çözüm bulmanız için buradayım. Bugün size nasıl yardımcı olabilirim?", type: "text" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [simStep, setSimStep] = useState("");
  const [interviewStep, setInterviewStep] = useState(false); 
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Yeni Bir Şikayet Yaz", action: "new_complaint" },
    { label: "Örnek Duygu Analizi Simüle Et", action: "demo_analysis" },
    { label: "Sık Karşılaşılan Sorunlar", action: "list_issues" },
    { label: "Çözüm Süreçlerini Sorgula", action: "process_info" },
    { label: "Sistem Nasıl Çalışır?", action: "how_it_works" }
  ];

  // Bu useEffect mesajlar geldikçe sayfayı kaydırır ama donmaya sebep olmaz
useEffect(() => {
  if (messages.length > 0) {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" }); // "smooth" yerine "auto" daha hafiftir
  }
}, [messages]);


  const processResponse = async (userText: string, actionKey?: string) => {
  setIsTyping(true);

  // 1. Kural: Süreç bilgisi isteniyorsa
  if (actionKey === "process_info" || userText.toLowerCase().includes("süreç")) {
    setMessages(prev => [...prev, { 
      role: "bot", 
      text: "Sistemimiz şu şekilde çalışır: Yazdığınız metin Node.js üzerinden Groq API'ye ve Llama 3.1 modeline iletilir. Doğal Dil İşleme (NLP) kullanılarak metnin duygu durumu ve şikayet kategorisi saniyeler içinde analiz edilir. Ardından sonuçlar anlık olarak yönetici paneline yansıtılır. 🚀", 
      type: "text" 
    }]);
    setIsTyping(false);
    return;
  }

  // 2. Kural: Şikayet yazma butonu tıklandıysa veya kullanıcı bunu yazdıysa API'ye gitme, kullanıcıyı bekle
  if (userText.toLowerCase().includes("yeni bir şikayet") || userText.toLowerCase().includes("şikayet yaz")) {
    setMessages(prev => [...prev, { 
      role: "bot", 
      text: "Size yardımcı olmak için buradayım. Lütfen yaşadığınız deneyimi veya sorunu detaylıca aşağıya yazın.", 
      type: "text" 
    }]);
    setIsTyping(false);
    return;
  }

  try {
    // Konuşma geçmişini hazırla (max son 10 mesaj — bağlam için yeterli, token tasarrufu için sınırlı).
    const conversationHistory = messages.slice(-10).map(m => ({
      role: m.role,
      text: m.text
    }));

    // Mesaj gerçek bir geri bildirim mi, yoksa sadece selamlaşma/kısa sohbet mi?
    // Eşik: en az 3 kelime VE 15+ karakter. Kısa mesajlarda rozet/skor göstermiyoruz.
    const trimmedText = userText.trim();
    const wordCount = trimmedText.split(/\s+/).length;
    const looksLikeFeedback = wordCount >= 3 && trimmedText.length >= 15;

    // /api/feedback/analyze isteğini paralelde başlat — admin paneli için DB'ye kaydeder
    // ve sentiment+kategori bilgisini badge için kullanırız. Kısa mesajlarda atlıyoruz.
    const analyzePromise: Promise<any> = looksLikeFeedback
      ? fetch(`${API_URL}/api/feedback/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userText }),
        }).then(r => r.json()).catch(() => null)
      : Promise.resolve(null);

    // ---- STREAMING SOHBET ----
    // Önce /api/chat/stream'i deniyoruz (token-by-token akış, ChatGPT efekti).
    // Başarısız olursa eski blocking /api/chat'e fallback yapıyoruz; davranış bozulmaz.
    let streamSucceeded = false;
    let accumulatedText = "";

    try {
      const streamResponse = await fetch(`${API_URL}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: conversationHistory, message: userText }),
      });

      if (!streamResponse.ok || !streamResponse.body) {
        throw new Error("Stream başlatılamadı");
      }

      // Akış başladı: önce empty bot mesajı koyuyoruz, her token'da text alanını update edeceğiz.
      setMessages(prev => [...prev, { role: "bot", text: "", type: "text" }]);

      const reader = streamResponse.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE olayları "\n\n" ile ayrılır
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              accumulatedText += parsed.token;
              // Son bot mesajını yeni token ile güncelle (akış efekti)
              setMessages(prev => {
                const next = [...prev];
                const i = next.length - 1;
                if (next[i]?.role === "bot") {
                  next[i] = { ...next[i], text: accumulatedText };
                }
                return next;
              });
              // Görsel UX: Groq + 8B çok hızlı (ms düzeyi). React auto-batching
              // hepsini tek render'a sıkıştırır. 18ms gecikme insan gözüne
              // "akış" hissi verir; ChatGPT ile aynı yaklaşım.
              await new Promise(r => setTimeout(r, 18));
            }
          } catch {
            // JSON parse edilemeyen satırları yut
          }
        }
      }

      streamSucceeded = accumulatedText.length > 0;
    } catch (streamErr) {
      console.warn("Streaming başarısız, blocking endpoint'e düşülüyor:", streamErr);
    }

    // Streaming başarısızsa eski /api/chat'i kullan (geri uyumluluk).
    let chatReply: string | null = streamSucceeded ? accumulatedText : null;
    if (!streamSucceeded) {
      try {
        const chatRes = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history: conversationHistory, message: userText }),
        }).then(r => r.json());
        if (chatRes?.success && chatRes.reply) {
          chatReply = chatRes.reply;
        }
      } catch {
        // sessizce yut, aşağıdaki "ikisi de başarısız" branch'i devreye girer
      }
    }

    // Analiz sonucunu bekle (badge için).
    const analyzeResult = await analyzePromise;
    const aiData = analyzeResult && analyzeResult.success ? analyzeResult.data.analysis : null;

    // Hiçbir kaynak çalışmadıysa hata göster (varsa empty placeholder'ı temizle).
    if (!chatReply && !aiData) {
      setMessages(prev => {
        const next = [...prev];
        if (next[next.length - 1]?.role === "bot" && !next[next.length - 1]?.text) {
          next.pop();
        }
        return [...next, {
          role: "bot",
          text: "⚠️ Yapay Zeka Hatası: Sunucuya ulaşılamadı. Lütfen biraz sonra tekrar deneyin.",
          type: "text"
        }];
      });
      return;
    }

    // Sohbet cevabı yoksa şablon ile dolduralım — UX bozulmasın.
    const fallbackText = aiData
      ? aiData.sentiment_label === "Negative"
        ? `Yaşadığınız bu deneyim için çok üzgünüz. Geri bildiriminiz "${aiData.nlp_category}" ekibimize iletilmiştir.`
        : aiData.sentiment_label === "Positive"
          ? `Harika geri bildiriminiz için çok teşekkür ederiz! 🌟`
          : `Geri bildiriminiz "${aiData.nlp_category}" kategorisinde kaydedilmiştir.`
      : "Anladım, geri bildiriminiz için teşekkür ederim.";

    const finalText = chatReply || fallbackText;

    // Final bot mesajını oluştur (badge ve istatistikler dahil).
    const botMessage: any = {
      role: "bot",
      text: finalText,
      type: aiData ? "analysis_result" : "text",
    };

    if (aiData) {
      botMessage.sentimentBadge = {
        text:
          aiData.sentiment_label === "Negative" ? "🔴 Negatif" :
          aiData.sentiment_label === "Neutral"  ? "⚪️ Nötr"   :
                                                  "🟢 Pozitif",
        classes: "p-2 rounded-xl border border-zinc-200 bg-white font-bold text-[10px] uppercase"
      };
      botMessage.stats = [
        { l: "Güven Skoru", v: Math.round(aiData.confidence_score * 100) },
        { l: "Kategori",    v: aiData.nlp_category }
      ];
    }

    // Streaming başarılıysa son mesajı in-place replace ediyoruz (akan text + badge birleşsin).
    // Streaming başarısızsa empty placeholder var olabilir — onu da replace et; yoksa append.
    setMessages(prev => {
      const next = [...prev];
      const lastIdx = next.length - 1;
      const lastIsBot = next[lastIdx]?.role === "bot";
      if (lastIsBot && (streamSucceeded || !next[lastIdx]?.text)) {
        next[lastIdx] = botMessage;
      } else {
        next.push(botMessage);
      }
      return next;
    });

  } catch (error) {
    console.error("Hata:", error);
    setMessages(prev => {
      const next = [...prev];
      // Empty placeholder kaldıysa sil
      if (next[next.length - 1]?.role === "bot" && !next[next.length - 1]?.text) {
        next.pop();
      }
      return [...next, {
        role: "bot",
        text: "🚨 Bağlantı Hatası: Backend sunucusuna ulaşılamıyor. Lütfen biraz sonra tekrar deneyin.",
        type: "text"
      }];
    });
  } finally {
    setIsTyping(false);
    setInput(""); // Mesaj kutusunu temizler
  }
};

  const handleSend = (e?: React.FormEvent) => {
    // İŞTE HAYAT KURTARAN O SATIR: Sayfanın kendi kendine yenilenip kilitlenmesini engeller!
    if (e) e.preventDefault(); 
    
    if (!input.trim()) return;
    
    const userMessage = input; // Önce mesajı güvene alıyoruz
    setInput(""); // Metin kutusunu temizliyoruz
    
    setMessages(prev => [...prev, { role: "user", text: userMessage, type: "text" }]);
    processResponse(userMessage);
  };

  // YÖNETİCİ GİRİŞ İŞLEMİ (MOCK)
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(adminUser && adminPass) {
      setShowAdminLogin(false);
      setIsAdminView(true);
      setAdminUser("");
      setAdminPass("");
    }
  };

  // EĞER ADMIN MODUNDAYSAK ADMIN PANELİNİ DÖNDÜR
  if (isAdminView) {
    return <AdminDashboard onExit={() => setIsAdminView(false)} />;
  }

  // DEĞİLSE ANA PORTALI DÖNDÜR
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-indigo-100 scroll-smooth overflow-x-hidden text-zinc-950">
      
      {/* --- ADMIN LOGIN MODAL (YENİ) --- */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[200] bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300 px-4">
          <div className="bg-white w-full max-w-[400px] rounded-3xl shadow-2xl p-8 border border-zinc-100 animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-2 text-indigo-600">
                 <IconShield />
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Yönetici Girişi</h3>
               </div>
               <button onClick={() => setShowAdminLogin(false)} className="text-zinc-400 hover:text-zinc-950 transition-colors"><IconX /></button>
             </div>
             <form onSubmit={handleAdminLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Kullanıcı Adı</label>
                  <input type="text" required value={adminUser} onChange={e=>setAdminUser(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-indigo-600 transition-colors font-bold" placeholder="admin" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Parola</label>
                  <input type="password" required value={adminPass} onChange={e=>setAdminPass(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-indigo-600 transition-colors font-bold" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl mt-4 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Giriş Yap</button>
             </form>
          </div>
        </div>
      )}

      {/* --- CHATBOT POPUP --- */}
     <motion.div 
        drag 
        dragMomentum={false}
        className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 text-zinc-950 cursor-grab active:cursor-grabbing"
      >
        {isBotOpen && (
          <div className="w-[360px] h-[580px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-zinc-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-950 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3 font-black">
                <div className="w-2 h-2 bg-cyan-400 rounded-full " />
                <span className="text-[11px] tracking-widest uppercase text-white">AI Feedback Assistant</span>
              </div>
              <button onClick={() => setIsBotOpen(false)}><IconX /></button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 space-y-4 font-medium">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className={cn("p-4 rounded-2xl text-[13px] leading-relaxed max-w-[92%] shadow-sm", m.role === "bot" ? "bg-white border text-zinc-700 self-start" : "bg-indigo-600 text-white self-end ml-auto")}>
                    {m.text}
                    
                    {/* DUYGU ANALİZİ ROZETİ */}
                    {m.sentimentBadge && (
                      <div className={cn("mt-4 mb-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase border text-center", m.sentimentBadge.classes)}>
                        {m.sentimentBadge.text}
                      </div>
                    )}

                    {m.type === "analysis_result" && m.stats && (
                      <div className="mt-2 space-y-3 pt-4 border-t border-zinc-100">
                        {m.stats.map((s, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-black uppercase text-zinc-900"><span>{s.l}</span><span>{s.l === "Kategori" ? s.v : `%${s.v}`}</span></div>
                            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600" style={{ width: `${s.v}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {m.type === "job_cards" && m.jobs && (
                      <div className="mt-4 space-y-2">
                        {m.jobs.map((j, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-xl border border-zinc-200 flex justify-between items-center hover:border-indigo-400 transition-colors">
                            <div><p className="text-[11px] font-black text-zinc-900">{j.t}</p><p className="text-[9px] text-zinc-500 font-bold uppercase">{j.l}</p></div>
                            <div className="text-indigo-600"><IconArrow /></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {simStep && <div className="flex items-center gap-3 p-4 bg-indigo-950 text-cyan-400 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-pulse"><IconZap className="w-4 h-4" /> {simStep}</div>}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-col gap-2 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1 mb-1">Hızlı İşlemler</p>
                  {quickActions.map((qa, i) => (
                    <button key={i} onClick={() => { setMessages(prev => [...prev, { role: "user", text: qa.label, type: "text" }]); processResponse(qa.label, qa.action); }} className="text-left bg-white border border-zinc-200 hover:border-indigo-600 p-3 rounded-xl text-[11px] font-bold transition-all shadow-sm">{qa.label}</button>
                  ))}
                </div>
              )}
              {isTyping && (
              <div className="flex items-center p-4 bg-white/50 w-fit rounded-full ml-2">
                 <span className="text-xs font-black uppercase tracking-widest text-indigo-600 animate-none">AI Analiz Ediyor...</span>
              </div>
            )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white border-t flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Şikayet veya önerinizi yazın..." className="flex-1 bg-zinc-100 rounded-xl px-4 py-2 text-xs outline-none" />
              <button onClick={handleSend} className="p-2 bg-indigo-600 rounded-xl text-white"><IconZap className="w-5 h-5" /></button>
            </div>
          </div>
        )}
        <button onClick={() => setIsBotOpen(!isBotOpen)} className="w-16 h-16 bg-indigo-950 text-cyan-400 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          {isBotOpen ? <IconX /> : <IconChat />}
        </button>
      </motion.div>

      {/* --- 1. NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-10 font-black text-zinc-950">
          <div className="text-2xl tracking-tighter uppercase flex items-center gap-2">
            <IconZap className="text-indigo-600" /> AI FEEDBACK HUB
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-bold">
            <a href="#about" className="hover:text-indigo-600 transition-colors">Platform</a>
            <a href="#metrics" className="hover:text-indigo-600 transition-colors">Analitik</a>
            <a href="#feedbacks" className="hover:text-indigo-600 transition-colors">Deneyimler</a>
            <a href="#uploader" className="hover:text-indigo-600 transition-colors">Belge Yükle</a>
          </div>
          <div className="flex items-center gap-4">
             {/* YENİ: YÖNETİCİ GİRİŞİ BUTONU */}
             <button onClick={() => setShowAdminLogin(true)} className="hidden md:flex bg-zinc-100 text-zinc-600 px-6 py-3 rounded-xl text-[10px] tracking-widest uppercase font-black hover:bg-zinc-200 transition-all items-center gap-2"><IconShield /> Yönetici Girişi</button>
             <button onClick={() => setIsBotOpen(true)} className="bg-indigo-600 text-white px-7 py-3 rounded-xl text-[10px] tracking-widest uppercase shadow-xl font-black">Şikayet Yaz</button>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO --- */}
      <section id="hero" className="pt-48 pb-16 px-10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-[5.5rem] font-black leading-[0.9] tracking-tighter uppercase">Deneyimle. <br/> Geri Bildirim Ver. <br/> <span className="text-indigo-600">Çözüm Bul.</span></h1>
              <p className="text-zinc-600 text-lg md:text-xl max-w-lg leading-relaxed font-medium">Müşteri geri bildirimlerinde yeni bir dönem. Şikayet ve önerilerinizi yapay zeka teknolojisiyle analiz ediyor, markalarla aranızda çözüm odaklı bir köprü kuruyoruz.</p>
            </div>
            <button onClick={() => document.getElementById('uploader')?.scrollIntoView({ behavior: 'smooth' })} className="bg-indigo-950 text-white px-12 py-5 rounded-2xl flex items-center gap-4 text-sm font-black tracking-widest uppercase hover:bg-black transition-all shadow-2xl">GERİ BİLDİRİM ANALİZİ <IconArrow /></button>
          </div>
          <div className="w-full h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-100">
            <img src="/pexels-tara-winstead-8386437.jpg" alt="Hero" className="w-full h-full object-cover animate-pulse-slow" />
          </div>
        </div>
      </section>

      {/* --- 3. TRUSTED BY --- */}
      <section className="pb-24 px-10 bg-white border-b border-zinc-50 text-zinc-950">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-8 text-xs font-black">GÜVENİLİR ÇÖZÜM ORTAKLARI</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale font-black italic tracking-tighter text-xl">
            <span>GOOGLE</span><span>MICROSOFT</span><span>LINKEDIN</span><span>VERCEL</span><span>FASTAPI</span>
          </div>
        </div>
      </section>

      {/* --- 4. PLATFORM HAKKINDA --- */}
      <section id="about" className="py-24 md:py-32 px-10 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
          <div className="space-y-4">
             <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-zinc-950 leading-none">PLATFORM <span className="text-indigo-600">HAKKINDA</span></h2>
             <div className="w-24 h-1.5 bg-indigo-600 rounded-full mx-auto" />
          </div>
          <div className="max-w-3xl">
            <p className="text-lg md:text-xl font-bold text-zinc-800 leading-relaxed tracking-tight">
              AI Feedback Hub, tüketici şikayetlerini ve yorumlarını akıllı bir sistemle analiz eden profesyonel bir ekosistemdir. Kullanıcılardan toplanan serbest metin verilerini duygu analizinden geçirerek, markaların müşteri memnuniyetini ölçmesini ve sorunlara veri odaklı çözümler üretmesini sağlar.
            </p>
          </div>
        </div>
      </section>

      {/* --- 5. METRİKLER --- */}
      <section id="metrics" className="py-24 px-10 bg-indigo-950 text-white rounded-3xl mx-10">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-4 font-black">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">SİSTEM <span className="text-cyan-400">METRİKLERİ</span></h2>
            <p className="text-indigo-300/60 font-black uppercase text-[10px] tracking-[0.4em]">Gerçek Zamanlı Veri Analitiği</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-zinc-950">
            <AnalysisCircle percent={88} label="Yetenek Uyumu" dark />
            <AnalysisCircle percent={92} label="Sektör Skoru" dark />
            <AnalysisCircle percent={74} label="Yazılım Yetkinliği" dark />
            <AnalysisCircle percent={81} label="ATS Uyumluluğu" dark />
          </div>
        </div>
      </section>

      {/* --- 6. VİZYON --- */}
      <section className="py-32 px-10 bg-white text-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-zinc-950">
          <div className="relative order-2 lg:order-1 rounded-3xl overflow-hidden shadow-xl border border-zinc-100">
            <img src="/pexels-marek-piwnicki-3907296-12489187.jpg" alt="Process" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-10 order-1 lg:order-2">
            <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none text-zinc-950">MÜŞTERİ DENEYİMİNİ</h2>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-indigo-600">GÜÇLENDİRİN</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 font-bold">
              {[
                {t: "Gerçek Zamanlı Deneyim Analizi", d: "Müşteri mesajlarını anlık olarak işliyor, duygusal derinliğini ölçüyoruz."},
                {t: "Kullanıcı Geri Dönüş Döngüsü", d: "Deneyimlerinizi doğrudan markanın çözüm mekanizmalarına iletiyoruz."},
                {t: "Anlamsal Sınıflandırma", d: "Şikayetleri otomatik olarak kargo, ürün veya iletişim olarak ayırıyoruz."},
                {t: "Dinamik Çözüm Paneli", d: "Analiz sonuçlarını markalara aksiyon alınabilir veriler olarak sunuyoruz."},
                {t: "Kişiselleştirilmiş İletişim", d: "Her kullanıcıya özel, deneyimine uygun yanıt stratejileri geliştiriyoruz."},
                {t: "Kesintisiz Destek Köprüsü", d: "Talepleri 7/24 dinleyen ve analiz eden profesyonel bir arayüz sağlıyoruz."}
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start group">
                  <div className="mt-1 w-6 h-6 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg"><IconCheck /></div>
                  <div>
                    <h4 className="font-black text-sm uppercase text-zinc-900 group-hover:text-indigo-600 transition-colors">{item.t}</h4>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 7. ŞİKAYETLER VE KATEGORİ FİLTRELEME (GENİŞLETİLMİŞ VERİ) --- */}
      <section id="feedbacks" className="py-24 px-10 bg-zinc-50 border-y border-zinc-100 text-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 font-black">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">GÜNCEL <br/> <span className="text-indigo-600">DENEYİMLER</span></h2>
          </div>
          
          {/* KATEGORİ FİLTRELERİ */}
          <div className="flex flex-wrap gap-3 mb-12">
            {filterCategories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", activeCategory === cat ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-white text-zinc-500 border border-zinc-200 hover:border-indigo-600 hover:text-indigo-600")}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeedbacks.map((feedback, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-zinc-200 hover:border-indigo-600 transition-all group shadow-sm hover:shadow-2xl animate-in fade-in duration-300">
                <div className="flex justify-between items-start mb-8 text-indigo-600 text-[10px] tracking-[0.4em] uppercase font-black">
                  <span>{feedback.c}</span>
                  <div className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors text-zinc-950"><IconArrow /></div>
                </div>
                <h4 className="text-xl mb-6 font-black tracking-tight">{feedback.t}</h4>
                <span className="px-4 py-1.5 bg-zinc-100 rounded-full text-[9px] tracking-widest text-zinc-600 uppercase font-black">{feedback.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 8. BELGE YÜKLEME --- */}
      <section id="uploader" className="py-32 px-10 bg-indigo-950 text-white rounded-t-[3rem] mt-[-3rem] relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="bg-zinc-900 rounded-3xl p-16 border border-zinc-800 relative z-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-white font-bold">
              <div className="lg:col-span-7 space-y-8">
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase text-white underline decoration-indigo-500 decoration-4">BELGE / KANIT YÜKLE</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium italic">Deneyim dökümanlarınızı veya şikayet dosyalarınızı sisteme dahil ederek analiz sürecini başlatın.</p>
                <div className="w-full">
                  {showUploader ? <FileUploader /> : (
                    <button onClick={() => setShowUploader(true)} className="px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest font-black">DOSYA YÜKLE VE ANALİZ ET</button>
                  )}
                </div>
              </div>
              <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-lg border border-zinc-800">
                <img src="/pexels-rdne-7947743.jpg" alt="Analysis" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-10 bg-indigo-950 text-center border-t border-indigo-900 font-black text-zinc-500 text-[10px] tracking-[0.6em] uppercase italic">
        © 2026 AI FEEDBACK HUB | SUDE ENGINEERING PROJECT
      </footer>

    </main>
  );
}