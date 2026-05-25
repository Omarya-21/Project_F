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
    
    // Map roles to Gemini format: 'assistant' -> 'model', 'user' -> 'user'
    const contents = (messages || []).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || "" }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are a Nexus PC Build Assistant. Help customers choose compatible PC parts.
        
        Inventory: ${JSON.stringify(products || [])}
        
        Rules:
        1. Sockets must match (LGA1700, AM5).
        2. RAM type must match (DDR4/DDR5).
        3. PSU should have 20% headroom.
        4. Be direct and helpful like a professional builder.`
      }
    });

    const text = response.text || "I was unable to formulate compatibility advice. Please double-check your specs manually.";
    
    res.json({ text });
  } catch (error) {
    console.error("❌ AI Error:", error);
    
    const errString = typeof error === 'object' ? JSON.stringify(error) : String(error);
    if (errString.includes("leaked") || errString.includes("PERMISSION_DENIED") || errString.includes("403")) {
      return res.status(403).json({ 
        error: "Leaked API Key",
        text: "⚠️ **Gemini API Error (Leaked Key)**\n\nThe Gemini API key configured in this environment is reported as leaked or compromised by Google's security systems.\n\n**How to Fix This:**\n1. Go to [Google AI Studio](https://aistudio.google.com/) and create or retrieve a new API key.\n2. Open the **Settings > Secrets / Environment Variables** panel in Google AI Studio Build.\n3. Update the `GEMINI_API_KEY` with your new key.\n4. Restart the assistant or refresh your page to continue!"
      });
    }
    
    res.status(500).json({ error: "I'm having trouble thinking right now. Please try again." });
  }
};
