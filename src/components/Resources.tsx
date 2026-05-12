import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, UserCheck, GraduationCap, Users, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const articles = [
  {
    id: "parents",
    title: "Ota-onalar uchun tavsiyalar",
    description: "Farzandingiz nutqini uy sharoitida qanday rivojlantirish mumkin? Mutaxassis maslahatlari.",
    icon: UserCheck,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "teachers",
    title: "O'qituvchilar uchun qo'llanma",
    description: "Sinfda nutq nuqsoni bor o'quvchilar bilan ishlash usullari.",
    icon: GraduationCap,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "dictionary",
    title: "Logopedik atamalar lug'ati",
    description: "Asosiy tushunchalar va ularning izohi.",
    icon: Info,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "experts",
    title: "Mutaxassislar bilan muloqot",
    description: "Hududingizdagi eng yaxshi logopedlar ro'yxati.",
    icon: Users,
    color: "bg-orange-100 text-orange-600",
  },
];

const parentRecommendations = [
  "Bolalar bilan ko‘proq vaqt o‘tkazish. Ularga kitob o‘qish an’anasini shakllantirish.",
  "Bolalarning xatolarini muloyimlik bilan tuzatish.",
  "To‘g‘ri nutq namunasini ko‘rsatish. Chunki bola nutqi kattalarning nutqiga qarab shakllanadi.",
  "Rag‘batlantirish orqali motivatsiyasini oshirish.",
  "Kitob o‘qishga odatlantirish, chunki ertak, hikoya va she’rlar bolaning lug‘at boyligini oshiradi.",
  "Savol-javob usulidan ko‘proq foydalaning (“bugun qayerga bording?”, “bu nima uchun kerak?” va boshqa savollar) bu orqali bolada faol nutq shakllanadi.",
  "Televizor va telefonlar vaqtini cheklang. Ekrandagi tez almashinuvchi qisqa metrajli, rang-barang videolar bolaning diqqatini suslashtiradi, miya rivojlanishini buzadi.",
  "Uy sharoitida bajariladigan nutqiy va artikulatsion mashqlardan foydalanib bolalar bilan birgalikda bajaring.",
  "Bolalarga ko‘proq ertak va hikoyalar o‘qib bering. Ertak o‘qib keyin boladan uni qayta hikoya qilishni so‘rang.",
  "Agar nutqidagi muammo katta bo‘lsa logoped mutaxassisga murojaat qiling.",
  "O‘qituvchi bilan doimiy hamkorlikda ishlash.",
  "Sabrli bo‘ling, chunki nutq nuqsoni tezda tuzalmaydi, shuning uchun mashqlarni to‘xtatmasdan doimiy ravishda sabr bilan bajarish kerak.",
  "Bolani ko‘proq odamlar gavjum joylarga, sayrlarga olib chiqing."
];

const prohibitedActions = [
  "Bola bilan go‘daklarcha (nana, baba, kaka) tilda gaplashmang, bu bola nutqi shu tarzda rivojlanishiga olib keladi.",
  "Bola bilan nutqi to‘liq rivojlanmay turib ikki tilda muloqot qilish tavsiya etilmaydi.",
  "Nutqidagi nuqsonni ko‘pchilik oldida aytish yoki bu nuqson bilan uni kamsitish. Bola bunday vaziyatdan keyin ko‘pchilik ichida o‘z fikrini ifoda etishga uyalib qoladi.",
  "Bolaga kattalar tomonidan bosim o‘tkazish yoki qattiq dakki berish."
];

const experts = [
  { name: "Sirojiddin Olimov", location: "Toshkent sh., Yunusobod tumani", contact: "+998 90 123 45 67", specialty: "Duduqlanish bo'yicha mutaxassis" },
  { name: "Muborak Azizova", location: "Samarqand sh., Markaz", contact: "+998 93 765 43 21", specialty: "Dizartriya va logopedik uqalash" },
  { name: "Dilshod Karimov", location: "Farg'ona sh., Kirguli", contact: "+998 91 111 22 33", specialty: "Bolalar nutqini o'stirish" },
  { name: "Zuhra Rahmonova", location: "Buxoro sh., G'ijduvon ko'chasi", contact: "+998 99 444 55 66", specialty: "Rinolaliya va afaziya" },
  { name: "Akmal Mansurov", location: "Namangan sh., Chorsu", contact: "+998 97 888 77 99", specialty: "Talaffuz nuqsonlarini tuzatish" },
];

const teacherGuide = [
  {
    title: "Psixologik muhit",
    description: "Sinfda ijobiy va qo'llab-quvvatlovchi muhit yarating. Nutqida nuqsoni bor bolani sinfdoshlari tomonidan kamsitilishiga yo'l qo'ymang."
  },
  {
    title: "Sertakalluflash",
    description: "O'quvchiga gapirish uchun yetarli vaqt bering. Uni shoshiltirmang va gapini bo'lmang. Diqqat bilan eshitishingizni amalda ko'rsating."
  },
  {
    title: "Yashirin duduqlanish",
    description: "Ba'zi bolalar duduqlanishini yashirish uchun gapirmaslikka harakat qiladi. Ularni majburlamang, balki o'z xohishi bilan gapirishga qiziqtiring."
  },
  {
    title: "Yozma ishlar",
    description: "Disgrafiya (yozuv nuqsoni) bor bolalar harflarni almashtirib yuborishi mumkin. Buni oddiy loqaydlik bilan adashtirmaslik kerak."
  },
  {
    title: "Individual yondashuv",
    description: "Har bir bola uchun alohida topshiriqlar bering. Agar u og'zaki javobga qiynalsa, yozma yoki rasm ko'rinishida javob berishiga imkon yarating."
  },
  {
    title: "Logoped bilan hamkorlik",
    description: "Maktab logopedi yoki mutaxassis bilan muntazam aloqada bo'ling va ularning tavsiyalarini dars jarayoniga tatbiq eting."
  }
];

const logopedicDictionary = [
  { term: "Alaliya", definition: "Bosh miya po'stlog'ining nutq markazlari zararlanishi natijasida nutqning umuman bo'lmasligi yoki juda sust rivojlanishi." },
  { term: "Afaziya", definition: "Nutq shakllanib bo'lgandan so'ng, bosh miya jarohatlari natijasida uning qisman yoki to'liq yo'qolishi." },
  { term: "Anartriya", definition: "Nutq apparati mushaklarining falajligi natijasida nutqning mutlaqo imkonsizligi." },
  { term: "Artikulyatsiya", definition: "Nutq a'zolarining (til, lab, jag') tovushlarni hosil qilishdagi harakati." },
  { term: "Bradilaliya", definition: "Nutq sur'atining patologik darajada sekinlashishi." },
  { term: "Batatizm", definition: "Nutqning tushunarsiz darajada tez va pala-partish bo'lishi." },
  { term: "Dislaliya", definition: "Eshitish qobiliyati va nutq apparati nerv tizimi sog'lom bo'lgan holda tovush talaffuzining buzilishi." },
  { term: "Dizartriya", definition: "Nutq apparati va markaziy nerv tizimi orasidagi bog'liqlik buzilishi natijasida talaffuzning qiyinlashishi." },
  { term: "Disfoniya", definition: "Ovozning qisman buzilishi (bo'g'iq, xirillagan ovoz)." },
  { term: "Disleksiya", definition: "O'qish jarayonining qisman buzilishi, harflarni tanish va so'zlarni o'qishdagi qiyinchiliklar." },
  { term: "Disgrafiya", definition: "Yozuv jarayonining qisman buzilishi, harflarni noto'g'ri yozish yoki almashtirib yuborish." },
  { term: "Fonema", definition: "Nutqning ma'no ajratuvchi eng kichik tovush birligi." },
  { term: "Fonematik eshitish", definition: "Nutq tovushlarini bir-biridan farqlash va tahlil qilish qobiliyati." },
  { term: "Logonevroz", definition: "Nutq sur'ati va ritmining buzilishi, ya'ni duduqlanish." },
  { term: "Rinolaliya", definition: "Burun va og'iz bo'shlig'idagi nuqsonlar natijasida ovoz tembri va talaffuzning buzilishi (dimog'da gapirish)." },
  { term: "Taxilaliya", definition: "Nutq sur'atining patologik darajada tezlashishi." },
  { term: "Ekolaliya", definition: "Eshitilgan so'z yoki gaplarni ma'nosiz ravishda qaytarish." },
  { term: "Logopediya", definition: "Nutq nuqsonlarini o'rganuvchi va ularni bartaraf etish usullarini ishlab chiquvchi fan." },
  { term: "Defektologiya", definition: "Rivojlanishida nuqsoni bor bolalarni o'qitish va tarbiyalash haqidagi fan." },
  { term: "Nutq apparati", definition: "Nutq hosil qilishda ishtirok etuvchi a'zolar majmuasi." },
  { term: "Artikulyatsion apparat", definition: "Nutq tovushlarini hosil qiluvchi a'zolar (til, lablar, tishlar, tanglay)." },
  { term: "Nutq nuqsoni", definition: "Nutqning me'yordan chetga chiqishi." },
  { term: "NTR (Nutqning to'liq rivojlanmaganligi)", definition: "Nutqning barcha tomonlari (tovush, lug'at, grammatika) rivojlanishdan orqada qolishi." },
  { term: "NFFR (Nutqning fonetik-fonematik rivojlanmaganligi)", definition: "Tovushlar talaffuzi va ularni farqlash qobiliyatining buzilishi." },
  { term: "Mutizm", definition: "Ruhiy jarohat natijasida so'zlashish qobiliyati saqlangan holda gapirishdan bosh tortish." },
  { term: "Surdolaliya", definition: "Eshitish qobiliyati yo'qligi natijasida nutqning shakllanmasligi." },
  { term: "Palilaliya", definition: "Bir so'z yoki iborani bir necha bor ixtiyorsiz qaytarish." },
  { term: "Paragrafiya", definition: "Yozuvda harflarni yoki bo'g'inlarni almashtirib yuborish." },
  { term: "Paraleksiya", definition: "O'qishda so'zlarni yoki harflarni almashtirib o'qish." },
  { term: "Sigmatizm", definition: "Hushtaksimon va shivirlovchi tovushlar (s, z, sh, j) talaffuzining buzilishi." },
  { term: "Rotatsizm", definition: "'R' tovushi talaffuzining buzilishi." },
  { term: "Lambdatsizm", definition: "'L' tovushi talaffuzining buzilishi." },
  { term: "Yotatsizm", definition: "'Y' tovushi talaffuzining buzilishi." },
  { term: "Kappatsizm", definition: "'K' tovushi talaffuzining buzilishi." },
  { term: "Gammatsizm", definition: "'G' tovushi talaffuzining buzilishi." },
  { term: "Xitizm", definition: "'X' tovushi talaffuzining buzilishi." },
  { term: "Logopedik uqalash", definition: "Nutq apparati mushaklari holatini yaxshilash uchun qo'llaniladigan maxsus massaj." },
  { term: "Zondlar", definition: "Tovushlarni to'g'ri qo'yish uchun ishlatiladigan maxsus logopedik asboblar." },
  { term: "Nutqiy nafas", definition: "Gapirish jarayonida havoni to'g'ri taqsimlash va chiqarish." },
  { term: "Prosodika", definition: "Nutqning ohangi, urg'usi, sur'ati va tembri majmuasi." }
];

export function Resources() {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto pb-40">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ma'lumotlar Markazi</h2>
        <p className="text-muted-foreground">Logopediya sohasidagi foydali maqolalar va qo'llanmalar.</p>
      </div>

      <div className="grid gap-6">
        {articles.map((art) => (
          <Card 
            key={art.id} 
            className="flex flex-col md:flex-row items-center p-2 hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => setSelectedArticle(art.id)}
          >
            <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl ${art.color} flex items-center justify-center m-4 shrink-0 group-hover:scale-110 transition-transform`}>
              <art.icon className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <div className="flex-1 text-center md:text-left p-4">
              <CardTitle className="text-xl mb-2">{art.title}</CardTitle>
              <p className="text-muted-foreground">{art.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Parents Dialog */}
      <Dialog open={selectedArticle === "parents"} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] md:max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl border-none sm:rounded-3xl">
          <DialogHeader className="p-6 pb-4 shrink-0 border-b border-border/50 bg-white z-10">
            <DialogTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <UserCheck className="w-8 h-8 text-blue-600" />
              Ota-onalar uchun tavsiyalar
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg">
              Nutqida nuqsoni bor bolalarning ota-onalari uchun muhim maslahatlar va taqiqlangan holatlar.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-6 pt-4 grid gap-6 pb-40 md:pb-32">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                  Tavsiyalar:
                </h3>
                {parentRecommendations.map((rec, index) => (
                  <div key={index} className="flex gap-4 p-5 rounded-2xl bg-blue-50/40 border border-blue-100/50 items-start hover:bg-blue-50 transition-colors shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-base shadow-md">
                      {index + 1}
                    </div>
                    <p className="text-foreground text-lg leading-relaxed pt-1">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-4">
                  <Info className="w-6 h-6" />
                  Taqiqlangan holatlar:
                </h3>
                {prohibitedActions.map((rec, index) => (
                  <div key={index} className="flex gap-4 p-5 rounded-2xl bg-red-50/40 border border-red-100/50 items-start hover:bg-red-50 transition-colors shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-bold text-base shadow-md">
                      {index + 14}
                    </div>
                    <p className="text-foreground text-lg leading-relaxed pt-1">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-10 bg-primary/5 rounded-[2.5rem] border-2 border-dashed border-primary/20 text-center">
                <p className="font-black text-primary text-xl md:text-2xl uppercase tracking-tight">
                  Muntazamlik va Ota-onaning Mehri — asosiy omildir!
                </p>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t border-border bg-white flex justify-end shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
            <Button onClick={() => setSelectedArticle(null)} size="lg" className="rounded-2xl px-12 h-14 text-lg font-black shadow-xl shadow-primary/20">Tushunarli</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dictionary Dialog */}
      <Dialog open={selectedArticle === "dictionary"} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] md:max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl border-none sm:rounded-3xl">
          <DialogHeader className="p-6 pb-4 shrink-0 border-b border-border/50 bg-white z-10">
            <DialogTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <Info className="w-8 h-8 text-purple-600" />
              Logopedik atamalar lug'ati
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg">
              Asosiy logopedik tushunchalar va ularning izohi.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-6 pt-4 grid gap-3 pb-40 md:pb-32">
              {logopedicDictionary.map((item, index) => (
                <div key={index} className="p-6 rounded-2xl bg-purple-50/20 border border-purple-100/50 hover:bg-purple-50/50 transition-all shadow-sm group">
                  <h4 className="font-black text-purple-700 text-xl md:text-2xl mb-2 group-hover:translate-x-1 transition-transform">{item.term}</h4>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t border-border bg-white flex justify-end shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
            <Button onClick={() => setSelectedArticle(null)} size="lg" className="rounded-2xl px-12 h-14 text-lg font-black shadow-xl shadow-purple-900/10">Yopish</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Teachers Dialog */}
      <Dialog open={selectedArticle === "teachers"} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl border-none">
          <DialogHeader className="p-6 pb-4 shrink-0 border-b border-border/50 bg-white z-10">
            <DialogTitle className="text-2xl flex items-center gap-2">
              < GraduationCap className="w-6 h-6 text-green-600" />
              O'qituvchilar uchun qo'llanma
            </DialogTitle>
            <DialogDescription>
              Maktabda nutqiy nuqsoni bor o'quvchilar bilan ishlash bo'yicha tavsiyalar.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-6 pt-4 grid gap-4 pb-32">
              {teacherGuide.map((item, index) => (
                <div key={index} className="p-6 rounded-2xl bg-green-50/30 border border-green-100 shadow-sm hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h4 className="font-bold text-xl text-green-800">{item.title}</h4>
                  </div>
                  <p className="text-foreground text-lg leading-relaxed italic">
                    "{item.description}"
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border bg-white flex justify-end shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <Button onClick={() => setSelectedArticle(null)} size="lg" className="rounded-xl px-12 font-bold">Yopish</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Experts Dialog */}
      <Dialog open={selectedArticle === "experts"} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl border-none">
          <DialogHeader className="p-6 pb-4 shrink-0 border-b border-border/50 bg-white z-10">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-600" />
              Mutaxassislar bilan muloqot
            </DialogTitle>
            <DialogDescription>
              Respublikamizdagi tajribali logopedlar va defektologlar ro'yxati.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-6 pt-4 grid gap-4 pb-32">
              {experts.map((exp, index) => (
                <div key={index} className="p-6 rounded-3xl bg-orange-50/20 border border-orange-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:bg-orange-50/50 transition-all">
                  <div>
                    <h4 className="font-bold text-2xl text-orange-800 mb-1">{exp.name}</h4>
                    <p className="text-orange-600 font-semibold text-lg mb-2">{exp.specialty}</p>
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center gap-2 text-base">
                        <span className="font-bold text-orange-950/70">Manzil:</span> {exp.location}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Button variant="default" className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl px-6 py-6 h-auto text-lg shadow-lg shadow-orange-200">
                      {exp.contact}
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-6 bg-orange-50 border border-orange-100 rounded-2xl text-center">
                <p className="text-base text-muted-foreground italic font-medium">
                  Eslatma: Bog'lanishdan oldin mutaxassisning qabul vaqtlarini aniqlashtirish tavsiya etiladi.
                </p>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border bg-white flex justify-end shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <Button onClick={() => setSelectedArticle(null)} size="lg" className="rounded-xl px-12 font-bold">Yopish</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
