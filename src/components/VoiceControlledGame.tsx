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
      ballY: 150,
      ballVelocity: 0,
      obstacles: [],
      frame: 0,
      volume: 0,
      sensitivity: 25,
      invincible: 0,
      speed: MIN_SPEED,
    };
    setScore(0);
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
    
    // Manual impulses are handled in event listeners directly subtracting from velocity
    
    // Clamp
    if (gameState.current.ballVelocity > MAX_VELOCITY) gameState.current.ballVelocity = MAX_VELOCITY;
    if (gameState.current.ballVelocity < -MAX_VELOCITY) gameState.current.ballVelocity = -MAX_VELOCITY;

    gameState.current.ballY += gameState.current.ballVelocity;

    // Check bounds
    if (gameState.current.ballY < 20 || gameState.current.ballY > canvas.height - 20) {
      setShowFlash(true);
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => setShowFlash(false), 300);
      handleGameOver();
      return;
    }

    // Obstacle spacing (INCREASED DISTANCE)
    const spawnFreq = Math.max(250, Math.floor(550 / (gameState.current.speed / MIN_SPEED)));
    if (gameState.current.frame % spawnFreq === 0) {
      const gap = 220;
      const minH = 40;
      const maxH = canvas.height - gap - minH;
      const h = Math.random() * (maxH - minH) + minH;
      
      gameState.current.obstacles.push({
        x: canvas.width,
        y: 0,
        width: 50,
        height: h,
        passed: false
      });
      gameState.current.obstacles.push({
        x: canvas.width,
        y: h + gap,
        width: 50,
        height: canvas.height - (h + gap),
        passed: false
      });
    }

    // Progressive Speed Increase
    if (gameState.current.frame > 100 && gameState.current.speed < MAX_SPEED) {
      gameState.current.speed += 0.0003;
    }

    // Move obstacles
    gameState.current.obstacles.forEach((o) => {
      o.x -= gameState.current.speed;
    });
    gameState.current.obstacles = gameState.current.obstacles.filter(o => o.x > -100);

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
          gameState.current.invincible = 90; // About 1.5 seconds at 60fps
          // Remove the obstacle pair that was hit
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
        // Obstacles are added in pairs (top/bottom), only increment score for one of them
        if (gameState.current.obstacles.indexOf(o) % 2 === 0) {
          setScore(s => s + 1);
          const audioClone = successAudioRef.current?.cloneNode(true) as HTMLAudioElement;
          if (audioClone) {
            audioClone.play().catch(() => {});
          }
        }
      }
    }

    // Rendering
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Sky Background
    const skyGrd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrd.addColorStop(0, "#bae6fd");
    skyGrd.addColorStop(1, "#f0f9ff");
    ctx.fillStyle = skyGrd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds (simple circles)
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    const cloudOffset = (gameState.current.frame * 0.5) % 800;
    ctx.beginPath();
    ctx.arc(400 - cloudOffset, 100, 30, 0, Math.PI*2);
    ctx.arc(430 - cloudOffset, 110, 40, 0, Math.PI*2);
    ctx.arc(460 - cloudOffset, 100, 30, 0, Math.PI*2);
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
    
    ctx.restore();

    gameState.current.frame++;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isGaming) {
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
      
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isGaming]);

  return (
    <div className={`p-4 sm:p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl shadow-xl transition-all duration-300 w-full flex flex-col items-center justify-center ${showFlash ? 'ring-8 ring-red-400 ring-inset' : ''}`}>
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-6 max-w-lg"
          >
            <div className="relative inline-block">
                <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6 animate-bounce">
                <Music2 className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
                <Mic className="w-4 h-4 text-white" />
                </div>
            </div>
            <h3 className="text-3xl font-black text-blue-900 capitalize">Ovozli Parvoz</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Bu o'yinda qahramonimizni ovoz balandligi yordamida boshqarasiz. 
              <span className="block font-bold text-primary mt-2">Baland ovoz = Yuqoriga ko'tarilish!</span>
            </p>
            
            <div className="flex flex-col gap-4 mt-8">
              {micError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm mb-4">
                  {micError}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={startMic} size="lg" className="h-16 text-xl rounded-full px-12 shadow-lg bg-red-500 hover:bg-red-600">
                  <Mic className="mr-3 w-6 h-6" />
                  Ovoz bilan boshlash
                </Button>
                
                <Button variant="outline" onClick={startManualMode} size="lg" className="h-16 text-lg rounded-full px-8">
                   Sichqoncha bilan boshlash
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Nutq nafasini va ovoz kuchini nazorat qilish mashqi
              </p>
            </div>
          </motion.div>
        ) : gameOver ? (
          <motion.div 
            key="over"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl mx-auto border-8 border-white"
            >
                <Trophy className="w-16 h-16 text-white" />
            </motion.div>
            <h3 className="text-4xl font-black text-blue-900">Parvoz yakunlandi!</h3>
            <div className="space-y-1">
                <p className="text-muted-foreground font-bold">Sizning balingiz:</p>
                <div className="text-7xl font-black text-blue-600">{score}</div>
            </div>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button onClick={initGame} size="lg" className="h-14 rounded-full text-lg shadow-md px-10">
                    <RotateCcw className="mr-2 w-5 h-5" />
                    Qayta urinish
                </Button>
                <Badge variant="secondary" className="text-sm">Eng yuqori natija: {highScore}</Badge>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-sky-100 min-h-[300px]"
          >
            <canvas 
              ref={canvasRef} 
              width={1000} 
              height={500} 
              className="absolute inset-0 w-full h-full block"
            />
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Top HUD: Score & Lives */}
              <div className="absolute top-2 left-0 right-0 px-4 flex justify-between items-center pointer-events-auto">
                <motion.div
                  key={score}
                  initial={{ scale: 1.1, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-yellow-400/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border-b-4 border-yellow-600 flex items-center gap-2 shadow-md"
                >
                  <Trophy className="w-4 h-4 text-white" />
                  <span className="text-xl font-black text-white">{score}</span>
                </motion.div>

                <div className="flex items-center gap-3">
                  <div className="flex gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100 shadow-sm">
                      {[...Array(3)].map((_, i) => (
                          <Heart key={i} className={`w-3.5 h-3.5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
                      ))}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full shadow-lg w-8 h-8 bg-white/90"
                    onClick={() => setIsGaming(false)}
                  >
                    <RotateCcw className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Bottom HUD: Volume */}
              <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-3 px-4">
                {/* Volume Bar */}
                {!isManualMode && (
                   <div className="w-24 h-1 bg-black/20 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            animate={{ width: `${Math.min(gameState.current.volume, 100)}%` }}
                            className={`h-full ${gameState.current.volume > gameState.current.sensitivity ? 'bg-green-400' : 'bg-blue-400'}`}
                        />
                   </div>
                )}
              </div>

              {/* Central Warning Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                <AnimatePresence>
                  {warningMessage && (
                    <motion.div
                      key="warning"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      className="bg-red-500 text-white font-black px-6 py-2 rounded-2xl shadow-xl border-2 border-white/20"
                    >
                      <span className="text-lg">{warningMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none opacity-30">
                <p className="text-blue-900 font-bold uppercase tracking-tighter text-[8px]">
                   {isManualMode ? 'Bosing yoki Space ishlating' : `Mikrofon faol`}
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

