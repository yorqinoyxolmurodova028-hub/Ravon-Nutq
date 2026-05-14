import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, RotateCcw, ArrowRight, PartyPopper, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult } from "../lib/effects";

interface Level {
  id: number;
  type: "word" | "sentence";
  target: string;
  parts: string[];
  difficulty: "Oson" | "O'rtacha" | "Murakkab";
  icon?: string;
}

const levels: Level[] = [
  // --- WORDS (Syllables) ---
  { id: 1, type: "word", target: "ONA", parts: ["O", "NA"], difficulty: "Oson", icon: "👩" },
  { id: 2, type: "word", target: "BOLA", parts: ["BO", "LA"], difficulty: "Oson", icon: "👶" },
  { id: 3, type: "word", target: "OLMA", parts: ["OL", "MA"], difficulty: "Oson", icon: "🍎" },
  { id: 4, type: "word", target: "KITOB", parts: ["KI", "TOB"], difficulty: "Oson", icon: "📖" },
  
  { id: 5, type: "word", target: "DARAXT", parts: ["DA", "RAXT"], difficulty: "O'rtacha", icon: "🌳" },
  { id: 6, type: "word", target: "MAKTAB", parts: ["MAK", "TAB"], difficulty: "O'rtacha", icon: "🏫" },
  { id: 7, type: "word", target: "QUYOSH", parts: ["QU", "YOSH"], difficulty: "O'rtacha", icon: "☀️" },
  { id: 8, type: "word", target: "LOGOPED", parts: ["LO", "GO", "PED"], difficulty: "O'rtacha", icon: "👩‍⚕️" },
  
  { id: 9, type: "word", target: "KOMPYUTER", parts: ["KOM", "PYU", "TER"], difficulty: "Murakkab", icon: "💻" },
  { id: 10, type: "word", target: "GULISTON", parts: ["GU", "LIS", "TON"], difficulty: "Murakkab", icon: "💐" },
  { id: 11, type: "word", target: "O'ZBEKISTON", parts: ["O'Z", "BE", "KIS", "TON"], difficulty: "Murakkab", icon: "🇺🇿" },

  // --- SENTENCES (Words) ---
  { id: 12, type: "sentence", target: "MEN MAKTABGA BORAMAN", parts: ["MEN", "MAKTABGA", "BORAMAN"], difficulty: "O'rtacha", icon: "🚶‍♂️" },
  { id: 13, type: "sentence", target: "DUNYO JUDA CHIROYLI", parts: ["DUNYO", "JUDA", "CHIROYLI"], difficulty: "O'rtacha", icon: "🌍" },
  { id: 14, type: "sentence", target: "LOGOPED MENI O'RGATADI", parts: ["LOGOPED", "MENI", "O'RGATADI"], difficulty: "Murakkab", icon: "🗣️" },
  { id: 15, type: "sentence", target: "KITOBLAR BILIM MANBAI HISOBLANADI", parts: ["KITOBLAR", "BILIM", "MANBAI", "HISOBLANADI"], difficulty: "Murakkab", icon: "📚" },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function WordBuilderGame() {
  const [gameLevels, setGameLevels] = useState<Level[]>(levels); // Not randomizing by default to keep difficulty curve
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [shuffledParts, setShuffledParts] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "success" | "finished">("ready");
  const [showFlash, setShowFlash] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentLevel = gameLevels[currentLevelIdx];

  useEffect(() => {
    // Music setup
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2024/02/09/audio_651a21e649.mp3"); // Quirky puzzle music
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;
    
    successAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_bbd13032d2.mp3"); // Success chime
    successAudioRef.current.volume = 0.4;
    
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const playFeedback = (isCorrect: boolean) => {
    if (isCorrect) {
      launchSuccessResult();
      const audioClone = successAudioRef.current?.cloneNode(true) as HTMLAudioElement;
      if (audioClone) {
        audioClone.play().catch(() => {});
      }
    } else {
        setShowFlash(true);
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setShowFlash(false), 500);
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
        initLevel();
    }
  }, [currentLevelIdx, gameState === "playing"]);

  const initLevel = () => {
    if (!gameLevels[currentLevelIdx]) return;
    const shuffled = [...gameLevels[currentLevelIdx].parts].sort(() => Math.random() - 0.5);
    setShuffledParts(shuffled);
    setSelectedParts([]);
    setIsCorrect(null);
    setTimeLeft(10);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            playFeedback(false);
            initLevel();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, currentLevelIdx]);

  useEffect(() => {
    if (gameState === "success") {
      const timer = setTimeout(() => {
        nextLevel();
      }, 1500); // 1.5 seconds delay to see the result
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handlePartClick = (part: string, index: number) => {
    if (gameState !== "playing") return;

    const newSelected = [...selectedParts, part];
    setSelectedParts(newSelected);

    // Remove from shuffled
    const newShuffled = [...shuffledParts];
    newShuffled.splice(index, 1);
    setShuffledParts(newShuffled);

    if (newSelected.length === currentLevel.parts.length) {
      const joinedString = currentLevel.type === "sentence" ? newSelected.join(" ") : newSelected.join("");
      
      if (joinedString === currentLevel.target) {
        setIsCorrect(true);
        setScore(s => s + (currentLevel.type === "sentence" ? 25 : 10));
        setGameState("success");
        playFeedback(true);
      } else {
        setIsCorrect(false);
        playFeedback(false);
        setTimeout(() => {
          initLevel();
        }, 1000);
      }
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < gameLevels.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setGameState("playing");
    } else {
      setGameState("finished");
    }
  };

  const startGame = () => {
    setGameLevels(levels);
    setCurrentLevelIdx(0);
    setScore(0);
    setGameState("playing");
    audioRef.current?.play().catch(() => {});
  };

  const resetGame = () => {
    setGameState("ready");
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  if (gameState === "finished") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-3xl font-bold text-blue-900">Ajoyib natija!</h3>
        <p className="text-muted-foreground text-lg">
          Siz barcha topshiriqlarni bajardingiz va {score} ball to'pladingiz!
        </p>
        <Button onClick={resetGame} size="lg" className="rounded-full px-10 h-14 bg-blue-600 hover:bg-blue-700">
          <RotateCcw className="mr-2 w-5 h-5" />
          Bosh menyuga qaytish
        </Button>
      </div>
    );
  }

  if (gameState === "ready") {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
               <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl"
               >
                  🧩
               </motion.div>
          </div>
          <h3 className="text-4xl font-black text-blue-900">So'z Yasash</h3>
          <p className="text-muted-foreground text-lg max-w-sm font-medium">
            Bloklarni to'g'ri tartibda yig'ing va so'zlar hosil qiling! Har bir so'z uchun 10 soniya vaqt beriladi.
          </p>
          <Button onClick={startGame} size="lg" className="rounded-full px-12 h-16 text-xl bg-blue-600 hover:bg-blue-700 shadow-xl group">
            <ArrowRight className="mr-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            O'yinni boshlash!
          </Button>
        </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 py-2 px-2 w-full h-full justify-center transition-all duration-300 ${showFlash ? 'ring-8 ring-red-500 ring-inset rounded-[3rem]' : ''}`}>
      {/* Header with Stats and Timer */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-4 rounded-[2rem] shadow-sm border-2 border-blue-50 flex flex-col gap-3 sticker-shadow">
        <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-black bg-blue-100 text-blue-600 rounded-lg px-3 py-1">
                   {currentLevelIdx + 1}-bosqich
                </Badge>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                   {currentLevel.difficulty}
                </div>
            </div>
            <div className="flex items-center gap-1.5 text-orange-500 font-black text-3xl font-display">
                <Star className="fill-current w-7 h-7" />
                {score}
            </div>
        </div>

        {/* Improved Timer Bar */}
        <div className="space-y-1">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / 10) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    className={`h-full shadow-inner ${timeLeft < 4 ? 'bg-orange-500' : 'bg-blue-500'}`}
                />
            </div>
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qolgan vaqt</span>
                <span className={`text-[10px] font-black transition-colors ${timeLeft < 4 ? 'text-orange-600 animate-pulse' : 'text-blue-500'}`}>
                    {timeLeft}s
                </span>
            </div>
        </div>
      </div>

      {/* Level Content */}
      <div className="text-center space-y-2 w-full">
        <div className="flex flex-col items-center gap-1">
            <motion.div 
                key={currentLevel.icon}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl md:text-7xl filter drop-shadow-md select-none"
            >
                {currentLevel.icon}
            </motion.div>
            <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                {currentLevel.type === "word" ? "So'zni yig'ing" : "Gapni yig'ing"}
            </h4>
        </div>
      </div>

      {/* Selected Parts Area */}
      <div className={`flex flex-wrap gap-2 md:gap-3 min-h-[5rem] items-center justify-center w-full max-w-xl border-4 border-dashed rounded-[2.5rem] px-6 py-5 transition-all shadow-inner 
        ${isCorrect === false ? 'border-orange-300 bg-orange-50' : 'border-blue-100 bg-blue-50/50'}`}>
        <AnimatePresence mode="popLayout">
          {selectedParts.length === 0 && (
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.4 }}
               className="text-blue-900 font-black uppercase tracking-[0.2em] text-[10px] text-center"
             >
                Bloklarni tanlang
             </motion.p>
          )}
          {selectedParts.map((s, i) => (
            <motion.div
              key={`selected-${i}-${s}`}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`px-4 py-2 flex items-center justify-center text-xl md:text-2xl font-black rounded-2xl shadow-md border-b-4 
                ${isCorrect === true ? 'bg-emerald-500 text-white border-emerald-700' : 
                  isCorrect === false ? 'bg-orange-500 text-white border-orange-700 animate-shake' : 
                  'bg-white text-slate-800 border-slate-200'}`}
            >
              {s}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Options Controls */}
      <div className="flex flex-wrap gap-3 justify-center items-center min-h-[120px] w-full pt-2 max-w-2xl px-4">
        {shuffledParts.map((s, i) => (
          <motion.button
            key={`shuffled-${i}-${s}`}
            whileHover={{ scale: 1.1, y: -4, rotate: Math.random() * 4 - 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePartClick(s, i)}
            className={`flex items-center justify-center font-black bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white transition-all text-slate-800 border-2 border-slate-50 relative overflow-hidden group sticker-shadow
               ${currentLevel.type === "word" ? "w-20 h-20 text-2xl" : "px-8 py-4 text-xl"}`}
          >
            {/* Glossy / Sticker Effect */}
            <div className="absolute top-1.5 left-1.5 w-1/3 h-1/3 bg-white/50 rounded-full blur-[4px] pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500/5 rounded-full pointer-events-none" />
            
            <span className="relative z-10">{s}</span>
          </motion.button>
        ))}
      </div>

      {/* Success Modal/Feedback */}
      <AnimatePresence>
        {gameState === "success" && (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
                <div className="bg-white rounded-[3rem] p-10 flex flex-col items-center gap-6 shadow-2xl border-8 border-green-100 max-w-sm w-full">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <PartyPopper className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-black text-blue-900 mb-2">Barakalla!</h3>
                        <p className="text-muted-foreground font-medium italic">
                            Topshiriq muvaffaqiyatli bajarildi!
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-green-600 mt-2 font-bold animate-pulse">
                        <ArrowRight className="w-6 h-6" />
                        <span>Keyingi bosqich yuklanmoqda...</span>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mt-4">
        <p className="text-xs text-blue-900/60 text-center font-bold uppercase tracking-wider">
          {currentLevel.type === "word" 
            ? "Bo'g'inlarni so'z tartibida tanlang"
            : "So'zlarni gap tartibida tanlang"}
        </p>
      </div>
    </div>
  );
}

