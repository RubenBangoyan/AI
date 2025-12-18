
import { GoogleGenAI, Modality } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const getTransportInsights = async (mode: string, context?: string) => {
  const ai = getAIClient();
  const prompt = `Act as an expert AI consultant for the ${mode} transport sector. 
  Provide 3 specific, actionable AI-driven insights for optimizing operations, reducing costs, or improving safety in this field.
  Include one current trend. Context: ${context || 'General optimization'}.
  Respond in JSON format with an array of objects: { "title": string, "description": string, "impact": "High" | "Medium" | "Low" }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching insights:", error);
    return [];
  }
};

export const askTransportAI = async (query: string, useMaps: boolean = false) => {
  const ai = getAIClient();
  try {
    const model = useMaps ? 'gemini-2.5-flash-lite-latest' : 'gemini-3-flash-preview';
    const tools: any[] = [{ googleSearch: {} }];
    if (useMaps) tools.push({ googleMaps: {} });

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: { tools }
    });

    return {
      answer: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error asking AI:", error);
    return { answer: "I encountered an error while processing your request.", sources: [] };
  }
};

export const generateTransportImage = async (prompt: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ text: `Create a professional, futuristic concept visualization for: ${prompt}. High quality, cinematic lighting, industrial design style.` }],
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const connectVoiceDispatcher = (callbacks: any) => {
  const ai = getAIClient();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
      },
      systemInstruction: 'You are an AI Transport Dispatcher. You help users manage logistics, flight paths, and rail schedules via voice. Keep responses concise and professional.',
    },
  });
};
