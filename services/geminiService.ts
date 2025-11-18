import { GoogleGenAI, Type } from "@google/genai";
import { SentimentResponse } from "../types";

// Initialize the Gemini API client
// Note: In a real production environment, API calls should be proxied through a backend 
// to protect the API key. For this mini-app demo, we use the env variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEntryReflection = async (content: string): Promise<SentimentResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
      config: {
        systemInstruction: `
          You are 'The Void', a digital stoic philosopher residing on the blockchain. 
          Analyze the user's diary entry.
          1. Determine a single-word 'Mood' (e.g., Melancholic, Hopeful, Manic, Zen).
          2. Provide a short, cryptic but supportive 1-sentence reflection or question that deepens their thought.
          
          Return the result as JSON.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            reflection: { type: Type.STRING },
          },
          required: ["sentiment", "reflection"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as SentimentResponse;
    }
    
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini reflection failed:", error);
    return {
      sentiment: "Unknown",
      reflection: "The void is silent today. Your words are preserved regardless."
    };
  }
};