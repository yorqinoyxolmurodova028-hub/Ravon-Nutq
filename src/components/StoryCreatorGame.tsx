import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Sparkles, Image as ImageIcon, BookOpen } from "lucide-react";

interface StoryPrompt {
  id: string;
  url: string;
  title: string;
  description: string;
}

const STORY_PROMPTS: StoryPrompt[] = [
  {
    id: "semurg-bird",
    url: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2000&auto=format&fit=crop",
    title: "Sehrli Semurg' Qushi",
    description: "Afsonaviy Semurg' qushi uzoq o'lkalardan qanday xushxabar keltirdi?"
  },
  {
    id: "fox-and-wolf",
    url: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=2000&auto=format&fit=crop",
    title: "Ayyor Tulki sarguzashti",
    description: "Tulki va bo'ri bu gal qanday qiziqarli reja tuzishmoqda?"
  },
  {
    id: "bear-honey",
    url: "https://images.unsplash.com/photo-1589656966115-37330761e0bb?q=80&w=2000&auto=format&fit=crop",
    title: "Mehribon Ayiqcha",
    description: "Ayiqcha o'rmon do'stlari uchun asal yig'ib keldi. U kimlarni mehmonga chaqiradi?"
  },
  {
    id: "lion-friends",
    url: "https://images.unsplash.com/photo-1614027164847-1b2809eb189d?q=80&w=2000&auto=format&fit=crop",
    title: "Aqlli Sher va Do'stlari",
    description: "O'rmonlar qiroli sher va uning do'stlari nima haqida suhbatlashayotganini so'zlab bering."
  },
  {
    id: "rabbit-adventure",
    url: "https://images.unsplash.com/photo-1591154665855-51faad52b36e?q=80&w=2000&auto=format&fit=crop",
    title: "Jasur Quyoncha",
    description: "Bu mitti quyoncha savatchaga nimalarni yig'di va qayerga ketmoqda?"
  },
  {
    id: "magical-palace",
    url: "https://images.unsplash.com/photo-1529973625058-a665431328fb?q=80&w=2000&auto=format&fit=crop",
    title: "Sehrli Oltin Qasr",
    description: "Bu go'zal qasrda qaysi malika yoki shahzoda yashaydi?"
  },
  {
    id: "squirrel-party",
    url: "https://images.unsplash.com/photo-1507358522600-9f71e620c44e?q=80&w=2000&auto=format&fit=crop",
    title: "Olmaxonning Bayrami",
    description: "Olmaxon o'zining barcha do'stlariga qish uchun yong'oqlar ulashmoqda."
  },
  {
    id: "talking-fish",
    url: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=2000&auto=format&fit=crop",
    title: "Gapiradigan Oltin Baliq",
    description: "Agar siz oltin baliqni tutib olsangiz, undan qanday uchta tilak so'ragan bo'lardingiz?"
  },
  {
    id: "owl-wisdom",
    url: "https://images.unsplash.com/photo-1543549732-234b4e7fe70d?q=80&w=2000&auto=format&fit=crop",
    title: "Bilimdon Boyo'g'li",
    description: "Tunda hamma uxlaganda boyo'g'li qanday sirlarni ko'rishi mumkin?"
  },
  {
    id: "fairytale-village",
    url: "https://images.unsplash.com/photo-1510001857259-6943984b9acd?q=80&w=2000&auto=format&fit=crop",
    title: "Ertaklar Shaharchasi",
    description: "Bu mitti uychalarda qanday gnomlar yoki parilar yashashi haqida hikoya qiling."
  },
  {
    id: "kitten-curiosity",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000&auto=format&fit=crop",
    title: "Qiziquvchan Mushukcha",
    description: "Mushukcha bog'da nimalarni qidirib yuribdi? U qanday yangi do'stlar orttiradi?"
  },
  {
    id: "ocean-palace",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2000&auto=format&fit=crop",
    title: "Dengiz Qirolligi",
    description: "Suv ostidagi rang-barang baliqlar va delfinlar qanday o'yinlar o'ynashadi?"
  }
];

export function StoryCreatorGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);

  const nextPrompt = () => {
    setCurrentIndex((prev) => (prev + 1) % STORY_PROMPTS.length);
    setShowMessage(false);
    setTimeout(() => setShowMessage(true), 100);
  };

  const prevPrompt = () => {
    setCurrentIndex((prev) => (prev - 1 + STORY_PROMPTS.length) % STORY_PROMPTS.length);
    setShowMessage(false);
    setTimeout(() => setShowMessage(true), 100);
  };

  const currentPrompt = STORY_PROMPTS[currentIndex];

  return (
    <div className="w-full h-full flex flex-col items-center gap-4">
      {/* Main Image Container - Maximized */}
      <div className="w-full flex-1 min-h-[450px] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPrompt.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentPrompt.url}
              alt={currentPrompt.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Top Right Progress */}
            <div className="absolute top-4 right-4 z-30">
              <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-tighter">
                  {currentIndex + 1} / {STORY_PROMPTS.length}
                </span>
              </div>
            </div>

            {/* Bottom Info Overlay - More refined and transparent */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 pt-20">
              <div className="flex flex-col gap-1 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 text-yellow-400 font-bold drop-shadow-md">
                  <Sparkles className="w-5 h-5" />
                  <span className="uppercase tracking-widest text-xs">Hikoya uchun mavzu</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">
                  {currentPrompt.title}
                </h3>
                <p className="text-white/95 text-lg sm:text-xl font-medium italic leading-relaxed drop-shadow-md max-w-2xl">
                  "{currentPrompt.description}"
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Side Navigation for Desktop/Tablets */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity z-40 hidden sm:flex">
          <Button
            variant="secondary"
            size="icon"
            onClick={prevPrompt}
            className="rounded-full w-12 h-12 shadow-xl bg-white/30 backdrop-blur-md border-white/50 hover:bg-white text-white hover:text-primary transition-all"
          >
            <ChevronLeft className="w-7 h-7" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity z-40 hidden sm:flex">
          <Button
            variant="secondary"
            size="icon"
            onClick={nextPrompt}
            className="rounded-full w-12 h-12 shadow-xl bg-white/30 backdrop-blur-md border-white/50 hover:bg-white text-white hover:text-primary transition-all"
          >
            <ChevronRight className="w-7 h-7" />
          </Button>
        </div>
      </div>

      {/* Control Buttons - Large and Accessible */}
      <div className="flex items-center gap-4 w-full max-w-md px-2">
        <Button 
          variant="outline" 
          size="lg"
          onClick={prevPrompt}
          className="flex-1 rounded-2xl h-16 text-lg font-bold border-2 bg-white/50"
        >
          <ChevronLeft className="mr-2 w-6 h-6" />
          Oldingi
        </Button>
        <Button 
          size="lg" 
          onClick={nextPrompt}
          className="flex-[2] rounded-2xl h-16 text-xl font-black shadow-[0_10px_25px_-5px_rgba(var(--primary),0.4)] animate-pulse hover:animate-none"
        >
          Keyingi Rasm
          <ChevronRight className="ml-2 w-7 h-7" />
        </Button>
      </div>

      <div className="flex items-center gap-2 text-gray-400 font-medium">
        <BookOpen className="w-4 h-4" />
        <span>Rasmga qarang va o'z ertagingizni so'zlab bering!</span>
      </div>
    </div>
  );
}
