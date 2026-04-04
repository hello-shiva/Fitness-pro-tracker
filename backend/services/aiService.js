const {GoogleGenAi} = require('@google/genai');

const estimateCaloriesAI = async (exerciseName,durationInMinutes) =>{
    try{
        const ai = new GoogleGenAi({apiKey:process.env.GEMINI_API_KEY});

        const prompt = `You are a fitness API. A user performed the Exercise"${exerciseName}" for ${durationInMinutes} minutes. Estimate the total calories burned. Respond with ONLY a valid JSON object in this exact format :{"calories": 300}. Do not include markdown, code blocks, or any other text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const result =JSON.parse(response.text);
        return result.calories;
    } catch(error){
        console.error('AI calculation Error:',error.message);

        return durationInMinutes *5;
    }
};
module.exports ={estimateCaloriesAI};