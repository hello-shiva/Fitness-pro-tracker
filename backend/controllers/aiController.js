const { GoogleGenerativeAI } = require('@google/generative-ai');

// Retry logic with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isLastAttempt = attempt === maxRetries - 1;
            const status = error.response?.status || error.status;

            // Only retry on 503 (Service Unavailable) errors
            if (status === 503 && !isLastAttempt) {
                const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
                console.log(`API temporarily unavailable. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
};

const generateChatResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await retryWithBackoff(async () => {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const systemPrompt = "You are a professional, motivating AI Fitness Coach. Answer the user's questions about workouts, diet, and gym routines concisely and enthusiastically. Keep answers under 3 paragraphs.";
            const fullPrompt = `${systemPrompt}\n\nUser asks: ${prompt}`;

            return await model.generateContent(fullPrompt);
        });

        res.status(200).json({ reply: response.response.text() });
    } catch (error) {
        console.error('AI Chat Error:', error.message);
        const status = error.response?.status || error.status;
        
        if (status === 503) {
            return res.status(503).json({ 
                message: 'AI service temporarily unavailable. Please try again in a few moments.',
                code: 'SERVICE_UNAVAILABLE'
            });
        }
        
        res.status(500).json({ message: 'Failed to connect to the Coach' });
    }
};

const generateFitnessPlan = async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) {
            return res.status(400).json({ message: "Please provide a fitness goal." });
        }

        const response = await retryWithBackoff(async () => {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const prompt = `Act as an expert fitness coach. Create a 30-day workout and diet plan for someone whose goal is: "${goal}". 
        Format the response entirely in clean HTML. 
        Use <h2> for the main title, <h3> for Day 1 to Day 30, and <ul>/<li> for diets and exercises. 
        Do not use any markdown formatting like \`\`\`html. Just return the raw HTML string.`;

            return await model.generateContent(prompt);
        });

        res.status(200).json({ plan: response.response.text() });
    } catch (error) {
        console.error('AI Plan Error:', error.message);
        const status = error.response?.status || error.status;
        
        if (status === 503) {
            return res.status(503).json({ 
                message: 'AI service temporarily unavailable. Please try again in a few moments.',
                code: 'SERVICE_UNAVAILABLE'
            });
        }
        
        res.status(500).json({ message: 'Failed to generate AI plan.' });
    }
};

module.exports = { generateChatResponse, generateFitnessPlan };