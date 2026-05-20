"use client";

import React, { useState, useEffect, useRef } from "react";
import FileUploader from "@/components/ui/file-uploader"; 
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
ArcElement,
Title,
Tooltip,
Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

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
// VOICE — sesli giriş için mikrofon ikonu
const IconMic = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
// VOICE — bot cevabının sesli okunması için hoparlör ikonu (açık)
const IconSpeakerOn = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);
// VOICE — hoparlör kapalı (sessiz) durumu
const IconSpeakerOff = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
);

// QUICK ACTION İKONLARI — chat karşılama ekranında kullanılır
const IconPen = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IconBarChart = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);
const IconRefresh = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const IconInfo = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const IconWorkflow = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6"/>
  </svg>
);
const IconSparkle = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l2.4 7.4L22 12l-7.6 2.6L12 22l-2.4-7.4L2 12l7.6-2.6z"/>
  </svg>
);

// BOT AVATAR — mesaj balonlarının yanında küçük yuvarlak avatar
const BotAvatar = ({ className = "" }: { className?: string }) => (
  <div className={cn("flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm", className)}>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a2 2 0 0 1 2 2v1.5a6.5 6.5 0 0 1 5 6.32V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6.18A6.5 6.5 0 0 1 10 5.5V4a2 2 0 0 1 2-2zm-2.5 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
    </svg>
  </div>
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
  const [dashboardStats, setDashboardStats] = useState<{
    total_feedbacks: number;
    resolved_tickets: number;
    negative_ratio: string;
    human_help_count: number;
    helpful_ratio: string | null;     // Memnuniyet anketi — null = henüz oy yok
    helpful_rated_count: number;
    top_brands: { brand: string; count: number }[];
    category_distribution: { category: string; count: number }[];
    sentiment_distribution: { sentiment: string; count: number }[];
    recent_feedbacks: any[];
  }>({
    total_feedbacks: 0,
    resolved_tickets: 0,
    negative_ratio: "0",
    human_help_count: 0,
    helpful_ratio: null,
    helpful_rated_count: 0,
    top_brands: [],
    category_distribution: [],   // Donut chart için
    sentiment_distribution: [],  // Pie chart için
    recent_feedbacks: []
  });

  // Admin panel marka filtresi: tabloyu hangi markaya göre süzeceğiz?
  // null → tüm şikayetler. Brand chip'lerine tıklayarak filtreleme yapılır.
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

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

    const headers = ["Saat", "Marka", "Mesaj", "Kategori", "Duygu", "Skor", "İnsan Yardımı", "Faydalı"];
    const rows = dashboardStats.recent_feedbacks.map((f: any) => [
      f.date,
      f.brand || "Belirtilmemiş",
      `"${f.text.replace(/"/g, '""')}"`,
      f.category,
      f.sentiment,
      `%${(f.score * 100).toFixed(0)}`,
      f.needs_human ? "Evet" : "Hayır",
      f.helpful === true ? "👍" : f.helpful === false ? "👎" : "—"
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
      // Yeni negatif şikayet geldiyse sessiz log atıyoruz (eski alert() pop-up'ı
      // demo sırasında jüriyi rahatsız ediyordu — kaldırıldı).
      // Admin panel zaten her 3 sn'de yenilenip yeni satırı kırmızı vurgulu gösteriyor.
      if (data.total_feedbacks > prevStats.total_feedbacks) {
        const latest = data.recent_feedbacks?.[0];
        if (latest && latest.sentiment === 'Negative') {
          console.log(`🚨 Yeni negatif geri bildirim: ${latest.category} / ${latest.brand || "Belirtilmemiş"}`);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[
            { t: "Toplam Bildirim", v: dashboardStats.total_feedbacks, c: "text-indigo-600" },
            { t: "Çözülen Şikayet", v: dashboardStats.resolved_tickets, c: "text-emerald-600" },
            { t: "Negatif Duygu Oranı", v: `%${dashboardStats.negative_ratio}`, c: "text-rose-600" },
            // HİBRİT DESTEK: confidence < 0.85 olan şikayetler insan operatöre yönlendirildi.
            // Bu metrik, raporun [3] ve [7] kaynaklarındaki "hibrit destek" önerisinin somut göstergesi.
            { t: "İnsan Yardımı", v: dashboardStats.human_help_count ?? 0, c: "text-amber-600" },
            // MEMNUNİYET ANKETİ: 👍 / (👍 + 👎) yüzdesi. Henüz oy yoksa "—" gösteriyoruz.
            {
              t: dashboardStats.helpful_rated_count > 0
                ? `Memnuniyet (${dashboardStats.helpful_rated_count} oy)`
                : "Memnuniyet",
              v: dashboardStats.helpful_ratio !== null ? `%${dashboardStats.helpful_ratio}` : "—",
              c: "text-fuchsia-600"
            },
            // Sahte sabit (%95) yerine ölçüm scriptinin ürettiği gerçek doğruluk sayısı.
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
        {/* Trend grafiği + Kategori dağılımı yan yana (D — Admin paneli grafikleri) */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
  <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-zinc-200/50 shadow-sm h-[400px]">
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

  {/* Kategori dağılımı — donut chart */}
  <div className="bg-white p-8 rounded-[40px] border border-zinc-200/50 shadow-sm h-[400px] flex flex-col">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
        Kategori Dağılımı
      </h3>
      <span className="text-[10px] font-bold text-zinc-400">
        {dashboardStats.category_distribution?.length || 0} kategori
      </span>
    </div>
    <div className="flex-1 flex items-center justify-center min-h-0">
      {(dashboardStats.category_distribution?.length || 0) === 0 ? (
        <p className="text-sm text-zinc-300 font-medium italic">Veri biriktikçe burada görüntülenecek</p>
      ) : (
        <Doughnut
          data={{
            labels: dashboardStats.category_distribution.map(c => c.category),
            datasets: [{
              data: dashboardStats.category_distribution.map(c => c.count),
              backgroundColor: [
                '#f59e0b', // Lojistik - amber
                '#f43f5e', // Teknik  - rose
                '#10b981', // Ödeme   - emerald
                '#0ea5e9', // İletişim- sky
                '#8b5cf6', // Ürün    - violet
                '#6366f1', // İşlem   - indigo
                '#a855f7', '#ec4899', // ek renkler
              ],
              borderWidth: 0,
              hoverOffset: 6,
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 8,
                  boxHeight: 8,
                  font: { size: 10, weight: 'bold' as const },
                  padding: 10,
                  usePointStyle: true,
                }
              },
              tooltip: {
                callbacks: {
                  label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} şikayet`
                }
              }
            }
          }}
        />
      )}
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
            <div className="p-20 text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-base font-black text-zinc-700 uppercase tracking-widest">Henüz Geri Bildirim Yok</p>
                <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed font-medium">Yeni bir müşteri etkileşimi geldiğinde otomatik olarak burada listelenecek. Test etmek için ana sayfada chatbot'a bir mesaj yazabilirsiniz.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* MARKA FİLTRESİ: backend'den gelen top_brands chip'leri.
                  Tıklanan markaya göre tablo süzülür; "Tümü" filtreyi sıfırlar. */}
              {dashboardStats.top_brands && dashboardStats.top_brands.length > 0 && (
                <div className="px-8 pt-6 pb-2 flex flex-wrap items-center gap-2 border-b border-zinc-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-2">Markaya Göre Filtrele:</span>
                  <button
                    onClick={() => setBrandFilter(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors",
                      brandFilter === null
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    )}
                  >
                    Tümü ({dashboardStats.total_feedbacks})
                  </button>
                  {dashboardStats.top_brands.map((b) => (
                    <button
                      key={b.brand}
                      onClick={() => setBrandFilter(b.brand)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors",
                        brandFilter === b.brand
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      )}
                    >
                      {b.brand} ({b.count})
                    </button>
                  ))}
                </div>
              )}

              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 border-b border-zinc-100">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <th className="p-6">Saat</th>
                    <th className="p-6">Marka</th>
                    <th className="p-6">Müşteri Mesajı</th>
                    <th className="p-6">Kategori</th>
                    <th className="p-6 text-right">Duygu & Güven</th>
                    <th className="p-6 text-center">Faydalı?</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold text-zinc-700">
                  {dashboardStats.recent_feedbacks
                    .filter((f: any) => brandFilter === null || f.brand === brandFilter)
                    .map((f: any) => (
                    <tr
                      key={f.id}
                      className={cn(
                        "border-b border-zinc-50 transition-colors",
                        // HİBRİT DESTEK görsel sinyali: insan yardımı gereken satırlar amber/sarı çerçeveli
                        f.needs_human
                          ? "bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-l-amber-500"
                          : "hover:bg-zinc-50/50"
                      )}
                    >
                      <td className="p-6 text-zinc-400 font-medium">{f.date}</td>
                      <td className="p-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                          f.brand && f.brand !== "Belirtilmemiş"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-zinc-100 text-zinc-400 italic"
                        )}>
                          {f.brand || "Belirtilmemiş"}
                        </span>
                      </td>
                      <td className="p-6 max-w-md truncate text-zinc-900">
                        {f.text}
                        {f.needs_human && (
                          <span className="ml-2 inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
                            ⚠ İnsan Yardımı
                          </span>
                        )}
                      </td>
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
                      <td className="p-6 text-center">
                        <span className={cn(
                          "text-lg",
                          f.helpful === true && "opacity-100",
                          f.helpful === false && "opacity-100",
                          f.helpful !== true && f.helpful !== false && "text-zinc-300"
                        )}>
                          {f.helpful === true ? "👍" : f.helpful === false ? "👎" : "—"}
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
    {
      role: "bot",
      text: "Hoş geldiniz. Markalarla yaşadığınız deneyimi paylaşabilir, sıkça sorulan konularda bilgi alabilir veya bana sesli olarak iletebilirsiniz. Aşağıdaki konulardan birini seçerek başlayabilirsiniz.",
      type: "welcome",
      complete: true,
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [simStep, setSimStep] = useState("");
  const [interviewStep, setInterviewStep] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // VOICE STATE'LERİ
  // isListening   → mikrofon aktif mi (UI'da kırmızı yanıp sönen mikrofon)
  // voiceOutput   → bot cevabı geldiğinde otomatik olarak sesli okunsun mu (toggle)
  // voiceSupported→ Tarayıcı Web Speech API destekliyor mu (Firefox eski sürümlerde yok)
  const [isListening, setIsListening] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(true);  // Default açık — kullanıcı isterse butonla kapatır
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  // Sesli okuma çift okumayı engellemek için son okunan mesajın "imzasını" tutar.
  // Format: `${index}::${text.length}` — index aynı ama text büyüdüyse okunabilir.
  const lastSpokenIndexRef = useRef<string>("");

  // Tarayıcının ses tanıma desteğini kontrol et + recognition instance oluştur.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setVoiceSupported(false);
      return;
    }
    setVoiceSupported(true);
    const recognition = new SR();
    recognition.lang = "tr-TR";          // Türkçe ses tanıma
    recognition.interimResults = false;   // Sadece final sonucu istiyoruz, ara sonuçlar yok
    recognition.continuous = false;       // Tek bir cümle, otomatik dur
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      if (transcript.trim()) {
        setInput(transcript);
      }
    };
    recognition.onerror = (event: any) => {
      console.warn("Ses tanıma hatası:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, []);

  // Mikrofon butonuna basıldığında: dinlemeyi başlat veya durdur (toggle).
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setInput(""); // Eski metin varsa temizle ki yeni transkript karışmasın
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Ses tanıma başlatılamadı:", e);
        setIsListening(false);
      }
    }
  };

  // Bot cevabı geldiğinde sesli okuma — voiceOutput açıkken son bot mesajını okur.
  useEffect(() => {
    console.log("🔊 [TTS-effect] Tetiklendi. voiceOutput=", voiceOutput, "messages.length=", messages.length, "lastRole=", messages[messages.length-1]?.role, "lastComplete=", (messages[messages.length-1] as any)?.complete);
    if (!voiceOutput) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (messages.length === 0) return;

    const lastIdx = messages.length - 1;
    const lastMsg = messages[lastIdx];
    if (lastMsg.role !== "bot") return;
    if (!lastMsg.text || !lastMsg.text.trim()) return;

    // SADECE tamamlanmış mesajları oku — streaming sırasında ara token'lar değil.
    // botMessage'a `complete: true` flag'i, processResponse içinde stream bittikten
    // sonra konunca eklenir. Bu sayede Chrome'un cancel+speak çakışma bug'ı oluşmaz.
    if (!(lastMsg as any).complete) return;

    // Aynı mesajı iki kez okumayalım.
    const signature = `${lastIdx}`;
    if (lastSpokenIndexRef.current === signature) return;

    console.log("🔊 [TTS] Timer kuruldu, 800ms sonra okunacak. Text uzunluğu:", lastMsg.text.length);

    const timer = setTimeout(() => {
      lastSpokenIndexRef.current = signature;

      // Türkçe ses seçimi (varsa kullan, yoksa default)
      const voices = window.speechSynthesis.getVoices();
      const trVoices = voices.filter(v => v.lang?.startsWith("tr"));
      const trVoice = voices.find(v => v.lang === "tr-TR") || trVoices[0];

      // Llama bazen sistem prompt'una rağmen markdown (** veya `) ekliyor.
      // Yelda bu sembolleri okurken takılıyor; metni temizleyip yolluyoruz.
      const cleanText = lastMsg.text
        .replace(/\*+/g, "")          // ** veya * sembollerini sil
        .replace(/`+/g, "")           // backtick'leri sil
        .replace(/#+\s/g, "")         // markdown header
        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // [link](url) → link text
        .trim();

      console.log("🔊 [TTS] Speak edilecek text (uzunluk=" + cleanText.length + "):", JSON.stringify(cleanText));

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "tr-TR";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      // Yelda bazı macOS sürümlerinde 1-2 sn'de kesiliyor olabiliyor.
      // Önce trVoice'u dene, eğer ses 2 saniyeden önce biterse (onend çok erken) default'a düş.
      if (trVoice) utterance.voice = trVoice;

      utterance.onstart = () => console.log("🔊 [TTS] Konuşma başladı.");
      utterance.onend = () => console.log("🔊 [TTS] Konuşma bitti.");
      utterance.onerror = (e: any) => console.warn("🔊 [TTS] Hata:", e.error || e);

      // Önceki konuşma bitsin, kuyruğa eklenir (cancel etmeden — Chrome cancel+speak
      // ardışık çağrıldığında metni ilk harften sonra kesiyor; bu yöntemle bug oluşmaz).
      // Ek: Chrome > 15sn konuşmaları kesiyor → her 10sn'de bir pause/resume hilesi.
      const watchdog = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(watchdog);
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);
      utterance.onend = () => {
        clearInterval(watchdog);
        console.log("🔊 [TTS] Konuşma bitti.");
      };

      window.speechSynthesis.speak(utterance);
      console.log("🔊 [TTS] speak() çağrıldı. Kuyruğa eklenmiş mi:", window.speechSynthesis.speaking);
    }, 800);

    // Yeni token gelirse önceki timer iptal edilir, ses 800ms sonra tek seferde başlar.
    return () => clearTimeout(timer);
  }, [messages, voiceOutput]);

  // Voice output kapatılırsa şu an okunan cümleyi durdur
  useEffect(() => {
    if (!voiceOutput && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [voiceOutput]);

  // Profesyonel görünüm: 6 adet kategorize edilmiş hızlı işlem. Her birinde küçük
  // bir ikon ve "bu butona basınca bot ne yapar" örneği var. İkonlar Tailwind
  // renkleriyle uyumlu.
  const quickActions: Array<{
    label: string;
    sub: string;
    icon: React.ElementType;
    color: string;
    action?: string;
    prompt?: string;
  }> = [
    { label: "Yeni Şikayet Yaz", sub: "Markaya geri bildirim ilet", icon: IconPen, color: "indigo", action: "new_complaint" },
    { label: "Toplam Şikayet Sayısı", sub: "Sistemdeki gerçek veri", icon: IconBarChart, color: "fuchsia", prompt: "Toplam kaç şikayet var?" },
    { label: "İade Politikası", sub: "Standart süre ve şartlar", icon: IconRefresh, color: "emerald", prompt: "İade nasıl yapılır?" },
    { label: "Kargo & Teslimat", sub: "Standart süreler", icon: IconWorkflow, color: "amber", prompt: "Kargom ne kadar sürede gelir?" },
    { label: "Sistem Hakkında", sub: "Nasıl çalıştığını öğren", icon: IconInfo, color: "sky", action: "process_info" },
    { label: "Sesli Konuşma", sub: "Mikrofona basıp konuşun", icon: IconMic, color: "rose", prompt: "__voice_hint" },
  ];

  /** Action / prompt'a göre quick action'ı tetikleyen yardımcı fonksiyon */
  const triggerQuickAction = (qa: { label: string; action?: string; prompt?: string }) => {
    if (qa.prompt === "__voice_hint") {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Mesaj kutusunun yanındaki mikrofon ikonuna tıklayıp konuşmaya başlayın. Türkçe konuştuklarınız otomatik olarak yazıya dökülür.",
        type: "text",
        complete: true,
      }]);
      return;
    }
    const userMessage = qa.prompt || qa.label;
    setMessages(prev => [...prev, { role: "user", text: userMessage, type: "text" }]);
    processResponse(userMessage, qa.action);
  };

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
      type: "text",
      complete: true,
    }]);
    setIsTyping(false);
    return;
  }

  // 2. Kural: Şikayet yazma butonu tıklandıysa veya kullanıcı bunu yazdıysa API'ye gitme, kullanıcıyı bekle
  if (userText.toLowerCase().includes("yeni bir şikayet") || userText.toLowerCase().includes("şikayet yaz")) {
    setMessages(prev => [...prev, {
      role: "bot",
      text: "Size yardımcı olmak için buradayım. Lütfen yaşadığınız deneyimi veya sorunu detaylıca aşağıya yazın.",
      type: "text",
      complete: true,
    }]);
    setIsTyping(false);
    return;
  }

  // 3. AI AGENT (Function Calling): Kullanıcı sayısal/istatistiksel bir sorgu yapıyorsa
  // bot DB'ye bakıp gerçek sayılarla cevap versin. /api/agent endpoint'i Llama 3.3'ün
  // tool calling yeteneğiyle çalışır.
  //
  // ÖNEMLİ: Pattern'lar dar tutuluyor; aksi takdirde "kaç gündür ürün bekliyorum" gibi
  // şikayet metinleri yanlışlıkla agent intent algılanıp /api/feedback/analyze'i
  // atlatıyor → veri kaybı oluyor. Her pattern, gerçek bir istatistik/veri sorgusu
  // olduğundan emin olacak şekilde geniş ifadeyle eşleşmeli.
  const lowerMsg = userText.toLowerCase();
  const agentPatterns: RegExp[] = [
    /kaç\s+(şikayet|tane|geri\s*bildirim|olumsuz|negatif|pozitif)/,
    /(şikayet|geri\s*bildirim)\s+(sayısı|sayi|adedi|kaç)/,
    /toplam\s+(kaç|şikayet|geri\s*bildirim|bildirim)/,
    /(en\s+(çok|cok|fazla))\s+(şikayet|marka|hangi)/,
    /hangi\s+(marka|firma)\s+(en\s+çok|en\s+fazla|kaç)/,
    /(istatistik|özet|ozet|raporla|dashboard|panel\s+verisi)/,
    /(insan\s+yardımı|insan\s+destek)\s+(kaç|sayı)/,
    /(şikayet|bildirim)\s+id\s*\d/,
    /id\s*[:#]?\s*\d+\s+(durum|şikayet|hangi)/,
    /memnuniyet\s+(oranı|yüzdesi|yuzdesi)/,
  ];
  const isAgentQuery = agentPatterns.some(re => re.test(lowerMsg));

  if (isAgentQuery) {
    try {
      const conversationHistory = messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
      const response = await fetch(`${API_URL}/api/agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: conversationHistory }),
      });
      const data = await response.json();

      setMessages(prev => [...prev, {
        role: "bot",
        text: data?.reply || "Veri alamadım, lütfen tekrar deneyin.",
        type: "text",
        complete: true,
        // Hangi tool'ları kullandığını rozet olarak göster (jüride çok şık duruyor)
        ...(data?.usedTools && data.usedTools.length > 0 ? { agentTools: data.usedTools } : {}),
      }]);
    } catch (err) {
      console.error("Agent hatası:", err);
      setMessages(prev => [...prev, {
        role: "bot",
        text: "🚨 Veri sunucusuna ulaşılamadı.",
        type: "text",
        complete: true,
      }]);
    } finally {
      setIsTyping(false);
      setInput("");
    }
    return;
  }

  try {
    // Konuşma geçmişini hazırla (max son 10 mesaj — bağlam için yeterli, token tasarrufu için sınırlı).
    const conversationHistory = messages.slice(-10).map(m => ({
      role: m.role,
      text: m.text
    }));

    // Mesaj gerçek bir geri bildirim mi?
    // Eşik kuralları yanlış negatif (örn. "Turkcell'e ulaşamıyorum" kaçırmak) yarattığı için
    // her mesajı analiz ediyoruz. Llama 70B "merhaba" gibi şeylere zaten "Neutral" +
    // "İletişim" der, küçük gürültü oluşur ama kısa şikayetler artık kaçmaz.
    const trimmedText = userText.trim();
    const wordCount = trimmedText.split(/\s+/).length;
    const looksLikeFeedback = trimmedText.length > 0;
    console.log("📝 [Analyze trigger]", { text: userText, wordCount, length: trimmedText.length, willAnalyze: looksLikeFeedback });

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
    // complete: true → useEffect bu mesajı sesli okumak için yeşil ışık olarak görür.
    // Streaming sırasında token'ların eklendiği geçici mesajlarda complete=false kalır.
    const botMessage: any = {
      role: "bot",
      text: finalText,
      type: aiData ? "analysis_result" : "text",
      complete: true,
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

      // HİBRİT DESTEK: backend confidence < 0.85 olduğunda needs_human=true gönderir.
      // Bu durumda kullanıcıya "uzman temsilciye yönlendirildiniz" banner'ı gösteriyoruz.
      if (analyzeResult?.data?.needs_human) {
        botMessage.needsHuman = true;
      }

      // MARKA ENTEGRASYONU: Llama şikayet metninden marka adını çıkardıysa
      // (örn. "Trendyol", "Getir"), bunu botMessage'a ekleyelim.
      // "Belirtilmemiş" değerlerini göstermiyoruz (kullanıcı yazmamış demek).
      const detectedBrand: string | undefined = analyzeResult?.data?.brand;
      if (detectedBrand && detectedBrand !== "Belirtilmemiş") {
        botMessage.brand = detectedBrand;
      }

      // MEMNUNİYET ANKETİ: backend'den dönen feedback id'sini bot mesajına ekleyelim.
      // Frontend daha sonra "/api/feedback/:id/rate" endpoint'ine 👍/👎 yollar.
      if (analyzeResult?.data?.id) {
        botMessage.feedbackId = analyzeResult.data.id;
      }
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

  // MEMNUNİYET ANKETİ: kullanıcı 👍/👎 tıklayınca DB'de helpful=true/false set ederiz.
  // Mesajı in-place update ederek butonları "Teşekkürler" haline getiriyoruz.
  const rateFeedback = async (messageIdx: number, feedbackId: number, helpful: boolean) => {
    // Önce optimistic update — kullanıcı butonun anında tepki verdiğini görsün.
    setMessages(prev => {
      const next = [...prev];
      if (next[messageIdx]) {
        next[messageIdx] = { ...next[messageIdx], rated: helpful ? "yes" : "no" };
      }
      return next;
    });

    // Sonra arka planda backend'e bildir.
    try {
      await fetch(`${API_URL}/api/feedback/${feedbackId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful }),
      });
    } catch (err) {
      console.warn("Rate gönderimi başarısız:", err);
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
        className={cn(
          "fixed z-[100] flex flex-col items-end gap-4 text-zinc-950 cursor-grab active:cursor-grabbing",
          // Mobilde her köşeden tam ekran, masaüstünde sağ alt köşede widget.
          isBotOpen ? "inset-0 sm:inset-auto sm:bottom-8 sm:right-8" : "bottom-8 right-8"
        )}
      >
        {isBotOpen && (
          <div className="w-full h-full sm:w-[380px] sm:h-[600px] bg-white sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-0 sm:border border-zinc-100 flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-900 p-5 flex justify-between items-center text-white border-b border-white/5">
              <div className="flex items-center gap-3">
                <BotAvatar className="!w-9 !h-9 ring-2 ring-white/20" />
                <div className="flex flex-col">
                  <span className="text-[12px] font-black tracking-tight text-white leading-tight">AI Feedback Assistant</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-300/80 leading-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    Çevrimiçi
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* VOICE OUTPUT TOGGLE — açıksa bot cevapları sesli okunur */}
                {voiceSupported && (
                  <button
                    onClick={() => setVoiceOutput(v => !v)}
                    title={voiceOutput ? "Sesli okumayı kapat" : "Sesli okumayı aç"}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      voiceOutput
                        ? "bg-cyan-400 text-indigo-950"          // AKTİF: net cyan zemin + koyu yazı
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    )}
                  >
                    {voiceOutput ? <IconSpeakerOn /> : <IconSpeakerOff />}
                    <span>{voiceOutput ? "Açık" : "Sesli"}</span>
                  </button>
                )}
                <button onClick={() => setIsBotOpen(false)}><IconX /></button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 space-y-4 font-medium">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-2 items-start animate-in fade-in slide-in-from-bottom-1 duration-300", m.role === "bot" ? "" : "justify-end")}>
                  {m.role === "bot" && <BotAvatar className="mt-1" />}
                  <div className={cn("p-4 rounded-2xl text-[13px] leading-relaxed max-w-[85%] shadow-sm", m.role === "bot" ? "bg-white border text-zinc-700 rounded-tl-md" : "bg-indigo-600 text-white rounded-tr-md")}>
                    {m.text}
                    
                    {/* MARKA ROZETİ — Llama metinden marka adını çıkardıysa göster.
                        Kullanıcının "doğru tespit edildi mi?" görsel onayı. */}
                    {m.brand && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <span>🏢 Marka:</span>
                        <span className="font-black tracking-wide">{m.brand}</span>
                      </div>
                    )}

                    {/* AGENT TOOL ROZETİ — bot bu cevap için DB'den gerçek veri çekti.
                        "AI Agent" davranışının görsel kanıtı, jüride çok prestijli duruyor. */}
                    {m.agentTools && m.agentTools.length > 0 && (
                      <div className="mt-3 inline-flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 border border-violet-200">
                        <span>🛠️ Tool kullanıldı:</span>
                        {m.agentTools.map((t: string, i: number) => (
                          <span key={i} className="font-mono lowercase tracking-tight">{t}</span>
                        ))}
                      </div>
                    )}

                    {/* HİBRİT DESTEK BANNER'I — confidence düşük ise insana yönlendir */}
                    {m.needsHuman && (
                      <div className="mt-3 mb-1 px-3 py-2.5 rounded-xl text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-300 text-center leading-relaxed">
                        👤 Şikayetiniz <u>uzman temsilcimize</u> yönlendirildi.
                        <br/>
                        <span className="font-medium text-amber-700 normal-case text-[10px]">En kısa sürede sizinle iletişime geçilecek.</span>
                      </div>
                    )}

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

                    {/* MEMNUNİYET ANKETİ — 👍/👎 — kullanıcı bot cevabını faydalı buldu mu? */}
                    {m.feedbackId && !m.rated && (
                      <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mr-1">Faydalı mıydı?</span>
                        <button
                          onClick={() => rateFeedback(i, m.feedbackId as number, true)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm transition-colors"
                          title="Faydalıydı"
                        >👍</button>
                        <button
                          onClick={() => rateFeedback(i, m.feedbackId as number, false)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm transition-colors"
                          title="Faydalı değildi"
                        >👎</button>
                      </div>
                    )}

                    {m.rated && (
                      <div className="mt-3 pt-3 border-t border-zinc-100 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {m.rated === "yes" ? "👍 Teşekkürler, geri bildiriminiz kayda geçti." : "👎 Geri bildiriminiz alındı, daha iyisini yapmak için kullanacağız."}
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
                <div className="pt-3 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-2 px-1">
                    <IconSparkle className="w-3 h-3 text-indigo-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Önerilen Konular</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((qa, i) => {
                      const Icon = qa.icon;
                      // Tailwind purge dynamic class'ları tanımıyor — statik map kullanıyoruz.
                      const colorMap: Record<string, { bg: string; text: string; hoverBorder: string; hoverBg: string; hoverIcon: string }> = {
                        indigo:  { bg: "bg-indigo-100",  text: "text-indigo-600",  hoverBorder: "hover:border-indigo-300",  hoverBg: "hover:bg-indigo-50/40",  hoverIcon: "group-hover:bg-indigo-200" },
                        fuchsia: { bg: "bg-fuchsia-100", text: "text-fuchsia-600", hoverBorder: "hover:border-fuchsia-300", hoverBg: "hover:bg-fuchsia-50/40", hoverIcon: "group-hover:bg-fuchsia-200" },
                        emerald: { bg: "bg-emerald-100", text: "text-emerald-600", hoverBorder: "hover:border-emerald-300", hoverBg: "hover:bg-emerald-50/40", hoverIcon: "group-hover:bg-emerald-200" },
                        amber:   { bg: "bg-amber-100",   text: "text-amber-600",   hoverBorder: "hover:border-amber-300",   hoverBg: "hover:bg-amber-50/40",   hoverIcon: "group-hover:bg-amber-200" },
                        sky:     { bg: "bg-sky-100",     text: "text-sky-600",     hoverBorder: "hover:border-sky-300",     hoverBg: "hover:bg-sky-50/40",     hoverIcon: "group-hover:bg-sky-200" },
                        rose:    { bg: "bg-rose-100",    text: "text-rose-600",    hoverBorder: "hover:border-rose-300",    hoverBg: "hover:bg-rose-50/40",    hoverIcon: "group-hover:bg-rose-200" },
                      };
                      const c = colorMap[qa.color] || colorMap.indigo;
                      return (
                        <button
                          key={i}
                          onClick={() => triggerQuickAction(qa)}
                          className={cn(
                            "group text-left p-3 rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                            c.hoverBorder, c.hoverBg
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={cn("flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors", c.bg, c.text, c.hoverIcon)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold text-zinc-900 leading-tight">{qa.label}</div>
                              <div className="text-[9px] text-zinc-500 leading-snug mt-0.5">{qa.sub}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {isTyping && (
                <div className="flex gap-2 items-start animate-in fade-in duration-300">
                  <BotAvatar className="mt-1" />
                  <div className="bg-white border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white border-t flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "🎤 Dinleniyor... konuşun" : "Şikayet veya önerinizi yazın..."}
                className="flex-1 bg-zinc-100 rounded-xl px-4 py-2 text-xs outline-none"
              />
              {/* VOICE INPUT — mikrofon butonu (sadece tarayıcı destekliyorsa) */}
              {voiceSupported && (
                <button
                  onClick={toggleListening}
                  title={isListening ? "Dinlemeyi durdur" : "Sesle yaz (Türkçe)"}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    isListening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  )}
                >
                  <IconMic className="w-5 h-5" />
                </button>
              )}
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

      {/* --- 2. HERO — gradient orb arkaplan + animated text --- */}
      <section id="hero" className="relative pt-48 pb-16 px-10 bg-white overflow-hidden">
        {/* Soft gradient orbs — modern dashboard'larda yaygın görsel */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Üstte mini rozet bandı — proje sahibi olduğun teknolojiyi pazarla */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">
                <IconSparkle className="w-3 h-3" />
                Llama 3.3 — 70B
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                %100 Doğruluk
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100">
                Gerçek Zamanlı
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl md:text-[5.5rem] font-black leading-[0.9] tracking-tighter uppercase">Deneyimle. <br/> Geri Bildirim Ver. <br/> <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Çözüm Bul.</span></h1>
              <p className="text-zinc-600 text-lg md:text-xl max-w-lg leading-relaxed font-medium">Müşteri geri bildirimlerinde yeni bir dönem. Şikayet ve önerilerinizi yapay zeka teknolojisiyle analiz ediyor, markalarla aranızda çözüm odaklı bir köprü kuruyoruz.</p>
            </div>
            <button onClick={() => setIsBotOpen(true)} className="bg-indigo-950 text-white px-12 py-5 rounded-2xl flex items-center gap-4 text-sm font-black tracking-widest uppercase hover:bg-indigo-900 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">ASİSTANI BAŞLAT <IconArrow /></button>
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

      {/* --- 5. METRİKLER — rapor sonuçlarıyla uyumlu, ölçülmüş gerçek değerler --- */}
      <section id="metrics" className="py-24 px-10 bg-indigo-950 text-white rounded-3xl mx-10 relative overflow-hidden">
        {/* Hafif arka plan grid efekti */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-4 font-black">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">SİSTEM <span className="text-cyan-400">METRİKLERİ</span></h2>
            <p className="text-indigo-300/60 font-black uppercase text-[10px] tracking-[0.4em]">24 Örnekli Etiketli Test Seti — Llama 3.3 70B</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-zinc-950">
            <AnalysisCircle percent={100} label="NLP Doğruluğu" dark />
            <AnalysisCircle percent={92} label="Kategori Sınıflandırma" dark />
            <AnalysisCircle percent={100} label="Duygu Analizi" dark />
            <AnalysisCircle percent={88} label="Genel Başarı" dark />
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
              <div
                key={i}
                style={{ animationDelay: `${i * 30}ms` }}
                className="bg-white p-10 rounded-3xl border border-zinc-200 hover:border-indigo-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] transition-all duration-300 group shadow-sm animate-in fade-in slide-in-from-bottom-2"
              >
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