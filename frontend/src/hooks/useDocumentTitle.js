import { useEffect } from "react";

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Commissionerate for Welfare of the Differently Abled` : "Commissionerate for Welfare of the Differently Abled | Government of Tamil Nadu";
  }, [title]);
}