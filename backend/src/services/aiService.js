"use strict";
// src/services/aiService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyCategory = exports.analyzeSentiment = void 0;
const analyzeSentiment = async (text) => {
    // Hocam, burada harici bir NLP API'sine (Hugging Face gibi) istek atıyoruz.
    // Şimdilik demo için temel bir mantık kuruyoruz:
    const lowerText = text.toLowerCase();
    let sentiment = 'Nötr';
    let score = 0.5;
    if (lowerText.includes('kötü') || lowerText.includes('şikayet') || lowerText.includes('yavaş')) {
        sentiment = 'Olumsuz';
        score = 0.2;
    }
    else if (lowerText.includes('iyi') || lowerText.includes('teşekkür') || lowerText.includes('hızlı')) {
        sentiment = 'Olumlu';
        score = 0.9;
    }
    return { sentiment, score };
};
exports.analyzeSentiment = analyzeSentiment;
const classifyCategory = async (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('kargo') || lowerText.includes('teslimat'))
        return 'Lojistik';
    if (lowerText.includes('iade') || lowerText.includes('para'))
        return 'Finans';
    return 'Genel Destek';
};
exports.classifyCategory = classifyCategory;
