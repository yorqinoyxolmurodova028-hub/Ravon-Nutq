import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, Mic, MicOff, Volume2, Gamepad2, Star, PartyPopper, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult } from "../lib/effects";

const CHALLENGE_WORDS = {
  1: [ // Oson (Easy) but targeted logopedic sounds - short words
    { word: "G'ildirak", difficulty: "Oson", prompt: "G'il-di-rak", description: "[G'] va [R] tovushlarini talaffuz qilish" },
    { word: "Qurbaqa", difficulty: "Oson", prompt: "Qur-ba-qa", description: "[Q] va [R] tovushlari mashqi" },
    { word: "Shashlik", difficulty: "Oson", prompt: "Shash-lik", description: "[Sh] va [L] tovushlarini farqlash" },
    { word: "Traktor", difficulty: "Oson", prompt: "Trak-tor", description: "[Tr] murakkab tovushlar birikmasi" },
    { word: "Qaychi", difficulty: "Oson", prompt: "Qay-chi", description: "[Q] va [Ch] tovushlari mashqi" },
  ],
  2: [ // O'rtacha (Medium) - Shorter words with tricky combinations
    { word: "Chumchuq", difficulty: "O'rtacha", prompt: "Chum-chuq", description: "[Ch] va [Q] tovushlarini takrorlash" },
    { word: "Sinchalak", difficulty: "O'rtacha", prompt: "Sin-cha-lak", description: "[S], [Ch] va [L] tovushlar birikmasi" },
    { word: "G'alvir", difficulty: "O'rtacha", prompt: "G'al-vir", description: "[G'], [L] va [R] tovushlari uyg'unligi" },
    { word: "Sarg'aldoq", difficulty: "O'rtacha", prompt: "Sar-g'al-doq", description: "[R], [G'] va [L] tovushlari ketma-ketligi" },
    { word: "Qorabuloq", difficulty: "O'rtacha", prompt: "Qo-ra-bu-loq", description: "[Q], [R] va [L] tovushlari farqlanishi" },
  ],
  3: [ // Murakkab (Hard) - Shorter but highly challenging tongue-twister words
    { word: "Karkidon", difficulty: "Murakkab", prompt: "Kar-ki-don", description: "[R] tovushini takroriy talaffuz qilish" },
    { word: "Zarg'aldoq", difficulty: "Murakkab", prompt: "Zar-g'al-doq", description: "[Z], [R], [G'] va [L] qiyin uyg'unligi" },
    { word: "Qaltirash", difficulty: "Murakkab", prompt: "Qal-ti-rash", description: "[Q], [L], [R] va [Sh] tovushlari mashqi" },
    { word: "Sug'orish", difficulty: "Murakkab", prompt: "Su-g'o-rish", description: "[S], [G'], [R] va [Sh] qiyin tovushlari" },
    { word: "Toshbaqa", difficulty: "Murakkab", prompt: "Tosh-ba-qa", description: "[Sh] va [Q] tovushlari birikmasi" },
  ]
};

const MAX_LEVELS = 3;
const MAZE_LENGTH = 3000; 
const BASE_STEP_SIZE = 4;

interface PathPoint {
  progress: number; // 0 to 1
  x: number; // percentage of width (0 to 100)
  y: number; // percentage of height (0 to 100)
}

const MAZE_PATH: PathPoint[] = [
  { progress: 0, x: 8, y: 70 },
  { progress: 0.12, x: 22, y: 70 },
  { progress: 0.25, x: 22, y: 30 }, // Winding Up
  { progress: 0.38, x: 42, y: 30 }, // Winding Right
  { progress: 0.50, x: 42, y: 74 }, // Winding Down
  { progress: 0.62, x: 62, y: 74 }, // Winding Right
  { progress: 0.75, x: 62, y: 30 }, // Winding Up
  { progress: 0.88, x: 80, y: 30 }, // Winding Right
  { progress: 0.94, x: 80, y: 64 }, // Winding Down
  { progress: 1.0, x: 92, y: 64 },  // Winding to Finish
];

const getCoordinatesForProgress = (progress: number): { x: number; y: number } => {
  if (progress <= 0) return { x: MAZE_PATH[0].x, y: MAZE_PATH[0].y };
  if (progress >= 1) return { x: MAZE_PATH[MAZE_PATH.length - 1].x, y: MAZE_PATH[MAZE_PATH.length - 1].y };

  for (let i = 0; i < MAZE_PATH.length - 1; i++) {
    const pStart = MAZE_PATH[i].progress;
    const pEnd = MAZE_PATH[i + 1].progress;
    if (progress >= pStart && progress <= pEnd) {
      const segmentProgress = (progress - pStart) / (pEnd - pStart);
      const x = MAZE_PATH[i].x + segmentProgress * (MAZE_PATH[i + 1].x - MAZE_PATH[i].x);
      const y = MAZE_PATH[i].y + segmentProgress * (MAZE_PATH[i + 1].y - MAZE_PATH[i].y);
      return { x, y };
    }
  }
  return { x: 50, y: 50 };
};

// Character Component with National Clothing
const UzbekBoyCharacter = ({ isMoving }: { isMoving: boolean }) => {
  return (
    <motion.svg 
      viewBox="0 0 100 120" 
      className="w-20 h-24 drop-shadow-xl"
      animate={isMoving ? { y: [0, -5, 0] } : {}}
      transition={isMoving ? { repeat: Infinity, duration: 0.4, ease: "easeInOut" } : {}}
    >
      <defs>
        <radialGradient id="faceGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#ffe4c4" />
          <stop offset="100%" stopColor="#ffdbac" />
        </radialGradient>
        <linearGradient id="choponGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* Chopon (Robe) */}
      <path 
        d="M30 60 L10 110 L90 110 L70 60 Z" 
        fill="url(#choponGradient)" 
        stroke="#1d4ed8"
        strokeWidth="1"
      />
      
      {/* Chopon Patterns (Detailed Ikat-like stripes) */}
      <path d="M35 60 L18 110" stroke="#facc15" strokeWidth="4" opacity="0.7" strokeDasharray="4 2" />
      <path d="M50 63 L50 110" stroke="#facc15" strokeWidth="3" opacity="0.5" strokeDasharray="5 3" />
      <path d="M65 60 L82 110" stroke="#facc15" strokeWidth="4" opacity="0.7" strokeDasharray="4 2" />
      
      {/* Belbog' (Belt/Sash) */}
      <rect x="25" y="85" width="50" height="6" fill="#dc2626" rx="2" />
      <path d="M45 85 L35 105" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
      <path d="M55 85 L65 105" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />

      {/* Face/Head */}
      <circle cx="50" cy="35" r="22" fill="url(#faceGradient)" />
      
      {/* Blush */}
      <circle cx="36" cy="40" r="4" fill="#fb7185" opacity="0.3" />
      <circle cx="64" cy="40" r="4" fill="#fb7185" opacity="0.3" />

      {/* Eyes & Smile */}
      <circle cx="42" cy="32" r="3.5" fill="#111" />
      <circle cx="58" cy="32" r="3.5" fill="#111" />
      <path d="M42 45 Q50 56 58 45" fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />

      {/* Do'ppi (Skullcap) - More detailed */}
      <path 
        d="M26 32 Q50 8 74 32 L74 36 L26 36 Z" 
        fill="#000" 
      />
      {/* Do'ppi traditional white pepper patterns (Kalampir nusxa) */}
      {[35, 50, 65].map((x, i) => (
        <path 
          key={i}
          d={`M${x-3} 25 Q${x} 18 ${x+3} 25 Q${x} 32 ${x-3} 25`} 
          fill="white" 
          opacity="0.9" 
        />
      ))}
      <rect x="26" y="34" width="48" height="2" fill="white" opacity="0.3" />
      
      {/* Arms */}
      <motion.rect 
        x="15" y="65" width="10" height="25" rx="5" fill="url(#choponGradient)" 
        animate={isMoving ? { rotate: [-20, 20, -20] } : {}}
      />
      <motion.rect 
        x="75" y="65" width="10" height="25" rx="5" fill="url(#choponGradient)" 
        animate={isMoving ? { rotate: [20, -20, 20] } : {}}
      />

      {/* Legs (if moving) */}
      <motion.g animate={isMoving ? { rotate: [0, 15, -15, 0] } : {}}>
         <rect x="36" y="108" width="12" height="12" rx="3" fill="#111" />
      </motion.g>
      <motion.g animate={isMoving ? { rotate: [0, -15, 15, 0] } : {}}>
         <rect x="52" y="108" width="12" height="12" rx="3" fill="#111" />
      </motion.g>
    </motion.svg>
  );
};

export function MazeGame() {
  const [level, setLevel] = useState(1);
  const [position, setPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isChallenge, setIsChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [score, setScore] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [obstacles, setObstacles] = useState<number[]>([]);
  const [passedObstacles, setPassedObstacles] = useState<Set<number>>(new Set());
  const [obstacleWords, setObstacleWords] = useState<Record<number, any>>({});
  const [isMergingKeys, setIsMergingKeys] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Generate obstacles - density increases with level
    const count = 4 + level; // Level 1: 5, Level 2: 6, Level 3: 7
    const obs = [];
    const step = MAZE_LENGTH / (count + 1);
    const wordsMap: Record<number, any> = {};
    const availableWords = CHALLENGE_WORDS[level as keyof typeof CHALLENGE_WORDS] || CHALLENGE_WORDS[1];

    for (let i = 1; i <= count; i++) {
      const pos = Math.round(i * step);
      obs.push(pos);
      // Allocate specific word to this obstacle position
      const wordIndex = (i - 1) % availableWords.length;
      wordsMap[pos] = availableWords[wordIndex];
    }
    setObstacles(obs);
    setObstacleWords(wordsMap);
  }, [level]);

  useEffect(() => {
    // Audio setup
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3"); // Upbeat
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;
    
    successAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_bbd13032d2.mp3");
    successAudioRef.current.volume = 0.4;

    // Speech Recognition setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'uz-UZ';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Transcript:", transcript);
        // In logopedic context, we might want to just detect ANY speech or specific word
        // Since uz-UZ recognition might be imperfect, we'll check if the transcript 
        // contains parts of the word or just count it as an attempt if significant speech is detected
        if (transcript.length > 1) {
          handleAttempt();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicError("Mikrofonga ruxsat berilmadi. Iltimos, brauzerning manzil satridagi qulflash belgisini bosing va ruxsat bering.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // We don't auto-restart here to avoid infinite loops or issues if permission is denied
        // Instead, the user can toggle it back on if needed
      };
    }

    return () => {
      audioRef.current?.pause();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      
      // Teacher override / manual marking
      if (isChallenge && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        handleAttempt();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, isChallenge, currentChallenge]);

  // Game Loop: Pure position updater (updates 100% of the movement)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMoving && gameState === "playing" && !isChallenge) {
      const stepSize = BASE_STEP_SIZE + (level - 1); // Get faster as level increases
      interval = setInterval(() => {
        setPosition(prev => {
          const next = prev + stepSize;
          if (next >= MAZE_LENGTH) {
            return MAZE_LENGTH;
          }
          return next;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isMoving, gameState, isChallenge, level]);

  // Side-effect handler: Checks for obstacles and handles game finish safely outside position setters
  useEffect(() => {
    if (gameState !== "playing" || isChallenge) return;

    // Check if character reached or exceeded the finish line
    if (position >= MAZE_LENGTH) {
      setIsMoving(false);
      setGameState("finished");
      launchSuccessResult();
      return;
    }

    // Check if character reached or crossed any unpassed obstacles
    const obstacleAt = obstacles.find(obs => position >= obs && !passedObstacles.has(obs));
    if (obstacleAt) {
      setPosition(obstacleAt); // Snap precisely to the obstacle's coordinate
      setIsMoving(false);
      triggerChallenge(obstacleAt);
    }
  }, [position, obstacles, passedObstacles, gameState, isChallenge]);

  const triggerChallenge = (obstacle: number) => {
    // Select word assigned specifically to this obstacle
    const assignedWord = obstacleWords[obstacle] || CHALLENGE_WORDS[level as keyof typeof CHALLENGE_WORDS][0];
    
    setCurrentChallenge(assignedWord);
    setAttempts(0);
    setIsChallenge(true);
    // Give a small delay before starting mic to let the user see the word
    setTimeout(() => {
      if (recognitionRef.current && !isListening) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Failed to start speech recognition:", e);
        }
      }
    }, 500);
  };

  const handleAttempt = () => {
    if (isMergingKeys) return; // Prevent double trigger

    setAttempts(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setIsMergingKeys(true);
        // Stop listening immediately to avoid extra sounds or errors
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {}
          setIsListening(false);
        }
        setTimeout(() => {
          finishChallenge();
          setIsMergingKeys(false);
        }, 1800);
        return 3;
      }
      return next;
    });
    
    // Show bonus star on each correct attempt
    setScore(s => s + 10);
    setShowBonus(true);
    setTimeout(() => setShowBonus(false), 1000);

    // Play small success sound for each valid attempt
    const audioClone = successAudioRef.current?.cloneNode(true) as HTMLAudioElement;
    if (audioClone) {
      audioClone.play().catch(() => {});
    }
  };

  const finishChallenge = () => {
    setIsChallenge(false);
    setPassedObstacles(prev => new Set(prev).add(position));
    setScore(s => s + 50);
    setIsMoving(true);
    setAttempts(0); // Reset attempts so HUD is empty for next segment
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
    
    // Play success sound
    const audioClone = successAudioRef.current?.cloneNode(true) as HTMLAudioElement;
    if (audioClone) {
      audioClone.play().catch(() => {});
    }
    
    launchSuccessResult();
  };

  const startGame = () => {
    setLevel(1);
    setPosition(0);
    setScore(0);
    setPassedObstacles(new Set());
    setGameState("playing");
    setIsMoving(true);
    setAttempts(0); // Reset attempts
    audioRef.current?.play().catch(() => {});
  };

  const toggleMic = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
        // Show a temporary alert or message if permission is likely denied
      }
    }
  };

  const playWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentChallenge.word);
    utterance.lang = "uz-UZ";
    window.speechSynthesis.speak(utterance);
  };

  const startNextLevel = () => {
    if (level < MAX_LEVELS) {
      setLevel(prev => prev + 1);
      setPosition(0);
      setPassedObstacles(new Set());
      setGameState("playing");
      setIsMoving(true);
      setAttempts(0); // Reset attempts
      launchSuccessResult();
    } else {
      setGameState("ready");
      setLevel(1);
    }
  };

  if (gameState === "finished") {
    const isGameComplete = level >= MAX_LEVELS;
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          {isGameComplete ? <PartyPopper className="w-12 h-12 text-white" /> : <Trophy className="w-12 h-12 text-white" />}
        </motion.div>
        <h3 className="text-3xl font-bold">{isGameComplete ? "Tabriklaymiz!" : `${level}-bosqich yakunlandi!`}</h3>
        <p className="text-muted-foreground text-lg">
          {isGameComplete 
            ? `Siz barcha bosqichlarni a'lo darajada o'tdingiz va ${score} ball to'pladingiz!` 
            : `Siz bu bosqichni muvaffaqiyatli yakunladingiz! Keyingi bosqich yanada qiziqarli bo'ladi.`}
        </p>
        <div className="flex flex-col gap-3">
            {!isGameComplete ? (
                <Button onClick={startNextLevel} size="lg" className="rounded-full px-12 h-16 text-xl bg-blue-600 hover:bg-blue-700 shadow-xl border-b-4 border-blue-800">
                    Keyingi bosqich! 🚀
                </Button>
            ) : (
                <Button onClick={startGame} size="lg" className="rounded-full px-10 bg-green-600 hover:bg-green-700">
                    Boshidan boshlash
                </Button>
            )}
        </div>
      </div>
    );
  }

  if (gameState === "ready") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
             <UzbekBoyCharacter isMoving={true} />
        </div>
        <h3 className="text-3xl font-bold">Logopedik Labirint</h3>
        <p className="text-muted-foreground text-lg max-w-sm">
          Qahramonimizga marraga yetishga yordam bering! To'siqlarda berilgan so'zlarni 3 marta baland va aniq ayting.
        </p>
        <Button onClick={startGame} size="lg" className="rounded-full px-10 h-14 text-lg bg-green-600 hover:bg-green-700">
          Yo'lga tushish!
        </Button>
      </div>
    );
  }

  const coord = getCoordinatesForProgress(position / MAZE_LENGTH);
  const pathD = MAZE_PATH.map((pt, index) => 
    `${index === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`
  ).join(' ');

  return (
    <div className="w-full flex flex-col items-center gap-12 py-8 px-4 relative">
      {/* HUD */}
      <div className="w-full flex justify-between items-center max-w-2xl">
        <div className="flex gap-2">
            <Badge variant="outline" className="text-lg py-1 px-4 bg-white shadow-sm border-stone-200">
            Bosqich: {level}/{MAX_LEVELS}
            </Badge>
            <Badge variant="outline" className="text-lg py-1 px-4 shadow-sm border-stone-200">
            Masofa: {Math.round((position / MAZE_LENGTH) * 100)}%
            </Badge>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-bold text-2xl relative">
          <Star className="fill-current w-6 h-6" />
          {score}
          <AnimatePresence>
            {showBonus && (
              <motion.span 
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -30, opacity: 0 }}
                className="absolute -top-4 right-0 text-yellow-500 font-bold"
              >
                +10
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Path with Castle Theme (Height increased to h-80 for 2D winding maze) */}
      <div 
        onClick={() => {
          if (gameState === "playing" && !isChallenge) {
            setIsMoving(prev => !prev);
          }
        }}
        className={`w-full max-w-3xl h-80 bg-stone-900 rounded-[3rem] relative overflow-hidden shadow-2xl border-b-8 border-stone-950 border-x-4 border-stone-850 select-none transition-all
          ${gameState === "playing" && !isChallenge ? "cursor-pointer active:brightness-95 hover:border-stone-800" : ""}`}
      >
        {/* Absolute Key Collection HUD inside the Maze Box itself */}
        {gameState === "playing" && (
          <div className="absolute top-4 left-4 z-40 bg-stone-950/85 backdrop-blur-md border border-amber-500/20 rounded-2xl px-3 py-1.5 flex flex-col items-start gap-1 shadow-2xl select-none pointer-events-none transition-all duration-300">
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider leading-none">
              {!isMergingKeys ? `Kalitlar: ${attempts}/3` : "Birlashmoqda! ✨"}
            </span>
            <div className="relative flex items-center justify-start h-6 min-w-[70px]">
              {!isMergingKeys ? (
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={attempts >= i 
                        ? { scale: [1, 1.25, 1], opacity: 1, rotate: [0, -10, 10, 0] } 
                        : { scale: 1, opacity: 0.3 }
                      }
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center relative transition-all duration-300
                        ${attempts >= i 
                          ? 'border-yellow-400 bg-gradient-to-br from-amber-400 to-yellow-300 text-stone-950 font-bold shadow-[0_0_8px_rgba(234,179,8,0.4)]' 
                          : 'border-stone-700 bg-stone-850 text-stone-600'}`}
                    >
                      <span className={`text-xs ${attempts >= i ? '' : 'grayscale opacity-30'}`}>🔑</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Merging Animation inside Maze Box HUD */
                <div className="relative w-16 h-6 flex items-center justify-center overflow-visible">
                  <motion.div
                    initial={{ x: -15, scale: 1, opacity: 1 }}
                    animate={{ x: 0, scale: 1.3, opacity: 0.8, rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-xs"
                  >
                    🔑
                  </motion.div>
                  <motion.div
                    initial={{ x: 15, scale: 1, opacity: 1 }}
                    animate={{ x: 0, scale: 1.3, opacity: 0.8, rotate: -360 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-xs"
                  >
                    🔑
                  </motion.div>
                  <motion.div
                    initial={{ y: -10, scale: 1, opacity: 1 }}
                    animate={{ y: 0, scale: 1.3, opacity: 0.8 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-xs"
                  >
                    🔑
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1.2], opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="absolute text-sm z-20"
                  >
                    🔑
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Magical Key Fusion Overlay in the Center of the Maze Box */}
        <AnimatePresence>
          {isMergingKeys && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs z-40 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="relative flex items-center justify-center w-36 h-36">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute w-24 h-24 rounded-full border-4 border-dashed border-yellow-400/30"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute w-28 h-28 rounded-full border-2 border-dotted border-amber-500/20"
                />

                <motion.div
                  initial={{ x: -60, scale: 1, opacity: 0 }}
                  animate={{ x: 0, scale: 1.6, opacity: [0, 1, 1, 0.8], rotate: 360 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute text-3xl"
                >
                  🔑
                </motion.div>
                <motion.div
                  initial={{ x: 60, scale: 1, opacity: 0 }}
                  animate={{ x: 0, scale: 1.6, opacity: [0, 1, 1, 0.8], rotate: -360 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute text-3xl"
                >
                  🔑
                </motion.div>
                <motion.div
                  initial={{ y: -50, scale: 1, opacity: 0 }}
                  animate={{ y: 0, scale: 1.6, opacity: [0, 1, 1, 0.8] }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute text-3xl"
                >
                  🔑
                </motion.div>

                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: [0, 2.2, 1.8], opacity: 1, rotate: [0, 15, 0] }}
                  transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
                  className="absolute flex flex-col items-center z-20"
                >
                  <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(250,204,21,0.7)]">🔑</span>
                  <motion.span 
                    animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-[10px] font-black text-yellow-400 uppercase tracking-wider bg-stone-900 border border-yellow-500/50 px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap mt-2 font-sans"
                  >
                    Eshik ochilmoqda! 🚪✨
                  </motion.span>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: [0.2, 3, 4], opacity: [0, 1, 0] }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute w-12 h-12 bg-yellow-400 rounded-full blur-2xl"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wall Background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,#333,transparent),radial-gradient(circle_at_80%_70%,#222,transparent)]" />
        
        {/* Torches (Positioned higher up) */}
        {[10, 30, 50, 70, 90].map(x => (
          <div key={`torch-${x}`} style={{ left: `${x}%` }} className="absolute top-4 flex flex-col items-center">
             <div className="w-1.5 h-6 bg-amber-900 rounded-b-lg" />
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
               transition={{ repeat: Infinity, duration: 0.5 }}
               className="w-3 h-3 bg-orange-500 rounded-full blur-sm mb-4" 
             />
          </div>
        ))}

        {/* Castle Windows (Arched, positioned subtly in background) */}
        <div className="absolute inset-0 flex justify-around items-center opacity-10 pointer-events-none">
           {Array.from({ length: 5 }).map((_, i) => (
             <div key={i} className="w-12 h-20 bg-sky-200 rounded-t-full border-4 border-stone-700" />
           ))}
        </div>

        {/* Winding Stone Road Path Vector Graphics */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Path Shadows */}
          <path
            d={pathD}
            fill="none"
            stroke="#1c1917"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-70"
          />
          {/* Main cobblestone border */}
          <path
            d={pathD}
            fill="none"
            stroke="#78716c"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Core road texture */}
          <path
            d={pathD}
            fill="none"
            stroke="#d6d3d1"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 4"
          />
          {/* Inner pathway line */}
          <path
            d={pathD}
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 8"
          />
        </svg>

        {/* Cute Castle Maze decorations along the curves */}
        <div style={{ left: "12%", top: "45%" }} className="absolute text-xl pointer-events-none select-none opacity-80">🌳</div>
        <div style={{ left: "30%", top: "52%" }} className="absolute text-lg pointer-events-none select-none opacity-70">🌸</div>
        <div style={{ left: "50%", top: "45%" }} className="absolute text-xl pointer-events-none select-none opacity-80">🌳</div>
        <div style={{ left: "70%", top: "54%" }} className="absolute text-lg pointer-events-none select-none opacity-70">🌻</div>
        <div style={{ left: "86%", top: "40%" }} className="absolute text-xl pointer-events-none select-none opacity-80">🚩</div>

        {/* Destination Finish Castle Archway */}
        <div 
          style={{ left: "92%", top: "64%", transform: "translate(-50%, -75%)" }} 
          className="absolute z-10 flex flex-col items-center pointer-events-none"
        >
          <span className="text-2xl animate-bounce duration-1000">🏰</span>
          <div className="w-10 h-14 bg-gradient-to-b from-stone-700 to-stone-850 rounded-t-full border-2 border-amber-500 shadow-xl flex items-center justify-center">
            <span className="text-[9px] font-black text-amber-400 tracking-wider">MARRA</span>
          </div>
        </div>
        
        {/* Obstacles Visual (Doors positioned dynamically along the coordinates of the winding road) */}
        {obstacles.map(obs => {
           const obsCoord = getCoordinatesForProgress(obs / MAZE_LENGTH);
           const isPassed = passedObstacles.has(obs);
           const assignedWord = obstacleWords[obs];
           return (
             <div 
               key={obs}
               style={{ 
                 left: `${obsCoord.x}%`, 
                 top: `${obsCoord.y}%`,
                 transform: "translate(-50%, -65%)"
               }}
               className={`absolute h-16 w-10 transition-all z-20 flex flex-col items-center justify-end overflow-visible
                  ${isPassed ? 'opacity-20 scale-x-50 -translate-y-2' : ''}`}
             >
                {/* Word displayed directly above the locked door - ONLY SHOWS when the boy is actually standing at this door (isChallenge is active for this door) */}
                {!isPassed && assignedWord && isChallenge && currentChallenge?.word === assignedWord.word && (
                  <div className="absolute bottom-[105%] mb-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-md border border-amber-300 select-none pointer-events-none text-center flex flex-col items-center min-w-[70px] animate-bounce z-30">
                    <span className="text-[7px] text-amber-100 uppercase tracking-wider font-extrabold leading-none mb-0.5">Ayting:</span>
                    <span className="leading-none drop-shadow-sm font-bold text-xs">{assignedWord.word}</span>
                    {/* Small speech arrow pointing to the door */}
                    <div className="w-1.5 h-1.5 bg-amber-600 rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2 border-r border-b border-amber-300" />
                  </div>
                )}

                {!isPassed ? (
                  <motion.div 
                    layoutId={`door-${obs}`}
                    className="w-10 h-14 bg-amber-950 rounded-t-lg border-2 border-amber-950 shadow-xl flex items-center justify-center relative"
                  >
                     <div className="w-8 h-0.5 bg-amber-900/40 absolute top-3" />
                     <div className="w-8 h-0.5 bg-amber-900/40 absolute top-7" />
                     <div className="w-8 h-0.5 bg-amber-900/40 absolute bottom-3" />
                     <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full absolute right-1.5 top-1/2 -translate-y-1/2 shadow-inner animate-pulse" />
                     <div className="absolute -top-7 text-lg">🚪</div>
                  </motion.div>
                ) : (
                  <div className="w-12 h-2 text-green-400 font-extrabold text-[8px] text-center mb-1">OCHIQ</div>
                )}
             </div>
           );
        })}

        {/* Character (Positioned on the 2D path coord) */}
        <motion.div
           animate={{ 
             left: `${coord.x}%`, 
             top: `${coord.y}%` 
           }}
           transition={position <= 2 ? { duration: 0 } : { type: "tween", ease: "linear", duration: 0.05 }}
           className="absolute z-30 transform -translate-x-1/2 -translate-y-[85%] flex items-center justify-center pointer-events-none"
        >
          <UzbekBoyCharacter isMoving={isMoving} />
          {isMoving && (
             <motion.div 
                animate={{ x: [-5, -20], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="absolute -left-6 bottom-4 text-xs opacity-50"
             >
                💨
             </motion.div>
          )}
        </motion.div>
      </div>

      <div ref={containerRef} className="w-full invisible h-0" />

      {/* Challenge UI - Ultra-Compact Horizontal Inline Panel below the Maze */}
      <AnimatePresence mode="wait">
        {isChallenge ? (
          <motion.div
            initial={{ height: 0, opacity: 0, y: 15 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="w-full max-w-3xl bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
          >
            {/* Left side: Word info */}
            <div className="flex flex-col sm:items-start items-center text-center sm:text-left gap-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full border-none uppercase">
                  To'siq!
                </Badge>
                {currentChallenge.description && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full border border-blue-100">
                    🎯 {currentChallenge.description}
                  </span>
                )}
                <Badge variant="secondary" className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] px-2 py-0.5 rounded-full uppercase font-bold">{currentChallenge.difficulty}</Badge>
              </div>
              
              <div className="flex items-baseline gap-2 mt-1 flex-wrap justify-center sm:justify-start">
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight leading-none">
                  {currentChallenge.prompt}
                </h3>
                <p className="text-base sm:text-lg font-black text-blue-500 italic leading-none">
                  "{currentChallenge.word}"
                </p>
                <Button variant="ghost" size="sm" onClick={playWord} className="h-7 w-7 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 p-0 ml-1">
                  <Volume2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Right side: Microphone & Aytib bo'ldim button */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center sm:justify-end">
              <div className="flex flex-col items-end mr-1">
                {micError ? (
                  <p className="text-[10px] text-red-600 font-medium max-w-[160px] text-right leading-tight">
                    {micError}
                  </p>
                ) : isListening ? (
                  <span className="text-[10px] text-emerald-600 font-black animate-pulse uppercase tracking-wider">Gapiring... 🎤</span>
                ) : (
                  <span className="text-[10px] text-red-500 font-bold animate-pulse">Mikrofonni yoqing!</span>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <Button 
                   onClick={toggleMic} 
                   size="sm" 
                   disabled={isMergingKeys}
                   className={`rounded-2xl h-12 w-12 p-0 shadow-md transition-all duration-300 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse text-white' : 'bg-slate-700 hover:bg-slate-800 text-white'}`}
                >
                  {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button 
                  onClick={handleAttempt} 
                  variant="default"
                  size="default"
                  disabled={isMergingKeys}
                  className="rounded-2xl h-12 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 font-black text-white shadow-md text-sm border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  Aytib bo'ldim! ✨
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          gameState === "playing" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-2"
            >
              <p className="text-slate-500 font-bold text-sm">
                Yo'lni davom ettirish uchun <span className="text-green-600 font-black">Ekrandagi Yo'lga</span> teging yoki bosing 🏃‍♂️💨
              </p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
