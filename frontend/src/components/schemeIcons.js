import {
  IdCard, ScanSearch, HeartHandshake, Presentation, Home, Users, BookOpen, Coins,
  Accessibility, Ear, ShieldCheck, Trophy, FileText,
} from "lucide-react";

// Icon for each seeded scheme (by slug); new schemes get the default icon.
const MAP = {
  "identification-scheme": IdCard,
  "early-identification": ScanSearch,
  "early-intervention-centres": HeartHandshake,
  "state-resource-cum-training-centre": Presentation,
  "rehabilitation-homes": Home,
  "day-care-centres": Users,
  "special-education": BookOpen,
  "economic-development": Coins,
  "assistive-devices": Accessibility,
  "special-assistive-devices": Ear,
  "social-security-schemes": ShieldCheck,
  "state-award": Trophy,
};

export const schemeIcon = (slug) => MAP[slug] || FileText;