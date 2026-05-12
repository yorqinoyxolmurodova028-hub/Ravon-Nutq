import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeSpeechDefect, SpeechAnalysis } from "@/src/services/geminiService";
import { Loader2, Send, CheckCircle2, AlertCircle, Info, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BG_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/03/10/audio_f523098f62.mp3"; // Soft ambient

export function DiagnosticTool() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpeechAnalysis | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(BG_MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.05; // Very subtle

    const playMusic = () => {
      audioRef.current?.play().catch(() => {});
    };

    window.addEventListener('mousedown', playMusic, { once: true });

    return () => {
      audioRef.current?.pause();
      window.removeEventListener('mousedown', playMusic);
    };
  }, []);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null); // Clear previous result
    try {
      const analysis = await analyzeSpeechDefect(description);
      setResult(analysis);
      // Scroll to result after a short delay to allow rendering
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Nutqni Tahlil Qilish</h2>
        <p className="text-muted-foreground">
          O'quvchining nutqidagi muammolarni batafsil yozing (masalan: "r" harfini ayta olmaydi, duduqlanadi).
        </p>
      </div>

      <Card className="mb-8 border-2 border-primary/20 shadow-xl overflow-hidden">
        <div className="h-2 bg-primary/10 w-full overflow-hidden">
          {loading && <motion.div 
            className="h-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />}
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Tavsif kiriting
          </CardTitle>
          <CardDescription>AI yordamida dastlabki tashxis qo'yish</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-[150px] p-4 rounded-xl border-2 border-muted focus:border-primary outline-none transition-all resize-none text-lg bg-muted/30"
            placeholder="Masalan: O'quvchi gapirganda ba'zi tovushlarni tushirib qoldiradi, ayniqsa 'l' va 'r' tovushlarida qiynaladi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button 
            className="w-full mt-4 h-14 text-lg font-bold shadow-lg shadow-primary/20" 
            onClick={handleAnalyze}
            disabled={loading || !description.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Tahlil qilinmoqda...
              </>
            ) : (
              <>
                <Send className="mr-2 h-6 w-6" />
                Tahlilni boshlash
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div ref={resultRef} />

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px bg-border flex-1" />
            <h3 className="text-xl font-bold text-primary px-4">Tahlil Natijasi</h3>
            <div className="h-px bg-border flex-1" />
          </div>

          <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl text-primary">{result.defectType}</CardTitle>
                  <CardDescription className="text-lg mt-1">Aniqlangan nuqson turi</CardDescription>
                </div>
                <Badge className={`text-sm px-4 py-1 rounded-full ${
                  result.severity === "og'ir" ? "bg-destructive text-destructive-foreground" : 
                  result.severity === "o'rtacha" ? "bg-accent text-accent-foreground" : 
                  "bg-secondary text-secondary-foreground"
                }`}>
                  {result.severity.toUpperCase()} DARAJA
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid gap-8">
                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <h4 className="font-bold text-xl mb-3 flex items-center gap-2 text-primary">
                    <Info className="w-6 h-6" />
                    Nuqson ta'rifi:
                  </h4>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {result.definition}
                  </p>
                </div>

                <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10">
                  <h4 className="font-bold text-xl mb-3 flex items-center gap-2 text-secondary-foreground">
                    <CheckCircle2 className="w-6 h-6" />
                    Bartaraf etish yo'nalishi:
                  </h4>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {result.direction}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-accent-foreground">
                    <AlertCircle className="w-6 h-6" />
                    Tavsiya etilgan mashqlar:
                  </h4>
                  <div className="grid gap-4">
                    {result.exercises.map((ex, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-muted/50 rounded-2xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <h5 className="font-bold text-primary text-lg mb-2">{ex.title}</h5>
                        <p className="text-muted-foreground leading-relaxed">{ex.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </section>
  );
}
