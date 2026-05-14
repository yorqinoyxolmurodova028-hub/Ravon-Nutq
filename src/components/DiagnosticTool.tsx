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
    <section className="py-12 px-4 max-w-4xl mx-auto min-h-[70vh]">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black font-display text-slate-900 mb-4 bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
          Nutqni Tahlil Qilamiz! 🔍
        </h2>
        <p className="text-xl text-slate-500 font-medium">
          O'quvchining nutqidagi muammolarni batafsil yozing, biz esa yordamlashamiz!
        </p>
      </div>

      <Card className="mb-10 rounded-3xl border-4 border-sky-100 shadow-xl overflow-hidden sticker-shadow bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-3 bg-sky-200/50 w-full overflow-hidden">
          {loading && <motion.div 
            className="h-full bg-sky-500"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />}
        </div>
        <CardHeader className="pt-8">
          <CardTitle className="flex items-center gap-3 text-2xl font-black font-display text-sky-600">
            <div className="bg-sky-100 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-sky-500 animate-pulse" />
            </div>
            Tavsif kiriting
          </CardTitle>
          <CardDescription className="text-lg font-medium text-slate-400">AI yordamida dastlabki tashxis qo'yish</CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <textarea
            className="w-full min-h-[180px] p-6 rounded-2xl border-4 border-slate-50 focus:border-sky-300 outline-none transition-all resize-none text-xl bg-slate-50/50 font-medium text-slate-700 placeholder:text-slate-300"
            placeholder="Masalan: O'quvchi gapirganda ba'zi tovushlarni tushirib qoldiradi, ayniqsa 'l' va 'r' tovushlarida qiynaladi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button 
            className="w-full mt-6 h-18 text-2xl font-black rounded-2xl shadow-xl bg-sky-500 hover:bg-sky-600 border-b-8 border-sky-700 active:border-b-0 active:translate-y-2 transition-all sticker-shadow" 
            onClick={handleAnalyze}
            disabled={loading || !description.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-8 w-8 animate-spin" />
                Tahlil qilinmoqda...
              </>
            ) : (
              <>
                <Send className="mr-3 h-8 w-8" />
                Natijani bilish!
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
