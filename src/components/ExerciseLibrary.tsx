import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Music, Mic, Book, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const BG_MUSIC_URL = "https://cdn.pixabay.com/audio/2021/08/04/audio_03e04e0e47.mp3"; // Soft educational background (calm lullaby)

const exercises = [
  {
    id: 1,
    title: "Artikulyatsion gimnastika",
    category: "Umumiy",
    icon: PlayCircle,
    description: "Nutq a'zolari (til, lab, jag') harakatchanligini oshirish uchun video darslik.",
    duration: "10 daqiqa",
    videoUrl: "https://www.youtube.com/embed/SNFDw6AwCXA?start=6",
  },
  {
    id: 2,
    title: "'R' tovushini qo'yish",
    category: "Fonetik",
    icon: Mic,
    description: "Vibratsiyali tovushlarni to'g'ri talaffuz qilishni o'rganish uchun video darsliklar to'plami.",
    duration: "20 daqiqa",
    subExercises: [
      {
        title: "1-dars: 'R' tovushini qo'yish usullari",
        description: "Logoped mutaxassisdan 'R' tovushini to'g'ri talaffuz qilish bo'yicha asosiy ko'rsatmalar.",
        image: "https://picsum.photos/seed/speech1/200/200",
        videoUrl: "https://www.youtube.com/embed/BDrdpDXB2tQ",
      },
      {
        title: "2-dars: Amaliy mashqlar",
        description: "Tovushni mustahkamlash uchun qo'shimcha amaliy mashqlar. (Video 15-sekunddan boshlanadi)",
        image: "https://picsum.photos/seed/speech2/200/200",
        videoUrl: "https://www.youtube.com/embed/Tj8GVXgy_DY?start=15",
      },
      {
        title: "Motorcha mashqi",
        description: "Til uchini yuqori tishlar orqasiga qo'yib, kuchli havo oqimi bilan 'dr-dr-dr' deb vibratsiya hosil qiling. Bu mashq til mushaklarini mustahkamlaydi.",
        image: "https://picsum.photos/seed/motor/200/200",
      },
      {
        title: "Malyar mashqi",
        description: "Og'izni keng ochib, til uchi bilan yuqori tanglayni oldinga va orqaga 'bo'yang'. Til tanglaydan uzilmasligi kerak.",
        image: "https://picsum.photos/seed/painter/200/200",
      },
      {
        title: "Bolg'acha mashqi",
        description: "Til uchi bilan yuqori tishlar orqasiga 'd-d-d-d' deb tez-tez urish. Bu til uchining harakatchanligini oshiradi.",
        image: "https://picsum.photos/seed/hammer/200/200",
      }
    ]
  },
  {
    id: 3,
    title: "Nafas mashqlari",
    category: "Fiziologik",
    icon: Music,
    description: "Nutqiy nafasni to'g'ri shakllantirish va boshqarish bo'yicha video darslik.",
    duration: "5 daqiqa",
    videoUrl: "https://www.youtube.com/embed/R3_CV5xSnIg",
  },
  {
    id: 4,
    title: "Lug'at boyligini oshirish",
    category: "Leksik",
    icon: Book,
    description: "O'zbek xalq ertaklari orqali lug'at boyligini oshirish va nutqni o'stirish. Ertak.uz sayti materiallaridan foydalanamiz.",
    duration: "45 daqiqa",
    subExercises: [
      {
        title: "Ertak.uz - Sehrli olam",
        description: "O'zbek tilidagi eng katta ertaklar to'plami. Bu erda siz yuzlab qiziqarli va tarbiyaviy ertaklarni topishingiz mumkin.",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format&fit=crop",
        externalUrl: "http://www.ertak.uz",
      },
      {
        title: "Zumrad va Qimmat",
        description: "Mehnatsevar Zumrad va erka Qimmat haqidagi tarbiyaviy ertak. Yaxshilik va yomonlik oqibati haqida tushuncha beradi.",
        image: "https://picsum.photos/seed/tale1/300/300",
      },
      {
        title: "Ur to‘qmoq",
        description: "Sehrli dasturxon, oltin sochuvchi eshak va nohaqlikka qarshi 'ur to'qmoq' haqidagi qiziqarli sarguzasht.",
        image: "https://picsum.photos/seed/tale2/300/300",
      },
      {
        title: "Oltin tarvuz",
        description: "Qaldirg'ochni saqlab qolgan dehqon va unga berilgan mo'jizaviy oltin tarvuz haqida rivoyat.",
        image: "https://picsum.photos/seed/tale3/300/300",
      },
      {
        title: "Susambil",
        description: "Eshak, ho'kiz, qo'chqor va xo'rozning baxtiyor yurt 'Susambil'ni qidirib yo'lga chiqishlari.",
        image: "https://picsum.photos/seed/tale4/300/300",
      },
      {
        title: "Egri va To‘g‘ri",
        description: "Inson fe'l-atvori, to'g'rilikning g'alabasi va egrilikning jazosi haqida falsafiy ertak.",
        image: "https://picsum.photos/seed/tale5/300/300",
      },
      {
        title: "Sehrli xaltacha",
        description: "Dono qiz va uning sehrli xaltachasi yordamida mushkul vaziyatlardan chiqishi haqida.",
        image: "https://picsum.photos/seed/tale6/300/300",
      },
      {
        title: "Uch og‘ayni botirlar",
        description: "Uch alp yigitning o'z yurtini yovuz kuchlardan va ajdaholardan himoya qilishi haqidagi doston.",
        image: "https://picsum.photos/seed/tale7/300/300",
      },
      {
        title: "Kenja botir",
        description: "Dono va jasur Kenja botirning etti boshli dev ustidan g'alaba qozonishi va malikani qutqarishi.",
        image: "https://picsum.photos/seed/tale8/300/300",
      },
      {
        title: "Tulki va turna",
        description: "Mehmondorchilik odoblari va 'Nima eksang, shuni o'rasan' degan maqolni o'rgatuvchi masal-ertak.",
        image: "https://picsum.photos/seed/tale9/300/300",
      },
      {
        title: "Aqlli dehqon",
        description: "Kambag'al dehqonning o'z o'tkir zehni bilan boylar va podshoni mot qilishi haqida.",
        image: "https://picsum.photos/seed/tale10/300/300",
      },
      {
        title: "Hunarli kishi xor bo'lmas",
        description: "Har bir bola biror hunar egallashi kerakligi va mehnatning inson hayotidagi o'rni.",
        image: "https://picsum.photos/seed/tale11/300/300",
      },
      {
        title: "Sahiy va Baxil",
        description: "Saxiylikning barakasi va baxillikning halokati haqida ibratli hikoya.",
        image: "https://picsum.photos/seed/tale12/300/300",
      },
      {
        title: "Bo‘ri bilan tulki",
        description: "Hayvonlar hayotidan olingan hajviy ertak, tulkining ayyorliklari silsilasi.",
        image: "https://picsum.photos/seed/tale13/300/300",
      },
      {
        title: "Sher bilan duradgor",
        description: "Sherning kuchi va insonning aqli o'rtasidagi bahs. Aqlning ustunligi isboti.",
        image: "https://picsum.photos/seed/tale14/300/300",
      },
      {
        title: "Oltin baliqcha",
        description: "Uzbek halq og'zaki ijodidagi mo'jizaviy baliq va inson orzulari haqida hikoya.",
        image: "https://picsum.photos/seed/tale15/300/300",
      },
      {
        title: "Dono chol",
        description: "Keksalar tajribasi va maslahati qanchalik muhimligini ko'rsatuvchi ertak.",
        image: "https://picsum.photos/seed/tale16/300/300",
      },
      {
        title: "Boy o'g'li va dehqon o'g'li",
        description: "Do'stlikda boylik emas, balki samimiylik muhimligi haqida.",
        image: "https://picsum.photos/seed/tale17/300/300",
      },
      {
        title: "Qaldirg‘och va burgut",
        description: "Jasorat va kichik bo'lsa-da katta ishlar qila olish haqidagi hayvonot ertagi.",
        image: "https://picsum.photos/seed/tale18/300/300",
      },
      {
        title: "O'zbek xalq maqollari ertagi",
        description: "Har bir voqeasi bir maqolga ulanadigan qiziqarli mantiqiy hikoya.",
        image: "https://picsum.photos/seed/tale19/300/300",
      },
      {
        title: "Eshak va bulbul",
        description: "Haqiqiqy san'at va go'zallikni anglash haqida tarbiyaviy hikoya.",
        image: "https://picsum.photos/seed/tale20/300/300",
      }
    ]
  },
  {
    id: 5,
    title: "Diktantlar to'plami",
    category: "Yozma",
    icon: Book,
    description: "Boshlang'ich sinf o'quvchilari uchun mo'ljallangan 30 ta qisqa va qiziqarli diktant matnlari.",
    duration: "60 daqiqa",
    subExercises: [
      { title: "1. Vatan", description: "O'zbekiston - bizning muqaddas vatanimiz. Uning tuprog'i oltin, suvi gavhardir. Biz vatanimiz bilan faxrlanamiz. Tarixi boy va buyuk sultonlar o'tgan bu yurtda yashash katta baxt. Har bir o'g'il-qiz vatanini ko'z qorachig'idek asrashi kerak. Ozod va obod yurt tinchligi bizning kelajagimizdir. Vatan sevgisi imondandir deb bejizga aytilmagan. Biz uning baxt-u iqboli uchun har doim tayyormiz. Kelajakda yurtimiz ravnaqi uchun bilim olamiz. O'zbekiston - dunyoning eng go'zal va mehmondost mamlakatlaridan biridir. Biz o'z ajdodlarimizga munosib voris bo'lishga harakat qilamiz.", image: "https://images.unsplash.com/photo-1579541571811-13b28b7636e0?q=80&w=300&auto=format&fit=crop" },
      { title: "2. Maktab", description: "Maktabimiz - nurli bilimlar maskani. Bu yerda biz hayotning ilk saboqlarini olamiz. Ustozlarimiz bizga mehr bilan ta'lim-tarbiya berishadi. Do'stlarimiz bilan birga qiziqarli darslarda qatnashamiz. Sport zallarida chiniqamiz, kutubxonada kitob o'qiymiz. Maktab bizni katta hayotga tayyorlaydigan muqaddas dargohdir. Biz har bir o'tgan kunimizni qadrlaymiz. Bilim - kelajakning kalitidir, shuning uchun darslarimizni a'lo baholarga o'qishimiz kerak. Maktab partasida o'tirib biz dunyoni o'rganamiz. Har bir darsimiz yangi bilim va sarguzashtdir. Ustozlarimizning o'gitlariga amal qilib, vatanparvar insonlar bo'lib yetishamiz.", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=300&auto=format&fit=crop" },
      { title: "3. Kuz", description: "Oltin kuz fasli o'zining saxovati bilan ajralib turadi. Atrof sarg'ish va qizil ranglarga burkangan. Daraxtlardan tushayotgan barglar xuddi palosga o'xshaydi. Dalalarda paxlavon dehqonlarimiz hosilni yig'ishtirmoqdalar. Qishloqlarimizda mevalar g'arq pishgan. Kuz havosi salqin va musaffo. Bu faslda tabiat xuddi dam olayotgandek tuyuladi. Biz kuzning ne'matlaridan bahramand bo'lamiz va qishga tayyorgarlik ko'ramiz. Tabiatning bu mo'jizaviy davri har bir inson qalbida shukonalik uyg'otadi. Bog'larda anorlar pishib, tilim-tilim bo'ladi. Uzumlar go'yo quyosh nurlarini ichib, to'lishadi. Kuz bizga boylik va to'kinchilik olib keladi.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=300&auto=format&fit=crop" },
      { title: "4. Bahor", description: "Bahor - fasllar kelinchagi. Bu faslda butun borliq uyg'onadi. Daraxtlar murtak yozadi, maysalar ko'karadi. Osmonda qaldirg'ochlar quvonch bilan uchib yurishadi. Navro'z bayrami kelishi bilan hamma shodlanadi. Sumalaklar pishiriladi, urf-odatlarimiz tiklanadi. Bahor yomg'iri yerga hayot baxsh etadi. Dalalarda mehnat qaynaydi. Bu fasl yangilanish va yasharish ramzidir. Biz bahorni juda sog'inamiz va uni katta xursandchilik bilan kutib olamiz. Qirlarda lolaqizg'aldoqlar yoyilib, atrofni yashillikka burkaydi. Bahor havosi kishiga quvvat va shijoat beradi. Har bir giyoh yangi hayot boshlaydi.", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=300&auto=format&fit=crop" },
      { title: "5. Qish", description: "Qish fasli o'zining oppoq qori bilan zavqlidir. Atrof oppoq kiyim kiygan. Bolalar qorbo'ron o'ynashmoqda, chana uchishmoqda. Daraxtlar qor bilan qoplangan, xuddi ertaklardagidek go'zal. Sovuq bo'lishiga qaramay, qalbimizda iliqlik bor. Yangi yil bayrami barchaga quvonch ulashadi. Qishning uzun tunlari oila davrasida qiziqarli o'tadi. Qor parchalari havoda raqs tushadi. Bu fasl tabiatning sokin uyqusi bo'lib, bahorgi uyg'onishga kuch to'playdi. Ayozli kunlarda hamma uyda issiq choy ichib, diltartib hikoyalarni tinglaydi. Qishda mo'jizalar ro'y berishiga ham hamma ishonadi.", image: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=300&auto=format&fit=crop" },
      { title: "6. Yoz", description: "Yoz fasli - eng issiq va maroqli davr. Maktabda ta'til boshlanadi. Biz tog'larga, dam olish maskanlariga boramiz. Daryolarda miriqib cho'milamiz. Bog'larda mevalar pishadi. Quyosh o'zining saxiy nurlarini barchaga ulashadi. Yoz oqshomlari salqin va yoqimli bo'ladi. Biz tabiat qo'ynida vaqt o'tkazishni yaxshi ko'ramiz. Yoz - sarguzashtlar faslidir. Har bir kun yangi yangiliklar bilan to'la bo'ladi. Biz sog'lom bo'lish uchun ko'p mevalar iste'mol qilamiz. Qovun va tarvuzlar shirin hidlari bilan hammani chorlaydi. Yozda maza qilib dam olsak, o'qishga yanada ko'proq kuch yig'amiz.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop" },
      { title: "7. Oila", description: "Oila - hayotimizning mustahkam tayanchi. Mening oilam juda ahil va mehribon. Dadajonim bizga hamisha maslahat beradilar, g'amxo'rlik qiladilar. Oyijonim esa xonadonimizning fayzi, ularning shirin taomlari bilan uyimiz quyoshdek porlaydi. Biz akam va singlim bilan birga uy ishlarida yordamlashamiz. Oilada o'zaro hurmat va ishonch bo'lishi juda muhim. Tinch-totuv oila har bir inson uchun eng katta baxtdir. Bir-birimizni doimo qo'llab-quvvatlaymiz. Oila davrasida o'tkazilgan har bir daqiqa biz uchun juda qadrli. Biz bir-birimizga hamisha sadoqatlimiz va yordamga tayyormiz.", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=300&auto=format&fit=crop" },
      { title: "8. Do'stlik", description: "Do'stlik - eng oliy ne'matlardan biridir. Do'stlar bir-biriga og'ir damda yordam beradi, quvonchli kunlarda birga shodlanadi. Haqiqiy do'st yomon yo'ldan qaytaradi va yaxshilikka yetaklaydi. Biz maktabda juda ko'p do'stlar orttiramiz. Do'stlik samimiyat va ishonch ustiga quriladi. Alisher Navoiy bobomiz do'stlikni ulug'laganlar. Yaxshi do'st topish qiyin, uni asrash kerak. Biz do'stlarimiz bilan bilimlarimizni oshirishga harakat qilamiz va hamisha birgamiz. Do'st siringni saqlaydigan, senga hamisha sadoqatli bo'ladigan insondir. Biz do'stlarimiz bilan faxrlanamiz va ularni juda qadrlaymiz.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=300&auto=format&fit=crop" },
      { title: "9. Kitob", description: "Kitob - insonning eng yaqin do'sti va bilim manbai. U bizni uzoq o'lkalarga, tarixiy voqealarga yetaklaydi. Kitob o'qigan kishining nutqi ravon, fikri teran bo'ladi. Biz har kuni kitob o'qishni odat qilishimiz kerak. Badiiy kitoblar boy tasavvur beradi, fan kitoblari esa dunyo sirlarini ochadi. Kitobni asrab-avaylash, uni toza tutish kerak. Bir parcha qog'ozda butun bir olam aks etgan bo'lishi mumkin. Kitobxon yoshlar vatan kelajagidir. Kitob mutolaasi orqali biz dunyoqarashimizni kengaytiramiz. Kitob bizni ezgulikka chorlaydi va komil inson bo'lib yetishimizga yordam beradi.", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=300&auto=format&fit=crop" },
      { title: "10. Tabiat", description: "Atrofimizni o'rab turgan tabiat juda go'zal va sirlarga boy. Daraxtlar, gullar, hayvonlar va qushlar - bularning barchasi bizning boyligimizdir. Biz ona tabiatni asrashimiz, uni iflos qilmasligimiz kerak. Daraxt ekish, gullarga suv berish orqali biz tabiatga yordam beramiz. Toza havo va zilol suv inson salomatligi uchun zarurdir. Har bir giyohni, har bir jonzotni asrashimiz lozim. Tabiat bizning uyimiz, uni toza tutish har birimizning burchimizdir. Tabiat bilan uyg'unlikda yashash bizga quvvat va xotirjamlik bag'ishlaydi. Biz tabiatning har bir mo'jizasidan hayratlanamiz va undan zavq olamiz.", image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=300&auto=format&fit=crop" },
      { title: "11. Non", description: "Non - muqaddas ne'mat. Uni e'zozlash, har bir uvoqini asrash kerak. Dehqonlarning mehnatini qadrlaylik. Non - rizq-ro'zimiz manbai. Tandirdan yangi uzilgan issiq nonning hidi butun xonadonni to'ldiradi. Biz nonni yerda qoldirmaymiz, aksincha uni ehtiyotkorlik bilan dasturxonga qo'yamiz. Onalarimiz pishirgan patir va obinonlar har bir dasturxonning ko'rki hisoblanadi. Nonni e'zozlash - bu ota-bobolarimizdan qolgan qadriyatdir. Uni isrof qilish katta gunohdir. Dasturxonimizda non bo'lsa, xonadonimizda to'kinchilik va baraka bo'ladi. Har bir tishlangan non zamirida qancha mehnat borligini hamisha yodda tutaylik. Non - bu hayotimizning mazmuni va barakasidir.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop" },
      { title: "12. Suv", description: "Suv - hayot manbai. Suvsiz hayotni tasavvur qilib bo'lmaydi. Har bir tomchi suvda hayot bor. Biz suvni isrof qilmasligimiz, daryo va ko'llarni toza tutishimiz kerak. Tabiatdagi barcha jonzotlar, o'simliklar suv bilan oziqlanadi. Inson tanasining katta qismi ham suvdan iborat. Suvni tejash - kelajakni o'ylash demakdir. Suv bor joyda hayot bor, yashillik bor. Musaffo suv - salomatlik garovidir. Biz bu bebaho ne'matni e'zozlaymiz. Daryolar va dengizlar tabiatning marvaridlaridir. Suvni tejash orqali biz sayyoramizni saqlab qolamiz. Har bir ochilgan jo'mrakni ehtiyotkorlik bilan yopaylik. Suv bizning eng katta boyligimiz bo'lib qoladi.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop" },
      { title: "13. Quyosh", description: "Quyosh - koinotdagi eng ulkan energiya manbai. U bizga nur va issiqlik bag'ishlaydi. Quyosh nuri ostida barcha o'simliklar rivojlanadi. U insonlar uchun ham juda foydali, tanamizda kerakli vitaminlar hosil bo'lishiga yordam beradi. Quyosh bo'lmasa, yer yuzida sovuq va zulmat hukm surgan bo'lardi. Ertalab quyosh chiqishi bilan butun borliq jonlanadi. U bizga yangi kun, yangi umidlar olib keladi. Quyosh - bu hayot ramzidir. Uning nurlari bizga quvvat va shodlik baxsh etadi. Biz har tong quyoshni quvonch bilan kutib olamiz. Quyosh bor ekan, olam go'zal va yashash uchun barcha sharoitlar muhayyo. U markaziy osmon yoritqichidir.", image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=300&auto=format&fit=crop" },
      { title: "14. Oy", description: "Kechasi osmonda kumushdek tovlanib oy chiqadi. U tunning ko'rki va yoritqichidir. Oy paydo bo'lishi bilan atrof sokinlashadi. Uning nuri ostida daraxtlar xuddi jilvalanayotgandek ko'rinadi. Oyning turli holatlari - yangi oy, to'lishgan oy kishini hayratga soladi. Qadimdan insonlar oyga qarab vaqtni o'lchashgan. Tungi osmon oy va yulduzlar bilan xuddi ertaklardagidek go'zal bo'ladi. Oy nuri musaffo va mayindir. U bizga tinchlikni eslatadi. Biz tungi oy nuri ostida sayr qilishni yaxshi ko'ramiz. Oy go'zal afsonalarga va she'rlarga ilhom bo'lib xizmat qiladi. Uning sokin nuri qalbimizga orom bag'ishlaydi va tushlarimizni bezaydi.", image: "https://images.unsplash.com/photo-1522030239044-f2838414fd70?q=80&w=300&auto=format&fit=crop" },
      { title: "15. Yulduz", description: "Moviy osmonda son-sanoqsiz yulduzlar miltillab turadi. Ular xuddi osmon ko'zlariga o'xshaydi. Mitti yulduzchalar zulmatda yo'lovchilarga yo'l ko'rsatgan. Koinot sirlarga to'la bo'lib, yulduzlar uning bir bo'lagidir. Har bir yulduzning o'z o'rni va nomi bor. Bolalar yulduzlarni sanashni yaxshi ko'radilar. Yulduzli osmon insonga cheksizlik haqida so'zlaydi. Biz koinotni o'rganishimiz, ilm orqali yulduzlar sari intilishimiz kerak. Ular bizning orzularimiz kabi yuksakdir. Tungi osmonning bu mitti mash'alalari bizga porloq kelajak haqida darak beradi. Biz yulduzlarga qarab mo'jizalar kutamiz va yangi kashfiyotlar qilishga intilamiz. Har bir miltillayotgan nur - bu uzoq koinotning sadosidir.", image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=300&auto=format&fit=crop" },
      { title: "16. Toshkent", description: "Toshkent - jonajon O'zbekistonimizning poytaxti. Bu shahar nafaqat Markaziy Osiyoda, balki dunyoda ham o'zining go'zalligi va boy tarixi bilan mashhur. Keng va ravon ko'chalar, zamonaviy binolar, muhtasham bog'lar hammani hayratda qoldiradi. Toshkent metrosining har bir bekati san'at asaridir. Shahrimiz kundan-kunga chiroy ochmoqda. Bu yerda ko'plab oliygohlar, teatrlar va muzeylar joylashgan. Toshkent - tinchlik va do'stlik shahridir. Biz poytaxtimiz bilan faxrlanamiz. Toshkentda har bir inson o'zini baxtli his qiladi. Bu shahar nafaqat ma'muriy markaz, balki madaniyat va ilm-fan o'chog'idir. Biz uning ravnaqi uchun hamisha harakatda bo'lamiz va Toshkentni dunyoga tanitamiz.", image: "https://images.unsplash.com/photo-1589139162121-6b45391e60f0?q=80&w=300&auto=format&fit=crop" },
      { title: "17. Bog'", description: "Bizning bog'imiz juda fayzli va hosildor. Erta bahorda daraxtlar oppoq gulga burkanadi. Yozda esa g'arq pishgan mevalar novdalarni egib qo'yadi. Olma, o'rik, uzum va anorlar juda shirin. Biz bog'da ishlashni, daraxtlarni parvarish qilishni yaxshi ko'ramiz. Bog'ning havosi musaffo, qushlarning sayrashi quloqqa juda yoqimli eshitiladi. Bog' - bu oilamizning rizq-ro'zi va dam oladigan maskanidir. Biz har bir niholni mehr bilan parvarish qilamiz. Bog'dagi har bir daraxt bizim qo'limiz bilan ekilgan. Kuz kelishi bilan bog'imiz tillarangga kiradi va hosilimizni yig'ishtirib olamiz. Bu yer biz uchun osoyishtalik manbaidir. Mehnatimiz mahsulini ko'rib, ko'nglimiz xursand bo'ladi.", image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=300&auto=format&fit=crop" },
      { title: "18. Daryo", description: "Daryolar tabiatning qon tomirlari kabi yer yuziga hayot tarqatadi. Bizning yurtimizda Amudaryo va Sirdaryo kabi ulkan daryolar oqib o'tadi. Ularning suvi bilan dalalar sug'oriladi, paxta va g'allalar yetishtiriladi. Daryo bo'yida o'tirish kishiga orom beradi. Suvning shitirlashi go'zal musiqa kabi yangraydi. Daryolarda ko'plab baliqlar va boshqa jonzotlar yashaydi. Daryolarni doimo toza saqlashimiz, ularga chiqindilar tashlamasligimiz shart. Daryo - obodlik va to'kinlik belgisidir. Shoshqin daryo suvlari miltillab oqishi kishini o'ychanlikka chorlaydi. Suv insoniyatning eng katta ne'matidir va biz daryolarimizni asrashimiz kerak. Ular bizning hayotimiz davomiyligi uchun xizmat qiladi.", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=300&auto=format&fit=crop" },
      { title: "19. Tog'", description: "Tog'larimizning cho'qqilari osmon bilan bo'ylashadi. Ularning qorli cho'qqilari quyosh nurlarid ostida kumushdek porlaydi. Tog'larda darmonbaxsh giyohlar, shifobaxsh buloqlar ko'p. Biz dam olish kunlari tog'larga sayrga boramiz. Tog' havosi inson sog'lig'i uchun juda foydali. Baland qoyalar, chuqur daralar va sharsharalar tabiatning betakror manzaralaridir. Tog'larda yashovchi hayvonlar va qushlar o'zgacha go'zallikka ega. Tog'larni ko'rganda inson o'zini yanada kuchli va bardam his qiladi. Tog'larning musaffo havosi bizga tetiklik baxsh etadi. Shovullab oqayotgan soy suvlari muzdek va shifobaxshdir. Biz tog'lar bag'rida tabiat bilan yuzma-yuz kelamiz. Tog'lar sirlarini o'rganish juda qiziqarli.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop" },
      { title: "20. Tinchlik", description: "Tinchlik - eng ulug' baxt. Tinch yurtda o'sish, bilim olish har bir bolaning orzusidir. Bizning O'zbekistonimiz tinchliksevar davlatdir. Osmonimiz musaffo, hayotimiz osuda. Dunyoda tinchlik bo'lsin. Bolalar doim kulib yursin. Tinch hayotimiz - baxtimizdir. Hamisha osmonimiz musaffo bo'lsin. Tinchlik bor joyda rivojlanish, to'kinchilik bo'ladi. Biz tinchligimizni ko'z qorachig'idek asrashimiz kerak. Hamisha bayramlar xursandchilik bilan o'tsin. Tinchlik - bu kelajakning poydevoridir. Har bir inson o'z yurtida xotirjam yashashi uchun tinchlik zarur. Biz tinchlikni qadrlovchi avlodmiz va uni asrash uchun bilim egallaymiz. Tinch elda shodlik va quvonch doimiy bo'ladi.", image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=300&auto=format&fit=crop" },
      { title: "21. Mehnat", description: "Mehnat insonni ulug'laydi va uni yuksak cho'qqilarga olib chiqadi. Hunarli kishi xor bo'lmas, chunki uning qo'lida doimo rizq-ro'zi bo'ladi. Mehnat bilan oilaga baraka keladi, xonadon obod bo'ladi. Har bir kasb egasi o'z mehnati bilan jamiyatga foyda keltiradi. Biz yoshligimizdan mehnatsevar bo'lib o'sishimiz, ota-onamizga yordam berishimiz kerak. Dangasalik - insonning dushmanidir. Faqat harakat va mehnat orqali orzularimizga yetamiz. Mehnatsevar insonni hamma hurmat qiladi. Halol mehnat insonga baxt va mamnuniyat olib keladi. Mehnat qilib toliqish ham go'zallikdir, chunki uning ortida natija turadi. Biz har qanday foydali mehnatni qadrli deb bilamiz. Mehnat bizni yetuk qiladi.", image: "https://images.unsplash.com/photo-1504384308090-c89e12bf9a55?q=80&w=300&auto=format&fit=crop" },
      { title: "22. Ona", description: "Onajonim - dunyodagi eng mehribon va aziz inson. Ularning mehri quyoshdek issiq, qalbi daryodek kengdir. Onam biz uchun har doim qayg'uradilar, har bir muvaffaqiyatimizdan quvonchidirlar. Biz onalarimizni e'zozlashimiz, ularning duolarini olishimiz kerak. Ona baxtli bo'lsa, butun oila baxtli bo'ladi. Onaning allasi insonga tinchlik va orom bag'ishlaydi. Biz onajonimizning o'gitlariga amal qilamiz. Dunyoda onadan ulug'roq zot yo'q. Biz ularning sog'-salomat bo'lishlarini doimo tilaymiz. Ularning mehrli nigohlari bizga hayot bag'sh etadi. Onajonimizning har bir so'zi biz uchun muqaddasdir. Biz ularni hamisha ardoqlaymiz va xizmatlarida bo'lamiz. Onalarning oyog'i ostida jannatdir deb bejiz aytilmagan.", image: "https://images.unsplash.com/photo-1494173853114-127169d0feeb?q=80&w=300&auto=format&fit=crop" },
      { title: "23. Ota", description: "Otam - oilamizning mustahkam tayanchi va suyanchidir. U bizga doimo to'g'ri yo'l ko'rsatadi, jasorat va matonat bilan mehnat qiladi. Otamning so'zi biz uchun hikmat, o'gitlari esa tarbiya manbaidir. Biz otamiz bilan faxrlanamiz va ularga munosib farzand bo'lishga intilamiz. Ota - xonadonning quyoshi, uning soyasida biz xotirjam o'samiz. Otamiz bizga halollik va mehnatsevarlikni o'rgatadilar. Oilada otaning o'rni beqiyosdir. Biz ularning omon bo'lishlarini har doim niyat qilamiz. Ularning biz uchun qilgan barcha g'amxo'rliklarini qadrlaymiz. Ota kuchi va matonati har bir bolaga qanot bag'ishlaydi. Biz otamizning ishonchini oqlashga harakat qilamiz. Ularning maslahatlari hayotimizda eng katta mayoqdir.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop" },
      { title: "24. Sog'lik", description: "Sog'lik - tuman boylik, deydi xalqimiz. Sog' tanda sog'lom aql bo'ladi. Biz har kuni ertalab badantarbiya mashqlarini bajarishimiz, to'g'ri ovqatlanishimiz shart. Shaxsiy gigiyena qoidalariga amal qilish, qo'llarni muntazam yuvish salomatlik garovidir. Sport bilan shug'ullanish insonni chiniqtiradi, irodasini mustahkamlaydi. Sog'lom inson hayotdan zavq oladi, o'z maqsadlari sari dadil intiladi. Biz kelajakda yurtimizga foyda keltirish uchun sog'lom bo'lib o'sishimiz kerak. Salomatlikni yoshlikdan asraylik. Sport bilan muntazam shug'ullanish insonni har qanday kasallikdan asraydi. Toza havoda sayr qilish va sog'lom hayot tarzini shakllantirish muhimdir. Sog'lik - insonning eng katta boyligidir va biz uni doimo qadrlaymiz.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=300&auto=format&fit=crop" },
      { title: "25. O'qish", description: "O'qish orqali biz dunyo sirlarini o'rganamiz, bilimlarimizni boyitamiz. Bilim - kuchdir, u insonni jaholatdan qutqaradi. Har bir o'quvchi kitob bilan do'st bo'lishi, har kuni yangi bilimlar egallashi kerak. Biz maktabda nafaqat fanlarni, balki hayot darslarini ham o'qiymiz. O'qish bizga dunyoqarashimizni kengaytirishga, kelajakda yaxshi kasb egasi bo'lishimizga yordam beradi. Kitob mutolaasi insonga ma'naviy ozuqa beradi. Biz bilimli va zukko bo'lib, yurtimiz ravnaqi uchun xizmat qilamiz. Bilim qudrati bilan biz buyuk maqsadlarga erishamiz. Yoshlikda o'rganilgan bilim toshga o'yilgan naqsh kabi mustahkam bo'ladi. Biz ilm olishda charchamaymiz va doimo izlanishda bo'lamiz. O'quvchi yoshlar sadoqat bilan o'qib, yurtimiz bayrog'ini yuksaklarga ko'tarishadi.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300&auto=format&fit=crop" },
      { title: "26. Yozuv", description: "Chiroyli yozuv - insonning husnihati va odobidan nishonadir. Har bir harfni kanda qilmasdan, chiroyli va tushunarli qilib yozish kerak. Husnihat insonning sabr-toqatini va diqqatini charxlaydi. Daftarimizning tozaligi, harflarning bir xil egilganligi bizning intizomimizni ko'rsatadi. Chiroyli yozilgan matnni o'qish hammaning ko'ziga quvonch bag'ishlaydi. Biz harflar elementlarini to'g'ri birlashtirishni o'rganamiz. Chiroyli yozuv - bu san'at. Biz bu san'atni egallash uchun har kuni mashq qilamiz. Har bir harfni chiroyli qilib chizish inson diqqatini oshiradi. Yozuvimiz orqali o'z shaxsiyatimizni va tartibimizni ko'rsatamiz. Husnihat darslari bizga sabr va go'zallikni o'rgatadi. Chiroyli yozuv ko'rkam bo'lib, uni o'qish hammaning kayfiyatini ko'taradi.", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=300&auto=format&fit=crop" },
      { title: "27. Odob", description: "Odobli bola - elga manzur, deydi xalqimiz. Kattalarga salom berish, kichiklarga shafqat qilish har bir bolaning burchidir. Odob hammaning hurmatiga sazovordir va u insonning ma'naviy go'zalligini namoyon etadi. Odob oltindan ham qimmat bo'lib, u kishiga chinakam ziynat bag'ishlaydi. Biz maktabda va ko'cha-ko'yda o'zimizni odobli tutishimiz, shirinso'z bo'lishimiz kerak. Yaxshi xulq - insonning eng katta boyligidir. Biz doimo odobli, axloqli va tarbiyali bo'lib yuramiz. Kattalarimizning o'gitlariga amal qilish va odob qoidalarini hamisha yodda tutish kerak. Odob bizni boshqalardan ajratib turadi va jamiyatda o'rnimizni belgilaydi. Biz yashayotgan muhitda o'zaro hurmat bo'lishi muhimdir. Odob - insonni odam qiluvchi asosiy fazilatdir.", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=300&auto=format&fit=crop" },
      { title: "28. Insof", description: "Har bir ishda insof va diyonat bo'lishi lozim. Insofli kishi o'zgalarning haqqiga xiyonat qilmaydi, har doim adolatli bo'lishga intiladi. Insof insonga iymondir va u jamiyatda tinchlik va totuvlikni mustahkamlaydi. Biz o'zaro munosabatlarda, o'yinlarda va darslarda ham insofli bo'lishimiz kerak. Insofli insonni hamma qadrlaydi va unga ishonadi. Vijdon amriga quloq solish - insofli bo'lish demakdir. Biz har qanday vaziyatda ham insofimizni yo'qotmaymiz va to'g'ri yo'ldan adashmaymiz. Inson o'zi uchun nima niyati bo'lsa, o'zgalarga ham ilinishi insofli kishining belgisidir. Adolat va insof bo'lgan joyda hamma baxtli va xotirjam yashaydi. Biz hamisha haqiqat tarafida bo'lamiz va insofli bo'lib qolamiz.", image: "https://images.unsplash.com/photo-1502136197394-14b8f582f3d4?q=80&w=300&auto=format&fit=crop" },
      { title: "29. Jasorat", description: "Jasur insonlar har doim o'z xalqi va Vatani uchun fidoiy bo'ladilar. Biz buyuk ajdodlarimizning, qahramonlarimizning jasoratidan o'rnak olishimiz kerak. Botirlik - mardlik va qat'iyatlilik belgisidir. Vatan himoyachilari hamisha qadrli va ular bizga tinchlikni asrashni o'rgatadilar. Biz jasur avlod bo'lib yetishishimiz, qiyinchiliklardan qo'rqmasligimiz kerak. Jasorat faqat jangda emas, balki to'g'ri gapni aytishda va yaxshilik qilishda ham namoyon bo'ladi. Biz mard va botir bo'lib o'samiz. Qiyin damlarda inson o'z irodasini va jasoratini ko'rsatadi. Mardlik - har qanday sinovda sobit qolish demakdir. Jasur insonlar doimo xalq ardog'ida va xotirasida yashaydi. Biz kuchi va jasorati bilan vatanimizni dunyoga tanitamiz.", image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=300&auto=format&fit=crop" },
      { title: "30. Orzu", description: "Mening orzularim ummondek cheksiz va osmondek yuksakdir. Ularga erishish uchun tinmay o'qiyman, izlanaman va harakat qilaman. Orzu insonni yangi zafarlar sari chorlaydi, qalbga quvonch va umid bag'ishlaydi. Bizning orzularim yurtimiz ravnaqi bilan chambarchas bog'liq. Har bir inson o'z oldiga qo'ygan buyuk maqsadlari bo'lishi kerak. Biz kelajakda vatanimizga munosib farzand bo'lishni orzu qilamiz. Orzular albatta ushaladi, agar biz ularga ishonib, chin dildan mehnat qilsak. Orzu - muvaffaqiyat poydevoridir. Buyuk maqsadlar va orzular sari ildam qadam tashlaymiz. Har bir niyatimiz amalga oshishi uchun bilimimizni charxlaymiz. Kelajak yoshlari buyuk orzular bilan yashaydi va ularni ro'yobga chiqarishga qodirdirlar. Orzu bilan dunyo yanada yorqinroq bo'ladi.", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop" }
    ]
  },
];

export function ExerciseLibrary() {
  const [selectedExercise, setSelectedExercise] = useState<typeof exercises[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState("Barchasi");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredExercises = filter === "Barchasi" 
    ? exercises 
    : exercises.filter(ex => ex.category === filter);

  useEffect(() => {
    audioRef.current = new Audio(BG_MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.05;

    const playMusic = () => {
      audioRef.current?.play().catch(() => {});
    };

    window.addEventListener('mousedown', playMusic, { once: true });

    return () => {
      audioRef.current?.pause();
      window.removeEventListener('mousedown', playMusic);
    };
  }, []);

  const handleStart = (ex: typeof exercises[0]) => {
    setSelectedExercise(ex);
    setIsDialogOpen(true);
  };

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto pb-40">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-slate-900 mb-3 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Mashqlar Kutubxonasi 📚
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl">Nutqni rivojlantirish va chiroyli gapirish uchun eng qiziqarli mashqlar to'plami!</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {["Barchasi", "Fonetik", "Leksik", "Yozma", "Umumiy", "Fiziologik"].map((cat) => (
            <Badge 
              key={cat}
              variant="outline"
              className={`cursor-pointer px-5 py-2 text-sm font-bold rounded-2xl border-4 transition-all duration-300 ${
                filter === cat 
                ? "bg-violet-500 text-white border-violet-200 shadow-lg scale-105" 
                : "bg-white border-slate-50 text-slate-400 hover:border-violet-100 hover:text-violet-500"
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredExercises.map((ex) => (
          <Card key={ex.id} className="group hover:shadow-2xl transition-all duration-500 border-none bg-white rounded-[2.5rem] flex flex-col sticker-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-3 bg-violet-400 opacity-20`} />
            <CardHeader className="pb-4 pt-8">
              <div className="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center text-violet-500 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                <ex.icon className="w-8 h-8" />
              </div>
              <Badge className="w-fit mb-3 bg-violet-100 text-violet-600 border-none px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider">{ex.category}</Badge>
              <CardTitle className="text-2xl font-black font-display text-slate-800 group-hover:text-violet-600 transition-colors">{ex.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-6 pt-0">
              <p className="text-base text-slate-500 font-medium mb-8 leading-relaxed line-clamp-3">
                {ex.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                  <PlayCircle className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">{ex.duration}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-xl font-bold bg-violet-50 text-violet-600 hover:bg-violet-500 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                  onClick={() => handleStart(ex)}
                >
                  Boshlash
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0 shadow-2xl border-none">
          <DialogHeader className="p-6 pb-4 shrink-0 border-b bg-background/50 backdrop-blur-sm z-10">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedExercise?.icon && <selectedExercise.icon className="w-6 h-6 text-primary" />}
              {selectedExercise?.title}
            </DialogTitle>
            <DialogDescription>
              Ushbu mashqlarni har kuni 2-3 marta takrorlash tavsiya etiladi.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 overflow-y-auto w-full">
            <div className="p-6 pt-4 grid gap-6 pb-24">
              {selectedExercise?.videoUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                  <iframe
                    src={selectedExercise.videoUrl}
                    title={selectedExercise.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              {selectedExercise?.subExercises ? (
                <div className="space-y-8">
                  {/* Video Lessons Section */}
                  {selectedExercise.subExercises.some((sub: any) => sub.videoUrl) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                        <PlayCircle className="w-5 h-5" />
                        Video darsliklar
                      </h3>
                      <div className="grid gap-6">
                        {selectedExercise.subExercises.filter((sub: any) => sub.videoUrl).map((sub: any, i: number) => (
                          <div key={`video-${i}`} className="flex flex-col gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <h4 className="font-bold text-primary">{sub.title}</h4>
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-border shadow-md bg-black">
                              <iframe
                                src={sub.videoUrl}
                                title={sub.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                            <p className="text-sm text-muted-foreground">{sub.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Exercises Section */}
                  {selectedExercise.subExercises.some((sub: any) => !sub.videoUrl) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-secondary-foreground">
                        <Book className="w-5 h-5" />
                        Amaliy mashqlar
                      </h3>
                      <div className="grid gap-4">
                        {selectedExercise.subExercises.filter((sub: any) => !sub.videoUrl).map((sub: any, i: number) => (
                          <div key={`text-${i}`} className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-muted/50 border border-border group hover:border-primary/30 transition-colors">
                            <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden shrink-0">
                              <img 
                                src={sub.image} 
                                alt={sub.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <h4 className="font-bold text-lg text-primary mb-2">{sub.title}</h4>
                              <p className="text-muted-foreground leading-relaxed mb-4">{sub.description}</p>
                              {sub.externalUrl && (
                                <Button 
                                  asChild 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-fit mt-auto border-primary text-primary hover:bg-primary/10"
                                >
                                  <a href={sub.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4" />
                                    Saytga o'tish
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground italic">Ushbu bo'lim uchun mashqlar tez orada qo'shiladi.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border bg-muted/20 flex justify-end shrink-0 z-10 backdrop-blur-sm">
            <Button onClick={() => setIsDialogOpen(false)} className="rounded-xl px-10">Tugatish</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
