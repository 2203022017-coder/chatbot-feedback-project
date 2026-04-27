// src/services/aiService.ts

export const analyzeSentiment = async (text: string) => {
    // Hocam, burada harici bir NLP API'sine (Hugging Face gibi) istek atıyoruz.
    // Şimdilik demo için temel bir mantık kuruyoruz:
    const lowerText = text.toLowerCase();
    
    let sentiment = 'Nötr';
    let score = 0.5;

    if (lowerText.includes('kötü') || lowerText.includes('şikayet') || lowerText.includes('yavaş')) {
        sentiment = 'Olumsuz';
        score = 0.2;
    } else if (lowerText.includes('iyi') || lowerText.includes('teşekkür') || lowerText.includes('hızlı')) {
        sentiment = 'Olumlu';
        score = 0.9;
    }

    return { sentiment, score };
};

export const classifyCategory = async (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('kargo') || lowerText.includes('teslimat')) return 'Lojistik';
    if (lowerText.includes('iade') || lowerText.includes('para')) return 'Finans';
    return 'Genel Destek';
};