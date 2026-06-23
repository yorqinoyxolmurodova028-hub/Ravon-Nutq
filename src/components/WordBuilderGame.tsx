import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, RotateCcw, ArrowRight, PartyPopper, Timer, CheckCircle, Volume2, VolumeX, HelpCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult, launchConfetti } from "../lib/effects";

interface Level {
  id: number;
  target: string;
  parts: string[];
  distractors: string[];
  complexWord: string;
  soundTag: string;
  difficulty: "Oson" | "O'rtacha" | "Murakkab";
  icon: string;
}

const levels: Level[] = [
  {
    id: 1,
    target: "RUSTAM SHIRIN OLMANI YEDI",
    parts: ["RUSTAM", "SHIRIN", "OLMANI", "YEDI"],
    distractors: ["SUTDAN", "KOSADAN", "KITOBNI"],
    complexWord: "RUSTAM, SHIRIN",
    soundTag: "R tovushi",
    difficulty: "Oson",
    icon: "🍏"
  },
  {
    id: 2,
    target: "SHODIYONA SARIQ SHARNI UCHIRDI",
    parts: ["SHODIYONA", "SARIQ", "SHARNI", "UCHIRDI"],
    distractors: ["OLMANI", "DAFTARGA", "SUVDAN"],
    complexWord: "SHODIYONA, SHARNI",
    soundTag: "Sh/S tovushi",
    difficulty: "Oson",
    icon: "🎈"
  },
  {
    id: 3,
    target: "LOLA SHIRIN LIMONNI TERDI",
    parts: ["LOLA", "SHIRIN", "LIMONNI", "TERDI"],
    distractors: ["RANONI", "UCHDAN", "KUCHUKKA"],
    complexWord: "LOLA, LIMON",
    soundTag: "L tovushi",
    difficulty: "O'rtacha",
    icon: "🍋"
  },
  {
    id: 4,
    target: "KICHIK KUCHUKCHA TO'PNI QUVDI",
    parts: ["KICHIK", "KUCHUKCHA", "TO'PNI", "QUVDI"],
    distractors: ["MUSHUKDAN", "OSMONDA", "YURISHGA"],
    complexWord: "KICHIK, KUCHUKCHA",
    soundTag: "K and Ch tovushi",
    difficulty: "O'rtacha",
    icon: "🐶"
  },
  {
    id: 5,
    target: "QAMAR QIZIL QALAMDA CHIZDI",
    parts: ["QAMAR", "QIZIL", "QALAMDA", "CHIZDI"],
    distractors: ["NONNI", "YEDI", "UYDAN"],
    complexWord: "QAMAR, QIZIL, QALAMDA",
    soundTag: "Q tovushi",
    difficulty: "O'rtacha",
    icon: "✏️"
  },
  {
    id: 6,
    target: "CHORI CHROYLI CHOYNAKNI OLDI",
    parts: ["CHORI", "CHROYLI", "CHOYNAKNI", "OLDI"],
    distractors: ["SUVDAN", "GULGA", "BORDIMI"],
    complexWord: "CHORI, CHOYNAKNI",
    soundTag: "Ch tovushi",
    difficulty: "Murakkab",
    icon: "🫖"
  },
  {
    id: 7,
    target: "ZAFAR ZOOPARKDA ZEBRANI KO'RDI",
    parts: ["ZAFAR", "ZOOPARKDA", "ZEBRANI", "KO'RDI"],
    distractors: ["RULDAGI", "KOSADAN", "KITOBGA"],
    complexWord: "ZEBRANI, ZOOPARKDA",
    soundTag: "Z tovushi",
    difficulty: "Murakkab",
    icon: "🦓"
  },
  {
    id: 8,
    target: "JO'JA SHIRIN SHAKARNI YEDI",
    parts: ["JO'JA", "SHIRIN", "SHAKARNI", "YEDI"],
    distractors: ["GULLARNI", "KAPALAKKA", "DARAXTDAN"],
    complexWord: "JO'JA, SHAKARNI",
    soundTag: "J/Sh/Ch",
    difficulty: "Murakkab",
    icon: "🐥"
  }
];

// Playful child-friendly color palettes for shuffled words
const getWordColorStyle = (index: number, isSelected: boolean) => {
  if (isSelected) {
    return {
      bg: "bg-slate-100/50 text-slate-300/60 border-dashed border-slate-200 shadow-none pointer-events-none opacity-40",
      dot: "bg-slate-300"
    };
  }
  
  const colorSchemes = [
    {
      bg: "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200/80 hover:border-rose-400 shadow-[0_4px_12px_-4px_rgba(244,63,94,0.2)]",
      dot: "bg-rose-400"
    },
    {
      bg: "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200/80 hover:border-sky-400 shadow-[0_4px_12px_-4px_rgba(14,165,233,0.2)]",
      dot: "bg-sky-400"
    },
    {
      bg: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200/80 hover:border-amber-400 shadow-[0_4px_12px_-4px_rgba(245,158,11,0.2)]",
      dot: "bg-amber-400"
    },
    {
      bg: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200/80 hover:border-emerald-400 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.2)]",
      dot: "bg-emerald-400"
    },
    {
      bg: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200/80 hover:border-indigo-400 shadow-[0_4px_12px_-4px_rgba(99,102,241,0.2)]",
      dot: "bg-indigo-400"
    },
    {
      bg: "bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200/80 hover:border-violet-400 shadow-[0_4px_12px_-4px_rgba(139,92,246,0.2)]",
      dot: "bg-violet-400"
    },
    {
      bg: "bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200/80 hover:border-pink-400 shadow-[0_4px_12px_-4px_rgba(236,72,153,0.2)]",
      dot: "bg-pink-400"
    },
    {
      bg: "bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200/80 hover:border-teal-400 shadow-[0_4px_12px_-4px_rgba(20,184,166,0.2)]",
      dot: "bg-teal-400"
    }
  ];

  return colorSchemes[index % colorSchemes.length];
};

export function WordBuilderGame() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); 
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "success" | "finished">("ready");
  const [showFlash, setShowFlash] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentLevel = levels[currentLevelIdx];

  useEffect(() => {
    // Upbeat bouncing kids background music
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3"); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;
    
    successAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_bbd13032d2.mp3"); 
    successAudioRef.current.volume = 0.4;
    
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (gameState === "finished") {
      audioRef.current?.pause();
      setIsMusicPlaying(false);
    }
  }, [gameState]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch((e) => console.warn("Music play blocked", e));
      }
    }
  };

  const playFeedback = (correct: boolean) => {
    if (correct) {
      launchSuccessResult();
      launchConfetti(); // Colorful sparkles stream!
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
  }, [currentLevelIdx, gameState]);

  const initLevel = () => {
    if (!levels[currentLevelIdx]) return;
    const lvl = levels[currentLevelIdx];
    const rawList = [...lvl.parts, ...lvl.distractors];
    // Keep exact length consistent or shuffle
    const shuffled = [...rawList].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedIndices([]);
    setIsCorrect(null);
    setTimeLeft(30);
    setFeedbackMsg("");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            playFeedback(false);
            initLevel();
            return 30;
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
      }, 8000); 
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleWordClick = (shuffledIndex: number) => {
    if (gameState !== "playing" || isCorrect) return;

    if (selectedIndices.includes(shuffledIndex)) {
      setSelectedIndices(prev => prev.filter(idx => idx !== shuffledIndex));
      return;
    }

    const newIndices = [...selectedIndices, shuffledIndex];
    setSelectedIndices(newIndices);

    if (newIndices.length === currentLevel.parts.length) {
      const assembledSentence = newIndices.map(idx => shuffledWords[idx]).join(" ");
      
      if (assembledSentence === currentLevel.target) {
        setIsCorrect(true);
        setScore(s => s + 35); 
        setFeedbackMsg("Barakalla! Gap nihoyatda chiroyli va to'g'ri yig'ildi! 🌟");
        setGameState("success");
        playFeedback(true);
      } else {
        setIsCorrect(false);
        playFeedback(false);
        setFeedbackMsg("Qayta urinib ko'ring! So'zlar tartibi yoki tanlovi xato.");
        setTimeout(() => {
          setSelectedIndices([]);
          setIsCorrect(null);
          setFeedbackMsg("");
        }, 1800);
      }
    }
  };

  const speakText = (text: string) => {
    // Disabled as per user request to only display text
  };

  const nextLevel = () => {
    if (currentLevelIdx < levels.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setGameState("playing");
    } else {
      setGameState("finished");
    }
  };

  const startGame = () => {
    setCurrentLevelIdx(0);
    setScore(0);
    setGameState("playing");
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
    }
  };

  const resetGame = () => {
    setGameState("ready");
    audioRef.current?.pause();
    setIsMusicPlaying(false);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  if (gameState === "finished") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-5 bg-gradient-to-br from-purple-600/10 via-indigo-500/10 to-pink-500/10 rounded-[2.5rem] border border-purple-100 shadow-2xl relative min-h-[420px] w-full max-w-lg mx-auto">
        <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-purple-400/20 blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-pink-400/20 blur-xl animate-pulse" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6 }}
          className="w-24 h-24 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
        >
          <Trophy className="w-12 h-12 text-white drop-shadow" />
        </motion.div>
        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-700 font-display">Ajoyib g'alaba! 🏆</h3>
        <p className="text-slate-600 text-base max-w-md leading-relaxed font-semibold">
          Siz barcha murakkab talaffuzli gaplarni to'liq va benuqson yig'dingiz hamda <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-black text-2xl">{score} ball</span> to'pladingiz!
        </p>
        <Button onClick={resetGame} size="lg" className="rounded-full px-8 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg text-white font-bold transform hover:scale-105 active:scale-95 transition-all">
          <RotateCcw className="mr-2 w-4 h-4" />
          Bosh menyuga qaytish
        </Button>
      </div>
    );
  }

  if (gameState === "ready") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-5 bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-indigo-500/15 rounded-[2.5rem] border border-white/80 shadow-2xl relative min-h-[420px] w-full max-w-lg mx-auto">
        <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-indigo-400/10 blur-lg" />
        <div className="absolute bottom-6 right-8 w-28 h-28 rounded-full bg-pink-400/10 blur-lg" />

        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-purple-200 relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-5xl"
          >
            🧩
          </motion.div>
        </div>
        <h3 className="text-3xl font-black text-purple-900 font-display tracking-tight leading-none">Ko'p Bo'g'inli Gaplar 🧩</h3>
        <p className="text-slate-600 text-sm max-w-sm font-semibold leading-relaxed">
          Kvadrat ichidagi so'zlar orasidan talaffuzi murakkab so'zlar ishtirok etgan gaplarni tartib bilan yig'ing. Gapdagi so'zlar mos qo'shimchalar bilan berilgan.
        </p>
        <div className="bg-purple-100/60 border border-purple-200/80 rounded-2xl p-3 max-w-xs text-center shadow-sm">
          <p className="text-[11px] text-purple-800 font-bold leading-relaxed flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            So'zlar ustiga bosganda, ular pastda tartib bilan teriladi va rang-barang porlaydi!
          </p>
        </div>
        <Button onClick={startGame} size="lg" className="rounded-full px-10 h-14 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl group text-white font-bold hover:scale-105 active:scale-95 transition-all">
          <ArrowRight className="mr-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          O'yinni boshlash!
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2.5 sm:gap-4 p-4 sm:p-5 w-full max-w-lg mx-auto justify-start transition-all duration-300 relative rounded-[2.5rem] border border-white/80
      bg-gradient-to-b from-indigo-100/50 via-purple-50/60 to-pink-100/50 backdrop-blur-md shadow-2xl overflow-hidden min-h-[520px]
      ${showFlash ? 'ring-8 ring-rose-500 ring-inset' : ''}`}>
      
      {/* Playful Floating Glassmorphism Circles */}
      <div className="absolute top-10 left-1 w-16 h-16 rounded-full bg-purple-300/20 blur-xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-1 w-14 h-14 rounded-full bg-pink-300/20 blur-xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-5 left-5 w-20 h-20 rounded-full bg-blue-300/20 blur-xl pointer-events-none animate-pulse" />

      {/* Header with Stats and Timer */}
      <div className="w-full bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-md border border-purple-100 flex flex-col gap-2 relative z-10 shrink-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1.5">
            <Badge className="text-[10px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl px-2.5 py-0.5 shadow-sm">
              {currentLevelIdx + 1}/{levels.length}-GAP
            </Badge>
            <Badge variant="outline" className="text-[10px] font-bold border-purple-200 text-purple-700 bg-purple-50 px-2 py-0.5">
              🎯 {currentLevel.soundTag}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Music Toggle Button */}
            <Button
              size="icon"
              variant="outline"
              onClick={toggleMusic}
              className={`w-7 h-7 rounded-full border-purple-200 shrink-0 shadow-sm transition-all duration-300 relative ${
                isMusicPlaying 
                  ? "bg-purple-100 text-purple-600 hover:bg-purple-200 border-purple-300 ring-2 ring-purple-400/20" 
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-500"
              }`}
              title={isMusicPlaying ? "Musiqani o'chirish" : "Musiqani yoqish"}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse relative z-10" />
                  <span className="absolute inset-0 rounded-full bg-purple-400/35 animate-ping opacity-75" />
                </>
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </Button>
            <div className="flex items-center gap-1 text-amber-500 font-extrabold text-lg sm:text-xl font-display">
              <Star className="fill-current w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
              {score}
            </div>
          </div>
        </div>

        {/* Dynamic Instructional Header */}
        <div className="flex items-center gap-2 bg-purple-50/70 p-2 rounded-xl border border-purple-100">
          <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
          <p className="text-[10px] sm:text-xs font-semibold text-slate-600 leading-tight">
            Mashq qilinayotgan murakkab so'z: <span className="text-purple-700 font-black">{currentLevel.complexWord}</span>. To'g'ri gapni yig'ing.
          </p>
        </div>

        {/* Compact Timer Bar */}
        <div className="space-y-0.5">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / 30) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
              className={`h-full rounded-full ${timeLeft < 8 ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
            />
          </div>
          <div className="flex justify-between items-center px-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Qolgan vaqt</span>
            <span className={`text-[10px] font-black transition-colors ${timeLeft < 8 ? 'text-rose-600 animate-pulse' : 'text-purple-600'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Target Clue & Icon */}
      <div className="text-center space-y-0.5 w-full relative z-10 shrink-0">
        <div className="flex items-center justify-center gap-2 bg-white/40 p-1.5 sm:p-2.5 rounded-full border border-white/60 shadow-sm max-w-xs mx-auto">
          <motion.div 
            key={currentLevel.icon}
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="text-3xl sm:text-4xl filter drop-shadow hover:rotate-12 transition-transform duration-300 select-none"
          >
            {currentLevel.icon}
          </motion.div>
          <div className="flex items-center gap-1">
            <h4 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight text-left">
              So'zlarni tanlang:
            </h4>
          </div>
        </div>
      </div>

      {/* Grid of Shuffled Words - THE WORD SQUARE */}
      <div className="w-full max-w-[320.5px] bg-gradient-to-tr from-purple-100/60 to-indigo-100/60 border-2 border-dashed border-purple-300/80 rounded-[2rem] p-3 sm:p-4 shadow-inner relative z-10">
        {/* Compact Grid using rectangular cells to prevent absolute overflow on screen heights */}
        <div className="grid grid-cols-3 gap-2.5 items-center justify-center">
          {shuffledWords.map((word, index) => {
            const isSelected = selectedIndices.includes(index);
            const styleInfo = getWordColorStyle(index, isSelected);
            return (
              <motion.button
                key={`shuffled-${index}-${word}`}
                whileHover={!isSelected ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isSelected ? { scale: 0.95 } : {}}
                onClick={() => handleWordClick(index)}
                className={`w-full py-2.5 sm:py-3.5 flex flex-col items-center justify-center rounded-xl font-bold text-[11px] sm:text-[13px] border-2 transition-all duration-300 shadow-sm relative overflow-hidden select-none min-h-[48px]
                  ${styleInfo.bg}`}
              >
                {/* Visual slot indicator if selected */}
                {isSelected ? (
                  <CheckCircle className="w-4 h-4 text-purple-300/80 absolute" />
                ) : (
                  <>
                    <div className="absolute top-1 left-1.5 w-1/4 h-1/4 bg-white/40 rounded-full blur-[2px]" />
                    {/* Tiny decorative dot indicating puzzle parts */}
                    <div className={`w-1.5 h-1.5 rounded-full absolute top-1.5 right-1.5 ${styleInfo.dot}`} />
                    <span className="p-0.5 break-all text-center uppercase tracking-normal leading-tight font-display font-black">
                      {word}
                    </span>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] uppercase font-black tracking-widest px-3.5 py-1 rounded-full shadow-md">
          Kvadrat Maydoni
        </div>
      </div>

      {/* Assembly Area - ASSEMBLED SENTENCE AT THE BOTTOM */}
      <div className="w-full space-y-1 mt-1 sm:mt-2 relative z-10 shrink-0">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Siz yig'ayotgan gap (Pastda):</span>
          {selectedIndices.length > 0 && (
            <button 
              onClick={() => setSelectedIndices([])}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:underline"
            >
              Tozalash
            </button>
          )}
        </div>

        <div className={`flex flex-wrap gap-1.5 sm:gap-2 min-h-[4.2rem] sm:min-h-[5rem] items-center justify-center w-full border-2 border-dashed rounded-[1.5rem] px-3 py-2 sm:py-3 transition-all shadow-inner 
          ${isCorrect === true ? 'border-emerald-400 bg-emerald-100/90 shadow-[0_0_25px_rgba(16,185,129,0.45)]' : 
            isCorrect === false ? 'border-rose-300 bg-rose-50/80 animate-shake' : 
            'border-purple-200 bg-white/80 backdrop-blur-sm'}`}
        >
          <AnimatePresence mode="popLayout">
            {selectedIndices.length === 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="text-purple-400/80 font-extrabold uppercase tracking-wider text-[10px] text-center px-4"
              >
                Kvadrat ichidan so'zlarni bosing
              </motion.p>
            )}
            {selectedIndices.map((shuffledIdx, displayIdx) => {
              const wordStr = shuffledWords[shuffledIdx];
              return (
                <motion.button
                  key={`selected-${displayIdx}-${wordStr}`}
                  initial={{ y: 15, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  onClick={() => handleWordClick(shuffledIdx)}
                  className={`px-3 py-1.5 sm:py-2 flex items-center gap-1 text-xs sm:text-sm font-black rounded-xl shadow-sm border-b-2 transition-all hover:scale-105 active:scale-95
                    ${isCorrect === true ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.7)] animate-bounce font-black' : 
                      isCorrect === false ? 'bg-rose-500 text-white border-rose-700 animate-shake' : 
                      'bg-white text-purple-950 border-purple-100 hover:border-purple-200 hover:text-purple-700 font-display'}`}
                >
                  <span>{wordStr}</span>
                  <span className="text-[10px] text-slate-400 font-bold hover:text-rose-500">×</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Success Messages */}
      {feedbackMsg && (
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-[11px] sm:text-xs font-black text-center px-4 py-1.5 rounded-xl border relative z-10 w-full ${
            isCorrect === true ? "text-emerald-700 bg-emerald-50 border-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]" : "text-rose-700 bg-rose-50 border-rose-200"
          }`}
        >
          {feedbackMsg}
        </motion.p>
      )}

      {/* Success Modal Overlay with Barakalla! and colorful star sparks */}
      <AnimatePresence>
        {gameState === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.85, opacity: 0, rotate: 5 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center gap-4 sm:gap-6 shadow-2xl border-8 border-emerald-200 max-w-sm w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />
              
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg relative border-4 border-emerald-100">
                <PartyPopper className="w-10 h-10 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-3 -right-3 text-3xl"
                >
                  🚀
                </motion.div>
              </div>
              <div className="text-center space-y-1.5 w-full">
                <h3 className="text-4xl font-black text-emerald-600 font-display tracking-tight drop-shadow-sm animate-bounce">
                  BARAKALLA!
                </h3>
                <p className="text-slate-600 font-extrabold italic text-[11px] sm:text-xs">
                  Dono bolajon, gap to'g'ri bo'ldi! 🏆
                </p>
                <div className="bg-emerald-50/90 p-3 sm:p-4 rounded-2xl border border-emerald-200 text-emerald-800 font-black text-center text-[12px] sm:text-sm tracking-wide uppercase mt-1 shadow-sm leading-relaxed">
                  "{currentLevel.target}"
                </div>
              </div>

              {/* Manual Proceed Action */}
              <div className="flex flex-col gap-2 w-full mt-1">
                <Button
                  id="success-next-level-manual-button"
                  onClick={nextLevel}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black h-12 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transform hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm"
                >
                  Keyingi gapni yig'ish ➡️
                </Button>
              </div>

              <div className="flex flex-col items-center gap-1 text-emerald-600 mt-1 font-black animate-pulse">
                <Sparkles className="w-5 h-5 animate-spin text-amber-500" />
                <span className="text-[9px] uppercase tracking-widest font-black">Yoki 8 soniyadan so'ng o'tadi...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
