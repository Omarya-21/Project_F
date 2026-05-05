import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getBuildAdvice = async (messages, products) => {
  try {
    const model = "gemini-3-flash-preview";
    
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

    const response = await ai.models.generateContent({
      model: model,
      contents: messages,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
