const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateChatResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 🟢 FIX: Sabse stable aur high-quota model
        const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

        const systemPrompt = "You are a professional, motivating AI Fitness Coach. Answer the user's questions about workouts, diet, and gym routines concisely and enthusiastically. Keep answers under 3 paragraphs.";
        const fullPrompt = `${systemPrompt}\n\nUser asks: ${prompt}`;

        const response = await model.generateContent(fullPrompt);

        res.status(200).json({ reply: response.response.text() });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ message: `Backend Error: ${error.message}` });
    }
};

const generateFitnessPlan = async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) {
            return res.status(400).json({ message: "Please provide a fitness goal." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 🟢 FIX: Sabse stable aur high-quota model
        const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

        const prompt = `Act as an expert fitness coach. Create a 7-day workout and diet plan for someone whose goal is: "${goal}". 
        Format the response entirely in clean HTML. 
        Use <h2> for the main title, <h3> for Day 1 to Day 7, and <ul>/<li> for diets and exercises. 
        Do not use any markdown formatting like \`\`\`html. Just return the raw HTML string.`;

        const response = await model.generateContent(prompt);

        res.status(200).json({ plan: response.response.text() });
    } catch (error) {
        console.error('AI Plan Error:', error);
        
        if (error.status === 503) {
            return res.status(503).json({ 
                message: 'AI servers are currently busy. Please wait 10 seconds and try again.',
                code: 'SERVICE_UNAVAILABLE'
            });
        } else if (error.status === 429) {
             return res.status(429).json({ 
                message: 'Daily AI Limit Exceeded. Please try again tomorrow.',
                code: 'QUOTA_EXCEEDED'
            });
        }
        
        res.status(500).json({ message: `Backend Error: ${error.message}` });
    }
};

module.exports = { generateChatResponse, generateFitnessPlan };