import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, RotateCcw, Timer, Heart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult } from "../lib/effects";

const ITEMS = [
  { emoji: "🍎", type: "good" },
  { emoji: "🐶", type: "good" },
  { emoji: "🚀", type: "good" },
  { emoji: "🎈", type: "good" },
  { emoji: "🚗", type: "good" },
  { emoji: "🧸", type: "good" },
  { emoji: "🐱", type: "good" },
  { emoji: "🍦", type: "good" },
  { emoji: "⚽", type: "good" },
  { emoji: "💣", type: "bad" },
  { emoji: "⚡", type: "bonus" },
];

const GRID_SIZE = 9; // 3x3 grid

export function MoleGame() {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<{emoji: string, type: string} | null>(null);
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
    audioRef.current.volume = 0.3;
    
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

    // Dynamic delay: Start at 2 seconds, decrease as score increases, but minimum 600ms
    const delay = Math.max(600, 2000 - (scoreRef.current * 8));
    
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
      
      const nextSpawnDelay = Math.random() * 600 + 400;
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
      
      const nextSpawnDelay = Math.random() * 200 + 100;
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
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center shadow-lg transform rotate-12">
          <Zap className="w-12 h-12 text-orange-500" />
        </div>
        <h3 className="text-3xl font-bold">Tezkor Qidiruv</h3>
        <p className="text-muted-foreground text-lg max-w-sm">
          Kvadratlar ichidan tasvirlar chiqishini kuting va ularni tezda bosing! Har bir muvaffaqiyat +5 ball, o'tkazib yuborish esa -2 ball.
        </p>
        <Button onClick={startGame} size="lg" className="rounded-full px-10 h-14 text-lg bg-orange-500 hover:bg-orange-600">
          O'yinni boshlash
        </Button>
      </div>
    );
  }

  if (gameState === "finished") {
    audioRef.current?.pause();
    if (gameIntervalRef.current) clearTimeout(gameIntervalRef.current);
    if (activeMoleTimeoutRef.current) clearTimeout(activeMoleTimeoutRef.current);
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-3xl font-bold">Vaqt tugadi!</h3>
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">Sizning natijangiz:</p>
          <div className="text-6xl font-black text-primary">{score}</div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">O'yin rekordi: {highScore}</p>
        <Button onClick={startGame} size="lg" className="rounded-full px-10">
          <RotateCcw className="mr-2 w-5 h-5" />
          Qayta urinish
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-6 py-4 px-4 w-full h-full justify-center transition-all duration-300 ${showFlash ? 'ring-8 ring-red-500 ring-inset rounded-[3rem]' : ''}`}>
      <div className="w-full max-w-md flex justify-between items-center px-4 bg-white/80 backdrop-blur-md py-4 rounded-[2rem] shadow-sm sticker-shadow">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-black text-slate-700 text-sm">
              <Timer className="w-4 h-4 text-primary" />
              {timeLeft}s
            </div>
            <div className="flex items-center gap-1 px-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Heart 
                        key={i} 
                        className={`w-5 h-5 transition-all duration-300 ${i < lives ? 'text-rose-500 fill-rose-500 scale-110' : 'text-slate-200 opacity-30 scale-90'}`} 
                    />
                ))}
            </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Ballar</span>
          <div className="flex items-center gap-2 text-orange-500 font-black text-4xl font-display">
            <Star className="fill-current w-8 h-8" />
            {score}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-[320px] md:max-w-md aspect-square mt-2">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <div key={i} className="relative group cursor-pointer active:scale-95 transition-transform" onClick={() => handleHit(i)}>
            {/* Mound/Hole Background */}
            <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-stone-200 to-stone-400 shadow-inner border-b-8 border-stone-500/30 transition-all duration-300
              ${activeHole === i ? 'ring-4 ring-orange-400/50 bg-orange-50' : ''}`} 
            />
            
            {/* Actual Hole Opening */}
            <div className="absolute inset-3 rounded-[2rem] bg-stone-900/20 shadow-[inset_0_6px_12px_rgba(0,0,0,0.3)] overflow-hidden">
               <AnimatePresence>
                 {activeHole === i && (
                   <motion.div
                     key={activeItem?.emoji}
                     initial={{ y: 60, opacity: 0, scale: 0.5 }}
                     animate={{ y: 0, opacity: 1, scale: 1 }}
                     exit={{ y: 60, opacity: 0, scale: 0.5 }}
                     transition={{ type: "spring", damping: 12, stiffness: 200 }}
                     className="absolute inset-0 flex items-center justify-center text-5xl md:text-7xl select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                   >
                     {activeItem?.emoji}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Dirt Front Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-stone-500/30 to-transparent pointer-events-none rounded-b-[2.5rem]" />
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm p-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-white/50 text-center sticker-shadow">
        <p className="text-sm text-slate-500 font-bold">
          Tezroq bosing! Har bir to'g'ri hit +5 ball beradi! 🚀
        </p>
      </div>
    </div>
  );
}

