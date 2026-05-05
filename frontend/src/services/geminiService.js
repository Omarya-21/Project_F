import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Try different ways the platform might provide the key
  return (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : null) || 
         (import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : null) ||
         "";
};

let genAIInstance = null;

const getAIInstance = () => {
  if (!genAIInstance) {
    const key = getApiKey();
    if (!key) {
      throw new Error("AI Configuration Error: Missing API Key");
    }
    genAIInstance = new GoogleGenAI(key);
  }
  return genAIInstance;
};

export const getBuildAdvice = async (messages, products) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing!");
    throw new Error("AI Configuration Error: Missing API Key");
  }

  try {
    const aiAccount = getAIInstance();
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
    // The last message is the current user prompt
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || m.parts?.[0]?.text || "" }]
    }));

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content || lastMessage.parts?.[0]?.text || "";

    const model = aiAccount.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const chat = model.startChat({
      history: history
    });

    const result = await chat.sendMessage(userPrompt);
    const text = result.response.text();

    return text;
  } catch (error) {
    console.error("AI Advice Service Error:", error);
    throw error;
  }
};
