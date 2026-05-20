export interface SpeechAnalysis {
  defectType: string;
  definition: string;
  severity: "yengil" | "o'rtacha" | "og'ir";
  direction: string;
  exercises: { title: string; description: string }[];
}

export async function analyzeSpeechDefect(description: string): Promise<SpeechAnalysis> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Client fetch error from /api/analyze:", error);
    return {
      defectType: "Aniqlanmadi",
      definition: "Tizimda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
      severity: "yengil",
      direction: "Mutaxassis bilan maslahatlashing.",
      exercises: [],
    };
  }
}
