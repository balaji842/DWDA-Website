import { useLang } from "../context/LanguageContext.jsx";

export const CATS = ["all", "identity", "children", "education", "employment", "devices", "care", "social-security", "awards"];

// Toggle buttons (aria-pressed) — simple for keyboard and screen reader users.
export default function CategoryFilter({ value, onChange }) {
  const { t } = useLang();
  return (
    <ul className="filter-row" aria-label={t("schemes.filterLabel")}>
      {CATS.map((c) => (
        <li key={c}>
          <button type="button" className={`pill${value === c ? " is-active" : ""}`} aria-pressed={value === c} onClick={() => onChange(c)}>
            {t(`cat.${c}`)}
          </button>
        </li>
      ))}
    </ul>
  );
}
