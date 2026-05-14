import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Gamepad2, Stars } from "lucide-react";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative py-20 px-4 overflow-hidden min-h-[90vh] flex items-center">
      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-4 border-yellow-100 text-yellow-600 text-sm font-black mb-10 sticker-shadow uppercase tracking-widest">
            <Stars className="w-5 h-5 animate-spin-slow" />
            Guliston Davlat Pedagogika Instituti
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tight font-display text-slate-900 mb-10 leading-[1]">
            <span className="block text-sky-500 transform -rotate-1 mb-2">Ravon</span> 
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent px-4">Nutq</span> 
            <span className="block text-emerald-500 transform rotate-1 pt-4">Bilan Birga!</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-600 max-w-4xl mx-auto mb-16 font-medium leading-relaxed">
            Bizning innovatsion darsliklarimiz va o'yinlarimiz <br className="hidden md:block" />
            bolalarga ravon so'zlashni o'rgatadi! 🚀
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button 
              size="lg" 
              className="rounded-[2.5rem] px-14 h-20 text-2xl font-black bg-yellow-400 hover:bg-yellow-500 text-white border-b-[10px] border-yellow-600 active:border-b-0 active:translate-y-2 transition-all shadow-2xl sticker-shadow group" 
              onClick={onStart}
            >
              Keling, boshlaymiz!
              <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-3 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-[2.5rem] px-14 h-20 text-2xl font-black text-slate-500 hover:bg-slate-50 border-4 border-slate-100">
              Ma'lumotlar
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Playful background decorations */}
      <div className="absolute top-[10%] left-[5%] w-48 h-48 bg-yellow-200/40 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-sky-200/40 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-rose-200/20 rounded-full blur-[80px] animate-bounce" style={{ animationDuration: '6s' }} />
      
      {/* Decorative floating stickers */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [-15, -10, -15] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="hidden lg:block absolute top-[20%] left-[12%] opacity-10"
      >
        <Sparkles className="w-32 h-32 text-yellow-400" />
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [20, 25, 20] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="hidden lg:block absolute bottom-[25%] right-[15%] opacity-10 text-sky-500"
      >
        <Gamepad2 className="w-28 h-28" />
      </motion.div>

      <div className="absolute -bottom-8 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
