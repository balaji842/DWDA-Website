import { AlertCircle } from "lucide-react";
import { cloneElement, isValidElement } from "react";

// Wires label, hint and error to the control with the right ARIA attributes.
export default function FormField({ id, label, required, hint, error, children, className = "" }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement(children)
    ? cloneElement(children, { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": required || undefined })
    : children;
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}{required && <span className="req" aria-hidden="true">*</span>}</label>
      {hint && <span id={hintId} className="hint">{hint}</span>}
      {control}
      {error && <span id={errId} className="field-error"><AlertCircle aria-hidden="true" />{error}</span>}
    </div>
  );
}
