import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, Mic, MicOff, Volume2, Gamepad2, Star, PartyPopper, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult } from "../lib/effects";

const CHALLENGE_WORDS = [
  // Oson (Easy) - Basic difficult sounds
  { word: "Randa", difficulty: "Oson", prompt: "Rrr-randa" },
  { word: "Lola", difficulty: "Oson", prompt: "Lll-lola" },
  { word: "Shar", difficulty: "Oson", prompt: "Shsh-shar" },
  { word: "Quyon", difficulty: "Oson", prompt: "Qq-quyon" },
  // O'rtacha (Medium) - More complex pronunciation
  { word: "Sabzi", difficulty: "O'rtacha", prompt: "Sss-sabzi" },
  { word: "Robot", difficulty: "O'rtacha", prompt: "Rrr-robot" },
  { word: "Limon", difficulty: "O'rtacha", prompt: "Lll-limon" },
  { word: "Shaftoli", difficulty: "O'rtacha", prompt: "Shsh-shaftoli" },
  // Murakkab (Hard) - Multi-syllable and tricky sounds
  { word: "Raketa", difficulty: "Murakkab", prompt: "Rrr-raketa" },
  { word: "Shashka", difficulty: "Murakkab", prompt: "Shsh-shashka" },
  { word: "Chirildoq", difficulty: "Murakkab", prompt: "Chch-chirildoq" },
  { word: "Qulupnay", difficulty: "Murakkab", prompt: "Qq-qulupnay" }
];

const MAZE_LENGTH = 3000; // Longer maze
const STEP_SIZE = 4; // Faster base speed for longer maze

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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Generate obstacles - spaced out over 3000 pixels
    const obs = [400, 800, 1200, 1600, 2000, 2400, 2800];
    setObstacles(obs);

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMoving && gameState === "playing" && !isChallenge) {
      interval = setInterval(() => {
        setPosition(prev => {
          const next = prev + STEP_SIZE;
          
          // Check for obstacles
          const obstacleAt = obstacles.find(obs => next >= obs && !passedObstacles.has(obs));
          if (obstacleAt) {
            setIsMoving(false);
            triggerChallenge(obstacleAt);
            return obstacleAt;
          }

          if (next >= MAZE_LENGTH) {
            setIsMoving(false);
            setGameState("finished");
            launchSuccessResult();
            return MAZE_LENGTH;
          }
          return next;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isMoving, gameState, isChallenge, obstacles, passedObstacles]);

  const triggerChallenge = (obstacle: number) => {
    // Select word based on obstacle position (difficulty curve)
    const section = Math.floor((obstacle / MAZE_LENGTH) * 3);
    const difficulty = section === 0 ? "Oson" : section === 1 ? "O'rtacha" : "Murakkab";
    const availableWords = CHALLENGE_WORDS.filter(w => w.difficulty === difficulty);
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    setCurrentChallenge(randomWord);
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
    setAttempts(prev => {
      const next = prev + 1;
      if (next >= 3) {
        finishChallenge();
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
    setPosition(0);
    setScore(0);
    setPassedObstacles(new Set());
    setGameState("playing");
    setIsMoving(true);
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

  if (gameState === "finished") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-3xl font-bold">Marra!</h3>
        <p className="text-muted-foreground text-lg">
          Siz labirintdan muvaffaqiyatli o'tdingiz va {score} ball to'pladingiz!
        </p>
        <Button onClick={startGame} size="lg" className="rounded-full px-10 bg-green-600 hover:bg-green-700">
          Qayta urinish
        </Button>
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

  return (
    <div className="w-full flex flex-col items-center gap-12 py-8 px-4 relative">
      {/* HUD */}
      <div className="w-full flex justify-between items-center max-w-2xl">
        <Badge variant="outline" className="text-lg py-1 px-4">
          Masofa: {Math.round((position / MAZE_LENGTH) * 100)}%
        </Badge>
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

      {/* Path with Castle Theme */}
      <div className="w-full max-w-3xl h-56 bg-stone-800 rounded-[3rem] relative overflow-hidden shadow-2xl border-b-8 border-stone-900 border-x-4 border-stone-700">
        {/* Wall Background */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_30%,#333,transparent),radial-gradient(circle_at_80%_70%,#222,transparent)]" />
        
        {/* Torches */}
        {[10, 30, 50, 70, 90].map(x => (
          <div key={`torch-${x}`} style={{ left: `${x}%` }} className="absolute top-10 flex flex-col items-center">
             <div className="w-2 h-8 bg-amber-900 rounded-b-lg" />
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
               transition={{ repeat: Infinity, duration: 0.5 }}
               className="w-4 h-4 bg-orange-500 rounded-full blur-sm mb-4" 
             />
          </div>
        ))}

        {/* Castle Windows (Arched) */}
        <div className="absolute inset-0 flex justify-around items-center opacity-10 pointer-events-none">
           {Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="w-16 h-28 bg-sky-200 rounded-t-full border-4 border-stone-600" />
           ))}
        </div>

        {/* Castle Floor (Stone blocks) */}
        <div className="absolute bottom-4 left-0 right-10 h-20 bg-stone-700 rounded-full shadow-inner border-b-4 border-stone-800 flex items-center justify-center overflow-hidden">
           <div className="w-[200%] h-full bg-[repeating-linear-gradient(90deg,#555,#555_2px,transparent_2px,transparent_100px)] opacity-20" />
           <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#444,#444_2px,transparent_2px,transparent_40px)] opacity-10" />
        </div>
        
        {/* Destination Castle Entrance */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-stone-900 shadow-2xl flex items-center justify-center border-l-4 border-stone-600">
           <div className="w-10 h-32 bg-stone-800 rounded-t-full border-2 border-stone-700" />
        </div>
        
        {/* Obstacles Visual (Doors) */}
        {obstacles.map(obs => (
           <div 
             key={obs}
             style={{ left: `${(obs / MAZE_LENGTH) * 100}%` }}
             className={`absolute bottom-4 h-24 w-12 transition-all z-20 flex flex-col items-center justify-end overflow-visible
                ${passedObstacles.has(obs) ? 'opacity-20 scale-x-50 -translate-y-2' : ''}`}
           >
              {!passedObstacles.has(obs) ? (
                <motion.div 
                  layoutId={`door-${obs}`}
                  className="w-12 h-20 bg-amber-900 rounded-t-xl border-4 border-amber-950 shadow-xl flex items-center justify-center relative"
                >
                   <div className="w-10 h-1 bg-amber-950/30 absolute top-4" />
                   <div className="w-10 h-1 bg-amber-950/30 absolute top-10" />
                   <div className="w-10 h-1 bg-amber-950/30 absolute bottom-4" />
                   <div className="w-2 h-2 bg-yellow-500 rounded-full absolute right-2 top-1/2 -translate-y-1/2 shadow-inner" />
                   <div className="absolute -top-10 text-2xl">🚪</div>
                </motion.div>
              ) : (
                <div className="w-12 h-2 text-green-500 font-bold text-[10px] text-center mb-2">OCHIQ</div>
              )}
           </div>
        ))}

        {/* Character */}
        <motion.div
           animate={{ x: (position / MAZE_LENGTH) * (containerRef.current ? containerRef.current.clientWidth - 80 : 500) }}
           className="absolute bottom-6 left-0 z-30 transform flex items-center justify-center"
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

      {/* Challenge UI */}
      <AnimatePresence>
        {isChallenge && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl border-4 border-red-100 flex flex-col items-center gap-6 relative"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
               <ShieldAlert className="w-5 h-5" />
               To'siq!
            </div>

            <div className="text-center space-y-4">
              <Badge variant="secondary" className="mb-2">{currentChallenge.difficulty}</Badge>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Ushbu so'zni 3 marta ayting:</p>
              <h2 className="text-5xl font-black text-primary tracking-tighter">{currentChallenge.prompt}</h2>
              <p className="text-xl font-bold text-blue-600 italic">"{currentChallenge.word}"</p>
              <Button variant="ghost" size="sm" onClick={playWord} className="rounded-full text-blue-600">
                <Volume2 className="w-4 h-4 mr-2" />
                Eshitish
              </Button>
            </div>

            {/* Attempts Indicator */}
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={attempts >= i ? { scale: [1, 1.2, 1], backgroundColor: "#22c55e" } : {}}
                  className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-xl font-bold transition-colors
                    ${attempts >= i ? 'border-green-600 bg-green-500 text-white' : 'border-slate-200 bg-slate-50 text-slate-300'}`}
                >
                  {attempts >= i ? <CheckCircle2 className="w-6 h-6" /> : i}
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-xs text-muted-foreground italic text-center">
                Maslahat: So'zni ayting yoki <span className="font-bold text-primary">Probel (Space)</span> tugmachasini bosing
              </p>
              
              {micError && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                   {micError}
                </p>
              )}
              
              {!isListening && !micError && (
                 <p className="text-sm text-red-500 font-medium animate-pulse">Mikrofonni yoqing va gapiring!</p>
              )}
              
              <div className="flex gap-4">
                <Button 
                   onClick={toggleMic} 
                   size="lg" 
                   className={`rounded-full h-16 w-16 p-0 shadow-lg ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-slate-700'}`}
                >
                  {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                </Button>

                {/* Fallback button for testing or if mic fails */}
                <Button 
                  onClick={handleAttempt} 
                  variant="outline"
                  className="rounded-full h-16 px-8 border-2 border-dashed border-primary/30"
                >
                  Aytib bo'ldim!
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic text-center">
              Eslatma: Nutq tahlili qilinmoqda. Har safar so'zni aniq talaffuz qiling.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isChallenge && gameState === "playing" && (
         <div className="text-center animate-bounce">
            <p className="text-green-600 font-black text-xl uppercase tracking-tighter">Yugurmoqda...</p>
         </div>
      )}
    </div>
  );
}
