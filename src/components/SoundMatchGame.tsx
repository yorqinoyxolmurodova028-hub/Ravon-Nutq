import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Volume2, Star, Trophy, RotateCcw, PartyPopper, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult } from "../lib/effects";

const BG_MUSIC_URL = "https://assets.mixkit.co/music/preview/mixkit-funny-game-over-theme-3243.mp3"; // This is short, I should find a loop. 
// Using a more suitable loopable music URL:
const GAME_LOOP_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Placeholder loop

interface SoundLevel {
  id: number;
  sound: string;
  options: { emoji: string; name: string; startsWith: string }[];
}

const levels: SoundLevel[] = [
  {
    id: 1,
    sound: "O",
    options: [
      { emoji: "🍎", name: "Olma", startsWith: "O" },
      { emoji: "🍌", name: "Banan", startsWith: "B" },
      { emoji: "🍇", name: "Uzum", startsWith: "U" },
    ]
  },
  {
    id: 2,
    sound: "B",
    options: [
      { emoji: "🐱", name: "Mushuk", startsWith: "M" },
      { emoji: "🍌", name: "Banan", startsWith: "B" },
      { emoji: "🐶", name: "Kuchuk", startsWith: "K" },
    ]
  },
  {
    id: 3,
    sound: "K",
    options: [
      { emoji: "🚗", name: "Mashina", startsWith: "M" },
      { emoji: "🏠", name: "Uy", startsWith: "U" },
      { emoji: "📖", name: "Kitob", startsWith: "K" },
      { emoji: "🎈", name: "Shar", startsWith: "Sh" },
    ]
  },
  {
    id: 4,
    sound: "S",
    options: [
      { emoji: "🕒", name: "Soat", startsWith: "S" },
      { emoji: "🌳", name: "Daraxt", startsWith: "D" },
      { emoji: "☁️", name: "Bulut", startsWith: "B" },
      { emoji: "🚲", name: "Velosiped", startsWith: "V" },
    ]
  },
  {
    id: 5,
    sound: "D",
    options: [
      { emoji: "🦋", name: "Kapalak", startsWith: "K" },
      { emoji: "🌳", name: "Daraxt", startsWith: "D" },
      { emoji: "🎈", name: "Shar", startsWith: "Sh" },
      { emoji: "🦷", name: "Tish", startsWith: "T" },
      { emoji: "🍓", name: "Qulupnay", startsWith: "Q" },
    ]
  },
  {
    id: 6,
    sound: "P",
    options: [
      { emoji: "🐧", name: "Pingvin", startsWith: "P" },
      { emoji: "🐘", name: "Fil", startsWith: "F" },
      { emoji: "🐢", name: "Toshbaqa", startsWith: "T" },
      { emoji: "🦜", name: "To'ti", startsWith: "T" },
      { emoji: "🐻", name: "Ayiq", startsWith: "A" },
    ]
  },
  {
    id: 7,
    sound: "L",
    options: [
      { emoji: "🍋", name: "Limon", startsWith: "L" },
      { emoji: "🍭", name: "Konfet", startsWith: "K" },
      { emoji: "🦁", name: "Sher", startsWith: "Sh" },
      { emoji: "🧅", name: "Piyoz", startsWith: "P" },
    ]
  },
  {
    id: 8,
    sound: "M",
    options: [
      { emoji: "🍦", name: "Muzqaymoq", startsWith: "M" },
      { emoji: "🍳", name: "Tuxum", startsWith: "T" },
      { emoji: "🥑", name: "Avokado", startsWith: "A" },
      { emoji: "🍍", name: "Ananas", startsWith: "A" },
    ]
  },
  {
    id: 9,
    sound: "T",
    options: [
      { emoji: "🥣", name: "Tavoq", startsWith: "T" },
      { emoji: "🥕", name: "Sabzi", startsWith: "S" },
      { emoji: "🌽", name: "Makkajo'xori", startsWith: "M" },
      { emoji: "🍉", name: "Tarvuz", startsWith: "T" },
    ]
  }
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function SoundMatchGame() {
  const [gameLevels, setGameLevels] = useState<SoundLevel[]>(() => shuffleArray(levels));
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "success" | "finished">("playing");
  const [score, setScore] = useState(0);
  const [incorrectId, setIncorrectId] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentLevel = gameLevels[currentLevelIdx];

  useEffect(() => {
    // Initial shuffle handled by useState initializer
  }, []);

  useEffect(() => {
    // Background music initialization
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3"); // Fun, upbeat, bouncing
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;
    
    successAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_bbd13032d2.mp3"); // Success chime
    successAudioRef.current.volume = 0.4;
    
    const playMusic = () => {
        audioRef.current?.play().catch(e => console.log("Music play blocked by browser", e));
    };

    window.addEventListener('mousedown', playMusic, { once: true });

    return () => {
      audioRef.current?.pause();
      window.removeEventListener('mousedown', playMusic);
    };
  }, []);


  const playSound = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "uz-UZ";
    utterance.rate = 0.8; // Slightly slower for clarity
    
    // Attempt to find a suitable voice
    const voices = window.speechSynthesis.getVoices();
    const uzVoice = voices.find(v => v.lang.startsWith('uz')) || voices.find(v => v.lang.startsWith('tr'));
    if (uzVoice) utterance.voice = uzVoice;
    
    window.speechSynthesis.speak(utterance);
  };

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
      const timer = setTimeout(() => playSound(currentLevel.sound), 600);
      return () => clearTimeout(timer);
    }
    
    if (gameState === "success") {
      const timer = setTimeout(() => {
        nextLevel();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentLevelIdx, gameState]);

  const handleOptionClick = (option: typeof levels[0]["options"][0], index: number) => {
    if (gameState !== "playing") return;

    if (option.startsWith === currentLevel.sound) {
      setScore(prev => prev + 20);
      setGameState("success");
      playFeedback(true);
    } else {
      setIncorrectId(index);
      playFeedback(false);
      setTimeout(() => setIncorrectId(null), 500);
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

  const resetGame = () => {
    setGameLevels(shuffleArray(levels));
    setCurrentLevelIdx(0);
    setScore(0);
    setGameState("playing");
  };

  if (gameState === "finished") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-3xl font-bold">Ajoyib Natija!</h3>
        <p className="text-muted-foreground text-lg">
          Siz barcha tovushlarni to'g'ri topdingiz va {score} ball to'pladingiz!
        </p>
        <Button onClick={resetGame} size="lg" className="rounded-full px-10 bg-blue-600 hover:bg-blue-700">
          <RotateCcw className="mr-2 w-5 h-5" />
          Boshidan boshlash
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-8 py-4 w-full transition-all duration-300 ${showFlash ? 'ring-8 ring-red-500 ring-inset' : ''}`}>
      <div className="w-full flex justify-between items-center px-4">
        <Badge variant="outline" className="text-lg py-1 px-4">
          Bosqich: {currentLevelIdx + 1}/{gameLevels.length}
        </Badge>
        <div className="flex items-center gap-2 text-blue-500 font-bold text-xl">
          <Star className="fill-current w-6 h-6" />
          {score}
        </div>
      </div>

      <div className="text-center space-y-4">
        <h4 className="text-2xl font-bold text-primary">Qaysi rasm ushbu tovush bilan boshlanadi?</h4>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playSound(currentLevel.sound)}
              className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 relative group"
            >
               <span className="text-6xl font-black">{currentLevel.sound}</span>
               <div className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Volume2 className="w-5 h-5" />
               </div>
            </motion.button>
            <p className="text-muted-foreground font-bold uppercase tracking-widest mt-4">
              {currentLevel.sound} tovushini toping
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl px-4">
        {currentLevel.options.map((opt, i) => (
          <motion.div
            key={`${currentLevel.id}-${i}`}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOptionClick(opt, i)}
            className={`cursor-pointer group relative bg-white p-8 rounded-[2.5rem] border-4 transition-all duration-300 flex flex-col items-center gap-4 shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:shadow-2xl
              ${incorrectId === i ? 'border-red-400 bg-red-50 animate-shake' : 'border-blue-50 hover:border-blue-400'}`}
          >
            {/* Soft background shape */}
            <div className="absolute inset-4 bg-muted/20 rounded-full group-hover:scale-110 transition-transform duration-500" />
            
            <span className="text-7xl md:text-8xl group-hover:scale-110 transition-transform select-none drop-shadow-md relative z-10">
              {opt.emoji}
            </span>
            <span className="font-black text-xl text-blue-900 capitalize relative z-10">{opt.name}</span>
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-muted text-muted-foreground group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors`}>
              {opt.startsWith} harfi
            </div>
            
            <AnimatePresence>
                {incorrectId === i && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-500/20 rounded-[2.2rem] flex items-center justify-center backdrop-blur-[2px]"
                  >
                    <div className="bg-red-500 text-white rounded-full p-4 shadow-lg scale-110">
                      <RotateCcw className="w-8 h-8" />
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="h-20 flex items-center justify-center">
        <AnimatePresence>
          {gameState === "success" && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-3 text-green-600 font-black text-2xl">
                <PartyPopper className="w-8 h-8" />
                Ofarin! Juda to'g'ri!
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <Button onClick={nextLevel} className="rounded-full bg-blue-600 hover:bg-blue-700 px-10 h-12 text-lg">
                Keyingi tovush
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
