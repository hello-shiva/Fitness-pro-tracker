const {GoogleGenAI} = require('@google/genai');

const generateChatResponse = async (req, res)=>{
    try{
        const {prompt} = req.body;
        const ai= new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

        const systemPrompt = "You are a professional, motivating AI Fitness Coach. Answer the user's questions about workouts, diet, and gym routines concisely and enthusiastically. Keep answers under 3 paragraphs.";

        const fullPrompt = `${systemPrompt}\n\nUser asks: ${prompt}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents:fullPrompt,
        });

        res.status(200).json({reply: response.text});
    } catch (error){
        console.error('AI Chat Error:',error.message);
        res.status(500).json({message:'Failed to connect to the Coach'});
    }
};

module.exports = {generateChatResponse};