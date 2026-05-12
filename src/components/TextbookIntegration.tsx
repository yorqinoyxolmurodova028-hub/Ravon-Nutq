import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Lightbulb, CheckCircle2, Layout, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const lessonModules = [
  {
    grade: "1-sinf",
    subject: "Ona tili va o'qish savodxonligi",
    topic: "Unli va undosh tovushlar",
    textbookLink: "https://docs.google.com/document/d/1zQjnkz8xyWIu44dVY4i3EVnpKiFK26pF/edit?usp=drive_link&ouid=104463674687201252083&rtpof=true&sd=true",
    correctionGoal: "Artikulyatsiyani aniqlashtirish va fonematik idrokni o'stirish",
    methods: [
      {
        name: "Ovozlarni topish o'yini",
        steps: "Darslikdagi so'zlarni aytishda boladan muayyan tovushni (masalan 'R' yoki 'S') balandroq aytishini so'rang.",
        interactive: "Rasm ostidagi so'zda tovush o'rnini (boshi, o'rtasi, oxiri) aniqlash."
      },
      {
        name: "Grafik diktant",
        steps: "Talaffuzi qiyin bo'lgan tovushli so'zlarni yozishda ularning artikulyatsiyasini rasmda tasvirlash.",
        interactive: "Harfni yozish paytida unga mos artikulyatsion mashqni bajarish."
      }
    ]
  },
  {
    grade: "2-sinf",
    subject: "Ona tili",
    topic: "So'z turkumlari (Ot, Sifat, Fe'l)",
    textbookLink: "https://docs.google.com/document/d/15R7vctWzAIQwiuNUzMxXghMn9WWPTZpf/edit?usp=drive_link&ouid=104463674687201252083&rtpof=true&sd=true",
    correctionGoal: "Lug'at boyligini oshirish va grammatik qurilishni to'g'rilash",
    methods: [
      {
        name: "Sifatlar zanjiri",
        steps: "Darslikdagi rasmlarga sifatlar tanlash orqali unli tovushlar cho'ziqligini mashq qilish.",
        interactive: "So'zlarni tempga moslab, ritm bilan aytish."
      },
      {
        name: "Harakatli fe'llar",
        steps: "Fe'llarni aytishda nutqiy nafasni boshqarish (nafas chiqarib fe'lni aytish).",
        interactive: "Fe'lni mimika va jismoniy harakat bilan ifodalash."
      }
    ]
  },
  {
    grade: "3-sinf",
    subject: "Ona tili",
    topic: "Gap turlari va tinish belgilari",
    textbookLink: "#",
    correctionGoal: "Prosodika (intonatsiya, urg'u, tembr) ustida ishlash",
    methods: [
      {
        name: "Intonatsiya teatri",
        steps: "Darslikdagi matnni turli hissiyotlar (shodlik, hayrat, so'roq) bilan o'qish.",
        interactive: "Tinish belgilariga qarab ovoz balandligini o'zgartirish."
      },
      {
        name: "Mantiqiy urg'u",
        steps: "Gapdagi asosiy so'zni ovoz bilan ajratib ko'rsatish mashqi.",
        interactive: "Gapni ma'nosini o'zgartirmasdan turli so'zlarga urg'u berib o'qish."
      }
    ]
  },
  {
    grade: "4-sinf",
    subject: "Ona tili",
    topic: "Matn yaratish va bayonlar",
    textbookLink: "#",
    correctionGoal: "Bog'lanishli nutqni rivojlantirish va duduqlanishni oldini olish",
    methods: [
      {
        name: "Flipped Classroom (Ag'darilgan sinf)",
        steps: "Bolaga matnni logopedik qo'llanma asosida guruhga tushuntirish berish.",
        interactive: "Matnni rejaga ko'ra, o'z so'zlari bilan, qisqa tanaffuslar bilan hikoya qilish."
      },
      {
        name: "Mind Mapping (Aqliy xarita)",
        steps: "Insho mavzusiga oid so'zlarni artikulyatsiyasiga ko'ra guruhlash.",
        interactive: "Murakkab so'zlarni logopedik tahlil qilib, so'ngra matnga kiritish."
      }
    ]
  }
];

export function TextbookIntegration() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-secondary/10 text-secondary-foreground mb-4"
        >
          <Layout className="w-10 h-10" />
        </motion.div>
        <h2 className="text-4xl font-bold mb-4">Darslik bilan Integratsiya</h2>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Ona tili darslarini logopedik korreksiya bilan birlashtirish. 
          Interfaol metodlar orqali o'quv dasturini o'zlashtirish va nutq nuqsonlarini bartaraf etish.
        </p>
      </div>

      <div className="grid gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lessonModules.map((module, idx) => (
            <Card 
              key={idx} 
              className="bg-primary/5 border-none shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => {
                if (module.textbookLink && module.textbookLink !== "#") {
                  window.open(module.textbookLink, "_blank");
                }
              }}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 text-primary font-bold shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <CardTitle>{module.grade}</CardTitle>
                <CardDescription>Ona tili darsliklari uchun</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Presentation className="text-secondary-foreground w-7 h-7" />
            Interfaol Metodik Tavsiyalar
          </h3>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {lessonModules.map((module, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-2xl px-6 bg-white overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4 text-left">
                    <Badge variant="secondary" className="bg-primary/10 text-primary px-3 py-1">
                      {module.grade}
                    </Badge>
                    <div>
                      <h4 className="font-bold text-xl">{module.topic}</h4>
                      <p className="text-sm text-muted-foreground">{module.subject}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8">
                  <div className="grid gap-8 pt-4">
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
                      <CheckCircle2 className="text-green-600 w-5 h-5 shrink-0 mt-1" />
                      <div>
                        <span className="font-bold text-green-900">Korreksion maqsad: </span>
                        <span className="text-green-800">{module.correctionGoal}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {module.methods.map((method, mIdx) => (
                        <div key={mIdx} className="space-y-3 p-5 rounded-2xl bg-muted/50 border border-border">
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <Lightbulb className="w-5 h-5" />
                            {method.name}
                          </div>
                          <p className="text-sm leading-relaxed">
                            <span className="font-semibold">O'qituvchi uchun: </span>
                            {method.steps}
                          </p>
                          <div className="p-3 rounded-lg bg-white border border-border text-sm font-medium text-secondary-foreground">
                            <span className="text-xs uppercase text-muted-foreground block mb-1">Interfaol element:</span>
                            {method.interactive}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (module.textbookLink && module.textbookLink !== "#") {
                            window.open(module.textbookLink, "_blank");
                          }
                        }}
                      >
                        <BookOpen className="mr-2 w-4 h-4" />
                        Darslikni ko'rish
                      </Button>
                      <Button size="sm">
                        <GraduationCap className="mr-2 w-4 h-4" />
                        Metodik qo'llanma (PDF)
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0 p-6 bg-white rounded-3xl shadow-sm">
              <Presentation className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">Ustozlar uchun eslatma</h4>
              <p className="text-muted-foreground leading-relaxed">
                Ushbu metodikalar Ona tili darsliklarining amaldagi o'quv rejasi bilan to'liq integratsiya qilingan. 
                Siz darsni o'tish jarayonida nutqida nuqsoni bor o'quvchilar bilan individual ishlash uchun ushbu 
                korreksion elementlardan foydalanishingiz mumkin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
