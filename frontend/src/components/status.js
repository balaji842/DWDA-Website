// Application statuses, in order, with English and Tamil labels.
export const STATUS_ORDER = ["submitted", "under-verification", "documents-required", "approved", "rejected", "completed"];

export const STATUS_LABEL = {
  en: {
    submitted: "Submitted", "under-verification": "Under verification", "documents-required": "Documents required",
    approved: "Approved", rejected: "Rejected", completed: "Completed",
  },
  ta: {
    submitted: "சமர்ப்பிக்கப்பட்டது", "under-verification": "சரிபார்ப்பில் உள்ளது", "documents-required": "ஆவணங்கள் தேவை",
    approved: "ஒப்புதல் அளிக்கப்பட்டது", rejected: "நிராகரிக்கப்பட்டது", completed: "நிறைவடைந்தது",
  },
};

// The usual path an application takes; used for the progress bar.
export const HAPPY_PATH = ["submitted", "under-verification", "approved", "completed"];
