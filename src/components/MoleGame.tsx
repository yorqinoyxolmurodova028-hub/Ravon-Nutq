import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, Star, RotateCcw, Timer, Sparkles, Swords, Users, Play, CheckCircle2, Award, RefreshCw, ChevronRight } from "lucide-react";
import { launchSuccessResult } from "../lib/effects";

interface WordItem {
  word: string;
  category: "ochiq" | "yopiq" | "sifat" | "ot" | "juft" | "toq" | "fel" | "son";
}

interface Floater {
  id: number;
  text: string;
  type: "success" | "error";
  x: number;
  y: number;
}

interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  player1Instruction: string;
  player2Instruction: string;
  player1TargetCategory: "ochiq" | "sifat" | "juft" | "fel" | "son";
  player2TargetCategory: "yopiq" | "ot" | "toq" | "sifat" | "ot"; // TS needs standard unions
  words: WordItem[];
}

const LEVEL_DATA: Record<number, LevelConfig> = {
  1: {
    id: 1,
    title: "1-Bosqich: Ochiq va Yopiq Bo'g'inlar 🧩",
    subtitle: "Bo'g'inlar bo'yicha tezkor musobaqa!",
    player1Instruction: "Faqat ochiq bo'g'inli so'zlarni top! (Masalan: Bo-la, Lo-la)",
    player2Instruction: "Faqat yopiq bo'g'inli so'zlarni top! (Masalan: Mak-tab, Tosh)",
    player1TargetCategory: "ochiq",
    player2TargetCategory: "yopiq",
    words: [
      // Ochiq bo'g'inlar (Vowel ending)
      { word: "Bola", category: "ochiq" },
      { word: "Lola", category: "ochiq" },
      { word: "Ona", category: "ochiq" },
      { word: "Dala", category: "ochiq" },
      { word: "Buvi", category: "ochiq" },
      { word: "Aka", category: "ochiq" },
      { word: "Uka", category: "ochiq" },
      { word: "Ko'za", category: "ochiq" },
      { word: "Ota", category: "ochiq" },
      { word: "Kema", category: "ochiq" },
      { word: "Supa", category: "ochiq" },
      { word: "Soya", category: "ochiq" },
      { word: "Qora", category: "ochiq" },
      { word: "Zira", category: "ochiq" },
      { word: "Yana", category: "ochiq" },
      { word: "Arra", category: "ochiq" },
      { word: "Toya", category: "ochiq" },
      { word: "Oyna", category: "ochiq" },
      { word: "Kosa", category: "ochiq" },
      { word: "Dori", category: "ochiq" },
      { word: "Oila", category: "ochiq" },
      { word: "Sari", category: "ochiq" },
      { word: "Tuta", category: "ochiq" },
      { word: "Yari", category: "ochiq" },

      // Yopiq bo'g'inlar (Consonant ending)
      { word: "Maktab", category: "yopiq" },
      { word: "Daftar", category: "yopiq" },
      { word: "Tosh", category: "yopiq" },
      { word: "Barg", category: "yopiq" },
      { word: "Qor", category: "yopiq" },
      { word: "Dars", category: "yopiq" },
      { word: "Non", category: "yopiq" },
      { word: "Muz", category: "yopiq" },
      { word: "Rustam", category: "yopiq" },
      { word: "Tandir", category: "yopiq" },
      { word: "Burgut", category: "yopiq" },
      { word: "Bulbul", category: "yopiq" },
      { word: "Zanjir", category: "yopiq" },
      { word: "Qalam", category: "yopiq" },
      { word: "Qoshiq", category: "yopiq" },
      { word: "Parta", category: "yopiq" },
      { word: "Sinf", category: "yopiq" },
      { word: "Darslik", category: "yopiq" },
      { word: "O'rmon", category: "yopiq" },
      { word: "Chizg'ich", category: "yopiq" },
      { word: "Rang", category: "yopiq" },
      { word: "Xat", category: "yopiq" },
      { word: "O'chirg'ich", category: "yopiq" }
    ]
  },
  2: {
    id: 2,
    title: "2-Bosqich: Ot va Sifat So'z Turkumlari 📝",
    subtitle: "Predmet nomi va uning belgilari musobaqasi!",
    player1Instruction: "Faqat SIFATlarni top! (Qanday? Qanaqa?)",
    player2Instruction: "Faqat OTlarni top! (Kim? Nima?)",
    player1TargetCategory: "sifat",
    player2TargetCategory: "ot",
    words: [
      // Sifat (Adjectives)
      { word: "Chiroyli", category: "sifat" },
      { word: "Katta", category: "sifat" },
      { word: "Kichik", category: "sifat" },
      { word: "Yaxshi", category: "sifat" },
      { word: "Yomon", category: "sifat" },
      { word: "Yashil", category: "sifat" },
      { word: "Shirin", category: "sifat" },
      { word: "Ajoyib", category: "sifat" },
      { word: "Aqlli", category: "sifat" },
      { word: "Issiq", category: "sifat" },
      { word: "Yangi", category: "sifat" },
      { word: "Eski", category: "sifat" },
      { word: "Kuchli", category: "sifat" },
      { word: "Sariq", category: "sifat" },
      { word: "Uzun", category: "sifat" },
      { word: "Qisqa", category: "sifat" },
      { word: "Keng", category: "sifat" },
      { word: "Tor", category: "sifat" },
      { word: "Mehribon", category: "sifat" },
      { word: "Chaqqon", category: "sifat" },
      { word: "Dangasa", category: "sifat" },
      { word: "Toza", category: "sifat" },
      { word: "Iflos", category: "sifat" },
      { word: "Qari", category: "sifat" },
      { word: "Yosh", category: "sifat" },

      // Ot (Nouns)
      { word: "Kitob", category: "ot" },
      { word: "Maktab", category: "ot" },
      { word: "Ustoz", category: "ot" },
      { word: "Daraxt", category: "ot" },
      { word: "Mushuk", category: "ot" },
      { word: "Qalam", category: "ot" },
      { word: "Suv", category: "ot" },
      { word: "Uy", category: "ot" },
      { word: "Bola", category: "ot" },
      { word: "Gul", category: "ot" },
      { word: "Olma", category: "ot" },
      { word: "Quyosh", category: "ot" },
      { word: "Ruchka", category: "ot" },
      { word: "Non", category: "ot" },
      { word: "Samolyot", category: "ot" },
      { word: "Kompyuter", category: "ot" },
      { word: "Telefon", category: "ot" },
      { word: "O'yinchoq", category: "ot" },
      { word: "Daftar", category: "ot" },
      { word: "Chizg'ich", category: "ot" },
      { word: "Sinf", category: "ot" },
      { word: "Xona", category: "ot" },
      { word: "Do'st", category: "ot" },
      { word: "Ona", category: "ot" },
      { word: "Ota", category: "ot" }
    ]
  },
  3: {
    id: 3,
    title: "3-Bosqich: Matematika Amallari 🔢",
    subtitle: "Tezkor hisob-kitob va sonlar bellashuvi!",
    player1Instruction: "Javobi JUFT son chiqadigan amallarni tanla!",
    player2Instruction: "Javobi TOQ son chiqadigan amallarni tanla!",
    player1TargetCategory: "juft",
    player2TargetCategory: "toq",
    words: [
      // Juft (Even results)
      { word: "4 + 2", category: "juft" }, // 6
      { word: "5 + 5", category: "juft" }, // 10
      { word: "8 + 4", category: "juft" }, // 12
      { word: "10 + 6", category: "juft" }, // 16
      { word: "9 - 3", category: "juft" }, // 6
      { word: "12 - 4", category: "juft" }, // 8
      { word: "15 - 5", category: "juft" }, // 10
      { word: "2 × 4", category: "juft" }, // 8
      { word: "3 × 2", category: "juft" }, // 6
      { word: "4 × 4", category: "juft" }, // 16
      { word: "5 × 2", category: "juft" }, // 10
      { word: "12 ÷ 2", category: "juft" }, // 6
      { word: "20 ÷ 2", category: "juft" }, // 10
      { word: "16 ÷ 4", category: "juft" }, // 4
      { word: "8 ÷ 2", category: "juft" }, // 4
      { word: "14 - 4", category: "juft" }, // 10
      { word: "6 + 6", category: "juft" }, // 12
      { word: "8 × 2", category: "juft" }, // 16
      { word: "20 - 8", category: "juft" }, // 12

      // Toq (Odd results)
      { word: "3 + 2", category: "toq" }, // 5
      { word: "5 + 4", category: "toq" }, // 9
      { word: "7 + 6", category: "toq" }, // 13
      { word: "8 + 3", category: "toq" }, // 11
      { word: "9 - 2", category: "toq" }, // 7
      { word: "11 - 4", category: "toq" }, // 7
      { word: "15 - 2", category: "toq" }, // 13
      { word: "3 × 3", category: "toq" }, // 9
      { word: "5 × 3", category: "toq" }, // 15
      { word: "1 × 7", category: "toq" }, // 7
      { word: "9 ÷ 3", category: "toq" }, // 3
      { word: "15 ÷ 3", category: "toq" }, // 5
      { word: "25 ÷ 5", category: "toq" }, // 5
      { word: "13 - 4", category: "toq" }, // 9
      { word: "7 + 2", category: "toq" }, // 9
      { word: "19 - 8", category: "toq" } // 11
    ]
  },
  4: {
    id: 4,
    title: "4-Bosqich: Fe'l va Sifat 🏃‍♂️",
    subtitle: "Harakat va belgi so'zlarini farqlash!",
    player1Instruction: "Faqat FE'Llarni top! (Nima qildi? Nima qilyapti?)",
    player2Instruction: "Faqat SIFATlarni top! (Qanday? Qanaqa?)",
    player1TargetCategory: "fel",
    player2TargetCategory: "sifat",
    words: [
      // Fe'l (Verbs / Actions)
      { word: "O'qidi", category: "fel" },
      { word: "Yozdi", category: "fel" },
      { word: "Keldi", category: "fel" },
      { word: "Ketdi", category: "fel" },
      { word: "Kuldi", category: "fel" },
      { word: "Chopdi", category: "fel" },
      { word: "O'ynadi", category: "fel" },
      { word: "Chizdi", category: "fel" },
      { word: "Kuyladi", category: "fel" },
      { word: "Gapirdi", category: "fel" },
      { word: "Tingladi", category: "fel" },
      { word: "Yugurdi", category: "fel" },
      { word: "Sakradi", category: "fel" },
      { word: "Suzdi", category: "fel" },
      { word: "Yeydi", category: "fel" },
      { word: "Ichdi", category: "fel" },
      { word: "Boradi", category: "fel" },
      { word: "Turdi", category: "fel" },
      { word: "O'tirdi", category: "fel" },
      { word: "Kuladi", category: "fel" },
      { word: "Tozaladi", category: "fel" },
      { word: "Sevadi", category: "fel" },

      // Sifat (Adjectives)
      { word: "Nordon", category: "sifat" },
      { word: "Sho'r", category: "sifat" },
      { word: "Yumshoq", category: "sifat" },
      { word: "Qattiq", category: "sifat" },
      { word: "Baland", category: "sifat" },
      { word: "Past", category: "sifat" },
      { word: "Issiq", category: "sifat" },
      { word: "Sovuq", category: "sifat" },
      { word: "Tez", category: "sifat" },
      { word: "Sekin", category: "sifat" },
      { word: "Aqlli", category: "sifat" },
      { word: "Chiroyli", category: "sifat" },
      { word: "Katta", category: "sifat" },
      { word: "Kichik", category: "sifat" },
      { word: "Yaxshi", category: "sifat" },
      { word: "Yomon", category: "sifat" },
      { word: "Jasur", category: "sifat" },
      { word: "Qo'rqoq", category: "sifat" },
      { word: "Saxiy", category: "sifat" },
      { word: "Ochko'z", category: "sifat" }
    ]
  },
  5: {
    id: 5,
    title: "5-Bosqich: Son va Ot 🔢",
    subtitle: "Miqdor va predmet so'zlarini guruhlash!",
    player1Instruction: "Faqat SONlarni top! (Nechta? Qancha? Nechanchi?)",
    player2Instruction: "Faqat OTlarni top! (Kim? Nima?)",
    player1TargetCategory: "son",
    player2TargetCategory: "ot",
    words: [
      // Son (Numbers)
      { word: "Bir", category: "son" },
      { word: "Ikki", category: "son" },
      { word: "Uch", category: "son" },
      { word: "Besh", category: "son" },
      { word: "O'n", category: "son" },
      { word: "Yuz", category: "son" },
      { word: "Ming", category: "son" },
      { word: "Birinchi", category: "son" },
      { word: "Beshinchi", category: "son" },
      { word: "O'ntacha", category: "son" },
      { word: "Ikkala", category: "son" },
      { word: "Uchovlon", category: "son" },
      { word: "Yarim", category: "son" },
      { word: "Chorak", category: "son" },
      { word: "Sakkiz", category: "son" },
      { word: "To'qqiz", category: "son" },
      { word: "Yigirma", category: "son" },
      { word: "Ellik", category: "son" },
      { word: "Ko'p", category: "son" },
      { word: "Kam", category: "son" },
      { word: "Bir qancha", category: "son" },

      // Ot (Nouns)
      { word: "Kitob", category: "ot" },
      { word: "Daftar", category: "ot" },
      { word: "Ruchka", category: "ot" },
      { word: "Sinf", category: "ot" },
      { word: "O'qituvchi", category: "ot" },
      { word: "O'quvchi", category: "ot" },
      { word: "Stol", category: "ot" },
      { word: "Stul", category: "ot" },
      { word: "Doska", category: "ot" },
      { word: "Xarita", category: "ot" },
      { word: "Maktab", category: "ot" },
      { word: "Uy", category: "ot" },
      { word: "Oila", category: "ot" },
      { word: "Shifokor", category: "ot" },
      { word: "Muhandis", category: "ot" },
      { word: "Uchuvchi", category: "ot" },
      { word: "Suv", category: "ot" },
      { word: "Osh", category: "ot" },
      { word: "Meva", category: "ot" },
      { word: "Sabzavot", category: "ot" },
      { word: "Ko'cha", category: "ot" },
      { word: "Shahar", category: "ot" }
    ]
  }
};

const ROUND_TIME = 20; // Exactly 20 seconds as requested

// Ambient moving bubbles for stunning responsive dynamic background
const BackgroundBubble = ({ delay = 0, duration = 15, size = 120, x = "10%", color = "from-sky-500/10 to-indigo-500/5" }) => (
  <motion.div
    initial={{ y: "110vh", x: x, rotate: 0 }}
    animate={{ 
      y: "-20vh", 
      x: [x, `calc(${x} + 50px)`, `calc(${x} - 50px)`, x],
      rotate: 360
    }}
    transition={{ 
      duration: duration, 
      repeat: Infinity, 
      delay: delay,
      ease: "linear" 
    }}
    className={`absolute rounded-full bg-gradient-to-br ${color} blur-2xl pointer-events-none z-0`}
    style={{ width: size, height: size }}
  />
);

export function MoleGame() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "finished" | "campaignFinished">("menu");
  const [level, setLevel] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  
  // High scores and current stage scores
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  // Campaign Cumulative tournament scores (persistent across levels)
  const [cumulativeScores, setCumulativeScores] = useState({ player1: 0, player2: 0 });
  const [playedLevels, setPlayedLevels] = useState<Record<number, { p1: number; p2: number }>>({});

  const [player1Words, setPlayer1Words] = useState<WordItem[]>([]);
  const [player2Words, setPlayer2Words] = useState<WordItem[]>([]);

  const [player1Floaters, setPlayer1Floaters] = useState<Floater[]>([]);
  const [player2Floaters, setPlayer2Floaters] = useState<Floater[]>([]);

  const [player1ShakeIndex, setPlayer1ShakeIndex] = useState<number | null>(null);
  const [player2ShakeIndex, setPlayer2ShakeIndex] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_5ec70762bd.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.12;

    successAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_c3523e414c.mp3");
    successAudioRef.current.volume = 0.35;

    errorAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69fc.mp3");
    errorAudioRef.current.volume = 0.3;

    victoryAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_0625c153b0.mp3");
    victoryAudioRef.current.volume = 0.25;

    return () => {
      audioRef.current?.pause();
      successAudioRef.current?.pause();
      errorAudioRef.current?.pause();
      victoryAudioRef.current?.pause();
    };
  }, []);

  // Timer interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endStage();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const getInitialWords = (levelNum: number, isPlayer1: boolean): WordItem[] => {
    const config = LEVEL_DATA[levelNum] || LEVEL_DATA[1];
    const targetCategory = isPlayer1 ? config.player1TargetCategory : config.player2TargetCategory;
    const levelWords = config.words;

    const targets = levelWords.filter(w => w.category === targetCategory);
    const distractors = levelWords.filter(w => w.category !== targetCategory);

    const shuffledTargets = [...targets].sort(() => Math.random() - 0.5);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);

    // Level 1: 6 words (3 targets + 3 distractors)
    // Level 2, 3, 4, 5: 8 words (4 targets + 4 distractors)
    const targetsCount = levelNum === 1 ? 3 : 4;
    const distractorsCount = levelNum === 1 ? 3 : 4;

    const selected: WordItem[] = [];
    for (let i = 0; i < targetsCount; i++) {
      if (shuffledTargets[i]) selected.push(shuffledTargets[i]);
    }
    for (let i = 0; i < distractorsCount; i++) {
      if (shuffledDistractors[i]) selected.push(shuffledDistractors[i]);
    }

    return selected.sort(() => Math.random() - 0.5);
  };

  const getReplacementWord = (currentWords: WordItem[], levelWords: WordItem[]): WordItem => {
    const currentWordNames = currentWords.map(w => w.word);
    const available = levelWords.filter(w => !currentWordNames.includes(w.word));
    if (available.length === 0) {
      return levelWords[Math.floor(Math.random() * levelWords.length)];
    }
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled[0];
  };

  const startLevel = (levelNum: number) => {
    setLevel(levelNum);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setTimeLeft(ROUND_TIME);

    setPlayer1Words(getInitialWords(levelNum, true));
    setPlayer2Words(getInitialWords(levelNum, false));

    setPlayer1Floaters([]);
    setPlayer2Floaters([]);

    setGameState("playing");
    audioRef.current?.play().catch(() => {});
  };

  const endStage = () => {
    setGameState("finished");
    audioRef.current?.pause();
    
    // Add to cumulative scores
    setCumulativeScores(prev => ({
      player1: prev.player1 + player1Score,
      player2: prev.player2 + player2Score
    }));

    // Record stage results
    setPlayedLevels(prev => ({
      ...prev,
      [level]: { p1: player1Score, p2: player2Score }
    }));

    victoryAudioRef.current?.play().catch(() => {});
    launchSuccessResult();
  };

  const finishCampaign = () => {
    setGameState("campaignFinished");
    launchSuccessResult();
  };

  const getFloaterCoords = (index: number, totalItems: number) => {
    const cols = 2;
    const rows = totalItems / cols;
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);
    const x = ((colIndex + 0.5) / cols) * 100;
    const y = ((rowIndex + 0.5) / rows) * 100;
    return { x, y };
  };

  const handlePlayer1Click = (index: number) => {
    if (gameState !== "playing") return;
    
    const clickedWord = player1Words[index];
    const config = LEVEL_DATA[level];
    const isCorrect = clickedWord.category === config.player1TargetCategory;

    const coords = getFloaterCoords(index, level === 1 ? 6 : 8);

    if (isCorrect) {
      const floaterId = Date.now() + Math.random();
      setPlayer1Floaters(prev => [...prev, { id: floaterId, text: "+5", type: "success", x: coords.x, y: coords.y }]);
      setTimeout(() => {
        setPlayer1Floaters(prev => prev.filter(f => f.id !== floaterId));
      }, 1000);

      const audioClone = successAudioRef.current?.cloneNode(true) as HTMLAudioElement;
      if (audioClone) audioClone.play().catch(() => {});

      setPlayer1Score(s => s + 5);

      setPlayer1Words(prev => {
        const next = [...prev];
        next[index] = getReplacementWord(prev, config.words);
        return next;
      });
    } else {
      const floaterId = Date.now() + Math.random();
      setPlayer1Floaters(prev => [...prev, { id: floaterId, text: "-2", type: "error", x: coords.x, y: coords.y }]);
      setTimeout(() => {
        setPlayer1Floaters(prev => prev.filter(f => f.id !== floaterId));
      }, 1000);

      const errAudio = errorAudioRef.current?.cloneNode(true) as HTMLAudioElement;
      if (errAudio) errAudio.play().catch(() => {});

      setPlayer1Score(s => Math.max(0, s - 2));

      setPlayer1ShakeIndex(index);
      setTimeout(() => setPlayer1ShakeIndex(null), 500);

      setPlayer1Words(prev => {
        const next = [...prev];
        next[index] = getReplacementWord(prev, config.words);
        return next;
      });
    }
  };

  const handlePlayer2Click = (index: number) => {
    if (gameState !== "playing") return;

    const clickedWord = player2Words[index];
    const config = LEVEL_DATA[level];
    const isCorrect = clickedWord.category === config.player2TargetCategory;

    const coords = getFloaterCoords(index, level === 1 ? 6 : 8);

    if (isCorrect) {
      const floaterId = Date.now() + Math.random();
      setPlayer2Floaters(prev => [...prev, { id: floaterId, text: "+5", type: "success", x: coords.x, y: coords.y }]);
      setTimeout(() => {
        setPlayer2Floaters(prev => prev.filter(f => f.id !== floaterId));
      }, 1000);

      const audioClone = successAudioRef.current?.cloneNode(true) as HTMLAudioElement;
      if (audioClone) audioClone.play().catch(() => {});

      setPlayer2Score(s => s + 5);

      setPlayer2Words(prev => {
        const next = [...prev];
        next[index] = getReplacementWord(prev, config.words);
        return next;
      });
    } else {
      const floaterId = Date.now() + Math.random();
      setPlayer2Floaters(prev => [...prev, { id: floaterId, text: "-2", type: "error", x: coords.x, y: coords.y }]);
      setTimeout(() => {
        setPlayer2Floaters(prev => prev.filter(f => f.id !== floaterId));
      }, 1000);

      const errAudio = errorAudioRef.current?.cloneNode(true) as HTMLAudioElement;
      if (errAudio) errAudio.play().catch(() => {});

      setPlayer2Score(s => Math.max(0, s - 2));

      setPlayer2ShakeIndex(index);
      setTimeout(() => setPlayer2ShakeIndex(null), 500);

      setPlayer2Words(prev => {
        const next = [...prev];
        next[index] = getReplacementWord(prev, config.words);
        return next;
      });
    }
  };

  const resetTournament = () => {
    setCumulativeScores({ player1: 0, player2: 0 });
    setPlayedLevels({});
    setGameState("menu");
  };

  // ================= 1. MENU STATE (MUNDARIJA) =================
  if (gameState === "menu") {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-[2.5rem] border-2 border-white/10 shadow-2xl relative min-h-[550px] w-full max-w-4xl mx-auto overflow-hidden">
        {/* Animated background bubbles */}
        <BackgroundBubble delay={0} duration={12} size={150} x="5%" color="from-indigo-500/10 to-purple-500/10" />
        <BackgroundBubble delay={4} duration={18} size={220} x="80%" color="from-pink-500/10 to-rose-500/10" />
        <BackgroundBubble delay={8} duration={14} size={100} x="45%" color="from-blue-500/10 to-sky-500/10" />

        <div className="w-20 h-20 bg-gradient-to-tr from-orange-400 to-amber-500 rounded-3xl flex items-center justify-center shadow-lg border-2 border-white/10 transform rotate-3 mb-4 relative z-10">
          <Swords className="w-10 h-10 text-white animate-pulse" />
        </div>

        <div className="text-center space-y-2 mb-6 relative z-10">
          <h3 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight drop-shadow-md">
            Tezkor Qidiruv: Musobaqa Arena ⚡
          </h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto font-medium">
            3-4-sinf o'quvchilari uchun mo'ljallangan 5 bosqichli intellektual bellashuv. Bosqichlarni ketma-ket yoki xohlagan tartibda o'ynang!
          </p>
        </div>

        {/* Tournament Scoreboard */}
        <div className="w-full max-w-xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between relative z-10 shadow-inner">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block mb-1">Turnir holati</span>
            <span className="text-slate-200 font-bold text-sm">Umumiy yig'ilgan ballar:</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👦</span>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block leading-none">1-O'yinchi</span>
                <span className="text-xl font-black text-sky-400">{cumulativeScores.player1}</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">👧</span>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block leading-none">2-O'yinchi</span>
                <span className="text-xl font-black text-purple-400">{cumulativeScores.player2}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Stage Index Menu (Mundarija) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full relative z-10 mb-8">
          {Object.values(LEVEL_DATA).map((stage) => {
            const isCompleted = playedLevels[stage.id] !== undefined;
            const stageResult = playedLevels[stage.id];
            
            return (
              <div 
                key={stage.id} 
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isCompleted 
                    ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-extrabold text-[11px] text-orange-400 uppercase tracking-wider">
                      {stage.id}-Bosqich
                    </span>
                    {isCompleted ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                        Kutilmoqda
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-base text-white line-clamp-1 mb-1">{stage.title.split(":")[1] || stage.title}</h4>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">{stage.subtitle}</p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  {isCompleted && stageResult ? (
                    <div className="text-[11px] font-bold text-slate-300">
                      Natija: <span className="text-sky-400">{stageResult.p1}</span> / <span className="text-purple-400">{stageResult.p2}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500">20s vaqt</span>
                  )}
                  <Button 
                    size="sm" 
                    onClick={() => startLevel(stage.id)}
                    className={`rounded-xl px-3.5 h-8 font-extrabold text-xs flex items-center gap-1.5 transition-all ${
                      isCompleted 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-950/20"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    O'ynash
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap gap-4 justify-center relative z-10">
          {Object.keys(playedLevels).length > 0 && (
            <>
              <Button 
                onClick={finishCampaign} 
                className="rounded-full px-8 h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 font-extrabold text-white flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Award className="w-5 h-5 animate-bounce" />
                Turnir G'olibini aniqlash! 🏆
              </Button>
              <Button 
                onClick={resetTournament} 
                variant="outline"
                className="rounded-full px-6 h-12 border-white/20 hover:bg-white/10 text-slate-300 font-bold flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Turnirni tozalash
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ================= 2. MID-LEVEL STAGE END STATE =================
  if (gameState === "finished") {
    const isP1Winner = player1Score > player2Score;
    const isP2Winner = player2Score > player1Score;
    const isDraw = player1Score === player2Score;

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-[2.5rem] border-2 border-white/20 shadow-2xl relative min-h-[480px] w-full max-w-2xl mx-auto overflow-hidden">
        <BackgroundBubble delay={0} duration={12} size={150} x="5%" color="from-indigo-500/10 to-purple-500/10" />
        <BackgroundBubble delay={4} duration={18} size={220} x="80%" color="from-pink-500/10 to-rose-500/10" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white/20 relative z-10"
        >
          <Trophy className="w-12 h-12 text-white animate-bounce" />
        </motion.div>

        <div className="space-y-1 relative z-10">
          <h3 className="text-3xl font-black text-white font-display">Bosqich Yakunlandi!</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {LEVEL_DATA[level].title}
          </p>
        </div>

        {/* Winner Declaration for individual level */}
        <div className="p-5 px-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-sm max-w-md w-full relative z-10">
          {isDraw ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">🤝</span>
              <span className="text-xl font-black text-amber-300">Bu bosqichda Durrang!</span>
            </div>
          ) : isP1Winner ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">🏆 👦</span>
              <span className="text-xl font-black text-sky-400">1-O'yinchi Bosqich G'olibi!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">🏆 👧</span>
              <span className="text-xl font-black text-purple-400">2-O'yinchi Bosqich G'olibi!</span>
            </div>
          )}
        </div>

        {/* Score comparison */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-md relative z-10">
          <div className="bg-sky-500/10 p-4 rounded-2xl border border-sky-500/20 flex flex-col items-center">
            <span className="text-base text-sky-300 font-bold mb-1">👦 1-O'yinchi</span>
            <span className="text-4xl font-black text-sky-400">{player1Score}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Ball</span>
          </div>
          <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 flex flex-col items-center">
            <span className="text-base text-purple-300 font-bold mb-1">👧 2-O'yinchi</span>
            <span className="text-4xl font-black text-purple-400">{player2Score}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Ball</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center relative z-10">
          <Button 
            onClick={() => setGameState("menu")} 
            size="lg" 
            className="flex-1 rounded-full h-14 text-base bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold flex items-center justify-center gap-2"
          >
            Mundarijaga qaytish 📋
          </Button>
          
          {level < 5 ? (
            <Button 
              onClick={() => startLevel(level + 1)} 
              size="lg" 
              className="flex-1 rounded-full h-14 text-base bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg text-white font-black transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              Keyingi bosqich!
              <ChevronRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button 
              onClick={finishCampaign} 
              size="lg" 
              className="flex-1 rounded-full h-14 text-base bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg text-white font-black transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              Natijalarni yakunlash 🏆
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ================= 3. FINAL TOURNAMENT CAMPAIGN WINNER STATE =================
  if (gameState === "campaignFinished") {
    const isP1Winner = cumulativeScores.player1 > cumulativeScores.player2;
    const isP2Winner = cumulativeScores.player2 > cumulativeScores.player1;
    const isDraw = cumulativeScores.player1 === cumulativeScores.player2;

    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-10 text-center space-y-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-[2.5rem] border-2 border-white/20 shadow-2xl relative min-h-[520px] w-full max-w-3xl mx-auto overflow-hidden">
        {/* Confetti & floating bubbles */}
        <BackgroundBubble delay={0} duration={10} size={180} x="10%" color="from-amber-400/20 to-orange-500/10" />
        <BackgroundBubble delay={3} duration={14} size={250} x="75%" color="from-emerald-400/20 to-teal-500/10" />
        <BackgroundBubble delay={6} duration={12} size={120} x="40%" color="from-purple-500/20 to-pink-500/10" />

        <motion.div
          initial={{ scale: 0, rotate: -18 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-28 h-28 bg-gradient-to-tr from-yellow-400 via-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 relative z-10"
        >
          <Trophy className="w-16 h-16 text-white animate-pulse" />
        </motion.div>

        <div className="space-y-2 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight drop-shadow-md">
            Turnir Yakunlandi! 🎉
          </h2>
          <p className="text-amber-400 text-sm sm:text-base font-bold uppercase tracking-widest">
            Katta chempionat g'olibi
          </p>
        </div>

        {/* Champion announcement */}
        <div className="p-6 sm:p-8 rounded-[2rem] bg-white/5 backdrop-blur-lg border-2 border-amber-500/20 shadow-xl max-w-lg w-full relative z-10">
          {isDraw ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl">🤝🏆</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300">Mutloq Durrang!</span>
              <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                Ikkala chempion ham ajoyib bilim va tezkorlik ko'rsatishdi! Do'stlik va bilim g'olib bo'ldi!
              </p>
            </div>
          ) : isP1Winner ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl animate-bounce">👦🏆</span>
              <span className="text-2xl sm:text-3xl font-black text-sky-400">1-O'yinchi Turnir G'olibi!</span>
              <p className="text-slate-300 text-sm mt-1">
                Katta turnir oltin kubogi sizga nasib etdi! Tabriklaymiz!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl animate-bounce">👧🏆</span>
              <span className="text-2xl sm:text-3xl font-black text-purple-400">2-O'yinchi Turnir G'olibi!</span>
              <p className="text-slate-300 text-sm mt-1">
                Katta turnir oltin kubogi sizga nasib etdi! Tabriklaymiz!
              </p>
            </div>
          )}
        </div>

        {/* Global Turnir Scoreboard */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-md relative z-10">
          <div className="bg-sky-500/10 p-5 rounded-3xl border border-sky-500/20 flex flex-col items-center">
            <span className="text-base sm:text-lg text-sky-300 font-bold mb-1">👦 1-O'yinchi</span>
            <span className="text-5xl font-black text-sky-400">{cumulativeScores.player1}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Umumiy ball</span>
          </div>
          <div className="bg-purple-500/10 p-5 rounded-3xl border border-purple-500/20 flex flex-col items-center">
            <span className="text-base sm:text-lg text-purple-300 font-bold mb-1">👧 2-O'yinchi</span>
            <span className="text-5xl font-black text-purple-400">{cumulativeScores.player2}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Umumiy ball</span>
          </div>
        </div>

        {/* Played stages statistics */}
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2.5 relative z-10">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Bosqichlar kesimidagi natijalar:</h4>
          {Object.entries(playedLevels).map(([stageId, res]) => {
            const results = res as { p1: number; p2: number };
            return (
              <div key={stageId} className="flex justify-between items-center text-xs text-slate-300">
                <span className="font-semibold">{stageId}-Bosqich ({LEVEL_DATA[parseInt(stageId)]?.title.split(":")[1].trim().split("  ")[0] || ""})</span>
                <span className="font-mono">👦 {results.p1} ball vs 👧 {results.p2} ball</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center relative z-10">
          <Button 
            onClick={resetTournament} 
            size="lg" 
            className="flex-1 rounded-full h-14 text-base bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-xl text-white font-black transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Yangi Turnir boshlash
          </Button>
          <Button 
            onClick={() => setGameState("menu")} 
            size="lg" 
            variant="outline"
            className="flex-1 rounded-full h-14 border-white/20 hover:bg-white/10 text-white font-extrabold"
          >
            Mundarijaga qaytish
          </Button>
        </div>
      </div>
    );
  }

  // ================= 4. ACTIVE GAMEPLAY STATE =================
  const isLevel1 = level === 1;

  return (
    <div className="flex flex-col items-center gap-4 py-6 px-4 w-full justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 shadow-2xl overflow-hidden w-full max-w-5xl mx-auto relative min-h-[550px]">
      
      {/* Dynamic movement background shapes */}
      <BackgroundBubble delay={0} duration={15} size={130} x="5%" color="from-sky-500/10 to-indigo-500/5" />
      <BackgroundBubble delay={3} duration={12} size={160} x="85%" color="from-purple-500/10 to-pink-500/5" />
      <BackgroundBubble delay={6} duration={18} size={90} x="45%" color="from-amber-500/5 to-rose-500/5" />
      <BackgroundBubble delay={9} duration={14} size={210} x="20%" color="from-blue-500/10 to-sky-400/5" />

      {/* Main Game Header */}
      <div className="w-full bg-white/5 backdrop-blur-xl p-3.5 sm:p-4 rounded-3xl shadow-lg border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-sm border transition-all ${
            timeLeft <= 5 
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse scale-105" 
              : "bg-orange-500/10 text-orange-400 border-orange-500/20"
          }`}>
            <Timer className={`w-4.5 h-4.5 ${timeLeft <= 5 ? "text-rose-400 animate-spin" : "text-orange-400"}`} />
            Vaqt: {timeLeft}s
          </div>
          <span className="font-extrabold text-slate-200 text-xs sm:text-sm bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
            {LEVEL_DATA[level].title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setGameState("menu")}
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl px-3 text-xs font-bold"
          >
            Chiqish 📋
          </Button>
          <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
            <Users className="w-4 h-4" />
            Musobaqa Arena
          </div>
        </div>
      </div>

      {/* Dual Screen Play Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative z-10 flex-1 items-stretch">
        
        {/* ================= PLAYER 1 SCREEN ================= */}
        <div className="p-5 rounded-[2rem] border-2 bg-white/5 backdrop-blur-md border-sky-500/20 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
          
          {/* Header Stats */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👦</span>
              <div>
                <h4 className="font-extrabold text-white leading-none mb-1 text-sm sm:text-base">1-O'yinchi</h4>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Faol o'yinda
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block leading-none mb-0.5">Ball</span>
              <div className="text-2xl font-black text-sky-400 leading-none flex items-center gap-1 justify-end">
                <Star className="w-5 h-5 fill-sky-400 text-sky-400" />
                {player1Score}
              </div>
            </div>
          </div>

          {/* Core Player 1 Board (Kvadrat) */}
          <div className="relative w-full max-w-[320px] mx-auto my-3 flex items-center justify-center">
            {/* Floater Animations overlay */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              <AnimatePresence>
                {player1Floaters.map(floater => (
                  <motion.div
                    key={floater.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: -50, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={`absolute z-30 font-black text-3xl drop-shadow-lg select-none ${
                      floater.type === "success" ? "text-emerald-400" : "text-rose-400"
                    }`}
                    style={{ left: `${floater.x}%`, top: `${floater.y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    {floater.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Grid of Words: 2x3 for level 1 (6 items), 2x4 for other levels (8 items) */}
            <div className="grid grid-cols-2 gap-3.5 w-full p-4 bg-slate-950/70 rounded-3xl border border-sky-500/20 shadow-inner">
              {player1Words.map((wordItem, idx) => {
                const isShaking = player1ShakeIndex === idx;
                return (
                  <motion.button
                    key={wordItem.word + "-" + idx}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isShaking ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => handlePlayer1Click(idx)}
                    className="relative flex flex-col items-center justify-center rounded-2xl p-4 min-h-[64px] text-center shadow-md border-2 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white border-sky-500/30 hover:border-sky-400 active:scale-95 transition-all"
                  >
                    <span className="font-extrabold text-sm sm:text-base tracking-wide select-none uppercase text-sky-200">
                      {wordItem.word}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Task Instruction Badge beneath screen */}
          <div className="mt-3 w-full">
            <div className="p-3.5 bg-gradient-to-r from-sky-600 to-indigo-700 text-white rounded-2xl shadow-lg border-b-4 border-indigo-900 text-center">
              <span className="text-[10px] text-sky-200 font-extrabold uppercase tracking-widest leading-none mb-1 block">Topshiriq</span>
              <span className="font-black text-xs sm:text-sm uppercase tracking-wide">
                {LEVEL_DATA[level].player1Instruction}
              </span>
            </div>
          </div>

        </div>

        {/* ================= PLAYER 2 SCREEN ================= */}
        <div className="p-5 rounded-[2rem] border-2 bg-white/5 backdrop-blur-md border-purple-500/20 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
          
          {/* Header Stats */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👧</span>
              <div>
                <h4 className="font-extrabold text-white leading-none mb-1 text-sm sm:text-base">2-O'yinchi</h4>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Faol o'yinda
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block leading-none mb-0.5">Ball</span>
              <div className="text-2xl font-black text-purple-400 leading-none flex items-center gap-1 justify-end">
                <Star className="w-5 h-5 fill-purple-400 text-purple-400" />
                {player2Score}
              </div>
            </div>
          </div>

          {/* Core Player 2 Board (Kvadrat) */}
          <div className="relative w-full max-w-[320px] mx-auto my-3 flex items-center justify-center">
            {/* Floater Animations overlay */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              <AnimatePresence>
                {player2Floaters.map(floater => (
                  <motion.div
                    key={floater.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: -50, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={`absolute z-30 font-black text-3xl drop-shadow-lg select-none ${
                      floater.type === "success" ? "text-emerald-400" : "text-rose-400"
                    }`}
                    style={{ left: `${floater.x}%`, top: `${floater.y}%`, transform: "translate(-50%, -50%)" }}
                  >
                    {floater.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Grid of Words: 2x3 for level 1 (6 items), 2x4 for other levels (8 items) */}
            <div className="grid grid-cols-2 gap-3.5 w-full p-4 bg-slate-950/70 rounded-3xl border border-purple-500/20 shadow-inner">
              {player2Words.map((wordItem, idx) => {
                const isShaking = player2ShakeIndex === idx;
                return (
                  <motion.button
                    key={wordItem.word + "-" + idx}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isShaking ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    onClick={() => handlePlayer2Click(idx)}
                    className="relative flex flex-col items-center justify-center rounded-2xl p-4 min-h-[64px] text-center shadow-md border-2 bg-gradient-to-br from-slate-900 via-purple-950 to-pink-950 text-white border-purple-500/30 hover:border-purple-400 active:scale-95 transition-all"
                  >
                    <span className="font-extrabold text-sm sm:text-base tracking-wide select-none uppercase text-purple-200">
                      {wordItem.word}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Task Instruction Badge beneath screen */}
          <div className="mt-3 w-full">
            <div className="p-3.5 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-2xl shadow-lg border-b-4 border-pink-900 text-center">
              <span className="text-[10px] text-purple-200 font-extrabold uppercase tracking-widest leading-none mb-1 block">Topshiriq</span>
              <span className="font-black text-xs sm:text-sm uppercase tracking-wide">
                {LEVEL_DATA[level].player2Instruction}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Info Banner */}
      <div className="w-full max-w-lg p-3 bg-white/5 border border-white/10 rounded-2xl text-center shadow-md relative z-10">
        <p className="text-xs text-slate-300 font-semibold leading-relaxed flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          Tezkorlik va diqqat sinovi! Berilgan topshiriqdagi so'zlarni birinchi bo'lib bosing! ⚡
        </p>
      </div>

    </div>
  );
}
