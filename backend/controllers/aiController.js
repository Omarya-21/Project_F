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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callGeminiWithFallback = async (ai, options) => {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`🤖 Attempting GenAI generation using model: ${model} (attempt ${attempt}/2)...`);
        const response = await ai.models.generateContent({
          ...options,
          model: model,
        });
        
        if (response && response.text) {
          console.log(`✅ Success with model: ${model}`);
          return response;
        }
      } catch (err) {
        lastError = err;
        const errStr = typeof err === 'object' ? JSON.stringify(err) : String(err);
        console.warn(`⚠️ Warning: Model ${model} failed on attempt ${attempt}. Error: ${errStr}`);
        
        // If it's a key compromise/leak block error, there's no point in retrying/falling back
        if (errStr.includes("leaked") || errStr.includes("PERMISSION_DENIED") || errStr.includes("403")) {
          throw err;
        }

        if (attempt < 2) {
          await delay(1000);
        }
      }
    }
  }

  throw lastError;
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

    const response = await callGeminiWithFallback(ai, {
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

    // 503 error handling & other service unavailable errors
    if (errString.includes("503") || errString.includes("UNAVAILABLE") || errString.includes("high demand") || errString.includes("ResourceExhausted") || errString.includes("429")) {
      return res.json({
        text: "⚠️ **Google AI Service High Demand / Unavailable**\n\nThe AI models are currently experiencing extremely high demand or are under heavy load. Below is an offline compatibility guide to help you build or check your PC right now:\n\n- **CPU & Motherboard Sockets**: Intel 12th/13th/14th Gen use **LGA1700**, AMD Ryzen 7000/9000 use **AM5**. Ensure your CPU and motherboard socket match exactly.\n- **RAM Generations**: Ensure your Motherboard and CPU both support the correct technology (**DDR4** vs **DDR5**). You cannot mix DDR4 RAM with a DDR5 motherboard.\n- **Power Supply (PSU)**: Add up your CPU's and GPU's power draws and add standard headroom. Aim for at least 650W-850W for modern gaming builds with high-end GPUs.\n\n*Please try sending your message again in a few moments, or check your components' specs manually!*"
      });
    }
    
    res.json({ 
      text: "⚠️ **AI Assistant Connection Issue**\n\nI was unable to connect to the Google GenAI service. Please check that your network connection is stable, or retry in a few moments." 
    });
  }
};
