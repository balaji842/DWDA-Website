// Reference data added on first start. Nothing here is official data:
// scheme titles and one-line summaries come from the design brief; eligibility,
// documents, contact details and figures are left EMPTY for the department to
// enter through the admin dashboard. Demo-only records are flagged isSample.
const Scheme = require("../models/Scheme");
const DistrictOffice = require("../models/DistrictOffice");
const News = require("../models/News");
const Document = require("../models/Document");
const Institution = require("../models/Institution");
const Setting = require("../models/Setting");
const Admin = require("../models/Admin");
const Need = require("../models/Need");
const config = require("../config");
const { DISTRICTS } = require("../config/constants");

const SCHEMES = [
  ["identification-scheme", "identity", ["person", "parent"], "Identification Scheme", "அடையாள அட்டை திட்டம்",
    "Medical assessment and the national ID card for differently abled persons.", "மருத்துவ மதிப்பீடு மற்றும் மாற்றுத்திறனாளிகளுக்கான தேசிய அடையாள அட்டை."],
  ["early-identification", "children", ["parent"], "Early Identification", "ஆரம்ப நிலை கண்டறிதல்",
    "Screening of young children to spot a disability early.", "குழந்தைகளிடம் உள்ள குறைபாட்டை முன்கூட்டியே கண்டறியும் பரிசோதனை."],
  ["early-intervention-centres", "children", ["parent", "institution"], "Early Intervention Centres", "ஆரம்ப நிலை பயிற்சி மையங்கள்",
    "Therapy and training for young children, with guidance for parents.", "சிறு குழந்தைகளுக்குச் சிகிச்சையும் பயிற்சியும், பெற்றோருக்கு வழிகாட்டுதலும்."],
  ["state-resource-cum-training-centre", "education", ["institution", "parent"], "State Resource cum Training Centre", "மாநில வள மற்றும் பயிற்சி மையம்",
    "Training for teachers, parents and rehabilitation workers.", "ஆசிரியர்கள், பெற்றோர் மற்றும் மறுவாழ்வுப் பணியாளர்களுக்கான பயிற்சி."],
  ["rehabilitation-homes", "care", ["parent", "institution"], "Rehabilitation Homes", "மறுவாழ்வு இல்லங்கள்",
    "Residential care, food and vocational training.", "தங்குமிடப் பராமரிப்பு, உணவு மற்றும் தொழிற்பயிற்சி."],
  ["day-care-centres", "care", ["parent", "institution"], "Day Care Centres", "பகல்நேரப் பராமரிப்பு மையங்கள்",
    "Day care and life-skills training close to home.", "வீட்டருகே பகல்நேரப் பராமரிப்பு மற்றும் வாழ்க்கைத் திறன் பயிற்சி."],
  ["special-education", "education", ["person", "parent"], "Special Education", "சிறப்புக் கல்வி",
    "Special schools, scholarships and learning support.", "சிறப்புப் பள்ளிகள், கல்வி உதவித்தொகை மற்றும் கற்றல் உதவி."],
  ["economic-development", "employment", ["person"], "Economic Development", "பொருளாதார மேம்பாடு",
    "Self-employment support and skill training.", "சுயதொழில் உதவி மற்றும் திறன் பயிற்சி."],
  ["assistive-devices", "devices", ["person", "parent"], "Assistive Devices", "உதவி உபகரணங்கள்",
    "Wheelchairs, tricycles, hearing aids and other aids.", "சக்கர நாற்காலிகள், மூன்று சக்கர வண்டிகள், காதொலிக் கருவிகள் மற்றும் பிற உபகரணங்கள்."],
  ["special-assistive-devices", "devices", ["person"], "Special Assistive Devices", "சிறப்பு உதவி உபகரணங்கள்",
    "Advanced and motorised aids for higher support needs.", "அதிக உதவி தேவைப்படுவோருக்கான மேம்பட்ட மற்றும் மோட்டார் பொருத்திய உபகரணங்கள்."],
  ["social-security-schemes", "social-security", ["person", "parent"], "Social Security Schemes", "சமூகப் பாதுகாப்புத் திட்டங்கள்",
    "Monthly maintenance assistance and pensions.", "மாதாந்திரப் பராமரிப்பு உதவித்தொகை மற்றும் ஓய்வூதியம்."],
  ["state-award", "awards", ["person", "institution"], "State Award", "மாநில விருது",
    "Recognition for achievers, employers and organisations.", "சாதனையாளர்கள், வேலையளிப்போர் மற்றும் நிறுவனங்களுக்கான அங்கீகாரம்."],
];

const DISTRICTS_TA = {
  Ariyalur: "அரியலூர்", Chengalpattu: "செங்கல்பட்டு", Chennai: "சென்னை", Coimbatore: "கோயம்புத்தூர்", Cuddalore: "கடலூர்",
  Dharmapuri: "தருமபுரி", Dindigul: "திண்டுக்கல்", Erode: "ஈரோடு", Kallakurichi: "கள்ளக்குறிச்சி", Kancheepuram: "காஞ்சிபுரம்",
  Kanniyakumari: "கன்னியாகுமரி", Karur: "கரூர்", Krishnagiri: "கிருஷ்ணகிரி", Madurai: "மதுரை", Mayiladuthurai: "மயிலாடுதுறை",
  Nagapattinam: "நாகப்பட்டினம்", Namakkal: "நாமக்கல்", Nilgiris: "நீலகிரி", Perambalur: "பெரம்பலூர்", Pudukkottai: "புதுக்கோட்டை",
  Ramanathapuram: "இராமநாதபுரம்", Ranipet: "இராணிப்பேட்டை", Salem: "சேலம்", Sivaganga: "சிவகங்கை", Tenkasi: "தென்காசி",
  Thanjavur: "தஞ்சாவூர்", Theni: "தேனி", Thoothukudi: "தூத்துக்குடி", Tiruchirappalli: "திருச்சிராப்பள்ளி", Tirunelveli: "திருநெல்வேலி",
  Tirupathur: "திருப்பத்தூர்", Tiruppur: "திருப்பூர்", Tiruvallur: "திருவள்ளூர்", Tiruvannamalai: "திருவண்ணாமலை", Tiruvarur: "திருவாரூர்",
  Vellore: "வேலூர்", Viluppuram: "விழுப்புரம்", Virudhunagar: "விருதுநகர்",
};

const DOCUMENTS = [
  ["Rights of Persons with Disabilities Act, 2016", "மாற்றுத்திறனாளிகள் உரிமைகள் சட்டம், 2016", "act", 2016],
  ["Persons with Disabilities Act, 1995", "மாற்றுத்திறனாளிகள் சட்டம், 1995", "act", 1995],
  ["State Policy for the Differently Abled, 1994", "மாற்றுத்திறனாளிகளுக்கான மாநிலக் கொள்கை, 1994", "policy", 1994],
];

// From https://www.scd.tn.gov.in/ and https://scd.tn.gov.in/contactus.php
const OFFICIAL = {
  helpline: "1800 425 0111",
  officePhone: "044-28444948",
  officeEmail: "scd.tn@nic.in",
  officeAddress: "State Commissionerate for Welfare of the Differently Abled,\nNo.5, Kamarajar Salai, Lady Wellington College Campus,\nChennai - 600 005",
  stats: { populationFigure: "13,35,219", schemesFigure: "82", rehabHomesFigure: "11", specialSchoolsFigure: "22" },
};

// Sample needs, as listed on the Namma School "Donate for Differently Abled" page (marked Sample).
// [institution key, category, SubCategory, unit cost ₹, required quantity]
const SAMPLE_INSTITUTIONS = {
  pdk: { name: "Government Rehabilitation Home, Pudukkottai", type: "rehabilitation-home", district: "Pudukkottai", managedBy: "government", disability: "Leprosy cured person" },
  slm: { name: "Govt Middle School for the Visually Impaired, Salem", type: "special-school", district: "Salem", managedBy: "government", disability: "" },
};
const SAMPLE_NEEDS = [
  ["slm", "digital-infrastructure", "Printers", 6000, 1], ["slm", "electrical-infrastructure", "Extension Box", 700, 1],
  ["slm", "electrical-infrastructure", "Motor and pump", 800, 1], ["slm", "electrical-infrastructure", "Washing Machine", 10000, 1],
  ["slm", "health-hygiene", "New Napkin Vending Machine and Incinerator", 11000, 1], ["slm", "safety", "Bell", 300, 1],
  ["slm", "safety", "CCTV", 6000, 10], ["slm", "renovation-maintenance", "Repairs", 5000, 1], ["slm", "special-needs", "Braille Slates and Styluses", 500, 53],
  ["pdk", "civil-infrastructure", "Anti-Slip Flooring", 100000, 1], ["pdk", "civil-infrastructure", "Common Area", 500000, 1],
  ["pdk", "civil-infrastructure", "Compound Wall", 200000, 1], ["pdk", "civil-infrastructure", "Gate", 50000, 1], ["pdk", "civil-infrastructure", "Ground", 200000, 1],
  ["pdk", "civil-infrastructure", "Handrails and Grab Bars", 50000, 1], ["pdk", "civil-infrastructure", "Handwashing Station", 50000, 1],
  ["pdk", "civil-infrastructure", "New sump", 100000, 1], ["pdk", "civil-infrastructure", "New Water Connection - Water Connection and Repairs", 30000, 1],
  ["pdk", "civil-infrastructure", "Ramp Construction", 30000, 1], ["pdk", "civil-infrastructure", "Septic Tank", 30000, 1], ["pdk", "civil-infrastructure", "Shelters", 100000, 1],
  ["pdk", "civil-infrastructure", "Toilet Construction", 30000, 1], ["pdk", "civil-infrastructure", "Water Tank Construction", 50000, 1], ["pdk", "civil-infrastructure", "Fencing", 30000, 1],
  ["pdk", "health-hygiene", "CPR Resuscitation Masks and Equipment", 400, 1], ["pdk", "health-hygiene", "Face Masks", 300, 1],
  ["pdk", "health-hygiene", "First Aid Kit - bandages, antiseptics, dressings, gloves and other basic supplies", 2000, 1],
  ["pdk", "health-hygiene", "Hand Sanitizer and Disinfectant Wipes", 100, 1], ["pdk", "health-hygiene", "Hand Wash", 100, 1],
  ["pdk", "medical-monitoring", "Blood Pressure Monitors", 1000, 1], ["pdk", "medical-monitoring", "Glucose Monitors", 5000, 1],
  ["pdk", "medical-monitoring", "Stethoscopes", 500, 1], ["pdk", "medical-monitoring", "Thermometers", 100, 2],
  ["pdk", "cleaning", "Broom", 70, 15], ["pdk", "cleaning", "Dust Pans", 20, 5], ["pdk", "cleaning", "Buckets", 80, 15], ["pdk", "cleaning", "Mops", 100, 3],
  ["pdk", "cleaning", "Cleaner Brush", 60, 5], ["pdk", "cleaning", "Cleaning Solutions", 60, 4], ["pdk", "cleaning", "Detergent Soap", 40, 2],
  ["pdk", "cleaning", "Disinfectant Sprays and Wipes", 150, 3], ["pdk", "cleaning", "Dustbin Cover", 150, 5], ["pdk", "cleaning", "Gloves", 190, 50],
  ["pdk", "cleaning", "Mugs", 20, 10], ["pdk", "cleaning", "Room Spray", 200, 5], ["pdk", "cleaning", "Vacuum Cleaners", 3000, 1],
  ["pdk", "food-kitchen", "Fridge", 8000, 1], ["pdk", "food-kitchen", "Grinder", 4000, 1], ["pdk", "food-kitchen", "Groceries", 2000, 1], ["pdk", "food-kitchen", "Mixie", 3000, 1],
  ["pdk", "clothes-footwear", "Bedsheets", 500, 36],
];

const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const SAMPLE_NOTE = "This is sample content for demonstration. Replace it from the admin dashboard with the department's announcement.";
const NEWS = [
  ["sample-last-date-for-scheme-applications", "Sample: last date for scheme applications", "மாதிரி: திட்ட விண்ணப்பங்களுக்கான கடைசி தேதி", 2],
  ["sample-district-medical-camp-schedule", "Sample: district medical camp schedule", "மாதிரி: மாவட்ட மருத்துவ முகாம் அட்டவணை", 9],
  ["sample-state-award-nominations-open", "Sample: State Award nominations open", "மாதிரி: மாநில விருது பரிந்துரைகள் தொடக்கம்", 16],
];

const INSTITUTIONS = [
  ["Sample Special School", "special-school", "Chennai", "aided"],
  ["Sample Rehabilitation Home", "rehabilitation-home", "Madurai", "government"],
  ["Sample Day Care Centre", "day-care", "Coimbatore", "ngo"],
  ["Sample Early Intervention Centre", "early-intervention", "Tiruchirappalli", "ngo"],
];

async function seedIfEmpty() {
  if ((await Scheme.countDocuments()) === 0) {
    await Scheme.insertMany(SCHEMES.map(([slug, category, audiences, en, ta, sEn, sTa], i) => ({
      slug, category, audiences, order: i + 1, title: { en, ta }, summary: { en: sEn, ta: sTa },
    })));
    console.log("Seeded 12 schemes (eligibility and documents left for the department to fill in).");
  }

  const existing = new Set((await DistrictOffice.find().select("district")).map((d) => d.district));
  const missing = DISTRICTS.filter((d) => !existing.has(d));
  if (missing.length) {
    await DistrictOffice.insertMany(missing.map((d) => ({
      district: d, districtTa: DISTRICTS_TA[d] || "", officeName: `District Differently Abled Welfare Office, ${d}`,
    })));
    console.log(`Seeded ${missing.length} district offices (contact details empty until verified).`);
  }

  if ((await Document.countDocuments()) === 0) {
    await Document.insertMany([
      ...DOCUMENTS.map(([en, ta, kind, year], i) => ({ title: { en, ta }, kind, year, order: i + 1 })),
      { title: { en: "Government orders (G.O.s)", ta: "அரசாணைகள்" }, kind: "go", order: 10 },
    ]);
    console.log("Seeded Acts & policies list (upload the official PDFs from the admin dashboard).");
  }

  if ((await News.countDocuments()) === 0) {
    await News.insertMany(NEWS.map(([slug, en, ta, ago]) => ({
      slug, title: { en, ta }, summary: { en: SAMPLE_NOTE, ta: "இது மாதிரி உள்ளடக்கம். நிர்வாகப் பகுதியிலிருந்து மாற்றவும்." },
      body: { en: SAMPLE_NOTE, ta: "" }, date: daysAgo(ago), isSample: true,
    })));
    console.log("Seeded 3 sample announcements.");
  }

  if ((await Institution.countDocuments()) === 0) {
    await Institution.insertMany(INSTITUTIONS.map(([name, type, district, managedBy]) => ({ name: `${name}, ${district}`, type, district, managedBy, isSample: true })));
    console.log("Seeded 4 sample institutions.");
  }

  // Sample needs for the donation pages (clearly marked Sample; replace them in Admin → Needs).
  // Older sample needs from the first version used different categories: replace those once.
  const OLD_CATS = ["assistive-devices", "learning-materials", "therapy-equipment", "it-equipment", "infrastructure", "sports-recreation"];
  if (await Need.exists({ category: { $in: OLD_CATS }, isSample: true })) {
    await Need.deleteMany({ isSample: true });
    console.log("Removed the old sample needs (replaced below).");
  }
  if ((await Need.countDocuments()) === 0) {
    const inst = {};
    for (const [key, d] of Object.entries(SAMPLE_INSTITUTIONS)) {
      inst[key] = (await Institution.findOne({ name: d.name })) || (await Institution.create({ name: d.name, type: d.type, district: d.district, managedBy: d.managedBy, isSample: true }));
    }
    await Need.insertMany(SAMPLE_NEEDS.map(([key, category, sub, unitCost, qty]) => ({
      institution: inst[key]._id, district: inst[key].district, category, disability: SAMPLE_INSTITUTIONS[key].disability,
      title: { en: sub, ta: "" }, unitCost, quantityRequired: qty, quantityFunded: 0, isSample: true,
    })));
    console.log(`Seeded ${SAMPLE_NEEDS.length} sample needs for the donation pages.`);
  }

  // Official details published by the department (checked against scd.tn.gov.in and
  // its Contact Us page). Filled once, only into empty fields, so admin edits are never overwritten.
  const site = (await Setting.findOne({ key: "site" })) || new Setting({ key: "site" });
  if (!site.officialSeeded) {
    const fill = (k, v) => { if (!site[k]) site[k] = v; };
    fill("helpline", OFFICIAL.helpline);
    fill("officePhone", OFFICIAL.officePhone);
    fill("officeEmail", OFFICIAL.officeEmail);
    fill("officeAddress", OFFICIAL.officeAddress);
    site.stats = site.stats || {};
    Object.entries(OFFICIAL.stats).forEach(([k, v]) => { if (!site.stats[k]) site.stats[k] = v; });
    site.officialSeeded = true;
    await site.save();
    console.log("Filled official contact details and statistics from scd.tn.gov.in (editable in Site settings).");
  }

  if ((await Admin.countDocuments()) === 0) {
    if (!config.admin.email || !config.admin.password) {
      console.warn("No admin exists. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env and restart to create one.");
    } else {
      await Admin.create({ name: config.admin.name, email: config.admin.email, password: config.admin.password, role: "superadmin" });
      console.log(`Created Super Admin ${config.admin.email}. Change the password after first sign-in.`);
    }
  }
}

async function reset() {
  const Application = require("../models/Application");
  if (await Application.exists({})) throw new Error("Applications exist, so schemes can't be reset. Edit them in the admin dashboard instead.");
  await Promise.all([Scheme.deleteMany({}), News.deleteMany({ isSample: true }), Institution.deleteMany({ isSample: true })]);
}

module.exports = { seedIfEmpty, reset };