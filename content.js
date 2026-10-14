// Alle tekstinhoud en vraagdata voor de Creator Quickscan.
// Scoreteksten (tierDescriptions/advice) zijn in fase 1 vooraf geschreven voorbeeldteksten
// die automatisch geselecteerd worden op basis van de echte, berekende score (geen AI).

const BRAND = {
  name: "A Bigger Circle",
  wordmark: ["A", "Bigger", "Circle"],
};

const WELCOME = {
  eyebrow: "Creator Quickscan",
  title: "Ontdek hoe sterk jouw creator strategie is",
  intro:
    "Ontdek hoe jouw bedrijf meer uit creator marketing kan halen. Beantwoord een paar korte vragen en krijg binnen 5-10 minuten inzicht in je sterke punten, verbeterpunten en concrete vervolgstappen.",
  benefitsTitle: "Wat levert het je op?",
  benefits: [
    "Inzicht in 7 cruciale onderdelen van jouw creator strategie",
    "Je sterke punten en kansen die je nog laat liggen",
    "Concreet advies om gerichter te werken aan betere resultaten",
  ],
  cta: "Start de Quickscan",
};

// ---------- Niet-scorende introvragen ----------

const INTRO_PAGE = {
  title: "Eerst een paar korte vragen",
  description:
    "Deze vragen tellen niet mee voor je score, maar zorgen dat je advies beter aansluit op jouw bedrijf.",
};

const INTRO_QUESTIONS = [
  {
    id: "inzet",
    type: "single",
    question: "Hoe worden creators momenteel ingezet binnen jouw organisatie?",
    options: [
      { value: "geen", label: "We zetten nog geen creators in" },
      { value: "soms", label: "We experimenteren soms met creators" },
      { value: "regelmatig", label: "We zetten regelmatig creators in" },
      { value: "groot", label: "Creator marketing speelt een grote rol binnen de marketingstrategie" },
    ],
  },
  {
    id: "ervaring",
    type: "single",
    question: "Met welke creators heb je eerder gewerkt?",
    options: [
      { value: "nog_niet", label: "Nog niet" },
      { value: "nano", label: "Nano (ongeveer 1.000 tot 10.000 volgers)" },
      { value: "micro", label: "Micro (ongeveer 10.000 tot 100.000 volgers)" },
      { value: "macro", label: "Macro (meer dan 100.000 volgers)" },
    ],
  },
  {
    id: "doel",
    type: "single",
    question: "Wat is op dit moment het belangrijkste doel met creator marketing?",
    options: [
      { value: "naamsbekendheid", label: "Naamsbekendheid" },
      { value: "engagement", label: "Engagement / community opbouwen" },
      { value: "merkvoorkeur", label: "Merkvoorkeur / overweging vergroten" },
      { value: "conversie", label: "Conversie / verkoop" },
      { value: "content", label: "Content creëren" },
      { value: "anders", label: "Anders" },
    ],
  },
  {
    id: "budget",
    type: "single",
    question: "Hoe groot is ongeveer het jaarlijkse budget voor creator marketing?",
    options: [
      { value: "lt5000", label: "Minder dan €5.000" },
      { value: "5000_10000", label: "€5.000 - €10.000" },
      { value: "10000_25000", label: "€10.000 - €25.000" },
      { value: "25000_50000", label: "€25.000 - €50.000" },
      { value: "gt50000", label: "Meer dan €50.000" },
      { value: "onbekend", label: "Weet ik niet / wil ik niet zeggen" },
    ],
  },
  {
    id: "vermijden",
    type: "text",
    optional: true,
    question: "Met welke onderwerpen wil je niet geassocieerd worden?",
    placeholder: "Typ hier je antwoord",
  },
  {
    id: "link",
    type: "text",
    optional: true,
    question: "Wil je een link naar je website of brandbook toevoegen?",
    placeholder: "Plak hier een link",
  },
];

// ---------- De zeven scorende onderdelen ----------
// Elke stelling levert 0 (Nooit) t/m 3 (Altijd) punten op.

const ANSWER_SCALE = [
  { value: 0, label: "Nooit" },
  { value: 1, label: "Soms" },
  { value: 2, label: "Meestal" },
  { value: 3, label: "Altijd" },
];

const SECTIONS = [
  {
    id: "doelstelling",
    title: "Doelstelling en strategie",
    description:
      "In dit onderdeel kijken we hoe goed jouw creator marketing aansluit bij de doelen en strategie van je merk.",
    statements: [
      { id: "doelstelling_1", text: "We bepalen vantevoren wat ons doel is voor de inzet van creators." },
      { id: "doelstelling_2", text: "De keuzes voor creators en content sluiten aan op het doel wat we willen bereiken." },
      { id: "doelstelling_3", text: "We stellen vantevoren verschillende KPI's op om te meten of de creator inzet succesvol was." },
    ],
    tierDescriptions: {
      low: "Doelen en KPI's voor creator inzet liggen nog grotendeels los van elkaar.",
      mid: "Doel en KPI's liggen meestal vooraf vast, soms nog los.",
      high: "Doelen en KPI's worden structureel vooraf vastgelegd en gebruikt.",
    },
    advice: {
      quickwin: "Schrijf binnen 1 zin op wat creators voor jouw merk moeten opleveren en deel dit intern.",
      volgendestap: "Koppel hier 2 à 3 KPI's aan, zoals engagement rate, acties en saves.",
      langetermijn: "Leg doelen en KPI's vast in een jaarplan met vaste evaluatiemomenten.",
    },
  },
  {
    id: "selectie",
    title: "Creator selectie en fit",
    description:
      "Hier kijken we hoe je creators selecteert en of zij passen bij jouw merk en doelgroep/community.",
    statements: [
      { id: "selectie_1", text: "We kijken bij het selecteren van creators verder dan alleen het aantal volgers en bereik." },
      { id: "selectie_2", text: "We onderzoeken of waarden, uitstraling en contentstijl van de creator passen bij het merk." },
      { id: "selectie_3", text: "We kijken of de community van een creator aansluit bij de doelgroep die we willen bereiken." },
    ],
    tierDescriptions: {
      low: "Creators worden vooral gekozen op volgers en bereik, fit met het merk blijft nog onderbelicht.",
      mid: "Fit met merk en doelgroep wordt redelijk beoordeeld.",
      high: "Creators worden zorgvuldig geselecteerd op waarden, stijl en community-fit.",
    },
    advice: {
      quickwin: "Maak een eenvoudige checklist met waarden, stijl en doelgroep-fit en gebruik deze bij elke nieuwe creator.",
      volgendestap: "Vergelijk bij elke kandidaat de community (reacties, type volgers) met je eigen doelgroep.",
      langetermijn: "Bouw een vaste shortlist op van creators die structureel bij je merk passen.",
    },
  },
  {
    id: "authenticiteit",
    title: "Content en authenticiteit",
    description:
      "Hier kijken we hoe goed de content aansluit bij jouw merk en hoe authentiek deze overkomt.",
    statements: [
      { id: "authenticiteit_1", text: "De content die creators voor ons maken past bij de tone of voice van het merk." },
      { id: "authenticiteit_2", text: "De creator content biedt iets waardevols of interessants voor de doelgroep en komt niet alleen over als reclame." },
      { id: "authenticiteit_3", text: "Onze huidige samenwerkingen met creators komen geloofwaardig en natuurlijk over bij de doelgroep." },
    ],
    tierDescriptions: {
      low: "Content van creators sluit nog niet altijd aan bij de tone of voice van het merk.",
      mid: "Content is meestal geloofwaardig en waardevol.",
      high: "Content voelt consistent authentiek en sluit goed aan bij het merk.",
    },
    advice: {
      quickwin: "Leg in 1 zin de tone of voice van je merk vast en deel deze met creators.",
      volgendestap: "Laat creators content indienen vóór publicatie en toets deze aan de tone of voice.",
      langetermijn: "Ontwikkel een contentgids die creators gebruiken als uitgangspunt voor elke samenwerking.",
    },
  },
  {
    id: "platform",
    title: "Platform en context",
    description:
      "Hier kijken we of de gekozen platformen en content aansluiten bij jouw doelgroep en merk.",
    statements: [
      { id: "platform_1", text: "We kiezen bewust welke platformen er worden ingezet op basis van de doelstellingen en de doelgroep." },
      { id: "platform_2", text: "We passen de content aan naar het platform waarop dit wordt geplaatst." },
      { id: "platform_3", text: "We houden in de creator strategie rekening met het type product of dienst die wordt aangeboden." },
    ],
    tierDescriptions: {
      low: "Platformkeuzes worden nog weinig onderbouwd vanuit doelgroep en doelstelling.",
      mid: "Platform en productcontext worden vaak bewust gekozen.",
      high: "Platform- en contentkeuzes zijn sterk onderbouwd en consistent.",
    },
    advice: {
      quickwin: "Kies per campagne bewust 1 primair platform op basis van je doelgroep.",
      volgendestap: "Pas content per platform aan in plaats van dezelfde content overal te plaatsen.",
      langetermijn: "Stel een platformstrategie op waarin doelgroep, product en contentvorm samenkomen.",
    },
  },
  {
    id: "samenwerking",
    title: "Samenwerking en creatieve vrijheid",
    description:
      "In dit onderdeel wordt gekeken hoe je samenwerkt met creators en of de creatieve vrijheid hierbij wordt behouden.",
    statements: [
      { id: "samenwerking_1", text: "Onze creators krijgen een duidelijke briefing over het merk en de content." },
      { id: "samenwerking_2", text: "Onze creators krijgen voldoende vrijheid om content in hun eigen stijl te maken en te posten." },
      { id: "samenwerking_3", text: "We nemen de creators mee in het denkproces van de content of campagne en staan open voor hun ideeën." },
    ],
    tierDescriptions: {
      low: "Briefings en ruimte voor eigen inbreng van creators zijn nog beperkt.",
      mid: "Er is meestal een goede briefing met ruimte voor eigen stijl.",
      high: "Creators krijgen een heldere briefing én veel ruimte voor hun eigen stijl.",
    },
    advice: {
      quickwin: "Stel een vast briefingformat op met merkinformatie, doel en duidelijke kaders.",
      volgendestap: "Betrek creators vroeg in het proces en vraag actief om hun eigen ideeën.",
      langetermijn: "Bouw langdurige samenwerkingen op waarin creators meedenken over de campagne.",
    },
  },
  {
    id: "meting",
    title: "Meting en optimalisatie",
    description:
      "In dit onderdeel kijken we hoe je resultaten meet en gebruikt om jouw eigen creator marketing te verbeteren.",
    statements: [
      { id: "meting_1", text: "We beoordelen de resultaten van elke creator samenwerking aan de hand van vooraf bepaalde KPI's." },
      { id: "meting_2", text: "We kijken bij de beoordeling van de effectiviteit van de creator strategie verder dan alleen bereik, views en likes." },
      { id: "meting_3", text: "We gebruiken resultaten uit eerdere samenwerkingen om volgende creator marketing samenwerkingen te verbeteren." },
    ],
    tierDescriptions: {
      low: "Resultaten worden nog weinig gemeten of gebruikt om bij te sturen.",
      mid: "Resultaten worden over het algemeen gemeten en soms benut.",
      high: "Resultaten worden structureel gemeten en gebruikt om te verbeteren.",
    },
    advice: {
      quickwin: "Verzamel na elke samenwerking 5 uitkomsten in een overzicht: views, reacties, saves, shares en nieuwe volgers.",
      volgendestap: "Kijk niet alleen naar het bereik, maar ook naar reacties en sfeer bij en onder de video. Houd hierin bij wat werkt en wat niet.",
      langetermijn: "Evalueer elk kwartaal en pas de selectie, briefing en budget aan op wat werkt.",
    },
  },
  {
    id: "samenhang",
    title: "Strategische samenhang",
    description:
      "In dit onderdeel kijken we naar hoe goed de verschillende onderdelen van jouw creator strategie op elkaar aansluiten.",
    statements: [
      { id: "samenhang_1", text: "We baseren de keuzes voor de creators, content en het platform uit hetzelfde einddoel." },
      { id: "samenhang_2", text: "Onze creator marketing sluit goed aan bij onze algemene marketingstrategie." },
      { id: "samenhang_3", text: "We meten de resultaten vanuit het vooraf gestelde einddoel." },
    ],
    tierDescriptions: {
      low: "Creator marketing staat nog los van de bredere marketingstrategie.",
      mid: "Creator marketing past redelijk goed in de bredere strategie.",
      high: "Creator marketing is volledig geïntegreerd en stuurt op één doel.",
    },
    advice: {
      quickwin: "Check bij de volgende samenwerking of creator, content en platform uit hetzelfde doel komen.",
      volgendestap: "Neem creator marketing standaard mee in je bredere marketingplanning.",
      langetermijn: "Laat creator marketing structureel bijdragen aan je algemene merk- en marketingdoelen.",
    },
  },
];

// ---------- Losse transparantievraag (telt niet mee voor de score) ----------

const TRANSPARENCY = {
  title: "Nog een check: transparantie",
  description: "Als laatste kijken we of je duidelijk maakt wanneer content onderdeel is van een betaalde samenwerking.",
  id: "transparantie",
  text: "Bij betaalde of commerciële samenwerkingen zorgen we dat voor de consument duidelijk is dat het om een commerciële samenwerking gaat.",
};

// ---------- Scoreniveaus ----------
// Grenzen zijn een voorlopige indeling; definitieve grenzen volgen later (zie briefing).

const LEVELS = [
  {
    max: 25,
    label: "Startpunt",
    description: "Je staat aan het begin van een doordachte creator strategie. Dat is een prima plek om vanaf te bouwen.",
  },
  {
    max: 50,
    label: "In ontwikkeling",
    description: "Je past al onderdelen van een creator strategie toe, maar het mist nog een vaste structuur.",
  },
  {
    max: 75,
    label: "Goed op weg",
    description: "De basis staat en wordt regelmatig toegepast, maar er zijn goede verbeterkansen!",
  },
  {
    max: 100.01,
    label: "Sterk onderbouwd",
    description: "Creator marketing is goed geïntegreerd in je strategie en je werkt al gestructureerd.",
  },
];

// ---------- "Over jouw merk" (niet-scorend, voor personalisatie) ----------

const BRAND_PAGE = {
  title: "Over jouw merk",
  description: "Met deze vragen koppelen we passende creatorprofielen aan je uitslag.",
};

const BRAND_QUESTIONS = {
  branche: {
    id: "branche",
    type: "single",
    question: "In welke branche is jouw merk actief?",
    options: [
      "Eten en drinken",
      "Mode en beauty",
      "Gezondheid en sport",
      "Reizen en vrije tijd",
      "Tech en software",
      "Retail en e-commerce",
      "Zakelijke dienstverlening",
      "Anders",
    ],
  },
  leeftijd: {
    id: "leeftijd",
    type: "single",
    question: "Leeftijd van je doelgroep",
    options: ["16 - 24", "25 - 34", "35 - 44", "45 - 54", "55+"],
  },
  interesses: {
    id: "interesses",
    type: "multi",
    max: 3,
    question: "Waar is de doelgroep in geïnteresseerd?",
    options: [
      "Lifestyle",
      "Mode en beauty",
      "Eten en drinken",
      "Sport en gezondheid",
      "Reizen",
      "Gaming en tech",
      "Muziek en cultuur",
      "Financiën en zakelijk",
      "Gezin en wonen",
      "Anders",
    ],
  },
  platformen: {
    id: "platformen",
    type: "multi",
    max: 2,
    question: "Op welk platform wil je zichtbaar zijn?",
    options: ["TikTok", "Instagram", "YouTube", "LinkedIn", "Facebook", "Pinterest", "Weet ik nog niet", "Reddit"],
  },
  merkwoorden: {
    id: "merkwoorden",
    type: "multi",
    max: 3,
    question: "Welke woorden passen het best bij jouw merk?",
    options: [
      "Persoonlijk en dichtbij",
      "Professioneel en betrouwbaar",
      "Grappig en laagdrempelig",
      "Duurzaam en bewust",
      "Luxe en exclusief",
      "Eerlijk en transparant",
      "Creatief en eigenzinnig",
      "Sportief en energiek",
      "Anders",
    ],
  },
  contentsoort: {
    id: "contentsoort",
    type: "multi",
    max: 2,
    question: "Welke soort content past het best bij jouw merk?",
    options: [
      "Educatief en uitleggend",
      "Entertainend",
      "Inspirerend en lifestyle",
      "Eerlijke reviews en ervaringen",
      "Behind the scenes",
      "Trends en challenges",
      "Anders",
    ],
  },
};

// ---------- Fictieve creatorprofielen ----------
// Vaste voorbeeldprofielen (geen bestaande personen). In fase 2 worden deze AI-gegenereerd.

const CREATOR_PROFILES = [
  {
    id: "foodie",
    name: "De Foodie Next Door",
    type: "Micro-creator",
    platform: "TikTok",
    tags: ["Persoonlijk en dichtbij", "Eerlijke reviews en ervaringen"],
    sizePreference: ["nano", "micro"],
    about: "Recepten, restaurantbezoeken en eerlijke producttests, gefilmd in de eigen woonomgeving.",
    concept: "Een week lang je product gebruiken in gewone maaltijden, met een eerlijke review aan het einde.",
    kpis: "Engagement rate, reacties en delen of opslaan.",
    firstStep: "Verzamel 10 creators in deze niche en vergelijk comments en eerdere samenwerkingen van deze creators.",
  },
  {
    id: "insider",
    name: "The Insider",
    type: "Micro-creator",
    platform: "Instagram",
    tags: ["Eerlijk en transparant", "Behind the scenes"],
    sizePreference: ["micro"],
    about: "Lokale horeca, verborgen adresjes en achter de schermen bij wat kleinere merken.",
    concept: "Een kijkje achter de schermen bij jouw merk. Hoe wordt je product gemaakt, door wie en wat komt er allemaal bij kijken.",
    kpis: "Reacties, opslaan en nieuwe volgers via de creator.",
    firstStep: "Bekijk welke behind-the-scenes content al werkt in jouw niche en ga in gesprek over de sterke en zwakke punten hiervan.",
  },
  {
    id: "smaakmaker",
    name: "De Smaakmaker",
    type: "Nano-creator",
    platform: "Instagram",
    tags: ["Creatief en eigenzinnig", "Trends en challenges"],
    sizePreference: ["nano"],
    about: "Signatuurgerechten, mooie styling en korte trends rondom eten, lifestyle en reizen.",
    concept: "Een challenge waarin creators jouw product op hun eigen manier verwerken in een gerecht of moment.",
    kpis: "Engagement rate, shares en reacties met mogelijke eigen ideeën.",
    firstStep: "Kies een thema uit en laat hierbij twee creators dit op hun eigen manier vormgeven.",
  },
  {
    id: "expert",
    name: "De Expert",
    type: "Micro-creator",
    platform: "YouTube",
    tags: ["Professioneel en betrouwbaar", "Educatief en uitleggend"],
    sizePreference: ["micro", "macro"],
    about: "Diepgaande uitleg, vergelijkingen en onderbouwde meningen over producten in de sector.",
    concept: "Een uitlegvideo waarin de creator laat zien welk probleem jouw product oplost en voor wie.",
    kpis: "Kijktijd, reacties en kliks naar je website.",
    firstStep: "Selecteer 3 experts in je sector en bekijk hoe zij eerder vergelijkbare producten hebben besproken.",
  },
  {
    id: "verbinder",
    name: "De Verbinder",
    type: "Micro-creator",
    platform: "Instagram",
    tags: ["Sportief en energiek", "Inspirerend en lifestyle"],
    sizePreference: ["micro"],
    about: "Energieke dagelijkse content over een actieve levensstijl, met een betrokken community.",
    concept: "Een week lang je product meenemen in een actieve dagelijkse routine, gedeeld via stories en reels.",
    kpis: "Story-reacties, saves en nieuwe volgers via de creator.",
    firstStep: "Vraag een proefplaatsing en bekijk hoe de community reageert voordat je verder opschaalt.",
  },
  {
    id: "verhalenverteller",
    name: "De Verhalenverteller",
    type: "Macro-creator",
    platform: "YouTube",
    tags: ["Luxe en exclusief", "Inspirerend en lifestyle"],
    sizePreference: ["macro"],
    about: "Grootschalige, hoogwaardige content met een sterke visuele signatuur en een breed bereik.",
    concept: "Een exclusieve samenwerking waarin jouw merk een centrale rol speelt in een groter verhaal of event.",
    kpis: "Bereik, merkherinnering en kwalitatieve reacties.",
    firstStep: "Plan een kennismakingsgesprek om te toetsen of stijl en waarden echt aansluiten bij je merk.",
  },
];

// ---------- "Jouw vervolgstappen" teksten, gekoppeld aan introvragen ----------

const STARTPUNT_TEXT = {
  geen: {
    text: "Je zet nog geen creators in, dus je kan met een frisse start direct de juiste basis neerzetten.",
    bullets: ["Begin met 1 duidelijk doel en 1 platform.", "Kies een klein experiment om ervaring op te doen."],
  },
  soms: {
    text: "Je zet soms al creators in, maar nog zonder vaste aanpak.",
    bullets: ["Hier ligt een kans voor meer structuur.", "Begin klein en ontdek wat bij je merk past."],
  },
  regelmatig: {
    text: "Je zet al regelmatig creators in en hebt al ervaring opgebouwd.",
    bullets: ["Breng structuur aan in wat al werkt.", "Leg vaste werkwijzen en KPI's vast."],
  },
  groot: {
    text: "Creator marketing speelt al een grote rol binnen je strategie.",
    bullets: ["Optimaliseer en professionaliseer de bestaande aanpak.", "Zet in op langdurige samenwerkingen."],
  },
};

const DOEL_TEXT = {
  naamsbekendheid: {
    text: "Je wilt vooral naamsbekendheid vergroten.",
    bullets: ["Kies voor bereik en herkenbare content.", "Werk met creators die aansluiten bij een brede doelgroep."],
  },
  engagement: {
    text: "Je wilt een community opbouwen rondom je merk.",
    bullets: ["Het gaat om engagement en niet alleen zoveel mogelijk bereik.", "Op deze manier creëer je een connectie met je doelgroep."],
  },
  merkvoorkeur: {
    text: "Je wilt merkvoorkeur en overweging vergroten.",
    bullets: ["Kies creators die geloofwaardig over je merk kunnen praten.", "Zet in op herhaling en een consistente boodschap."],
  },
  conversie: {
    text: "Je wilt vooral conversie en verkoop stimuleren.",
    bullets: ["Kies creators met een overtuigende call-to-action stijl.", "Meet direct op kliks, kortingscodes of conversies."],
  },
  content: {
    text: "Je wilt vooral waardevolle content laten creëren.",
    bullets: ["Focus op kwalitatieve, herbruikbare content.", "Maak vooraf afspraken over het gebruik van deze content."],
  },
  anders: {
    text: "Je hebt een eigen, specifiek doel voor creator marketing.",
    bullets: ["Vertaal dit doel naar 1 of 2 concrete KPI's.", "Bespreek dit doel duidelijk met creators in de briefing."],
  },
};

const BUDGET_TEXT = {
  lt5000: {
    text: "Met een budget tot €5.000 kan je klein en gericht experimenteren.",
    bullets: ["Kies 1 à 2 nano-creators.", "Test welke aanpak werkt voor je merk."],
  },
  "5000_10000": {
    text: "Met een budget van €5.000 tot €10.000 kan je een kleinschalige campagne starten.",
    bullets: ["Kies 2 tot 3 creators.", "Test verschillende contentvormen en kijk wat werkt en wat niet."],
  },
  "10000_25000": {
    text: "Met een budget van €10.000 tot €25.000 kan je een gerichte campagne met meerdere creators opzetten.",
    bullets: ["Combineer micro-creators met 1 iets grotere creator.", "Zet meerdere contentvormen tegelijk in."],
  },
  "25000_50000": {
    text: "Met een budget van €25.000 tot €50.000 kan je een bredere, structurele campagne opzetten.",
    bullets: ["Combineer micro- en macro-creators.", "Bouw aan langdurige samenwerkingen."],
  },
  gt50000: {
    text: "Met een budget boven €50.000 kan je een grootschalige, structurele creator strategie opzetten.",
    bullets: ["Werk met een mix van creator-types.", "Zet in op een jaarplan met vaste samenwerkingen."],
  },
  onbekend: {
    text: "Je budget staat nog niet vast, dus je hebt ruimte om dit af te stemmen op je doel.",
    bullets: ["Begin met een klein experiment om een indicatie te krijgen.", "Bepaal op basis hiervan een realistisch budget."],
  },
};

const CTA_PAGE = {
  title: "Hoe pak je dit nu aan?",
  description:
    "Je weet nu waar je kansen liggen, welke creatorprofielen bij je passen en welke stappen je nu kan zetten. A Bigger Circle helpt je graag om dit verder uit te werken tot een duidelijke aanpak.",
  planCta: "Plan een gesprek",
  mailCta: "Mail mijn resultaten",
  privacyNote: "Je gegevens worden vertrouwelijk behandeld.",
};
