import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

let aiClient = null;

const getAIClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in backend environment");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
};

export const getAdvice = async (req, res) => {
  const { messages, products } = req.body;

  try {
    const ai = getAIClient();
    
    // Format full conversation for Gemini SDK
    const contents = (messages || []).map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.parts?.[0]?.text || m.content || "" }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: `
          You are a Nexus PC Build Assistant. Your goal is to help customers choose compatible PC parts from our inventory.
          
          Here is our current inventory of products with their technical specifications:
          ${JSON.stringify(products, null, 2)}
          
          Key Compatibility Rules you must enforce:
          1. CPU & Motherboard must have matching Sockets (e.g., LGA1700, AM5).
          2. RAM must match Motherboard type (DDR4 or DDR5).
          3. PSU wattage should be at least 20-30% higher than the GPU's power requirement.
          4. Motherboard Form Factor must fit in the Case.
          
          When recommending products:
          - Use the exact name from the inventory.
          - If possible, include the image URL in markdown format like ![name](url) to show the user what the part looks like.
          
          Be professional, technical yet accessible. Keep responses concise but helpful.
        `,
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ error: error.message || "Failed to get AI advice" });
  }
};
