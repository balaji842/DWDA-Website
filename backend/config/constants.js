// Shared lists. Official details (addresses, phones, eligibility) are NOT here:
// they are entered by the department through the admin dashboard.

const DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanniyakumari", "Karur",
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar",
];

const CATEGORIES = ["identity", "children", "education", "employment", "devices", "care", "social-security", "awards"];

const STATUSES = ["submitted", "under-verification", "documents-required", "approved", "rejected", "completed"];

// Which status may follow which. Keeps the timeline sensible.
const STATUS_FLOW = {
  submitted: ["under-verification", "documents-required", "rejected"],
  "under-verification": ["documents-required", "approved", "rejected"],
  "documents-required": ["under-verification", "rejected"],
  approved: ["completed"],
  rejected: [],
  completed: [],
};

// Disability categories named in the RPwD Act, 2016 schedule.
const DISABILITY_CATEGORIES = [
  "Locomotor disability", "Leprosy cured person", "Cerebral palsy", "Dwarfism",
  "Muscular dystrophy", "Acid attack victim", "Blindness", "Low vision",
  "Deaf", "Hard of hearing", "Speech and language disability", "Intellectual disability",
  "Specific learning disabilities", "Autism spectrum disorder", "Mental illness",
  "Chronic neurological conditions", "Multiple sclerosis", "Parkinson's disease",
  "Haemophilia", "Thalassemia", "Sickle cell disease", "Multiple disabilities including deaf-blindness",
];

const ROLES = ["superadmin", "district"];

module.exports = { DISTRICTS, CATEGORIES, STATUSES, STATUS_FLOW, DISABILITY_CATEGORIES, ROLES };
