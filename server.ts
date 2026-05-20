import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Initialize Gemini on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON body parsing middleware
app.use(express.json());

// API route for diagnostic speech analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || typeof description !== "string") {
      return res.status(400).json({ error: "Tavsif kiritilishi shart" });
    }

    const prompt = `
      Siz tajribali o'zbek tili logoped mutaxassisiz. Quyidagi nutq nuqsoni tavsifini tahlil qiling:
      Tavsif: "${description}"
      
      Javobni mutlaqo JSON formatida, o'zbek tilida qaytaring:
      {
        "defectType": "nuqsonning qisqa nomi (masalan: Dislaliya, Logonevroz, Rinolaliya, Dizartriya)",
        "definition": "nuqsonga logopedik-ilmiy ta'rif va uning o'ziga xos xususiyatlari",
        "severity": "yengil" | "o'rtacha" | "og'ir",
        "direction": "ushbu nuqsonni bartaraf etish uchun dars va hayotda qo'llaniladigan asosiy yo'nalish hamda metodik ko'rsatmalar",
        "exercises": [
          {
            "title": "mashq nomi",
            "description": "mashqni o'qituvchi yoki ota-ona bolaga qanday o'tkazishi kerakligi haqida batafsil va aniq metodik qo'llanma"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const data = JSON.parse(responseText.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini API server-side error:", error);
    return res.status(500).json({
      error: "Tahlil qilishda serverda xatolik yuz berdi"
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Vite middleware for development or serving built dist in production
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupApp();
