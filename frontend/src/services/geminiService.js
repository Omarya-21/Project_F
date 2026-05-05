import { GoogleGenAI } from "@google/genai";

// Initialization follows the skill's guidance for React (Vite)
// The API key is handled externally by the platform.
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const getBuildAdvice = async (messages, products) => {
  try {
    const systemInstruction = `
      You are a Nexus PC Build Assistant. Your goal is to help customers choose compatible PC parts from our inventory.
      
      Here is our current inventory of products with their technical specifications:
      ${JSON.stringify(products, null, 2)}
      
      Key Compatibility Rules you must enforce:
      1. CPU & Motherboard must have matching Sockets (e.g., LGA1700, AM5).
      2. RAM must match Motherboard type (DDR4 or DDR5).
      3. PSU wattage should be at least 20-30% higher than the GPU's power requirement (rough estimate).
      4. Motherboard Form Factor must fit in the Case (if requested).
      
      If a user asks for a build, recommend specific parts from the inventory.
      If parts are incompatible, explain why clearly.
      Be professional, technical yet accessible, and always prioritize accuracy.
      Keep responses concise.
    `;

    // Process messages for chat
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || m.parts?.[0]?.text || "" }]
    }));

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content || lastMessage.parts?.[0]?.text || "";

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: systemInstruction,
      },
      history: history
    });

    const response = await chat.sendMessage({
      message: userPrompt
    });

    return response.text;
  } catch (error) {
    if (error.message?.includes("API Key")) {
      console.error("Gemini API Key Error. Please ensure GEMINI_API_KEY is set in the environment.");
    }
    console.error("AI Advice Service Error:", error);
    throw error;
  }
};
