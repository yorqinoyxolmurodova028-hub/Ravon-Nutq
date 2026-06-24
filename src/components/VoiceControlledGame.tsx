import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, RotateCcw, Play, Volume2, Trophy, Music, Music2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { launchSuccessResult } from "../lib/effects";

const MIN_SPEED = 0.5;
const MAX_SPEED = 1.8;
const GRAVITY = 0.1;
const LIFT_COEFFICIENT = 0.1;
const MAX_VELOCITY = 4;
const GAME_BG_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f6946.mp3";

const PRACTICE_SOUNDS = ["Rrr", "Lll", "Sss", "Shsh", "Zzz", "Ggg", "Kkk", "Ppp", "Ttt"];

export function VoiceControlledGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const [isGaming, setIsGaming] = useState(false);
  const [score, setScore] = useState(0);
  const [isMicOn, setIsMicOn] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [lives, setLives] = useState(3);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [targetSound, setTargetSound] = useState(PRACTICE_SOUNDS[0]); 
  const containerRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);

  // Game state refs
  const gameState = useRef({
    ballY: 200,
    ballVelocity: 0,
    obstacles: [] as { x: number; y: number; width: number; height: number; passed: boolean }[],
    frame: 0,
    volume: 0,
    sensitivity: 25, // Threshold
    invincible: 0,   // Invincibility frames after hit
    speed: MIN_SPEED,
  });

  const startMic = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      setIsMicOn(true);
      setIsManualMode(false);
      initGame(); // Start immediately
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMicError("Mikrofonga ruxsat berilmadi. Iltimos, brauzer sozlamalaridan ruxsat bering yoki klaviatura orqali o'ynang.");
    }
  };

  const startManualMode = () => {
    setIsManualMode(true);
    setIsMicOn(false);
    setMicError(null);
    initGame();
  };

  useEffect(() => {
    successAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_c3523e414c.mp3"); // Short ding
    successAudioRef.current.volume = 0.3;
    
    victoryAudioRef.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_0625c153b0.mp3"); // Fanfare
    victoryAudioRef.current.volume = 0.4;

    return () => {
        if (bgMusicRef.current) {
            bgMusicRef.current.pause();
        }
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        stopMic();
    };
  }, []);

  const stopMic = () => {
    if (sourceRef.current && sourceRef.current.mediaStream) {
      sourceRef.current.disconnect();
      sourceRef.current.mediaStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    setIsMicOn(false);
  };

  const isGamingRef = useRef(false);

  useEffect(() => {
    isGamingRef.current = isGaming;
  }, [isGaming]);

  // physics constants
  const manualLiftRef = useRef(false);

  const initGame = () => {
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }
    gameState.current = {
      ballY: canvasRef.current ? canvasRef.current.height / 2 : 150,
      ballVelocity: 0,
      obstacles: [],
      frame: 0,
      volume: 0,
      sensitivity: 25,
      invincible: 0,
      speed: MIN_SPEED,
    };
    setScore(0);
    setTargetSound(PRACTICE_SOUNDS[0]);
    setLives(3);
    setWarningMessage(null);
    setGameOver(false);
    setIsGaming(true);
    isGamingRef.current = true;
    if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0.3;
        bgMusicRef.current.play().catch(() => {});
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    setIsGaming(false);
    isGamingRef.current = false;
    if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
    }
    
    if (score > highScore) setHighScore(score);
    
    if (score > 10) {
        launchSuccessResult();
        victoryAudioRef.current?.play().catch(() => {});
    }
  };

  const gameLoop = () => {
    if (!isGamingRef.current) return;
    if (!canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Rendering
    const scale = canvas.height / 600; // Logical height of 600
    const logicalWidth = canvas.width / scale;
    const logicalHeight = 600;

    // Volume detection
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }
      gameState.current.volume = sum / dataArrayRef.current.length;
    }

    // Physics
    gameState.current.ballVelocity += GRAVITY;
    
    // Lift from sound (only if above threshold) or manual lift
    if (manualLiftRef.current) {
        gameState.current.ballVelocity -= 0.8; // Steady lift while held
    } else if (!isManualMode && gameState.current.volume > gameState.current.sensitivity) {
        const effectiveVol = gameState.current.volume - gameState.current.sensitivity;
        gameState.current.ballVelocity -= effectiveVol * LIFT_COEFFICIENT;
    }
    
    // Clamp
    if (gameState.current.ballVelocity > MAX_VELOCITY) gameState.current.ballVelocity = MAX_VELOCITY;
    if (gameState.current.ballVelocity < -MAX_VELOCITY) gameState.current.ballVelocity = -MAX_VELOCITY;

    gameState.current.ballY += gameState.current.ballVelocity;

    // Check bounds (logical)
    if (gameState.current.ballY < 20 || gameState.current.ballY > logicalHeight - 20) {
      setShowFlash(true);
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => setShowFlash(false), 300);
      handleGameOver();
      return;
    }

    // Obstacle spacing (logical)
    const spawnFreq = Math.max(250, Math.floor(550 / (gameState.current.speed / MIN_SPEED)));
    if (gameState.current.frame % spawnFreq === 0) {
      const gap = 240;
      const minH = 60;
      const maxH = logicalHeight - gap - minH;
      const h = Math.random() * (maxH - minH) + minH;
      
      gameState.current.obstacles.push({
        x: logicalWidth,
        y: 0,
        width: 60,
        height: h,
        passed: false
      });
      gameState.current.obstacles.push({
        x: logicalWidth,
        y: h + gap,
        width: 60,
        height: logicalHeight - (h + gap),
        passed: false
      });
    }

    // Progressive Speed Increase
    if (gameState.current.frame > 100 && gameState.current.speed < MAX_SPEED) {
      gameState.current.speed += 0.0003;
    }

    // Move obstacles
    gameState.current.obstacles.forEach((o) => {
      o.x -= gameState.current.speed * 4; // Adjust speed for logical coordinate system
    });
    gameState.current.obstacles = gameState.current.obstacles.filter(o => o.x > -200);

    // Collision & Score
    const ballX = 150;
    const ballR = 25;

    if (gameState.current.invincible > 0) {
      gameState.current.invincible--;
    }

    for (let i = gameState.current.obstacles.length - 1; i >= 0; i--) {
      const o = gameState.current.obstacles[i];
      // Collision
      if (
        gameState.current.invincible === 0 &&
        ballX + ballR > o.x && 
        ballX - ballR < o.x + o.width && 
        gameState.current.ballY + ballR > o.y && 
        gameState.current.ballY - ballR < o.y + o.height
      ) {
        setShowFlash(true);
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setShowFlash(false), 300);

        if (lives > 1) {
          setLives(prev => prev - 1);
          setWarningMessage("Ehtiyot bo'ling! ⚠️");
          gameState.current.invincible = 90;
          const pairIndex = Math.floor(i / 2) * 2;
          gameState.current.obstacles.splice(pairIndex, 2);
          setTimeout(() => setWarningMessage(null), 2000);
          continue;
        } else {
          handleGameOver();
          return;
        }
      }
    }

    // Score
    for (const o of gameState.current.obstacles) {
      if (!o.passed && o.x + o.width < ballX) {
        o.passed = true;
        if (gameState.current.obstacles.indexOf(o) % 2 === 0) {
          setScore(s => s + 1);
          setTargetSound(prev => {
            const nextIdx = (PRACTICE_SOUNDS.indexOf(prev) + 1) % PRACTICE_SOUNDS.length;
            return PRACTICE_SOUNDS[nextIdx];
          });
          const audioClone = successAudioRef.current?.cloneNode(true) as HTMLAudioElement;
          if (audioClone) {
            audioClone.play().catch(() => {});
          }
        }
      }
    }

    // Rendering with scaling
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    
    // Draw Sky Background (logical dimensions)
    const skyGrd = ctx.createLinearGradient(0, 0, 0, logicalHeight);
    skyGrd.addColorStop(0, "#bae6fd");
    skyGrd.addColorStop(1, "#f0f9ff");
    ctx.fillStyle = skyGrd;
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Draw clouds (simple circles)
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    const cloudOffset = (gameState.current.frame * 0.5) % (logicalWidth + 200);
    ctx.beginPath();
    ctx.arc(logicalWidth - cloudOffset, 100, 30, 0, Math.PI*2);
    ctx.arc(logicalWidth + 30 - cloudOffset, 110, 40, 0, Math.PI*2);
    ctx.arc(logicalWidth + 60 - cloudOffset, 100, 30, 0, Math.PI*2);
    ctx.fill();

    // Draw Obstacles
    ctx.fillStyle = "#0284c7";
    ctx.strokeStyle = "#075985";
    ctx.lineWidth = 4;
    gameState.current.obstacles.forEach(o => {
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(o.x, o.y, o.width, o.height, 8);
      } else {
        ctx.rect(o.x, o.y, o.width, o.height);
      }
      ctx.fill();
      ctx.stroke();
      
      // Decorative stripes
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(o.x + 10, o.y);
      ctx.lineTo(o.x + 10, o.y + o.height);
      ctx.stroke();
    });

    // Draw Hero (Uzbek Boy Character)
    ctx.save();
    ctx.translate(ballX, gameState.current.ballY);
    const rotation = gameState.current.ballVelocity * 0.1;
    ctx.rotate(rotation);
    
    // Ghost effect when invincible
    if (gameState.current.invincible > 0) {
      ctx.globalAlpha = 0.5 + Math.sin(gameState.current.frame * 0.2) * 0.3;
    }
    
    // Chopon (Blue Robe)
    ctx.fillStyle = "#1e40af";
    ctx.beginPath();
    ctx.moveTo(-20, 15);
    ctx.lineTo(-30, 40);
    ctx.lineTo(30, 40);
    ctx.lineTo(20, 15);
    ctx.closePath();
    ctx.fill();
    
    // Head
    ctx.fillStyle = "#ffdbac";
    ctx.beginPath();
    ctx.arc(0, -10, 22, 0, Math.PI * 2);
    ctx.fill();
    
    // Do'ppi (Skullcap)
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(0, -15, 22, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "white";
    for(let i=-16; i<=16; i+=10) {
       ctx.beginPath();
       ctx.arc(i, -18, 3, 0, Math.PI*2);
       ctx.fill();
    }

    // Eyes
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-8, -12, 3, 0, Math.PI * 2);
    ctx.arc(8, -12, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    // Glow effect when active
    if (gameState.current.volume > gameState.current.sensitivity) {
       ctx.shadowBlur = 20;
       ctx.shadowColor = "#fbbf24";
       ctx.strokeStyle = "#fbbf24";
       ctx.lineWidth = 4;
       ctx.strokeRect(-28, -32, 56, 75);
    }
    
    ctx.restore(); // Character restore
    ctx.restore(); // Scaling restore

    gameState.current.frame++;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // Touch Events
  const handleTouchStart = (e: TouchEvent) => {
    if (isGamingRef.current) {
        e.preventDefault();
        gameState.current.ballVelocity -= 6;
        manualLiftRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    manualLiftRef.current = false;
  };

  useEffect(() => {
    if (isGaming) {
      // Resize handling
      const updateCanvasSize = () => {
        if (containerRef.current && canvasRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          canvasRef.current.width = rect.width * dpr;
          canvasRef.current.height = rect.height * dpr;
        }
      };

      const resizeObserver = new ResizeObserver(updateCanvasSize);
      if (containerRef.current) resizeObserver.observe(containerRef.current);
      updateCanvasSize();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" || e.code === "ArrowUp") {
            gameState.current.ballVelocity -= 6;
            manualLiftRef.current = true;
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === "Space" || e.code === "ArrowUp") {
            manualLiftRef.current = false;
        }
      };
      
      const handleMouseDown = () => {
        gameState.current.ballVelocity -= 6;
        manualLiftRef.current = true;
      };

      const handleMouseUp = () => {
        manualLiftRef.current = false;
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      containerRef.current?.addEventListener("touchstart", handleTouchStart, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("touchcancel", handleTouchEnd);
      
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        containerRef.current?.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("touchcancel", handleTouchEnd);
      };
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isGaming]);

  return (
    <div ref={containerRef} className={`p-4 md:p-8 bg-gradient-to-br from-sky-100 to-blue-50 rounded-[3rem] shadow-xl transition-all duration-300 w-full h-full flex flex-col items-center justify-center relative overflow-hidden sticker-shadow ${showFlash ? 'ring-8 ring-rose-400 ring-inset' : ''}`}>
      <audio 
        ref={bgMusicRef} 
        src={GAME_BG_MUSIC_URL} 
        loop 
        style={{ display: 'none' }}
      />
      <AnimatePresence mode="wait">
        {!isGaming && !gameOver ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-8 max-w-lg z-10"
          >
            <div className="relative inline-block">
                <motion.div 
                  animate={{ 
                    rotate: [-5, 5, -5],
                    y: [0, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-28 h-28 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl border-b-8 border-blue-800"
                >
                  <Music2 className="w-14 h-14 text-white" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -right-4 -top-4 w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white"
                >
                  <Mic className="w-6 h-6 text-white" />
                </motion.div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-slate-800 font-display">Ovozli Parvoz 🚀</h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-xl text-2xl font-black mr-2">"{targetSound}"</span> 
                tovushini aytib to'siqlardan o'ting! <br/>
                <span className="text-blue-600 font-black">Baland ovoz = Yuqoriga ko'tarilish!</span>
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              {micError && (
                <div className="p-5 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 text-sm font-bold shadow-inner">
                  {micError}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={startMic} 
                  className="h-16 text-xl rounded-2xl px-12 bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-200 border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 font-black transition-all"
                >
                  <Mic className="mr-3 w-6 h-6" />
                  Ovoz bilan!
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={startManualMode} 
                  className="h-16 text-lg rounded-2xl px-8 border-2 border-slate-200 bg-white hover:bg-slate-50 font-black text-slate-500 transition-all"
                >
                   Sichqoncha bilan
                </Button>
              </div>
              
              <div className="pt-4 flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                <div className="h-[2px] w-8 bg-slate-200 rounded-full" />
                Ovoz kuchi mashqi
                <div className="h-[2px] w-8 bg-slate-200 rounded-full" />
              </div>
            </div>
          </motion.div>
        ) : gameOver ? (
          <motion.div 
            key="over"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-8 z-10"
          >
            <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5, repeat: 1 }}
                className="w-36 h-36 bg-yellow-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl mx-auto border-8 border-white sticker-shadow"
            >
                <Trophy className="w-20 h-20 text-white" />
            </motion.div>
            
            <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-800 font-display">Parvoz yakunlandi!</h3>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Sizning natijangiz</p>
                <div className="text-8xl font-black text-blue-600 font-display drop-shadow-lg">{score}</div>
            </div>
            
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <Button 
                  onClick={initGame} 
                  className="h-16 rounded-2xl text-xl font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all px-12"
                >
                    <RotateCcw className="mr-3 w-6 h-6" />
                    Yana bir marta!
                </Button>
                <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-xl text-sm font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
                  Eng yaxshisi: {highScore}
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full min-h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-sky-200 sticker-shadow touch-pan-y"
          >
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full block cursor-pointer"
            />
            <div className="absolute inset-0 pointer-events-none z-20 p-6">
              {/* Top HUD: Score & Lives */}
              <div className="flex justify-between items-start w-full">
                <motion.div
                  key={score}
                  initial={{ scale: 1.2, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-yellow-400 px-5 py-3 rounded-2xl border-b-4 border-yellow-600 flex items-center gap-3 shadow-xl"
                >
                  <Trophy className="w-5 h-5 text-white" />
                  <span className="text-3xl font-black text-white font-display leading-none">{score}</span>
                </motion.div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex gap-1.5 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-2 border-white">
                      {[...Array(3)].map((_, i) => (
                          <Heart 
                            key={i} 
                            className={`w-5 h-5 transition-all duration-300 ${i < lives ? 'text-rose-500 fill-rose-500 scale-110' : 'text-slate-200 opacity-30 scale-90'}`} 
                          />
                      ))}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-2xl shadow-lg w-12 h-12 bg-white/90 hover:bg-white text-slate-500 pointer-events-auto border-2 border-white"
                    onClick={() => setIsGaming(false)}
                  >
                    <RotateCcw className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Bottom Volume Indicator & Target Letter */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col items-center gap-4">
                {!isManualMode && (
                   <div className="flex flex-col items-center gap-2 w-full">
                      <motion.div 
                        animate={{ 
                          scale: gameState.current.volume > gameState.current.sensitivity ? 1.2 : 1,
                          color: gameState.current.volume > gameState.current.sensitivity ? "#7c3aed" : "#94a3b8"
                        }}
                        className="text-6xl md:text-8xl font-black font-display drop-shadow-sm select-none"
                      >
                         {targetSound}
                      </motion.div>
                      <div className="w-full max-w-xs h-3 bg-black/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                          <motion.div 
                              animate={{ width: `${Math.min(gameState.current.volume, 100)}%` }}
                              className={`h-full transition-colors duration-300 ${gameState.current.volume > gameState.current.sensitivity ? 'bg-purple-500 shadow-[0_0_15px_#a855f7]' : 'bg-blue-400'}`}
                          />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        {gameState.current.volume > gameState.current.sensitivity ? "A'lo!" : "Tovush chiqaring..."}
                      </p>
                   </div>
                )}
                {isManualMode && (
                  <div className="text-4xl font-black text-slate-300 opacity-50">
                    {targetSound}
                  </div>
                )}
              </div>

              {/* Central Warning Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                <AnimatePresence>
                  {warningMessage && (
                    <motion.div
                      key="warning"
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      className="bg-rose-500 text-white font-black px-10 py-4 rounded-3xl shadow-2xl border-4 border-white/50 text-2xl uppercase tracking-widest"
                    >
                      {warningMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

