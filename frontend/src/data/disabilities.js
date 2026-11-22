// The four disabilities covered by the National Trust Act, 1999 (Act 44 of 1999).
// Plain-language summaries based on the Rights of Persons with Disabilities Act, 2016
// and National Trust material. Tamil text is machine-prepared — have it reviewed.
// Nothing here is a diagnosis: every page tells families to see a doctor or the district office.

export const DISABILITIES = [
  {
    slug: "autism",
    icon: "Puzzle",
    image: "disability-autism",
    tone: "#2563eb",
    title: { en: "Autism Spectrum Disorder (ASD)", ta: "ஆட்டிசம் நிறமாலை குறைபாடு (ASD)" },
    short: { en: "Autism", ta: "ஆட்டிசம்" },
    summary: {
      en: "A developmental condition that affects how a person communicates, relates to others and experiences the world.",
      ta: "ஒருவர் தொடர்புகொள்வது, மற்றவர்களுடன் பழகுவது மற்றும் உலகை உணர்வதைப் பாதிக்கும் வளர்ச்சி சார்ந்த நிலை.",
    },
    about: {
      en: [
        "Autism usually appears in the first three years of life. It affects how a person communicates, understands relationships and relates to other people. Many autistic people also have repeated routines or behaviours, and may be very sensitive to sound, light or touch.",
        "Autism is a spectrum: every autistic person is different. Some need a lot of support every day; others need very little. Many have real strengths, such as attention to detail and strong memory.",
      ],
      ta: [
        "ஆட்டிசம் பொதுவாக வாழ்வின் முதல் மூன்று ஆண்டுகளில் வெளிப்படுகிறது. இது ஒருவர் தொடர்புகொள்வது, உறவுகளைப் புரிந்துகொள்வது மற்றும் மற்றவர்களுடன் பழகுவதைப் பாதிக்கிறது. பலருக்குத் திரும்பத் திரும்பச் செய்யும் வழக்கங்கள் இருக்கலாம்; ஒலி, ஒளி அல்லது தொடுதலுக்கு அதிக உணர்திறன் இருக்கலாம்.",
        "ஆட்டிசம் ஒரு நிறமாலை: ஒவ்வொருவரும் வேறுபட்டவர்கள். சிலருக்கு அன்றாடம் அதிக உதவி தேவை; சிலருக்குக் குறைவாகவே தேவை. பலருக்கு நுணுக்கமான கவனம், வலுவான நினைவாற்றல் போன்ற திறன்கள் உள்ளன.",
      ],
    },
    signs: {
      en: [
        "Little eye contact, or not responding to their name by about 12 months",
        "Not pointing, waving or babbling by the age most children do",
        "Speech that is delayed, or words that are lost after being learned",
        "Strong need for routine, and distress at small changes",
        "Repeated movements, such as hand-flapping or rocking",
        "Very strong reactions to sounds, textures, lights or smells",
      ],
      ta: [
        "குறைவான கண் தொடர்பு, அல்லது சுமார் 12 மாதத்தில் பெயர் சொல்லி அழைத்தால் திரும்பாமை",
        "மற்ற குழந்தைகள் செய்யும் வயதில் சுட்டிக்காட்டாமை, கை அசைக்காமை",
        "பேச்சு தாமதம், அல்லது கற்ற சொற்களை இழத்தல்",
        "வழக்கத்தில் அதிகப் பிடிப்பு, சிறு மாற்றங்களில் மன உளைச்சல்",
        "கை அசைத்தல், ஆடுதல் போன்ற திரும்பத் திரும்ப அசைவுகள்",
        "ஒலி, தொடுதல், ஒளி அல்லது வாசனைக்கு மிகக் கடுமையான எதிர்வினை",
      ],
    },
    help: {
      en: [
        "Early intervention — speech, occupational and behavioural therapy — helps most when it starts early.",
        "Structured routines, visual timetables and a calm space at home and school.",
        "Inclusive or special education with trained teachers.",
      ],
      ta: [
        "ஆரம்ப நிலைப் பயிற்சி — பேச்சு, செயல்முறை மற்றும் நடத்தை சிகிச்சை — விரைவாகத் தொடங்கினால் அதிகப் பயன் தரும்.",
        "வீட்டிலும் பள்ளியிலும் ஒழுங்கான வழக்கம், படக் கால அட்டவணை மற்றும் அமைதியான இடம்.",
        "பயிற்சி பெற்ற ஆசிரியர்களுடன் உள்ளடக்கிய அல்லது சிறப்புக் கல்வி.",
      ],
    },
    schemes: ["early-identification", "early-intervention-centres", "special-education", "day-care-centres", "social-security-schemes"],
  },
  {
    slug: "cerebral-palsy",
    icon: "Accessibility",
    image: "disability-cerebral-palsy",
    tone: "#0f766e",
    title: { en: "Cerebral Palsy (CP)", ta: "மூளை முடக்குவாதம் (CP)" },
    short: { en: "Cerebral Palsy", ta: "மூளை முடக்குவாதம்" },
    summary: {
      en: "A group of conditions that affect movement, muscle tone and posture, caused by injury to the developing brain.",
      ta: "வளரும் மூளையில் ஏற்படும் பாதிப்பால் அசைவு, தசை இறுக்கம் மற்றும் உடல் நிலையைப் பாதிக்கும் நிலைகள்.",
    },
    about: {
      en: [
        "Cerebral palsy is caused by damage to parts of the brain that control movement, usually before, during or shortly after birth. It does not get worse over time, but its effects can change as a child grows.",
        "CP affects people in different ways: some walk with a little difficulty, others use a wheelchair. Some people with CP also have difficulty with speech, swallowing, vision, hearing or learning; many do not.",
      ],
      ta: [
        "அசைவைக் கட்டுப்படுத்தும் மூளைப் பகுதிகளில், பொதுவாகப் பிறப்பதற்கு முன், பிறக்கும்போது அல்லது பிறந்த சிறிது காலத்தில் ஏற்படும் பாதிப்பால் மூளை முடக்குவாதம் வருகிறது. இது காலப்போக்கில் மோசமடைவதில்லை; ஆனால் குழந்தை வளரும்போது அதன் விளைவுகள் மாறலாம்.",
        "ஒவ்வொருவரையும் வெவ்வேறு விதமாகப் பாதிக்கிறது: சிலர் சிறிது சிரமத்துடன் நடக்கிறார்கள்; சிலர் சக்கர நாற்காலியைப் பயன்படுத்துகிறார்கள். சிலருக்குப் பேச்சு, விழுங்குதல், பார்வை, கேட்டல் அல்லது கற்றலில் சிரமம் இருக்கலாம்.",
      ],
    },
    signs: {
      en: [
        "Late to hold up the head, roll over, sit or crawl",
        "Body that feels very stiff or very floppy",
        "Using one side of the body much more than the other",
        "Difficulty sucking, swallowing or feeding",
        "Unusual posture or movements",
      ],
      ta: [
        "தலை நிமிர்த்துதல், புரளுதல், உட்காருதல் அல்லது தவழுதலில் தாமதம்",
        "மிகவும் விறைப்பான அல்லது மிகவும் தளர்வான உடல்",
        "உடலின் ஒரு பக்கத்தை மற்றதைவிட அதிகம் பயன்படுத்துதல்",
        "உறிஞ்சுதல், விழுங்குதல் அல்லது உணவு உண்பதில் சிரமம்",
        "இயல்பற்ற உடல் நிலை அல்லது அசைவுகள்",
      ],
    },
    help: {
      en: [
        "Physiotherapy and occupational therapy to build strength, movement and daily-living skills.",
        "Assistive devices such as wheelchairs, walkers, callipers and seating supports.",
        "Speech therapy and communication aids where needed.",
      ],
      ta: [
        "வலிமை, அசைவு மற்றும் அன்றாட வாழ்க்கைத் திறன்களுக்கான இயன்முறை மற்றும் செயல்முறை சிகிச்சை.",
        "சக்கர நாற்காலி, நடை உதவி, காலிப்பர், இருக்கை ஆதரவு போன்ற உதவி உபகரணங்கள்.",
        "தேவைப்பட்டால் பேச்சுப் பயிற்சி மற்றும் தொடர்பு உதவிக் கருவிகள்.",
      ],
    },
    schemes: ["early-intervention-centres", "assistive-devices", "special-assistive-devices", "special-education", "social-security-schemes"],
  },
  {
    slug: "intellectual-disability",
    icon: "Brain",
    image: "disability-intellectual",
    tone: "#7c3aed",
    title: { en: "Intellectual Disability", ta: "அறிவுசார் குறைபாடு" },
    short: { en: "Intellectual Disability", ta: "அறிவுசார் குறைபாடு" },
    summary: {
      en: "Significant limits in learning, reasoning and problem-solving, and in everyday social and practical skills.",
      ta: "கற்றல், சிந்தித்தல், சிக்கல் தீர்த்தல் மற்றும் அன்றாட சமூக, நடைமுறைத் திறன்களில் குறிப்பிடத்தக்க வரம்புகள்.",
    },
    note: {
      en: "The National Trust Act, 1999 uses the older term “mental retardation”. The Rights of Persons with Disabilities Act, 2016 uses “intellectual disability”, which is the term used on this website.",
      ta: "தேசிய அறக்கட்டளைச் சட்டம், 1999 பழைய சொல்லைப் பயன்படுத்துகிறது. மாற்றுத்திறனாளிகள் உரிமைகள் சட்டம், 2016 “அறிவுசார் குறைபாடு” என்ற சொல்லைப் பயன்படுத்துகிறது; இந்தத் தளமும் அதையே பயன்படுத்துகிறது.",
    },
    about: {
      en: [
        "Intellectual disability means a person has significant limits both in intellectual functioning — reasoning, learning, problem-solving — and in adaptive behaviour: the everyday social and practical skills needed to live and work.",
        "It begins during childhood. With the right teaching, support and patience, people with intellectual disability learn, work, build friendships and take part fully in community life.",
      ],
      ta: [
        "அறிவுசார் குறைபாடு என்பது அறிவுச் செயல்பாட்டில் — சிந்தித்தல், கற்றல், சிக்கல் தீர்த்தல் — மற்றும் தகவமைப்பு நடத்தையில், அதாவது வாழவும் வேலை செய்யவும் தேவையான அன்றாட சமூக, நடைமுறைத் திறன்களில் குறிப்பிடத்தக்க வரம்புகள் இருப்பதைக் குறிக்கிறது.",
        "இது குழந்தைப் பருவத்தில் தொடங்குகிறது. சரியான கற்பித்தல், ஆதரவு மற்றும் பொறுமையுடன், அறிவுசார் குறைபாடு உள்ளவர்கள் கற்கிறார்கள், வேலை செய்கிறார்கள், நட்பு கொள்கிறார்கள், சமூக வாழ்வில் முழுமையாகப் பங்கேற்கிறார்கள்.",
      ],
    },
    signs: {
      en: [
        "Sitting, crawling, walking or talking much later than other children",
        "Difficulty remembering things or understanding cause and effect",
        "Finding it hard to learn self-care, such as dressing or eating",
        "Difficulty following instructions or solving everyday problems",
        "Learning at school much more slowly than classmates",
      ],
      ta: [
        "மற்ற குழந்தைகளைவிட உட்காருதல், தவழுதல், நடத்தல் அல்லது பேசுவதில் அதிகத் தாமதம்",
        "நினைவில் வைப்பதில், காரண-காரியத்தைப் புரிந்துகொள்வதில் சிரமம்",
        "உடை அணிதல், உணவு உண்ணுதல் போன்ற சுயபராமரிப்பைக் கற்பதில் சிரமம்",
        "அறிவுரைகளைப் பின்பற்றுவதில் அல்லது அன்றாடச் சிக்கல்களைத் தீர்ப்பதில் சிரமம்",
        "வகுப்புத் தோழர்களைவிட மிக மெதுவாகக் கற்றல்",
      ],
    },
    help: {
      en: [
        "Early stimulation and special education that teaches one step at a time.",
        "Life-skills and vocational training for independence and work.",
        "Day care and, where needed, residential care and a legal guardian for adults.",
      ],
      ta: [
        "படிப்படியாகக் கற்பிக்கும் ஆரம்பத் தூண்டல் மற்றும் சிறப்புக் கல்வி.",
        "சுதந்திரமாக வாழவும் வேலை செய்யவும் வாழ்க்கைத் திறன் மற்றும் தொழிற்பயிற்சி.",
        "பகல்நேரப் பராமரிப்பு; தேவைப்பட்டால் தங்குமிடப் பராமரிப்பு மற்றும் வயது வந்தோருக்குச் சட்டப் பாதுகாவலர்.",
      ],
    },
    schemes: ["early-identification", "special-education", "day-care-centres", "rehabilitation-homes", "economic-development"],
  },
  {
    slug: "multiple-disabilities",
    icon: "Layers",
    image: "disability-multiple",
    tone: "#be185d",
    title: { en: "Multiple Disabilities", ta: "பல்வகைக் குறைபாடுகள்" },
    short: { en: "Multiple Disabilities", ta: "பல்வகைக் குறைபாடுகள்" },
    summary: {
      en: "Two or more disabilities together, such as cerebral palsy with intellectual disability, or deaf-blindness.",
      ta: "இரண்டு அல்லது அதற்கு மேற்பட்ட குறைபாடுகள் ஒன்றாக — எ.கா. மூளை முடக்குவாதத்துடன் அறிவுசார் குறைபாடு, அல்லது காது கேளாமை-பார்வையின்மை.",
    },
    about: {
      en: [
        "A person has multiple disabilities when they have two or more disabilities at the same time. Under the National Trust Act, this means a combination of two or more of autism, cerebral palsy and intellectual disability; under the RPwD Act, 2016 it also includes deaf-blindness.",
        "Because the disabilities affect each other, a person usually needs support that brings several services together — health, therapy, education and daily care — planned around the person and their family.",
      ],
      ta: [
        "ஒருவருக்கு ஒரே நேரத்தில் இரண்டு அல்லது அதற்கு மேற்பட்ட குறைபாடுகள் இருந்தால் அது பல்வகைக் குறைபாடு. தேசிய அறக்கட்டளைச் சட்டத்தின்படி, ஆட்டிசம், மூளை முடக்குவாதம் மற்றும் அறிவுசார் குறைபாடு ஆகியவற்றில் இரண்டு அல்லது அதற்கு மேற்பட்டவை சேர்ந்திருப்பது; RPwD சட்டம், 2016 இன்படி காது கேளாமை-பார்வையின்மையும் இதில் அடங்கும்.",
        "குறைபாடுகள் ஒன்றையொன்று பாதிப்பதால், உடல்நலம், சிகிச்சை, கல்வி மற்றும் அன்றாடப் பராமரிப்பு ஆகியவற்றை ஒருங்கிணைக்கும் ஆதரவு பொதுவாகத் தேவை — அது அந்த நபரையும் குடும்பத்தையும் மையமாகக் கொண்டு திட்டமிடப்பட வேண்டும்.",
      ],
    },
    signs: {
      en: [
        "Delays in several areas at once — movement, speech, seeing, hearing or learning",
        "Needing help with most daily activities",
        "Health needs such as seizures, feeding or breathing difficulties",
        "Communicating mainly through sounds, gestures or touch",
      ],
      ta: [
        "அசைவு, பேச்சு, பார்வை, கேட்டல் அல்லது கற்றல் எனப் பல பகுதிகளில் ஒரே நேரத்தில் தாமதம்",
        "பெரும்பாலான அன்றாடச் செயல்களுக்கு உதவி தேவைப்படுதல்",
        "வலிப்பு, உணவு அல்லது சுவாசச் சிரமம் போன்ற உடல்நலத் தேவைகள்",
        "முக்கியமாக ஒலி, சைகை அல்லது தொடுதல் மூலம் தொடர்புகொள்ளுதல்",
      ],
    },
    help: {
      en: [
        "A team approach: doctors, therapists, special educators and the family working together.",
        "Assistive and communication devices chosen for the person's needs.",
        "Day care, respite care and residential care when families need support.",
      ],
      ta: [
        "குழு அணுகுமுறை: மருத்துவர்கள், சிகிச்சையாளர்கள், சிறப்புக் கல்வியாளர்கள் மற்றும் குடும்பம் இணைந்து செயல்படுதல்.",
        "அந்த நபரின் தேவைக்கேற்ற உதவி மற்றும் தொடர்பு உபகரணங்கள்.",
        "குடும்பங்களுக்கு ஆதரவு தேவைப்படும்போது பகல்நேர, ஓய்வுப் பராமரிப்பு மற்றும் தங்குமிடப் பராமரிப்பு.",
      ],
    },
    schemes: ["early-intervention-centres", "special-assistive-devices", "day-care-centres", "rehabilitation-homes", "social-security-schemes"],
  },
];

// National Trust schemes in operation (from National Trust annual reports, 2022–2024).
export const NATIONAL_TRUST_SCHEMES = [
  { name: "Disha", en: "Early intervention and school readiness for children up to 10 years.", ta: "10 வயது வரையிலான குழந்தைகளுக்கு ஆரம்ப நிலைப் பயிற்சி மற்றும் பள்ளித் தயார்நிலை." },
  { name: "Vikaas", en: "Day care for people above 10 years, building interpersonal and vocational skills.", ta: "10 வயதுக்கு மேற்பட்டோருக்கு, தனிநபர் மற்றும் தொழில் திறன்களை வளர்க்கும் பகல்நேரப் பராமரிப்பு." },
  { name: "Disha-cum-Vikaas", en: "Early intervention and day care at one centre.", ta: "ஒரே மையத்தில் ஆரம்பப் பயிற்சி மற்றும் பகல்நேரப் பராமரிப்பு." },
  { name: "Samarth", en: "Respite and residential care, for example when a family is in crisis.", ta: "குடும்பம் நெருக்கடியில் இருக்கும்போது போன்ற சூழல்களில் ஓய்வு மற்றும் தங்குமிடப் பராமரிப்பு." },
  { name: "Gharaunda", en: "Group homes giving adults lifelong shelter and care.", ta: "வயது வந்தோருக்கு வாழ்நாள் தங்குமிடமும் பராமரிப்பும் வழங்கும் குழு இல்லங்கள்." },
  { name: "Samarth-cum-Gharaunda", en: "Residential care combining respite care and group homes.", ta: "ஓய்வுப் பராமரிப்பும் குழு இல்லமும் இணைந்த தங்குமிடப் பராமரிப்பு." },
  { name: "Niramaya", en: "Affordable health insurance for people with any of the four disabilities.", ta: "நான்கு குறைபாடுகளில் ஏதேனும் ஒன்று உள்ளவர்களுக்குக் குறைந்த செலவிலான மருத்துவக் காப்பீடு." },
];

export const findDisability = (slug) => DISABILITIES.find((d) => d.slug === slug);