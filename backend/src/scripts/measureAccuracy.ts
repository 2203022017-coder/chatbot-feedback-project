/**
 * AI Feedback Hub — Doğruluk Ölçüm Scripti
 *
 * Etiketli test veri setini (backend/data/test_dataset.json) Llama 3.1 modeline
 * tek tek gönderir, modelin tahminlerini gerçek etiketlerle karşılaştırır ve
 * doğruluk oranlarını hesaplayıp backend/data/accuracy_results.json dosyasına yazar.
 *
 * Çalıştırma (backend klasöründen):
 *     npm run measure
 *
 * Bu script mevcut /api/feedback/analyze endpoint'inin kullandığı sistem prompt'unun
 * birebir aynısını kullanır — yani gerçekten "üretim" modelinin doğruluğunu ölçer.
 */

import 'dotenv/config';
import { Groq } from 'groq-sdk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { ANALYZE_SYSTEM_PROMPT, ANALYZE_MODEL } from '../prompts/analyzePrompt';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error("❌ GROQ_API_KEY tanımlı değil. backend/.env dosyasına ekleyin.");
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

const CATEGORIES = ["Lojistik", "Teknik", "Ödeme", "İletişim", "Ürün", "İşlem"] as const;

interface Sample {
  id: number;
  text: string;
  expected_category: string;
  expected_sentiment: string;
}

interface PredictionResult {
  id: number;
  text: string;
  expected_category: string;
  expected_sentiment: string;
  predicted_category: string;
  predicted_sentiment: string;
  confidence_score: number;
  category_correct: boolean;
  sentiment_correct: boolean;
  error?: string;
}

/**
 * /api/feedback/analyze endpoint'iyle BİREBİR aynı sistem prompt'u ve model.
 * Bu sayede ölçtüğümüz şey, kullanıcının gerçekten konuştuğu sistemin kendisi.
 * Prompt'u veya modeli güncellemek istersen tek dosya: src/prompts/analyzePrompt.ts
 */
async function analyze(text: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: ANALYZE_SYSTEM_PROMPT },
      { role: "user", content: text }
    ],
    model: ANALYZE_MODEL,
    response_format: { type: "json_object" }
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const data = JSON.parse(raw);
  return {
    category: String(data.nlp_category || "?"),
    sentiment: String(data.sentiment_label || "?"),
    confidence: Number(data.confidence_score) || 0
  };
}

async function main() {
  const datasetPath = join(process.cwd(), 'data', 'test_dataset.json');
  if (!existsSync(datasetPath)) {
    throw new Error(`Test veri seti bulunamadı: ${datasetPath}\nLütfen 'cd backend' yapıp scripti tekrar çalıştırın.`);
  }

  const dataset = JSON.parse(readFileSync(datasetPath, 'utf-8'));
  const samples: Sample[] = dataset.samples || [];

  if (samples.length === 0) {
    throw new Error("Test veri seti boş. backend/data/test_dataset.json dosyasını kontrol edin.");
  }

  console.log(`\n🧪 ${samples.length} örnek üzerinde doğruluk ölçümü başlıyor...\n`);

  const results: PredictionResult[] = [];

  for (const sample of samples) {
    const preview = sample.text.length > 50 ? sample.text.slice(0, 47) + "..." : sample.text;
    process.stdout.write(`[${String(sample.id).padStart(2)}/${samples.length}] ${preview.padEnd(53)} `);

    try {
      const pred = await analyze(sample.text);
      const categoryCorrect = pred.category === sample.expected_category;
      const sentimentCorrect = pred.sentiment === sample.expected_sentiment;

      results.push({
        id: sample.id,
        text: sample.text,
        expected_category: sample.expected_category,
        expected_sentiment: sample.expected_sentiment,
        predicted_category: pred.category,
        predicted_sentiment: pred.sentiment,
        confidence_score: pred.confidence,
        category_correct: categoryCorrect,
        sentiment_correct: sentimentCorrect
      });

      const mark = categoryCorrect && sentimentCorrect
        ? "✅"
        : categoryCorrect || sentimentCorrect ? "⚠️ " : "❌";
      console.log(`${mark}  cat=${pred.category}  sent=${pred.sentiment}`);
    } catch (e: any) {
      console.log(`💥 ${e.message}`);
      results.push({
        id: sample.id,
        text: sample.text,
        expected_category: sample.expected_category,
        expected_sentiment: sample.expected_sentiment,
        predicted_category: "?",
        predicted_sentiment: "?",
        confidence_score: 0,
        category_correct: false,
        sentiment_correct: false,
        error: e.message
      });
    }

    // Groq rate limit'ine saygı: küçük bekleme
    await new Promise(r => setTimeout(r, 250));
  }

  const total = results.length;
  const correctCategory = results.filter(r => r.category_correct).length;
  const correctSentiment = results.filter(r => r.sentiment_correct).length;
  const correctBoth = results.filter(r => r.category_correct && r.sentiment_correct).length;

  // Kategori bazlı doğruluk (per-class accuracy / recall)
  const perCategoryAccuracy: Record<string, { total: number; correct: number; accuracy: number }> = {};
  for (const cat of CATEGORIES) {
    const inCat = results.filter(r => r.expected_category === cat);
    const cor = inCat.filter(r => r.category_correct).length;
    perCategoryAccuracy[cat] = {
      total: inCat.length,
      correct: cor,
      accuracy: inCat.length === 0 ? 0 : Math.round((cor / inCat.length) * 100)
    };
  }

  // Confusion matrix (kategori için)
  const confusionMatrix: Record<string, Record<string, number>> = {};
  for (const cat of CATEGORIES) {
    confusionMatrix[cat] = Object.fromEntries(CATEGORIES.map(c => [c, 0]));
  }
  for (const r of results) {
    if (
      (CATEGORIES as readonly string[]).includes(r.expected_category) &&
      (CATEGORIES as readonly string[]).includes(r.predicted_category)
    ) {
      confusionMatrix[r.expected_category][r.predicted_category]++;
    }
  }

  const summary = {
    timestamp: new Date().toISOString(),
    model: ANALYZE_MODEL,
    total_samples: total,
    category_accuracy_pct: Math.round((correctCategory / total) * 100),
    sentiment_accuracy_pct: Math.round((correctSentiment / total) * 100),
    overall_accuracy_pct: Math.round((correctBoth / total) * 100),
    correct_counts: {
      category: correctCategory,
      sentiment: correctSentiment,
      both: correctBoth
    },
    per_category_accuracy: perCategoryAccuracy,
    confusion_matrix: confusionMatrix,
    results
  };

  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  const outPath = join(dataDir, 'accuracy_results.json');
  writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf-8');

  console.log("\n" + "=".repeat(64));
  console.log("📊  DOĞRULUK ÖLÇÜM SONUÇLARI");
  console.log("=".repeat(64));
  console.log(`Toplam örnek:               ${total}`);
  console.log(`Kategori doğruluğu:         %${summary.category_accuracy_pct}   (${correctCategory}/${total})`);
  console.log(`Sentiment doğruluğu:        %${summary.sentiment_accuracy_pct}   (${correctSentiment}/${total})`);
  console.log(`Genel doğruluk (ikisi):     %${summary.overall_accuracy_pct}   (${correctBoth}/${total})`);
  console.log("\nKategori bazlı doğruluk:");
  for (const [cat, stats] of Object.entries(perCategoryAccuracy)) {
    const bar = "█".repeat(Math.round(stats.accuracy / 5)).padEnd(20);
    console.log(`  ${cat.padEnd(10)} ${bar} %${String(stats.accuracy).padStart(3)}  (${stats.correct}/${stats.total})`);
  }
  console.log(`\n💾  Detaylı sonuçlar:  ${outPath}`);
  console.log("✅  Ölçüm tamamlandı.\n");
}

main().catch(e => {
  console.error("\n❌  Beklenmeyen hata:", e?.message || e);
  process.exit(1);
});
