import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, Star, Play, Info, Mic, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VoiceControlledGame } from "./VoiceControlledGame";
import { WordBuilderGame } from "./WordBuilderGame";
import { MoleGame } from "./MoleGame";
import { SoundMatchGame } from "./SoundMatchGame";
import { MazeGame } from "./MazeGame";
import { StoryCreatorGame } from "./StoryCreatorGame";

const games = [
  {
    id: 1,
    title: "Tovushlarni Top",
    description: "Eshitilgan tovushga mos rasmni tanlang. Fonematik eshitishni rivojlantiradi.",
    category: "Eshitish",
    difficulty: "Oson",
    icon: Gamepad2,
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop",
    instruction: "O'yin boshlanganda tovush yangraydi, siz esa ushbu tovush bilan boshlanadigan rasmni topishingiz kerak. Har bir to'g'ri javob uchun ballar to'plang!",
    component: SoundMatchGame,
  },
  {
    id: 5,
    title: "Ovozli Parvoz",
    description: "To'pni ovoz balandligi orqali boshqaring. Nutq nafasini va ovoz kuchini nazorat qilishni o'rgatadi.",
    category: "Ovoz",
    difficulty: "O'rtacha",
    icon: Mic,
    color: "bg-red-500",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop",
    instruction: "Ovozni balandlatganingizda to'p yuqoriga ko'tariladi, pasaytirganingizda esa pastga tushadi. To'siqlardan o'tish uchun ovoz kuchini boshqaring.",
    component: VoiceControlledGame,
  },
  {
    id: 2,
    title: "So'z Yasash",
    description: "Bo'g'inlardan so'zlar yasang. Nutqning leksik-grammatik tomonini shakllantiradi.",
    category: "Leksika",
    difficulty: "O'rtacha",
    icon: Star,
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b4a3?q=80&w=400&auto=format&fit=crop",
    instruction: "Ekrandagi bo'g'inlarni to'g'ri ketma-ketlikda tanlab, butun bir so'z hosil qiling. To'g'ri topilgan har bir so'z uchun rag'batlantiruvchi ballar beriladi.",
    component: WordBuilderGame,
  },
  {
    id: 3,
    title: "Tezkor Qidiruv",
    description: "Kvadratlar ichidan chiqadigan predmetlarni tezda bosing. Diqqat va reaksiyani rivojlantiradi.",
    category: "Diqqat",
    difficulty: "Oson",
    icon: Trophy,
    color: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop",
    instruction: "Kvadratlar ichidan tasvirlar chiqishini kuting va ularni tezda bosing! Har bir muvaffaqiyat +5 ball, o'tkazib yuborish esa -2 ball.",
    component: MoleGame,
  },
  {
    id: 4,
    title: "Logopedik Labirint",
    description: "To'g'ri talaffuz orqali qahramonni marraga yetkazish.",
    category: "Talaffuz",
    difficulty: "Qiyin",
    icon: Play,
    color: "bg-green-500",
    image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=400&auto=format&fit=crop",
    instruction: "Har bir to'siqda berilgan so'zni 3 marta to'g'ri aytsangiz, yo'l ochiladi.",
    component: MazeGame,
  },
  {
    id: 6,
    title: "Hikoya Tuzuvchi",
    description: "Rasm asosida o'z hikoyangizni yarating. Bog'langan nutq va tasavvurni rivojlantiradi.",
    category: "Nutq",
    difficulty: "Oson",
    icon: BookOpen,
    color: "bg-pink-500",
    image: "https://images.unsplash.com/photo-1512820666243-e5949ff8302c?q=80&w=400&auto=format&fit=crop",
    instruction: "Ekranda rasm paydo bo'ladi. Unga diqqat bilan qarang va nimalar bo'layotgani haqida qiziqarli hikoya so'zlab bering. 'Keyingi rasm' tugmasini bosib yangi sarguzashtlarni boshlang!",
    component: StoryCreatorGame,
  },
];

const BG_MUSIC_URL = "https://cdn.pixabay.com/audio/2021/08/04/audio_03e04e0e47.mp3"; // Choice menu music (calm lullaby)

export function EducationalGames() {
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Menu music
    audioRef.current = new Audio(BG_MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.05;

    const playMusic = () => {
      if (!isPlaying) {
          audioRef.current?.play().catch(() => {});
      }
    };

    window.addEventListener('mousedown', playMusic, { once: true });

    return () => {
      audioRef.current?.pause();
      window.removeEventListener('mousedown', playMusic);
    };
  }, [isPlaying]);

  const handlePlay = (game: any) => {
    setSelectedGame(game);
    setIsDialogOpen(true);
    // Start immediately if the game component is available
    if (game.component) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto pb-40">
      <div className="text-center mb-16">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block p-4 rounded-[2rem] bg-yellow-100 text-yellow-600 mb-6 shadow-inner sticker-shadow"
        >
          <Gamepad2 className="w-12 h-12" />
        </motion.div>
        <h2 className="text-5xl md:text-6xl font-black font-display text-slate-900 mb-4 bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
          Elektron O'yinlar 🎮
        </h2>
        <p className="text-2xl text-slate-500 font-medium max-w-3xl mx-auto">
          Bilim olish - bu eng katta sarguzasht! 🌟
          Keling, birga o'ynaymiz va yangi narsalarni o'rganamiz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring" }}
          >
            <Card className="group hover:shadow-2xl transition-all duration-500 border-none bg-white rounded-[3rem] overflow-hidden h-full flex flex-col relative sticker-shadow">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80`} />
                <div className="absolute top-6 left-6">
                   <div className={`p-3.5 rounded-2xl ${game.color} text-white shadow-xl rotate-[-5deg] group-hover:rotate-0 transition-transform`}>
                      <game.icon className="w-6 h-6 border-b-2 border-white/20" />
                   </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                   <div className="space-y-1">
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-md border-none text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
                        {game.category}
                      </Badge>
                      <h3 className="text-3xl font-black font-display drop-shadow-md">{game.title}</h3>
                   </div>
                </div>
              </div>

              <CardContent className="flex-1 p-8 flex flex-col gap-6 pt-8">
                <p className="text-lg text-slate-500 font-medium leading-relaxed line-clamp-3">
                  {game.description}
                </p>
                
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Qiyinchilik</span>
                    <span className={`text-sm font-black ${
                      game.difficulty === "Oson" ? "text-emerald-500" : 
                      game.difficulty === "O'rtacha" ? "text-orange-500" : "text-rose-500"
                    }`}>{game.difficulty}</span>
                  </div>
                  <Button 
                    onClick={() => handlePlay(game)}
                    className={`rounded-2xl px-10 h-14 text-xl font-black ${game.color} hover:brightness-110 transition-all shadow-xl shadow-slate-100 border-b-4 border-black/10 active:border-b-0 active:translate-y-1`}
                  >
                    <Play className="w-5 h-5 mr-3 fill-current" />
                    O'yna!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setIsPlaying(false);
      }}>
        <DialogContent className={`${isPlaying ? 'max-w-[100vw] md:max-w-[95vw] lg:max-w-5xl w-full h-[100dvh] md:h-[90dvh] m-0 md:m-4 flex flex-col p-0 gap-0 overflow-hidden rounded-none md:rounded-[3rem] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]' : 'max-w-3xl rounded-[3rem]'} transition-all duration-500 shadow-2xl border-none sticker-shadow`}>
          <div className="flex flex-col h-full overflow-hidden bg-background relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            {/* Close button replacement for deep kid-friendly design - already in DialogContent but visual feedback helps */}
            <DialogHeader className={`px-8 py-6 border-b bg-card z-50 shrink-0 ${isPlaying ? 'flex-row items-center justify-between space-y-0' : ''}`}>
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl ${selectedGame?.color} text-white shadow-lg rotate-[-3deg]`}>
                  {selectedGame?.icon && <selectedGame.icon className="w-6 h-6" />}
                </div>
                <div className="text-left">
                  <DialogTitle className="text-2xl font-black font-display text-slate-900 leading-tight">
                    {selectedGame?.title}
                  </DialogTitle>
                  {!isPlaying && (
                    <DialogDescription className="text-slate-500 font-medium">
                      O'yin qoidalari va yo'riqnoma
                    </DialogDescription>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsPlaying(false)} 
                    className="text-slate-400 hover:text-slate-900 font-bold hover:bg-slate-100 rounded-xl"
                  >
                    <Info className="w-5 h-5 mr-2" />
                    Yo'riqnoma
                  </Button>
                )}
              </div>
            </DialogHeader>
            
            <div className={`relative flex-1 flex flex-col items-center justify-center ${isPlaying ? 'overflow-y-auto overflow-x-hidden p-4 bg-orange-50/30' : 'p-8 overflow-y-auto'}`}>
              {!isPlaying ? (
                <div className="flex flex-col gap-10 w-full max-w-4xl">
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-muted group sticker-shadow">
                    <img 
                      src={selectedGame?.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop"} 
                      alt={selectedGame?.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <Badge className={`${selectedGame?.color} border-none text-white px-5 py-2 rounded-xl font-black text-xs tracking-widest uppercase shadow-lg`}>
                        {selectedGame?.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
                    <div className="md:col-span-2 space-y-6">
                      <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                        <h4 className="font-black text-slate-900 flex items-center gap-3 mb-4 text-xl">
                          <BookOpen className="w-6 h-6 text-blue-500" />
                          Nima qilish kerak?
                        </h4>
                        <p className="text-slate-600 font-medium text-lg leading-relaxed">
                          {selectedGame?.description}
                        </p>
                      </div>

                      <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                        <h4 className="font-black text-slate-900 flex items-center gap-3 mb-4 text-xl">
                          <Play className="w-6 h-6 text-orange-500 fill-current" />
                          O'yin qoidalari
                        </h4>
                        <p className="text-slate-600 font-medium text-lg leading-relaxed">
                          {selectedGame?.instruction}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-[2rem] flex flex-col gap-4 border-2 border-white shadow-inner">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Qiyinchilik</span>
                          <Badge variant="secondary" className="font-black text-orange-500 bg-orange-100 rounded-lg px-3 py-1">
                            {selectedGame?.difficulty}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center px-2">
                          <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Kategoriya</span>
                          <span className="font-black text-slate-700">{selectedGame?.category}</span>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-100 p-8 rounded-[2rem] flex flex-col items-center gap-4 text-center sticker-shadow rotate-2">
                         <div className="bg-white p-4 rounded-3xl shadow-md rotate-[-5deg]">
                            <Trophy className="w-10 h-10 text-yellow-500" />
                         </div>
                         <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-yellow-700/60 block leading-none">O'yin maqsadi</span>
                           <span className="text-base font-black text-yellow-800 leading-tight block">Marraga yeting va rekord o'rnating!</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {selectedGame?.component && <selectedGame.component />}
                </div>
              )}
            </div>

            <div className={`px-8 py-6 border-t bg-card flex justify-center md:justify-end gap-6 shrink-0 ${isPlaying ? 'bg-background' : ''}`}>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)} 
                className="rounded-2xl px-8 h-14 text-lg font-black text-slate-500 hover:bg-slate-50 border-2 border-slate-100"
              >
                Yopish
              </Button>
              {!isPlaying && (
                <Button 
                  disabled={!selectedGame?.component} 
                  onClick={() => setIsPlaying(true)}
                  className={`px-14 h-14 rounded-2xl text-xl font-black text-white ${selectedGame?.color} hover:brightness-110 shadow-xl shadow-slate-200 border-b-4 border-black/10 active:border-b-0 active:translate-y-1 transition-all`}
                >
                  <Play className="w-5 h-5 mr-3 fill-current" />
                  Boshlash
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
