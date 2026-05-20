export interface SpeechAnalysis {
  defectType: string;
  definition: string;
  severity: "yengil" | "o'rtacha" | "og'ir";
  direction: string;
  exercises: { title: string; description: string }[];
}

// Local Highly-intelligent Uzbek Logopedic Speech Classifier
function getLocalAnalysis(description: string): SpeechAnalysis {
  const text = description.toLowerCase().trim();

  // 1. Rotasizm (R tovushi nuqsoni)
  if (
    text.includes("r tovush") ||
    text.includes("r harf") ||
    text.includes("rr") ||
    text.includes("err") ||
    text.includes("r ni ayt") ||
    text.includes("rni ayt") ||
    text.includes("rotasiz") ||
    text.includes("r talaffuz") ||
    text.includes("r harfida qiynal") ||
    text.includes("r tovushida qiynal")
  ) {
    return {
      defectType: "Dislaliya (Rotasizm - 'R' tovushi nuqsoni)",
      definition: "Rotasizm — nutq apparatining anatomik tuzilishi normal bo'lgan holatda 'R' tovushining noto'g'ri talaffuz qilinishi, 'L' yoki 'Y' kabi boshqa tovushlar bilan almashtirilishi yoki butunlay tushirib qoldirilishi. Bu eng keng tarqalgan nutqiy nuqsonlardan biri bo'lib, til uchining tebranish xarakteri yetishmasligidan yoki dahan-til mushaklarining sustligidan kelib chiqadi.",
      severity: "yengil",
      direction: "Til mushaklarini chiniqtirish, til uchini tebranishga o'rgatish, to'g'ri havo va nafas yo'nalishini shakllantirish hamda vibratsiyaviy mashqlarni dars yoki hayotiy dars jarayonlariga muntazam kiritish.",
      exercises: [
        {
          title: "Motorli qayiqcha (Til vibratsiyasi)",
          description: "Boladan tilini yuqori tishlar orqasiga qo'yib, kuchli va maqsadli nafas chiqarib 'dr-dr-dr' deb aytishini so'rang. Bu mashq til uchidagi tebranishni faollashtiradi."
        },
        {
          title: "Tish tozalash o'yini",
          description: "Og'izni keng ochib, til uchi bilan yuqori tishlarning ichki-orqa tomonini chapdan o'ngga va o'ngdan chapga qarab sekin va silliq silash mashq qilinadi."
        },
        {
          title: "Ot choptirish (Taqillatish)",
          description: "Tilni yuqori tanglayga yopishtirib, ot qadamlaridek 'taq-taq-taq' deb taqillatish. Bu til osti yuganchasini cho'zishga ko'maklashadi."
        }
      ]
    };
  }

  // 2. Lambdasizm (L tovushi nuqsoni)
  if (
    text.includes("l tovush") ||
    text.includes("l harf") ||
    text.includes("ll") ||
    text.includes("ell") ||
    text.includes("l ni ayt") ||
    text.includes("lni ayt") ||
    text.includes("lambdasiz") ||
    text.includes("l talaffuz") ||
    text.includes("l harfida qiynal")
  ) {
    return {
      defectType: "Dislaliya (Lambdasizm - 'L' tovushi nuqsoni)",
      definition: "Lambdasizm — 'L' tovushining talaffuz qilinishida uchraydigan kamchiliklar: uning asosan 'Y', 'V', 'U' yoki 'O' tovushlari bilan almashtirilishi yoki butunlay tushirib aytilishi. Bu til harakatlarining orqa qismiga qaratilishi va til yon chetlarining sustligi sababli yuzaga keladi.",
      severity: "yengil",
      direction: "Til yon chetlarining faolligini oshirish, dahan hamda lablar harakatlarini to'g'ri muvofiqlashtirish va tovush chiqarishda havo yo'nalishini nazorat qilish.",
      exercises: [
        {
          title: "Paroxod fuvullashi (I-i-i)",
          description: "Lablarni tabassum holatiga keltirib, til uchini tishlar orasiga ohista qisib, sekin va uzluksiz 'ı-ı-ı-ı' deb paroxod fuvullashiga taqlid qilinadi."
        },
        {
          title: "Igna mashqi (O'tkir til)",
          description: "Og'izni ohista ochib, tilni iloji boricha oldinga tomon ingichka va o'tkir qilib chiqarish hamda lablarga tekkizmasdan 5-10 soniya ushlab turish."
        },
        {
          title: "Bo'yoqchi (Tanglayni bo'yash)",
          description: "Til uchi bilan yuqori tanglayni tishlar orqasidan boshlab, tomoq tomon yetguncha sekin va silliq silash harakatini bajarish."
        }
      ]
    };
  }

  // 3. Sigmatizm (Hushtak va shivirlovchi tovushlar - S, Z, Sh, Ch, J)
  if (
    text.includes("sh tovush") ||
    text.includes("ch tovush") ||
    text.includes("s tovush") ||
    text.includes("z tovush") ||
    text.includes("j tovush") ||
    text.includes("sigmatis") ||
    text.includes("hushtak") ||
    text.includes("shivir") ||
    text.includes("s harf") ||
    text.includes("sh harf") ||
    text.includes("z harf") ||
    text.includes("ch harf")
  ) {
    return {
      defectType: "Dislaliya (Sigmatizm - Shivirlovchi va Hushtakli tovushlar)",
      definition: "Sigmatizm — hushtakli (S, Z, C) va shivirlovchi (Sh, Ch, J) tovushlarning noto'g'ri talaffuz etilishi. Ko'pincha tilning tishlar orasiga ortiqcha chiqishi (tishlararo sigmatizm) yoki tillar yonidan havo chiqib ketishi (yonlama sigmatizm) oqibatida tovushlar xira va tushunarsiz chiqadi.",
      severity: "yengil",
      direction: "Havo oqimining til o'rtasidan to'g'ri va markazli yo'naltirilishini ta'minlash, dahan yopilishini to'g'ri shakllantirish hamda tilning old va yon tomonlarini faollashtirish.",
      exercises: [
        {
          title: "Shamol esishi (Fuuuuuh)",
          description: "Tilni kengaytirilgan 'kurakcha' shaklida pastki dudoqqa qisib qo'yib, til o'rtasidan mayin va barqaror havo puflash (sovutish mashqi)."
        },
        {
          title: "Chashka (Piyola) o'yini",
          description: "Og'izni ochib, tilni oldinga chiqarib, uning chetlarini yuqoriga ko'tarish orqali kichik 'piyola' shaklini hosil qilish va shunday ushlab turish."
        },
        {
          title: "To'siqli dahan",
          description: "Tishlarni yopib, tishlar orasidan havo bilan chiroyli 'S-S-S' yoki 'Sh-Sh-Sh' tovushini toza puflash mashqlari."
        }
      ]
    };
  }

  // 4. Logonevroz (Duduqlanish)
  if (
    text.includes("duduq") ||
    text.includes("tutil") ||
    text.includes("logonevroz") ||
    text.includes("hayajon") ||
    text.includes("to'xtab") ||
    text.includes("ritm") ||
    text.includes("tutilish") ||
    text.includes("gapda tutil")
  ) {
    return {
      defectType: "Logonevroz (Duduqlanish)",
      definition: "Logonevroz (Duduqlanish) — nutqning maromi, sur'ati va ravonligining nutq apparati mushaklarining qisqarishi (klonik yoki tonik talvasalar) oqibatida buzilishi. Bu asosan asab tizimining zo'riqishi, hayajon, qo'rquv yoki stress tufayli kuchayadi.",
      severity: "o'rtacha",
      direction: "Nutqiy nafasni rivojlantirish, sekin va bo'g'inlab gapirish darslarini tashkil etish, boladagi hayajonni bartaraf etish hamda qulay va xunuk bosimsiz muloqot muhitini yaratish.",
      exercises: [
        {
          title: "Diafragmal nafas olish (Qorin nafasi)",
          description: "Bir qo'lni ko'krakka, ikkinchisini qoringa qo'yib, burun orqali chuqur nafas olinadi (qorin oldinga shishadi) va og'izdan sekin, ovozsiz puflab chiqariladi."
        },
        {
          title: "Ritmik gapirish (Metronom o'yini)",
          description: "Har bir gapni yoki bo'g'inni ma'lum bir sekin ritm (masalan, sekin barmoq urishi) ostida ifoda etish. Bu nutq talvasalarini minimumga tushiradi."
        },
        {
          title: "Qo'shiq sadosi",
          description: "So'zlarni oddiy talaffuz qilmasdan, ohang bilan, qo'shiq aylanmasidek cho'zib aytish mashg'uloti."
        }
      ]
    };
  }

  // 5. Dizartriya
  if (
    text.includes("falaj") ||
    text.includes("insult") ||
    text.includes("dizartri") ||
    text.includes("mushak") ||
    text.includes("innervatsiya") ||
    text.includes("noaniq gap") ||
    text.includes("tushunarsiz") ||
    text.includes("chaynab")
  ) {
    return {
      defectType: "Dizartriya",
      definition: "Dizartriya — markaziy yoki periferik asab tizimining shikastlanishi natijasida nutq a'zolarini harakatlantiruvchi mushaklarning innervatsiyasi (asab aloqalari) buzilishi. Bu holatda nutq noaniq, g'o'ng'irga o'xshash, ba'zida haddan tashqari sekin va 'chaynayotgandek' xususiyatga ega bo'ladi.",
      severity: "og'ir",
      direction: "Artikulyatsion apparat organlarining umumiy tonusini normallashtirish, logopedik passiv/aktiv massaj, nafas mashqlari va dahan mosligini chiniqtirish.",
      exercises: [
        {
          title: "Logopedik passiv massaj",
          description: "Til va lab mushaklarini steril doka yoki maxsus logopedik zonalar yordamida ohista silash va massaj qilish orqali mushaklar tonusini yaxshilash."
        },
        {
          title: "Shirin murabbo o'yini",
          description: "Yuqori va pastki labni til uchi bilan aylanma shaklda (go'yo labga surtilgan asal yoki murabboni yalayotgandek) sekin artib chiqish."
        },
        {
          title: "Katta qorako'z (Lab mashqlari)",
          description: "Lablarni oldinga 'naycha' shaklida cho'zish, so'ng keng 'tabassum' holatiga keltirish. Mashqni ketma-ket qaytarish."
        }
      ]
    };
  }

  // 6. Rinolaliya
  if (
    text.includes("burni") ||
    text.includes("burun") ||
    text.includes("rinolali") ||
    text.includes("g'o'ng'ir") ||
    text.includes("g'o'ng'illab")
  ) {
    return {
      defectType: "Rinolaliya (Burun tovushi nuqsoni)",
      definition: "Rinolaliya — ovoz tembri va tovushlar talaffuzining anatomik va fiziologik jihatdan burun-tomoq yo'llarining rezonans buzilishi natijasida o'zgarishi. Havo asosan og'izdan emas, burun orqali chiqib ketadi va gapirish jarayoni g'o'ng'ir bo'lib qoladi.",
      severity: "og'ir",
      direction: "Burun va og'iz nafasini farqlashga o'rgatish, yumshoq tanglayning harakatchanligi va faolligini oshirish, og'iz orqali qaratilgan kuchli havo oqimini shakllantirish.",
      exercises: [
        {
          title: "Pufakchalar chalish mashqi",
          description: "Suvli stakanga ingichka naycha solib, burunni qisgan va ochgan holda kuch bilan havo puflab pufakchalar hosil qilish."
        },
        {
          title: "Chuqur esnash simulyatsiyasi",
          description: "Og'izni imkon darajasida keng ochib, chuqur esnash harakatini takrorlash. Bu yumshoq tanglayning ko'tarilish qobiliyatini yaxshilash uchun mukammaldir."
        }
      ]
    };
  }

  // 7. Alaliya (Nutq kechikishi va Nutqning Umumiy Rivojlanmaganligi)
  if (
    text.includes("kechikish") ||
    text.includes("gapirmay") ||
    text.includes("kam gapir") ||
    text.includes("alali") ||
    text.includes("nutq o'smagan") ||
    text.includes("tushunadi lekin gapirmaydi") ||
    text.includes("umumiy rivojlanmagan") ||
    text.includes("so'z boyligi kam")
  ) {
    return {
      defectType: "Alaliya (Nutqiy va Ruhiy Rivojlanish Kechikishi)",
      definition: "Alaliya — bosh miya po'stlog'idagi nutqiy sohalarning ona qornida yoki barvaqt g'o'daklik davridagi zararlanishi oqibatida til va nutqning tizimli ravishda to'liq shakllanmay qolishi. Bola so'zlarni va buyruqlarni mukammal tushunishi mumkin, lekin mustaqil gapirishga qiynaladi.",
      severity: "og'ir",
      direction: "Bolani nutqiy muloqotga faol jalb qilish, faol va passiv so'z boyligini kengaytirish, noverbal belgilardan og'zaki talaffuzga o'tishni o'yinlar orqali rag'batlantirish hamda barmoq mayda motorikasini rivojlantirish.",
      exercises: [
        {
          title: "Barmoqlar gimnastikasi (Mayda motorika)",
          description: "Mayda donachalar, plastilinlar, koptokchalar yoki maxsus tugmalar yordamida harakatlarni bajarish. Mayda motorika bevosita miya nutq markaziga ijobiy ta'sir ko'rsatadi."
        },
        {
          title: "Taqlyidiy o'yinlar (Onomatopeya)",
          description: "Hayvonlar yoki mashinalar tovushini (vov-vov, taq-tuq, pi-pi, fvvvv) o'yin davomida qayta-qayta takrorlab, dastlabki unli tovushlarni nutqqa kiritish."
        }
      ]
    };
  }

  // 8. General / Fallback (Fonetik-fonematik nutq buzilishi)
  return {
    defectType: "Fonetik-fonematik nutq buzilishi (FFNB)",
    definition: "FFNB — turli nutqiy nuqsonlar natijasida bolalarda tovushlarni talaffuz qilish tizimining shakllanishi va eshitish (fonematik) idrok etish jarayonlarining buzilishi. Bola o'xshash tovushlarni ajratishda qiynalishi va so'zlarni xira talaffuz qilishi mumkin.",
    severity: "yengil",
    direction: "Tovushlarni eshitib farqlash (fonematik idrok) ko'nikmasini rivojlantirish, to'g'ri artikulyatsion harakatlarni yo'lga qo'yish va so'z boyligini grammatik tomondan mustahkamlash.",
    exercises: [
      {
        title: "Eshitish teatri (Tovushlarni toping)",
        description: "Boladan ko'zlarini yumishini so'rang va turli o'yinchoqlar yoki qog'ozlar ovozini chiqarib, ularning nimaligini topishini talab qiling."
      },
      {
        title: "So'z ichra tovush",
        description: "Muayyan bir tovush (masalan 'S' yoki 'R') mavjud bo'lgan so'zlarni aytganda bolaning qarsak chalishi yoki harakat qilishi mashqi."
      },
      {
        title: "Aks-sado o'yini",
        description: "Siz aytgan turli murakkab va oson so'zlarni yoki bo'g'inlarni bola aks-sadodek ketma-ket va tushunarli takrorlashi lozim."
      }
    ]
  };
}

export async function analyzeSpeechDefect(description: string): Promise<SpeechAnalysis> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate if structure is correct, otherwise use fallback
    if (data && data.defectType && data.definition && data.exercises) {
      return data;
    }
    
    console.warn("Invalid data format received from server. Using intelligent local analyzer...");
    return getLocalAnalysis(description);
  } catch (error) {
    console.error("Client fetch error from /api/analyze, using intelligent local analyzer fallback:", error);
    return getLocalAnalysis(description);
  }
}
