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
  console.log("🤖 Generating AI advice...");

  try {
    const ai = getAIClient();
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are a Nexus PC Build Assistant. Help customers choose compatible PC parts.
      
      Inventory: ${JSON.stringify(products || [])}
      
      Rules:
      1. Sockets must match (LGA1700, AM5).
      2. RAM type must match (DDR4/DDR5).
      3. PSU should have 20% headroom.
      4. Be direct and helpful like a professional builder.`
    });
    
    // Map roles to Gemini format: 'assistant' -> 'model', 'user' -> 'user'
    const contents = (messages || []).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || "" }]
    }));

    const result = await model.generateContent({ contents });
    const text = result.response.text();
    
    res.json({ text });
  } catch (error) {
    console.error("❌ AI Error:", error);
    res.status(500).json({ error: "I'm having trouble thinking right now. Please try again." });
  }
};
