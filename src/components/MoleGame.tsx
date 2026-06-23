import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, RotateCcw, Timer, Heart, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult } from "../lib/effects";

const WORD_METADATA: Record<string, { emoji: string; bg?: string }> = {
  // R words
  "Rasm": { emoji: "🖼️" },
  "Ruchka": { emoji: "🖊️" },
  "Rubob": { emoji: "🪕" },
  "Robot": { emoji: "🤖" },
  // S words
  "Sinf": { emoji: "🏫" },
  "Somsa": { emoji: "🥟" },
  "Sariq": { 
    emoji: "🟨", 
    bg: "bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 text-slate-950 border-yellow-200 shadow-yellow-500/40" 
  },
  "Suv": { emoji: "💧" },
  // Sh words
  "Shakar": { emoji: "🍬" },
  "Sher": { emoji: "🦁" },
  "Shar": { emoji: "🎈" },
  // L words
  "Lola": { emoji: "🌷" },
  "Limon": { emoji: "🍋" },
  "Laylak": { emoji: "🦢" },
  // Q words
  "Qalam": { emoji: "✏️" },
  "Qoshiq": { emoji: "🥄" },
  "Qovun": { emoji: "🍈" },
  "Quyosh": { emoji: "☀️" },
  // Ch words
  "Chana": { emoji: "🛷" },
  "Choynak": { emoji: "🫖" },
  "Chiroq": { emoji: "💡" },
  "Chumoli": { emoji: "🐜" },
  // X words
  "Xarita": { emoji: "🗺️" },
  "Xurmo": { emoji: "🌴" },
  "Xat": { emoji: "✉️" },
  "Xo'roz": { emoji: "🐓" },
  // Z words
  "Zebra": { emoji: "🦓" },
  "Zanjir": { emoji: "⛓️" },
  "Zirak": { emoji: "💍" },
  // G' words
  "G'oz": { emoji: "🦢" },
  "G'uncha": { emoji: "🌸" },
  "G'ildirak": { emoji: "🎡" },
  // J words
  "Jo'ja": { emoji: "🐥" },
  "Javon": { emoji: "🚪" },
  "Jiyda": { emoji: "🍒" },
};

const ITEMS = [
  // R words
  { text: "Rasm", type: "good" },
  { text: "Ruchka", type: "good" },
  { text: "Rubob", type: "good" },
  { text: "Robot", type: "good" },
  // S words
  { text: "Sinf", type: "good" },
  { text: "Somsa", type: "good" },
  { text: "Sariq", type: "good" },
  { text: "Suv", type: "good" },
  // Sh words
  { text: "Shakar", type: "good" },
  { text: "Sher", type: "good" },
  { text: "Shar", type: "good" },
  // L words
  { text: "Lola", type: "good" },
  { text: "Limon", type: "good" },
  { text: "Laylak", type: "good" },
  // Q words
  { text: "Qalam", type: "good" },
  { text: "Qoshiq", type: "good" },
  { text: "Qovun", type: "good" },
  { text: "Quyosh", type: "good" },
  // Ch words
  { text: "Chana", type: "good" },
  { text: "Choynak", type: "good" },
  { text: "Chiroq", type: "good" },
  { text: "Chumoli", type: "good" },
  // X words
  { text: "Xarita", type: "good" },
  { text: "Xurmo", type: "good" },
  { text: "Xat", type: "good" },
  { text: "Xo'roz", type: "good" },
  // Z words
  { text: "Zebra", type: "good" },
  { text: "Zanjir", type: "good" },
  { text: "Zirak", type: "good" },
  // G' words
  { text: "G'oz", type: "good" },
  { text: "G'uncha", type: "good" },
  { text: "G'ildirak", type: "good" },
  // J words
  { text: "Jo'ja", type: "good" },
  { text: "Javon", type: "good" },
  { text: "Jiyda", type: "good" },
  // Obstacles & Bonuses
  { text: "💣", type: "bad" },
  { text: "⚡", type: "bonus" },
];

const GRID_SIZE = 9; // 3x3 grid

const getMoleItemStyle = (text: string) => {
  if (WORD_METADATA[text] && WORD_METADATA[text].bg) {
    return WORD_METADATA[text].bg;
  }
  const norm = text.toLowerCase();
  if (norm.startsWith("sh")) {
    return "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30 border-amber-300";
  }
  if (norm.startsWith("ch")) {
    return "bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 border-cyan-300";
  }
  if (norm.startsWith("g'")) {
    return "bg-gradient-to-br from-orange-400 to-red-600 text-white shadow-lg shadow-orange-500/30 border-orange-300";
  }
  if (norm.startsWith("r")) {
    return "bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 border-rose-300";
  }
  if (norm.startsWith("s")) {
    return "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 border-sky-300";
  }
  if (norm.startsWith("l")) {
    return "bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-teal-500/30 border-teal-300";
  }
  if (norm.startsWith("q")) {
    return "bg-gradient-to-br from-purple-400 via-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/30 border-fuchsia-300";
  }
  if (norm.startsWith("x")) {
    return "bg-gradient-to-br from-lime-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-lime-300";
  }
  if (norm.startsWith("z")) {
    return "bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 border-pink-300";
  }
  if (norm.startsWith("j")) {
    return "bg-gradient-to-br from-violet-400 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 border-violet-300";
  }

  return "bg-gradient-to-br from-orange-400 via-purple-500 to-indigo-500 text-white border-white";
};

export function MoleGame() {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<{text: string, type: string} | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(5);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [highScore, setHighScore] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(score);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeMoleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    // Music setup
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_5ec70762bd.mp3"); // Energetic arcade loop
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;
    
    successAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_c3523e414c.mp3"); // Short ding/collect
    successAudioRef.current.volume = 0.5;

    const victoryAudio = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_0625c153b0.mp3"); // Fanfare
    victoryAudio.volume = 0.4;
    victoryAudioRef.current = victoryAudio;
    
    return () => {
      audioRef.current?.pause();
      successAudioRef.current?.pause();
      victoryAudioRef.current?.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      if (gameIntervalRef.current) clearTimeout(gameIntervalRef.current);
      if (activeMoleTimeoutRef.current) clearTimeout(activeMoleTimeoutRef.current);
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setLives(5);
    setGameState("playing");
    gameStateRef.current = "playing"; // Update ref immediately
    spawnItem();
    audioRef.current?.play().catch(() => {});
  };

  const spawnItem = () => {
    if (gameStateRef.current !== "playing") return; 
    
    if (gameIntervalRef.current) clearTimeout(gameIntervalRef.current);
    if (activeMoleTimeoutRef.current) clearTimeout(activeMoleTimeoutRef.current);

    const randomHole = Math.floor(Math.random() * GRID_SIZE);
    const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    
    setActiveHole(randomHole);
    setActiveItem(randomItem);

    // Dynamic delay: Start at 3.5 seconds (3500ms) - extended visibility - and decrease slightly, with minimum 1600ms
    const delay = Math.max(1600, 3500 - (scoreRef.current * 10));
    
    activeMoleTimeoutRef.current = setTimeout(() => {
      setActiveHole(prevHole => {
        if (prevHole === randomHole && randomItem.type === "good") {
          setLives(prevLives => {
            const nextLives = Math.max(0, prevLives - 1);
            if (nextLives === 0) setGameState("finished");
            return nextLives;
          });
          setShowFlash(true);
          if (navigator.vibrate) navigator.vibrate(100);
          setTimeout(() => setShowFlash(false), 300);
        }
        return null; 
      });
      
      const nextSpawnDelay = Math.random() * 800 + 600; // Increased delay between spawns
      gameIntervalRef.current = setTimeout(spawnItem, nextSpawnDelay);
    }, delay);
  };

  const handleHit = (index: number) => {
    if (index === activeHole && activeItem) {
      if (activeItem.type === "good") {
        setScore(prev => prev + 5);
        const audioClone = successAudioRef.current?.cloneNode(true) as HTMLAudioElement;
        if (audioClone) {
          audioClone.play().catch(() => {});
        }
      } else if (activeItem.type === "bad") {
        setLives(prev => Math.max(0, prev - 1));
        setShowFlash(true);
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setShowFlash(false), 300);
      } else if (activeItem.type === "bonus") {
        setScore(prev => prev + 15);
        setTimeLeft(prev => prev + 5);
        launchSuccessResult();
        victoryAudioRef.current?.play().catch(() => {});
      }

      setActiveHole(null);
      if (activeMoleTimeoutRef.current) clearTimeout(activeMoleTimeoutRef.current);
      
      const nextSpawnDelay = Math.random() * 300 + 200;
      gameIntervalRef.current = setTimeout(spawnItem, nextSpawnDelay);
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState("finished");
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (lives === 0 && gameState === "playing") {
        setGameState("finished");
    }
  }, [lives, gameState]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score]);

  if (gameState === "ready") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-5 bg-gradient-to-br from-orange-400/10 via-amber-500/10 to-rose-500/10 rounded-[2.5rem] border border-white/85 shadow-2xl relative min-h-[420px] w-full max-w-lg mx-auto">
        <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-orange-400/10 blur-lg" />
        <div className="absolute bottom-6 right-8 w-28 h-28 rounded-full bg-pink-400/10 blur-lg" />

        <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-lg border-4 border-orange-200 transform rotate-12 relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-5xl"
          >
            ⚡
          </motion.div>
        </div>
        <h3 className="text-3xl font-black text-orange-955 font-display tracking-tight leading-none">Tezkor Qidiruv ⚡</h3>
        <p className="text-slate-600 text-sm max-w-sm font-semibold leading-relaxed">
          Kvadratlar ichidan tezda chiqadigan talaffuzi murakkab harflar bilan boshlanuvchi qisqa so'zlarni kuting va ularni bolakay tezkorlik bilan bossin!
        </p>
        <div className="bg-orange-100/60 border border-orange-200/80 rounded-2xl p-3 max-w-xs text-center shadow-sm">
          <p className="text-[11px] text-orange-800 font-extrabold leading-relaxed flex items-center justify-center gap-1.5 font-display">
            <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
            Rasm, Shakar, G'oz kabi qisqa so'zlar chiqish vaqti uzaytirildi. Har bir muvaffaqiyatli hit +5 ball beradi!
          </p>
        </div>
        <Button onClick={startGame} size="lg" className="rounded-full px-10 h-14 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl group text-white font-bold hover:scale-105 active:scale-95 transition-all">
          <ArrowRight className="mr-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          O'yinni boshlash!
        </Button>
      </div>
    );
  }

  if (gameState === "finished") {
    audioRef.current?.pause();
    if (gameIntervalRef.current) clearTimeout(gameIntervalRef.current);
    if (activeMoleTimeoutRef.current) clearTimeout(activeMoleTimeoutRef.current);
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 bg-gradient-to-br from-orange-400/10 via-amber-500/15 to-rose-500/10 rounded-[2.5rem] border border-orange-100 shadow-2xl relative min-h-[420px] w-full max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-3xl font-black text-orange-955 font-display">Vaqt tugadi!</h3>
        <div className="space-y-1">
          <p className="text-slate-600 text-sm font-semibold">Sizning natijangiz:</p>
          <div className="text-6xl font-black text-orange-500 font-display">{score}</div>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">O'yin rekordi: {highScore}</p>
        <Button onClick={startGame} size="lg" className="rounded-full px-8 h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg text-white font-bold transform hover:scale-105 active:scale-95 transition-all">
          <RotateCcw className="mr-2 w-4 h-4" />
          Qayta urinish
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 sm:gap-5 py-4 px-4 w-full h-full justify-center transition-all duration-300 relative rounded-[2.5rem] border border-white/80
      bg-gradient-to-br from-orange-100/40 via-purple-50/50 to-pink-100/40 backdrop-blur-md shadow-2xl overflow-hidden min-h-[420px] w-full max-w-lg mx-auto
      ${showFlash ? 'ring-8 ring-rose-500 ring-inset' : ''}`}>
      
      {/* Playful Floating Glassmorphism Circles */}
      <div className="absolute top-10 left-1 w-16 h-16 rounded-full bg-orange-300/20 blur-xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-1 w-14 h-14 rounded-full bg-pink-300/20 blur-xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-5 left-5 w-20 h-20 rounded-full bg-yellow-300/20 blur-xl pointer-events-none animate-pulse" />

      {/* Header with Stats and Timer */}
      <div className="w-full bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-md border border-orange-100 flex flex-col gap-2 relative z-10 shrink-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl font-black text-orange-700 text-xs sm:text-sm border border-orange-100">
              <Timer className="w-4 h-4 text-orange-500" />
              {timeLeft}s
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart 
                  key={i} 
                  className={`w-4.5 h-4.5 transition-all duration-300 ${i < lives ? 'text-rose-500 fill-rose-500 scale-105' : 'text-slate-200 opacity-30 scale-90'}`} 
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Ballar</span>
            <div className="flex items-center gap-1 text-orange-500 font-extrabold text-3xl sm:text-4xl font-display leading-none">
              <Star className="fill-current w-6 h-6 sm:w-8 sm:h-8 animate-bounce" />
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Holes */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4.5 w-full max-w-[310.5px] aspect-square mt-1 relative z-10">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div key={i} className="relative group cursor-pointer active:scale-95 transition-transform" onClick={() => handleHit(i)}>
            {/* Mound/Hole Background */}
            <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-b from-stone-200 to-stone-400 shadow-inner border-b-4 border-stone-500/30 transition-all duration-300
              ${activeHole === i ? 'ring-4 ring-orange-400/50 bg-orange-50' : ''}`} 
            />
            
            {/* Actual Hole Opening */}
            <div className="absolute inset-2.5 rounded-[1.6rem] bg-stone-900/20 shadow-[inset_0_4px_8px_rgba(0,0,0,0.35)] overflow-hidden">
               <AnimatePresence>
                 {activeHole === i && activeItem && (
                   <motion.div
                     key={activeItem.text}
                     initial={{ y: 55, opacity: 0, scale: 0.5 }}
                     animate={{ y: 0, opacity: 1, scale: 1 }}
                     exit={{ y: 55, opacity: 0, scale: 0.5 }}
                     transition={{ type: "spring", damping: 11, stiffness: 190 }}
                     className="absolute inset-0 flex items-center justify-center select-none"
                   >
                     {activeItem.type === "good" ? (
                       <div className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center font-black font-display leading-tight px-1 text-center border-4 border-white uppercase tracking-tight relative overflow-hidden shadow-inner ${getMoleItemStyle(activeItem.text)}`}>
                         {/* Background representation with emoji */}
                         {WORD_METADATA[activeItem.text] && (
                           <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none text-[22px] sm:text-[28px] pointer-events-none transform scale-110">
                             {WORD_METADATA[activeItem.text].emoji}
                           </div>
                         )}
                         {/* Legible Foreground text */}
                         <span className={`relative z-10 text-[9px] sm:text-[11px] font-black tracking-tight ${
                           WORD_METADATA[activeItem.text]?.bg?.includes("text-slate-950")
                             ? "drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] text-slate-950"
                             : "drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.85)] text-white"
                         }`}>
                           {activeItem.text}
                         </span>
                       </div>
                     ) : (
                       <span className={`text-4.5xl sm:text-6xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] ${activeItem.type === "bonus" ? "animate-pulse" : ""}`}>
                         {activeItem.text}
                       </span>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Dirt Front Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-stone-500/20 to-transparent pointer-events-none rounded-b-[2rem]" />
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm p-3 bg-white/55 backdrop-blur-sm rounded-2xl border-2 border-white/60 text-center shadow-inner relative z-10">
        <p className="text-xs text-orange-950 font-bold leading-relaxed flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
          Tezroq bosing! Talaffuzi murakkab harflar bilan boshlanuvchi so'zlar chiqqanda ularni kuting! 🚀
        </p>
      </div>
    </div>
  );
}
