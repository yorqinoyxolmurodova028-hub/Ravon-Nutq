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
    grade: "R tovushini mustahkamlash 1- darslik",
    subject: "Ona tili va o'qish savodxonligi",
    topic: "Unli va undosh tovushlar",
    textbookLink: "https://docs.google.com/document/d/1zQjnkz8xyWIu44dVY4i3EVnpKiFK26pF/edit?usp=drive_link&ouid=104463674687201252083&rtpof=true&sd=true",
    correctionGoal: "Artikulyatsiyani aniqlashtirish va fonematik idrokni o'stirish",
    methods: [
      {
        name: "Ovozlarni topish o'yini",
        steps: "Kitobdagi so'zlarni aytishda boladan muayyan tovushni (masalan 'R' yoki 'S') balandroq aytishini so'rang.",
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
    grade: "R tovushini mustahkamlash 2- darslik",
    subject: "Ona tili",
    topic: "So'z turkumlari (Ot, Sifat, Fe'l)",
    textbookLink: "https://docs.google.com/document/d/15R7vctWzAIQwiuNUzMxXghMn9WWPTZpf/edit?usp=drive_link&ouid=104463674687201252083&rtpof=true&sd=true",
    correctionGoal: "Lug'at boyligini oshirish va grammatik qurilishni to'g'rilash",
    methods: [
      {
        name: "Sifatlar zanjiri",
        steps: "Kitobdagi rasmlarga sifatlar tanlash orqali unli tovushlar cho'ziqligini mashq qilish.",
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
    grade: "Q tovushini mustahkamlash",
    subject: "Ona tili",
    topic: "Gap turlari va tinish belgilari",
    textbookLink: "https://docs.google.com/document/d/1ZJ8E_g5_TW3okVlFWWsi57ZwyRWvRvL-/edit?usp=drive_link&ouid=104463674687201252083&rtpof=true&sd=true",
    correctionGoal: "Prosodika (intonatsiya, urg'u, tembr) ustida ishlash",
    methods: [
      {
        name: "Intonatsiya teatri",
        steps: "Kitobdagi matnni turli hissiyotlar (shodlik, hayrat, so'roq) bilan o'qish.",
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
    grade: "L tovushini mustahkamlash",
    subject: "Ona tili",
    topic: "Matn yaratish va bayonlar",
    textbookLink: "https://docs.google.com/document/d/1zDFw7mmbcN1Kw6y69UlNBbDrDg4HCe_L/edit?usp=drive_link&ouid=104463674687201252083&rtpof=true&sd=true",
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
  },
  {
    grade: "K tovushi talaffuzini mustahkamlash",
    subject: "Badiiy adabiyot",
    topic: "Nutq o'stirish va lug'at boyligi",
    textbookLink: "https://docs.google.com/document/d/1YyF5byb36DigWJklkZeQlc1tTD6eATy1/edit?usp=drive_link&ouid=104463674687201252083&rtpof=true&sd=true",
    correctionGoal: "Tahliliy fikrlash, tasavvurni boyitish va izchil nutqni shakllantirish",
    methods: [
      {
        name: "Ertakni qayta hikoyalash",
        steps: "Bolaga ertakni o'qib berganingizdan so'ng, voqealar ketma-ketligini so'rang.",
        interactive: "Ertak qahramonlarining nutqini turli ovozlarda taqlid qilib ko'rsating."
      },
      {
        name: "Yangi so'zlar xazinasi",
        steps: "Ertakdagi notanish so'zlarni ajratib, ularning ma'nosini tushuntiring.",
        interactive: "Ushbu so'zlar ishtirokida yangi kichik gaplar tuzing."
      }
    ]
  },
  {
    grade: "Logopedik qo'llanma (Yangi)",
    subject: "Nutq terapiyasi",
    topic: "Nutqiy rivojlanish va artikulyatsiya",
    textbookLink: "https://drive.google.com/file/d/1Aant3EBTftSwcjJemiur0w-zrXpDmaRh/view?usp=drive_link",
    correctionGoal: "Nutq nuqsonlarini kompleks bartaraf etish va talaffuzni shakllantirish",
    methods: [
      {
        name: "Artikulyatsion mashqlar majmuasi",
        steps: "Qo'llanmadagi ko'rsatmalarga binoan har bir tovush uchun maxsus mashqlarni bajaring.",
        interactive: "Oyna qarshisida til va lab mashqlarini vizual nazorat ostida o'tkazish."
      },
      {
        name: "Tovushlar kombinatsiyasi",
        steps: "Murakkab bo'g'inli so'zlarni sekin va aniq talaffuz qilish mashqlari.",
        interactive: "So'zlarni bo'g'inlarga ajratib, ritm ostida aytish."
      }
    ]
  }
];

export function TextbookIntegration() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto pb-40">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="p-5 rounded-[2rem] bg-emerald-100 text-emerald-600 mb-6 sticker-shadow"
        >
          <Layout className="w-12 h-12" />
        </motion.div>
        <h2 className="text-5xl md:text-6xl font-black font-display text-slate-900 mb-4 bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
          Elektron Kutubxona 📖
        </h2>
        <p className="text-2xl text-slate-500 font-medium max-w-3xl">
          Elektron kutubxonamiz darsliklari bilan o'qish endi yanada qiziqarli! 
          Keling, Ona tili kitoblarini o'yinlar bilan birga o'rganamiz.
        </p>
      </div>

      <div className="grid gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessonModules.map((module, idx) => (
            <Card 
              key={idx} 
              className="bg-white border-4 border-emerald-50 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all cursor-pointer group sticker-shadow relative overflow-hidden"
              onClick={() => {
                if (module.textbookLink && module.textbookLink !== "#") {
                  window.open(module.textbookLink, "_blank");
                }
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-[2.5rem] flex items-center justify-center text-emerald-500 font-black text-xl">
                {idx + 1}
              </div>
              <CardHeader className="text-center pt-10 pb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <CardTitle className="text-xl md:text-2xl font-black font-display text-slate-800 leading-tight">{module.grade}</CardTitle>
                <CardDescription className="text-base font-bold text-emerald-500 mt-2">Kutubxona to'plami</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="space-y-8 mt-8">
          <h3 className="text-3xl font-black font-display flex items-center gap-4 mb-8 text-slate-900 bg-white w-fit px-6 py-3 rounded-2xl sticker-shadow">
            <Presentation className="text-orange-500 w-10 h-10" />
            Interfaol Tavsiyalar ✨
          </h3>
          
          <Accordion type="single" collapsible className="w-full space-y-6">
            {lessonModules.map((module, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-4 border-slate-50 rounded-[2.5rem] px-8 bg-white overflow-hidden sticker-shadow-hover transition-all hover:bg-slate-50/50"
              >
                <AccordionTrigger className="hover:no-underline py-8">
                  <div className="flex items-center gap-6 text-left">
                    <Badge className="bg-emerald-100 text-emerald-600 border-none px-4 py-2 rounded-2xl font-black text-sm">
                      {module.grade}
                    </Badge>
                    <div>
                      <h4 className="font-black font-display text-2xl text-slate-800">{module.topic}</h4>
                      <p className="text-lg text-slate-400 font-medium">{module.subject}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-10">
                  <div className="grid gap-10 pt-6">
                    <div className="p-6 rounded-[2rem] bg-emerald-50 border-4 border-emerald-100 flex items-start gap-4">
                      <div className="bg-emerald-500 p-2 rounded-xl mt-1">
                        <CheckCircle2 className="text-white w-6 h-6 shrink-0" />
                      </div>
                      <div>
                        <span className="font-black text-emerald-900 text-xl block mb-1">Asosiy maqsad:</span>
                        <span className="text-emerald-800 text-lg font-medium leading-relaxed">{module.correctionGoal}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {module.methods.map((method, mIdx) => (
                        <div key={mIdx} className="space-y-4 p-8 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-inner">
                          <div className="flex items-center gap-3 text-orange-500 font-black text-xl font-display">
                            <Lightbulb className="w-7 h-7" />
                            {method.name}
                          </div>
                          <p className="text-lg font-medium text-slate-600 leading-relaxed">
                            <span className="font-black text-slate-900">Ustoz uchun: </span>
                            {method.steps}
                          </p>
                          <div className="p-5 rounded-2xl bg-white border-2 border-slate-100 text-lg font-bold text-sky-600 sticker-shadow-inner">
                            <span className="text-xs uppercase font-black text-slate-300 block mb-2 tracking-widest leading-none">Interfaol o'yin:</span>
                            {method.interactive}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="rounded-2xl h-14 px-8 border-4 border-emerald-100 font-black text-emerald-600 hover:bg-emerald-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (module.textbookLink && module.textbookLink !== "#") {
                            window.open(module.textbookLink, "_blank");
                          }
                        }}
                      >
                        <BookOpen className="mr-3 w-6 h-6" />
                        Kitobni ko'rish
                      </Button>
                      <Button size="lg" className="rounded-2xl h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-lg shadow-emerald-100 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1">
                        <GraduationCap className="mr-3 w-6 h-6" />
                        PDF Qo'llanma
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
