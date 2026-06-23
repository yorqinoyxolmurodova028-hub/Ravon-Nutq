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

const parentAdvice = [
  { text: "Bolalar bilan ko‘proq vaqt o‘tkazish. Ularga kitob o‘qish an’anasini shakllantirish. Ertak, rasmli hikoya va boshqa xalq og’zaki namunalari nutqni yaxshilashga yordam beradi.", type: "recommendation" },
  { text: "Bolalarning xatolarini muloyimlik bilan tuzatish.", type: "recommendation" },
  { text: "To‘g‘ri nutq namunasini ko‘rsatish. Chunki bola nutqi kattalarning nutqiga qarab shakllanadi.", type: "recommendation" },
  { text: "Rag‘batlantirish orqali motivatsiyasini oshirish. Kichik yutuqlarini ham e'tiborsiz qoldirmay rag’batlantirib borish.", type: "recommendation" },
  { text: "Kitob o‘qishga odatlantirish, chunki ertak, hikoya va she’rlar bolaning lug‘at boyligini oshiradi.", type: "recommendation" },
  { text: "Savol-javob usulidan ko‘proq foydalaning (\"bugun qayerga bording?\", \"bu nima uchun kerak?\" va boshqa savollar) bu orqali bolada faol nutq shakllanadi.", type: "recommendation" },
  { text: "Televizor va telefonlar vaqtini cheklang. Ekrandagi tez almashinuvchi qisqa metrajli, rang-barang videolar bolaning diqqatini suslashtiradi, miya rivojlanishini buzadi.", type: "recommendation" },
  { text: "Uy sharoitida bajariladigan nutqiy va artikulatsion mashqlardan foydalanib bolalar bilan birgalikda bajaring.", type: "recommendation" },
  { text: "Bolalarga ko‘proq ertak va hikoyalar o‘qib bering. Ertak o‘qib keyin boladan uni qayta hikoya qilishni so‘rang.", type: "recommendation" },
  { text: "Agar nutqidagi muammo katta bo‘lsa logoped mutaxassisga murojaat qiling.", type: "recommendation" },
  { text: "O‘qituvchi bilan doimiy hamkorlikda ishlash.", type: "recommendation" },
  { text: "Sabrli bo‘ling, chunki nutq nuqsoni tezda tuzalmaydi, shuning uchun mashqlarni to‘xtatmasdan doimiy ravishda sabr bilan bajarish kerak.", type: "recommendation" },
  { text: "Bolani ko‘proq odamlar gavjum joylarga, sayrlarga olib chiqing.", type: "recommendation" },
  { text: "Bolaga mehr va sabr ko'rsatish ya’ni bola nutqidagi kamchilik sababli uni koyish, masxara qilish va boshqalar bilan solishtirmaslik lozim. Ota-onaning ishonchi va iliq munosabati bolaning o’ziga bo’lgan ishonchini oshiradi.", type: "recommendation" },
  { text: "Logoped mutaxassis bilan hamkorlik qilish. Nutqdagi nuqsonni vaqtida aniqlab mutaxassisga murojaat qilish va u bergan tavsiyalarga doimiy tarzda amal qilish. Uy sharoitida ham logopedik mashqlarni takrorlab turish.", type: "recommendation" },
  { text: "Oilada sog’lom muhitni shakllantirish, chunki jahl, qo’rqitish va oiladagi ziddiyatlar bolaning nutqiga salbiy ta’sir ko’rsatadi. Tinch va baxtli oila muhiti foydali hisoblanadi.", type: "recommendation" },
  { text: "Bola bilan go‘daklarcha (nana, baba, kaka) tilda gaplashmang, bu bola nutqi shu tarzda rivojlanishiga olib keladi.", type: "prohibited" },
  { text: "Bola bilan nutqi to‘liq rivojlanmay turib ikki tilda muloqot qilish tavsiya etilmaydi.", type: "prohibited" },
  { text: "Nutqidagi nuqsonni ko‘pchilik oldida aytish yoki bu nuqson bilan uni kamsitish. Bola bunday vaziyatdan keyin ko‘pchilik ichida o‘z fikrini ifoda etishga uyalib qoladi.", type: "prohibited" },
  { text: "Bolaga kattalar tomonidan bosim o‘tkazish yoki qattiq dakki berish.", type: "prohibited" }
];

const experts = [
  { name: "Nargiza Umarova", region: "Sirdaryo", location: "Guliston sh., Markaziy shifoxona", contact: "+998 99 321 09 87", specialty: "Dislaliya va bolalar nutqini rivojlantirish" },
  { name: "Sanjarbek Pardayev", region: "Sirdaryo", location: "Yangiyer sh., Ma'rifat ko'chasi", contact: "+998 90 543 21 09", specialty: "Duduqlanish (logonevroz) va darslar" },
  { name: "Feruza Ahmedova", region: "Sirdaryo", location: "Sirdaryo t., Baxt shahri, Shifokorlar ko'chasi", contact: "+998 91 987 65 43", specialty: "Dizartriya, afaziya va logopedik uqalash" },
  { name: "Olimjon To'rayev", region: "Sirdaryo", location: "Boyovut t., 3-sonli oilaviy poliklinika", contact: "+998 97 124 56 78", specialty: "Rinolaliya va korreksion pedagogika" },
  { name: "Malika Qodirova", region: "Sirdaryo", location: "Xovos t., Bunyodkor ko'chasi, 12-uy", contact: "+998 94 876 54 32", specialty: "Kognitiv rivojlantirish va tovushlarni korreksiya qilish" },
  { name: "Sirojiddin Olimov", region: "Boshqa", location: "Toshkent sh., Yunusobod tumani", contact: "+998 90 123 45 67", specialty: "Duduqlanish bo'yicha mutaxassis" },
  { name: "Muborak Azizova", region: "Boshqa", location: "Samarqand sh., Markaz", contact: "+998 93 765 43 21", specialty: "Dizartriya va logopedik uqalash" },
  { name: "Dilshod Karimov", region: "Boshqa", location: "Farg'ona sh., Kirguli", contact: "+998 91 111 22 33", specialty: "Bolalar nutqini o'stirish" },
  { name: "Zuhra Rahmonova", region: "Boshqa", location: "Buxoro sh., G'ijduvon ko'chasi", contact: "+998 99 444 55 66", specialty: "Rinolaliya va afaziya" },
  { name: "Akmal Mansurov", region: "Boshqa", location: "Namangan sh., Chorsu", contact: "+998 97 888 77 99", specialty: "Talaffuz nuqsonlarini tuzatish" },
];

const teacherAdvice = [
  "Har bir darsda o‘quvchilarga she’r, tez aytish va kichik hikoyalarni ovoz chiqarib o‘qitish.",
  "O‘qituvchining o‘zi namunali talaffuz ko‘rsatish.",
  "O‘quvchilar nutqida muammoli tovushlar mavjud (masalan l, r, s, sh), ular ustida alohida mashqlar bajarish.",
  "Har bir darsda o‘quvchilarga notanish bo‘lgan 4-5 ta yangi so‘z bilan tanishtirish va ular ishtirokida kichik gap tuzish.",
  "Har xil rasmlar asosida kichik hikoya tuzdirish.",
  "“Nega unday qildi?”, “bu nima?” va boshqa savollar orqali nutqini faollashtirish.",
  "Jamoaviy o‘yinlar o‘ynash va jamoada hammaning fikrini eshitish.",
  "Rolli o‘yinlar o‘ynash (do‘konda, uyda).",
  "Yozma nutqini yaxshilash uchun har kuni kichik diktant yozdirish.",
  "Eng ko‘p xato qiladigan so‘zlar bilan alohida ishlash va “xatoni top, o‘zing tuzat” deb mashqlar berish.",
  "Avval og‘zaki hikoyalar ayttirish, so‘ngra shu hikoyalarni yozma ravishda ifodalash.",
  "Har bir bolaning muammosiga qarab alohida ishlash.",
  "Kelishik qo‘shimchalarini to‘g‘ri qo‘llashga o‘rgatish.",
  "Xalq og‘zaki ijodi namunalaridan tez-tez foydalanish (ertak, maqol, tez aytish).",
  "Doimo kichik yutuqlarini ham rag‘batlantirish.",
  "Fonetik mashqlar va takrorlashlar orqali tovushlarni mustahkamlab borish.",
  "Interfaol o‘yinlar orqali o‘quvchilarni faol nutqqa o‘rgatish.",
  "Ota-onalar bilan doimo hamkorlikda ishlash.",
  "O‘quvchilarning nutq nuqsonlarini bartaraf etish uchun doimo o‘z bilimlarini yangilab borish, yangi metodikalar bilan tanishish.",
  "Sinfdan tashqari mashg‘ulotlarda nutq o‘stirishga doir mashqlardan ko‘proq foydalanish."
];

const logopedicDictionary = [
  { term: "Logopediya", definition: "Nutq nuqsonlari, ularning kelib chiqishi sabablari, oldini olish va bartaraf etish usullarini o'rganuvchi maxsus pedagogika fanining bir tarmog'i." },
  { term: "Dislaliya", definition: "Eshitish tizimi va nutq a'zolari nerv tizimi sog'lom bo'lgan holda tovushlar talaffuzining buzilishi (masalan, r, l, s tovushlarini noto'g'ri aytish)." },
  { term: "Dizartriya", definition: "Nutq apparati mushaklarining nerv tizimi bilan bog'liqligi buzilishi natijasida talaffuzning qiyinlashishi, nutqning tushunarsiz va bo'g'iq bo'lishi." },
  { term: "Rinolaliya", definition: "Burun va og'iz bo'shlig'idagi anatomik nuqsonlar natijasida ovoz tembri va tovushlar talaffuzining buzilishi (ko'pincha 'dimog'da gapirish' deb ataladi)." },
  { term: "Alaliya", definition: "Bosh miya po'stlog'ining nutq markazlari homiladorlik yoki tug'ruq paytida zararlanishi natijasida nutqning umuman shakllanmasligi yoki juda sust bo'lishi." },
  { term: "Afaziya", definition: "Nutq tizimi to'liq shakllanib bo'lgandan so'ng, turli bosh miya jarohatlari yoki insult natijasida nutqning qisman yoki to'liq yo'qolishi." },
  { term: "Bradilaliya", definition: "Nutq sur'atining patologik darajada sekinlashishi, so'zlarni cho'zib, juda sekin talaffuz qilish holati." },
  { term: "Taxilaliya", definition: "Nutq sur'atining me'yordan ortiq tezlashishi, buning natijasida nutq tushunarsiz va pala-partish bo'lib qoladi." },
  { term: "Logonevroz (Duduqlanish)", definition: "Nutq apparati mushaklarining qisqarishi (titrashi) natijasida nutq sur'ati va ritmining buzilishi, so'z yoki tovushlarni qaytarish va tutilishlar." },
  { term: "Disgrafiya", definition: "Yozuv jarayonining qisman buzilishi, bunda bola harflarni almashtirib yuboradi, so'zlarni xato yozadi yoki harflarni tashlab ketadi." },
  { term: "Disleksiya", definition: "O'qish qobiliyatining buzilishi, bunda harflarni tanish, ularni bo'g'inga birlashtirish va so'zlarni to'g'ri o'qishda doimiy qiyinchiliklar kuzatiladi." },
  { term: "Fonematik eshitish", definition: "Nutq tovushlarini (fonemalarni) bir-biridan farqlash, ularni tahlil qilish va nutq tarkibida ajratish qobiliyati." },
  { term: "Artikulyatsiya", definition: "Nutq tovushlarini hosil qilishda ishtirok etuvchi a'zolarning (til, lablar, jag', yumshoq tanglay) ma'lum bir holatga kelishi va harakati." },
  { term: "Prosodika", definition: "Nutqning ohangdorligi (intonatsiya), urg'u, marom (ritm) va sur'atining umumiy yig'indisi, nutqning hissiy bo'yog'i." },
  { term: "NUR (Nutqning umumiy rivojlanmaganligi)", definition: "Nutq tizimining barcha tomonlari - tovush talaffuzi, lug'at boyligi va grammatik qurilishining me'yordan orqada qolishi." },
  { term: "NFFR (Nutqning fonetik-fonematik rivojlanmaganligi)", definition: "Bolalarda tovushlarni talaffuz qilishdagi nuqsonlar bilan birga, nutq tovushlarini eshitish orqali farqlash qobiliyatining sustligi." },
  { term: "Logopedik uqalash", definition: "Nutq apparati mushaklarining holatini yaxshilash, tonusini boshqarish yoki harakatini faollashtirish uchun bajariladigan maxsus massaj turi." },
  { term: "Logopedik zondlar", definition: "Tovushlarni to'g'ri talaffuz qilish uchun tilga shakl berish yoki kerakli nuqtaga qo'yishda ishlatiladigan maxsus asboblar." },
  { term: "Ekolaliya", definition: "Inson eshitgan so'z yoki gaplarini ma'nosiz ravishda, tushunmasdan xuddi o'zini qaytarishdek takrorlab turishi." },
  { term: "Nutqiy nafas", definition: "Nutq jarayonida havoni sarflash va chiqarishni boshqarish, bu uzoq va ravon gapirish uchun asosiy omil hisoblanadi." }
];

export function Resources() {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<"Sirdaryo" | "Boshqa" | "All">("Sirdaryo");

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
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 pt-4 space-y-4">
              <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="text-xl font-black text-emerald-900 leading-tight">Muntazamlik va Mehr — asosiy omildir!</h3>
                  <p className="text-sm text-emerald-700 font-bold uppercase tracking-wider">Ota-onalar uchun 20 ta muhim tavsiya</p>
                </div>
              </div>
              
              <div className="grid gap-3 pb-8">
                {parentAdvice.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-4 p-4 rounded-xl border items-start transition-all ${
                      item.type === "prohibited" 
                        ? "bg-red-50/30 border-red-100/50" 
                        : "bg-blue-50/20 border-blue-100/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm ${
                      item.type === "prohibited" ? "bg-red-500" : "bg-blue-500"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      {item.type === "prohibited" && (
                        <p className="text-red-700 font-bold text-xs mb-0.5 uppercase tracking-tighter">Taqiqlanadi:</p>
                      )}
                      <p className="text-slate-800 text-lg leading-snug">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
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
              Sohaga oid eng muhim 20 ta tushuncha va ularning batafsil izohi.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 pt-4 space-y-4">
              <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-purple-900 leading-tight">Atamalarni bilish — mutaxassislik asosi!</h3>
                  <p className="text-sm text-purple-700 font-bold uppercase tracking-wider">Logopediya alifbosi</p>
                </div>
              </div>

              <div className="grid gap-3 pb-8">
                {logopedicDictionary.map((item, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-purple-50/20 border border-purple-100/50 hover:bg-purple-50/50 transition-all shadow-sm group">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-purple-300 font-black text-2xl">{(index + 1).toString().padStart(2, '0')}</span>
                      <h4 className="font-black text-purple-700 text-xl md:text-2xl group-hover:translate-x-1 transition-transform">{item.term}</h4>
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed pl-10 md:pl-11 border-l-2 border-purple-100/50">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-border bg-white flex justify-end shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
            <Button onClick={() => setSelectedArticle(null)} size="lg" className="rounded-2xl px-12 h-14 text-lg font-black shadow-xl shadow-purple-900/10">Tushunarli</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Teachers Dialog */}
      <Dialog open={selectedArticle === "teachers"} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] md:max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl border-none sm:rounded-3xl">
          <DialogHeader className="p-6 pb-4 shrink-0 border-b border-border/50 bg-white z-10">
            <DialogTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-green-600" />
              O'qituvchilar uchun qo'llanma
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg">
              Maktabda nutqiy nuqsoni bor o'quvchilar bilan ishlash bo'yicha amaliy tavsiyalar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 pt-4 space-y-4">
              <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-2xl border border-green-100">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-black text-green-900 leading-tight">Sinfda nutq o'stirish — muvaffaqiyat garovi!</h3>
                  <p className="text-sm text-green-700 font-bold uppercase tracking-wider">O'qituvchilar uchun 20 ta metodik tavsiya</p>
                </div>
              </div>

              <div className="grid gap-3 pb-8">
                {teacherAdvice.map((text, index) => (
                  <div 
                    key={index} 
                    className="flex gap-4 p-4 rounded-xl border border-green-100/50 bg-green-50/20 items-start hover:bg-green-50/50 transition-all shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                      {index + 1}
                    </div>
                    <p className="text-slate-800 text-lg leading-snug pt-0.5">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-border bg-white flex justify-end shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
            <Button onClick={() => setSelectedArticle(null)} size="lg" className="rounded-2xl px-12 h-14 text-lg font-black shadow-xl shadow-green-900/10">Tushunarli</Button>
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
              Respublikamizdagi tajribali logopedlar va defektologlar ro'yxati. Sirdaryo viloyati bo'yicha saralangan.
            </DialogDescription>
          </DialogHeader>

          {/* Region Tabs */}
          <div className="px-6 py-3 bg-orange-50/40 border-b border-orange-100/50 flex gap-2 shrink-0">
            <Button
              variant={selectedRegion === "Sirdaryo" ? "default" : "outline"}
              onClick={() => setSelectedRegion("Sirdaryo")}
              className={`flex-1 rounded-2xl font-extrabold h-11 text-base shadow-sm ${
                selectedRegion === "Sirdaryo"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-orange-800 border-orange-200 hover:bg-orange-50"
              }`}
            >
              Sirdaryo viloyati ✨
            </Button>
            <Button
              variant={selectedRegion === "Boshqa" ? "default" : "outline"}
              onClick={() => setSelectedRegion("Boshqa")}
              className={`flex-1 rounded-2xl font-extrabold h-11 text-base shadow-sm ${
                selectedRegion === "Boshqa"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-orange-800 border-orange-200 hover:bg-orange-50"
              }`}
            >
              Boshqa hududlar
            </Button>
            <Button
              variant={selectedRegion === "All" ? "default" : "outline"}
              onClick={() => setSelectedRegion("All")}
              className={`flex-1 rounded-2xl font-extrabold h-11 text-base shadow-sm ${
                selectedRegion === "All"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-orange-800 border-orange-200 hover:bg-orange-50"
              }`}
            >
              Barchasi
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 pt-4 grid gap-4 pb-20">
              {experts
                .filter(exp => selectedRegion === "All" || exp.region === selectedRegion)
                .map((exp, index) => (
                  <div key={index} className="p-6 rounded-3xl bg-orange-50/20 border border-orange-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:bg-orange-50/50 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-2xl text-orange-800">{exp.name}</h4>
                        {exp.region === "Sirdaryo" && (
                          <span className="bg-orange-100 text-orange-700 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider border border-orange-200">
                            Sirdaryo
                          </span>
                        )}
                      </div>
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
              {experts.filter(exp => selectedRegion === "All" || exp.region === selectedRegion).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Bu hududda mutaxassislar topilmadi.
                </div>
              )}
              <div className="mt-6 p-6 bg-orange-50 border border-orange-100 rounded-2xl text-center">
                <p className="text-base text-muted-foreground italic font-medium">
                  Eslatma: Bog'lanishdan oldin mutaxassisning qabul vaqtlarini aniqlashtirish tavsiya etiladi.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-border bg-white flex justify-end shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <Button onClick={() => setSelectedArticle(null)} size="lg" className="rounded-xl px-12 font-bold">Yopish</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
