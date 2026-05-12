import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Guliston Davlat Pedagogika Instituti
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Nutq Nuqsonlarini <span className="text-primary">Aniqlash</span> va <span className="text-secondary-foreground">Bartaraf Etish</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Boshlang'ich sinf o'quvchilari uchun innovatsion logopedik platforma. 
            AI yordamida nutqni tahlil qiling, individual mashqlar bajaring va interaktiv o'yinlar orqali nutqni rivojlantiring.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg" onClick={onStart}>
              Tashxisni boshlash
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg">
              Mashqlar kutubxonasi
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
    </section>
  );
}
