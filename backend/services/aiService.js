const { GoogleGenerativeAI } = require('@google/generative-ai');

// Retry logic with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isLastAttempt = attempt === maxRetries - 1;
            const status = error.response?.status || error.status;

            if (status === 503 && !isLastAttempt) {
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
};

const estimateCaloriesAI = async (exerciseName, durationInMinutes) => {
    try {
        const result = await retryWithBackoff(async () => {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

            const prompt = `You are a fitness API. A user performed the Exercise"${exerciseName}" for ${durationInMinutes} minutes. Estimate the total calories burned. Respond with ONLY a valid JSON object in this exact format :{"calories": 300}. Do not include markdown, code blocks, or any other text.`;

            const response = await model.generateContent(prompt);
            return response.response.text();
        });

        const parsed = JSON.parse(result);
        return parsed.calories;
    } catch (error) {
        return durationInMinutes * 5;
    }
};

module.exports = { estimateCaloriesAI };