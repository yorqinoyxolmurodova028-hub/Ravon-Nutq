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
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-3 rounded-2xl bg-primary/10 text-primary mb-4"
        >
          <Gamepad2 className="w-10 h-10" />
        </motion.div>
        <h2 className="text-4xl font-bold mb-4">Elektron O'yinlar</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Nutqni qiziqarli va o'yin orqali rivojlantirish uchun maxsus ishlab chiqilgan interaktiv o'yinlar to'plami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-2xl transition-all duration-500 border-none bg-card/50 backdrop-blur-sm overflow-hidden h-full flex flex-col relative">
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80`} />
                <div className="absolute top-4 left-4">
                   <div className={`p-2.5 rounded-xl ${game.color} text-white shadow-lg`}>
                      <game.icon className="w-5 h-5" />
                   </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                   <div className="space-y-0.5">
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-md border-none text-white text-[10px] uppercase tracking-wider">
                        {game.category}
                      </Badge>
                      <h3 className="text-xl font-bold">{game.title}</h3>
                   </div>
                </div>
              </div>

              <CardContent className="flex-1 p-6 flex flex-col gap-4">
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {game.description}
                </p>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Qiyinchilik</span>
                    <span className="text-sm font-semibold">{game.difficulty}</span>
                  </div>
                  <Button 
                    onClick={() => handlePlay(game)}
                    className={`rounded-xl px-6 h-10 ${game.color} hover:brightness-110 transition-all shadow-lg shadow-primary/20`}
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    O'ynash
                  </Button>
                </div>
              </CardContent>

              {/* Decorative hover element */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${game.color} opacity-0 group-hover:opacity-5 blur-[40px] transition-opacity duration-500`} />
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setIsPlaying(false);
      }}>
        <DialogContent className={`${isPlaying ? 'max-w-[98vw] md:max-w-5xl w-full h-[95vh] md:h-[90vh] flex flex-col p-0 gap-0 overflow-hidden' : 'max-w-3xl'} transition-all duration-500 shadow-2xl border-none`}>
          <div className="flex flex-col h-full overflow-hidden bg-background">
            <DialogHeader className={`px-6 py-4 border-b bg-card z-50 ${isPlaying ? 'flex-row items-center justify-between space-y-0 shrink-0' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${selectedGame?.color} text-white shadow-sm`}>
                  {selectedGame?.icon && <selectedGame.icon className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <DialogTitle className="text-xl font-bold">
                    {selectedGame?.title}
                  </DialogTitle>
                  {!isPlaying && (
                    <DialogDescription className="text-sm">
                      O'yin qoidalari va yo'riqnoma
                    </DialogDescription>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <Button variant="ghost" size="sm" onClick={() => setIsPlaying(false)} className="text-muted-foreground hover:text-primary">
                    <Info className="w-4 h-4 mr-2" />
                    Qoidalar
                  </Button>
                )}
              </div>
            </DialogHeader>
            
            <div className={`relative ${isPlaying ? 'flex-1 overflow-y-auto overflow-x-hidden p-0 bg-secondary/5' : 'p-6 overflow-y-auto'}`}>
              {!isPlaying ? (
                <div className="flex flex-col gap-6">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted group">
                    <img 
                      src={selectedGame?.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop"} 
                      alt={selectedGame?.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <Badge className={`${selectedGame?.color} border-none text-white px-3 py-1`}>
                        {selectedGame?.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-3">
                          <BookOpen className="w-5 h-5" />
                          Vazifa
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedGame?.description}
                        </p>
                      </div>

                      <div className="bg-orange-500/5 p-5 rounded-2xl border border-orange-500/10">
                        <h4 className="font-bold text-orange-600 flex items-center gap-2 mb-3">
                          <Info className="w-5 h-5" />
                          Qanday o'ynaladi?
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedGame?.instruction}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-xl border flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Qiyinchilik</span>
                          <Badge variant="secondary">{selectedGame?.difficulty}</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Turi</span>
                          <span className="font-medium">{selectedGame?.category}</span>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/20 p-4 rounded-xl border border-secondary/30 flex flex-col items-center gap-2 text-center">
                         <Trophy className="w-8 h-8 text-yellow-500 mb-1" />
                         <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">O'yin maqsadi</span>
                         <span className="text-sm font-medium">Ko'proq ball to'plab rekord o'rnating!</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-full w-full flex flex-col items-center">
                  {selectedGame?.component && <selectedGame.component />}
                </div>
              )}
            </div>

            <div className={`px-6 py-4 border-t bg-card flex justify-end gap-3 shrink-0 ${isPlaying ? 'bg-background' : ''}`}>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Yopish
              </Button>
              {!isPlaying && (
                <Button 
                  disabled={!selectedGame?.component} 
                  onClick={() => setIsPlaying(true)}
                  className="px-10 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
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
