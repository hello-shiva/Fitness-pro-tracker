const { GoogleGenAI } = require('@google/genai');

const generateChatResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const systemPrompt = "You are a professional, motivating AI Fitness Coach. Answer the user's questions about workouts, diet, and gym routines concisely and enthusiastically. Keep answers under 3 paragraphs.";

        const fullPrompt = `${systemPrompt}\n\nUser asks: ${prompt}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        res.status(200).json({ reply: response.text });
    } catch (error) {
        console.error('AI Chat Error:', error.message);
        res.status(500).json({ message: 'Failed to connect to the Coach' });
    }
};
const generateFitnessPlan = async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) {
            return res.status(400).json({ message: "Please provide a fitness goal." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Act as an expert fitness coach. Create a 7-day workout and diet plan for someone whose goal is: "${goal}". 
        Format the response entirely in clean HTML. 
        Use <h2> for the main title, <h3> for Day 1 to Day 7, and <ul>/<li> for diets and exercises. 
        Do not use any markdown formatting like \`\`\`html. Just return the raw HTML string.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.status(200).json({ plan: response.text });
    } catch (error) {
        console.error('AI Plan Error:', error.message);
        res.status(500).json({ message: 'Failed to generate AI plan.' });
    }
};
module.exports = { generateChatResponse, generateFitnessPlan };