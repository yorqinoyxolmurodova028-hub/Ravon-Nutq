import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Volume2, Trophy, RotateCcw, Play, Sparkles, Star, Award, Hourglass, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult } from "../lib/effects";

interface TongueTwister {
  id: number;
  text: string;
  difficulty: "Oson" | "O'rtacha" | "Qiyin";
  character: string; // Fun character associated with it
}

const TONGUE_TWISTERS: TongueTwister[] = [
  {
    id: 1,
    text: "Oq choynakka oq qopqoq.",
    difficulty: "Oson",
    character: "🫖 Oq Choynak"
  },
  {
    id: 2,
    text: "Ko'k choynakka ko'k qopqoq.",
    difficulty: "Oson",
    character: "🫖 Ko'k Choynak"
  },
  {
    id: 3,
    text: "Qora qarg'a qorga qo'ndi.",
    difficulty: "Oson",
    character: "🐦 Qarg'avoy"
  },
  {
    id: 4,
    text: "Sariq sabzi shirin sersuv.",
    difficulty: "O'rtacha",
    character: "🥕 Quyonvoy"
  },
  {
    id: 5,
    text: "Lola shirin lola terdi.",
    difficulty: "Oson",
    character: "🌷 Lolaxon"
  },
  {
    id: 6,
    text: "Oshpaz shirin osh pishirdi.",
    difficulty: "O'rtacha",
    character: "👨‍🍳 Oshpazvoy"
  },
  {
    id: 7,
    text: "Shakar shirin, asal shirin.",
    difficulty: "Oson",
    character: "🐝 Asal Ari"
  },
  {
    id: 8,
    text: "Uchta qush shoxda sayrar.",
    difficulty: "Oson",
    character: "🐦 Qushcha"
  },
  {
    id: 9,
    text: "Qurbaqa qumda quvnab sakrar.",
    difficulty: "Qiyin",
    character: "🐸 Qurbaqavoy"
  }
];

// Playful child-friendly backgrounds and text styles for words
const WORD_STYLES = [
  { bg: "bg-rose-100 border-rose-300 text-rose-600 shadow-rose-100", hover: "hover:bg-rose-200" },
  { bg: "bg-blue-100 border-blue-300 text-blue-600 shadow-blue-100", hover: "hover:bg-blue-200" },
  { bg: "bg-emerald-100 border-emerald-300 text-emerald-600 shadow-emerald-100", hover: "hover:bg-emerald-200" },
  { bg: "bg-amber-100 border-amber-300 text-amber-600 shadow-amber-100", hover: "hover:bg-amber-200" },
  { bg: "bg-purple-100 border-purple-300 text-purple-600 shadow-purple-100", hover: "hover:bg-purple-200" },
  { bg: "bg-cyan-100 border-cyan-300 text-cyan-600 shadow-cyan-100", hover: "hover:bg-cyan-200" },
  { bg: "bg-orange-100 border-orange-300 text-orange-600 shadow-orange-100", hover: "hover:bg-orange-200" },
  { bg: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-600 shadow-fuchsia-100", hover: "hover:bg-fuchsia-200" }
];

export function TezAytishGame() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute hourglass / timer
  const [count, setCount] = useState(0);
  const [showCountAnimate, setShowCountAnimate] = useState(false);

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const finishAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeTwister = TONGUE_TWISTERS[activeIdx];

  useEffect(() => {
    finishAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_bbd13032d2.mp3");
    finishAudioRef.current.volume = 0.4;

    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  const startGame = () => {
    setCount(0);
    setTimeLeft(60);
    setGameState("playing");

    if (countdownInterval.current) clearInterval(countdownInterval.current);

    countdownInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current) clearInterval(countdownInterval.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setGameState("finished");
    launchSuccessResult();
    if (finishAudioRef.current) {
      finishAudioRef.current.play().catch(() => {});
    }
  };

  const skipTwister = () => {
    setActiveIdx((prev) => (prev + 1) % TONGUE_TWISTERS.length);
    if (gameState === "playing") {
      // Keep playing, just reset count for the new tongue twister
      setCount(0);
    }
  };

  const prevTwister = () => {
    setActiveIdx((prev) => (prev - 1 + TONGUE_TWISTERS.length) % TONGUE_TWISTERS.length);
    if (gameState === "playing") {
      setCount(0);
    }
  };

  const handleAytildiClick = () => {
    if (gameState !== "playing") return;
    setCount((prev) => prev + 1);
    setShowCountAnimate(true);
    setTimeout(() => setShowCountAnimate(false), 300);

    // Simple audio feedback using Web Audio API so it's snappy and reliable without remote files
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Fallback silently if audio context fails
    }
  };

  const playTTS = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "uz-UZ";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS fails", e);
    }
  };

  // Get dynamic feedback based on the count
  const getFeedbackDetails = (score: number) => {
    if (score === 0) {
      return {
        label: "Urinib ko'ring! 🧐",
        desc: "Qumsoat oqib tugagunicha gapni baland ovozda qayta-qayta aytib, 'Aytildi ✔️' tugmasini bosing!",
        color: "text-slate-500 bg-slate-100 border-slate-200",
        stars: 0
      };
    }
    if (score >= 1 && score <= 4) {
      return {
        label: "Qoniqarli! 👍",
        desc: "Yaxshi boshlanish, ovozingiz juda chiroyli! Yana ko'proq mashq qilsangiz, tilingiz ravonlashib boradi! ✨",
        color: "text-amber-600 bg-amber-100 border-amber-200",
        stars: 1
      };
    }
    if (score >= 5 && score <= 9) {
      return {
        label: "Yaxshi! ⚡",
        desc: "Barakalla! Diqqat bilan, adashmasdan juda tez talaffuz qildingiz! Zo'r natija! 🎉",
        color: "text-blue-600 bg-blue-100 border-blue-200",
        stars: 2
      };
    }
    return {
      label: "Juda Zo'r! 🏆✨",
      desc: "Hayratlanarli! Haqiqiy nutq va tez aytish chempionisiz! Siz bilan faxrlanamiz! 💖🏅",
      color: "text-emerald-700 bg-emerald-100 border-emerald-200",
      stars: 3
    };
  };

  const feedback = getFeedbackDetails(count);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 text-center select-none">
      {/* Game Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <Badge variant="outline" className="text-base py-1 px-4 border-2 border-orange-200 bg-orange-50 text-orange-950 font-bold shadow-sm">
          Tez Aytish: {activeIdx + 1}/{TONGUE_TWISTERS.length}
        </Badge>
        <div className="flex items-center gap-2">
          <Badge className={`text-sm tracking-wide font-extrabold ${
            activeTwister.difficulty === "Oson" ? "bg-emerald-500 text-white" :
            activeTwister.difficulty === "O'rtacha" ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
          }`}>
            {activeTwister.difficulty}
          </Badge>
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-xl font-bold text-sm border border-yellow-200">
            <Star className="fill-current w-4 h-4" />
            Eng yaxshi urinishga tayyorlaning!
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === "idle" && (
          <motion.div
            key="idle-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center gap-6 bg-white/60 backdrop-blur-md border-4 border-white rounded-[3rem] p-6 sm:p-10 shadow-xl"
          >
            {/* Cute Avatar or character illustration */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-orange-400 to-amber-400 flex items-center justify-center text-5xl sm:text-6xl shadow-xl animate-bounce">
              💬
            </div>
            
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-orange-950 font-display">Tez Aytishlar Turniri 🏁</h3>
              <p className="text-slate-600 text-sm sm:text-base max-w-lg font-medium leading-relaxed">
                Talaffuzni rivojlantirish va tilingizni cheksiz ravon qilish vaqti keldi! 1 daqiqalik qumsoat tugaguncha tez aytishni qancha ko'p marta qaytarsangiz, shuncha baland baho olasiz!
              </p>
            </div>

            {/* Selected tongue twister snippet for child to see */}
            <div className="w-full max-w-xl bg-orange-50/50 p-6 rounded-2xl border-2 border-orange-100">
              <div className="text-xs uppercase font-extrabold text-orange-600 tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                <span>{activeTwister.character}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800 leading-normal">
                "{activeTwister.text}"
              </h4>
            </div>

            {/* Navigation and Play button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <div className="flex items-center gap-2">
                <Button onClick={prevTwister} variant="outline" className="rounded-xl font-bold border-slate-200">
                  ⬅️ Oldingisi
                </Button>
                <Button onClick={skipTwister} variant="outline" className="rounded-xl font-bold border-slate-200">
                  Keyingisi ➡️
                </Button>
              </div>

              <Button
                onClick={startGame}
                size="lg"
                className="rounded-full px-10 h-14 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl text-white font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current text-white" />
                Qumsoatni Boshlash! ⏳
              </Button>
            </div>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            key="playing-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full flex flex-col items-center gap-6"
          >
            {/* Visual Playground containing Hourglass and Tongue Twister side-by-side */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Hourglass container (Left/Top side) - md:col-span-4 */}
              <div className="md:col-span-4 bg-white/75 backdrop-blur-md rounded-[2.5rem] p-6 border-4 border-white shadow-xl flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Qumsoat ⏳</div>
                
                {/* Real-looking, beautifully crafted classic Hourglass structure */}
                <div className="relative w-36 h-56 flex flex-col items-center justify-between p-1 bg-amber-50/20 rounded-3xl border border-amber-900/10">
                  {/* Top wooden plate */}
                  <div className="w-32 h-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-t-lg shadow-md border-b-2 border-amber-950 flex justify-around px-4 z-10 relative">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600/50 shadow-sm mt-0.5" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600/50 shadow-sm mt-0.5" />
                  </div>

                  {/* Left wooden column */}
                  <div className="absolute left-2 top-4 bottom-4 w-2.5 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 rounded shadow-md z-10 border-r border-amber-950/40 opacity-90" />
                  
                  {/* Right wooden column */}
                  <div className="absolute right-2 top-4 bottom-4 w-2.5 bg-gradient-to-l from-amber-700 via-yellow-600 to-amber-800 rounded shadow-md z-10 border-l border-amber-950/40 opacity-90" />

                  {/* Hourglass Glass Core */}
                  <div className="flex flex-col items-center w-full relative z-0 -my-1">
                    {/* Upper Glass Container - rounded funnel shape */}
                    <div className="relative w-24 h-[84px] bg-sky-200/5 border border-white/40 rounded-t-[50%_100%] rounded-b-[50%_12%] overflow-hidden flex items-end shadow-[inset_0_4px_12px_rgba(255,255,255,0.4)]">
                      {/* Sand falling down (top shrinking) */}
                      <motion.div
                        style={{ height: `${(timeLeft / 60) * 100}%` }}
                        className="w-full bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-300 relative origin-bottom transition-all duration-1000 ease-linear rounded-b-[50%_15%]"
                      >
                        {/* Sand top rim curve shading */}
                        <div className="absolute top-0 left-0 right-0 h-4 bg-amber-600/20 rounded-[50%] blur-[0.5px]" />
                        {/* Floating dust inside sand top */}
                        {timeLeft > 0 && (
                          <div className="absolute bottom-1 left-4 right-4 h-1 bg-amber-300/35 animate-pulse rounded-full" />
                        )}
                      </motion.div>
                    </div>

                    {/* Central Neck with pouring sand stream */}
                    <div className="w-5 h-2.5 bg-sky-200/25 border-l border-r border-white/60 relative z-20 flex justify-center">
                      {/* Active streaming sand line */}
                      {timeLeft > 0 && (
                        <div 
                          className="w-1.5 h-16 bg-amber-400 absolute top-0 origin-top shadow-[0_0_8px_rgba(251,191,36,0.9)] z-10 animate-pulse" 
                          style={{
                            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 4px, #d97706 4px, #d97706 8px)'
                          }}
                        />
                      )}
                    </div>

                    {/* Lower Glass Container - funnel facing upwards */}
                    <div className="relative w-24 h-[84px] bg-sky-200/5 border border-white/40 rounded-b-[50%_100%] rounded-t-[50%_12%] overflow-hidden flex items-end shadow-[inset_0_-4px_12px_rgba(255,255,255,0.4)]">
                      {/* Sand collecting up as an elegant heap */}
                      <motion.div
                        style={{ height: `${((60 - timeLeft) / 60) * 100}%` }}
                        className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 relative origin-bottom transition-all duration-1000 ease-linear rounded-t-[100%_40%] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]"
                      >
                        {/* Bouncing pile tip to show impact from pouring sand */}
                        {timeLeft > 0 && (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-6 h-3 bg-amber-400 rounded-full blur-[1px] animate-bounce" />
                        )}
                        {/* Cute shiny points in collected sand */}
                        {timeLeft > 0 && (
                          <>
                            <div className="absolute top-1 left-6 w-1 h-1 bg-white rounded-full animate-ping" />
                            <div className="absolute top-2 right-6 w-1 h-1 bg-yellow-200 rounded-full animate-ping [animation-delay:0.3s]" />
                          </>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom wooden plate */}
                  <div className="w-32 h-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-b-lg shadow-md border-t-2 border-amber-950 flex justify-around px-4 z-10 relative">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600/50 shadow-sm mb-0.5" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400 border border-yellow-600/50 shadow-sm mb-0.5" />
                  </div>
                </div>

                {/* Digital readout */}
                <div className="flex flex-col items-center">
                  <span className={`text-4xl font-black font-mono tracking-wider ${timeLeft <= 10 ? 'text-rose-500 animate-pulse scale-110' : 'text-slate-800'}`}>
                    {timeLeft}s
                  </span>
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">
                    Qolgan vaqt 🚀
                  </span>
                </div>
              </div>

              {/* Colorful words display panel (Right/Bottom side) - md:col-span-8 */}
              <div className="md:col-span-8 bg-white/75 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-8 border-4 border-white shadow-xl flex flex-col items-center justify-between gap-6">
                
                {/* Active character prompt */}
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{activeTwister.character}</span>
                  <span className="text-sm font-extrabold text-orange-950 uppercase tracking-wider">tilini charxlaydi!</span>
                </div>

                {/* Highly Colorful, Attractively Styled Words Block */}
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 p-4 my-auto">
                  {activeTwister.text.split(" ").map((word, wordIdx) => {
                    const style = WORD_STYLES[(wordIdx + activeIdx) % WORD_STYLES.length];
                    return (
                      <motion.span
                        key={`${wordIdx}-${word}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: wordIdx * 0.05, type: "spring" }}
                        className={`inline-block px-3.5 py-2.5 rounded-[1.25rem] border-2 font-black text-base sm:text-2xl shadow-sm hover:scale-110 active:scale-95 transition-all text-center leading-none ${style.bg} ${style.hover} border-black/10 select-all cursor-pointer`}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </div>

                {/* Sound Helper */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => playTTS(activeTwister.text)}
                  className="rounded-full flex items-center gap-1.5 text-orange-600 bg-orange-50 hover:bg-orange-100 font-extrabold px-4 hover:scale-105 active:scale-95 transition-all"
                  title="To'g'ri talaffuzini eshitish"
                >
                  <Volume2 className="w-4 h-4" />
                  Yo'lboshchi Ovoz 🔊
                </Button>
              </div>
            </div>

            {/* Counts & Interactive Say/Aytildi Button */}
            <div className="w-full flex flex-col items-center gap-6 mt-2 max-w-2xl bg-white/65 p-6 rounded-[2.5rem] border-2 border-white shadow-lg">
              
              {/* Dynamic counters */}
              <div className="flex justify-around items-center w-full gap-4">
                <div className="text-center">
                  <div className="text-indigo-950/40 text-[10px] font-black uppercase tracking-widest block leading-none">Marta aytilgan:</div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={count}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className={`text-5xl font-black block leading-none select-none text-orange-600 mt-1 ${showCountAnimate ? 'animate-bounce' : ''}`}
                    >
                      {count}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Huge 'Aytildi' Button - Bounces and shines */}
              <motion.div
                className="w-full flex flex-col gap-3"
              >
                <Button
                  onClick={handleAytildiClick}
                  className="w-full rounded-[2rem] bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 font-black h-20 text-2xl sm:text-3xl text-white shadow-2xl shadow-orange-500/30 transform hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 border-b-8 border-amber-700 hover:border-b-4 active:border-b-0"
                >
                  <span className="text-3xl sm:text-4xl animate-bounce">👍</span>
                  Aytildi!
                  <span className="bg-white/30 text-white rounded-full px-4 py-1.5 text-base sm:text-xl font-mono shadow-inner">
                    +1
                  </span>
                </Button>

                {/* 'Tugatdi' Button to end early */}
                <Button
                  onClick={endGame}
                  variant="outline"
                  className="w-full rounded-2xl border-2 border-rose-300 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-500 font-black h-12 text-sm sm:text-base tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>🏁</span> Tugatdi (Natijani ko'rish!)
                </Button>
              </motion.div>
              
              <p className="text-xs text-slate-500 font-extrabold italic">
                Har safar tez aytishni oxirigacha aniq aytsangiz, o'sha zahotiyoq 'Aytildi!' tugmasini bosing! 🚀
              </p>
            </div>
          </motion.div>
        )}

        {gameState === "finished" && (
          <motion.div
            key="finish-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 bg-white/80 backdrop-blur-md border-4 border-white rounded-[3rem] p-8 sm:p-10 shadow-2xl relative"
          >
            {/* Crown or trophy icon with rotating sparkles */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-yellow-400/20 rounded-full filter blur-xl scale-125"
              />
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center shadow-lg relative z-10">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Natija</span>
              <h3 className="text-3xl font-black text-slate-900 font-display">Tugadi! 🎉</h3>
            </div>

            {/* Score block */}
            <div className="bg-slate-50 p-6 rounded-[2rem] w-full border border-slate-100 flex flex-col items-center gap-1 shadow-inner">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Aytish soni</span>
              <span className="text-6xl font-black text-orange-600">{count} marta</span>
            </div>

            {/* Dynamic Rag'bat (Feedback) Card with Stars */}
            <div className={`p-6 rounded-[2rem] border-2 w-full text-center space-y-3 ${feedback.color}`}>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight">{feedback.label}</h4>
              
              {/* Star Rating visualization */}
              {feedback.stars > 0 && (
                <div className="flex justify-center items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < feedback.stars ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
              )}
              
              <p className="text-xs sm:text-sm font-extrabold leading-relaxed text-slate-700 max-w-sm mx-auto">
                {feedback.desc}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
              <Button
                onClick={startGame}
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black h-14 text-base shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Yana o'ynash 🔄
              </Button>
              <Button
                variant="outline"
                onClick={() => setGameState("idle")}
                className="w-full rounded-2xl border-slate-200 text-slate-700 font-extrabold h-14 text-base hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
              >
                O'yinni yopish ✖️
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Tips helper */}
      {gameState === "playing" && (
        <div className="w-full max-w-xl p-3 bg-white/55 backdrop-blur-sm rounded-2xl border-2 border-white/60 text-center shadow-inner mt-4 relative z-10">
          <p className="text-xs text-orange-950 font-bold leading-relaxed flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            Navbatdagi harzlilikka tayyormisiz? Qadimgi sehrli qumsoat tez aytayotganingizda sandlarni to'playdi! 🚀
          </p>
        </div>
      )}
    </div>
  );
}
