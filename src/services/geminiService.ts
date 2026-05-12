import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SpeechAnalysis {
  defectType: string;
  definition: string;
  severity: "yengil" | "o'rtacha" | "og'ir";
  direction: string;
  exercises: { title: string; description: string }[];
}

export async function analyzeSpeechDefect(description: string): Promise<SpeechAnalysis> {
  const prompt = `
    Siz tajribali logoped mutaxassisiz. Quyidagi nutq nuqsoni tavsifini tahlil qiling:
    Tavsif: "${description}"
    
    Javobni JSON formatida, o'zbek tilida qaytaring:
    {
      "defectType": "nuqsonning qisqa nomi (masalan: Dislaliya, Logonevroz)",
      "definition": "nuqsonga ilmiy ta'rif va uning o'ziga xos xususiyatlari",
      "severity": "yengil" | "o'rtacha" | "og'ir",
      "direction": "ushbu nuqsonni bartaraf etish uchun asosiy yo'nalish va metodik ko'rsatmalar",
      "exercises": [
        {
          "title": "mashq nomi",
          "description": "mashqni bajarish tartibi haqida batafsil ma'lumot"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      defectType: "Aniqlanmadi",
      definition: "Tizimda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
      severity: "yengil",
      direction: "Mutaxassis bilan maslahatlashing.",
      exercises: [],
    };
  }
}
