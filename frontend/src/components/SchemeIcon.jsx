import { useState } from "react";
import { schemeIcon } from "./schemeIcons.js";

// Illustrated icon for a scheme tile: /images/schemes/<slug>.webp.
// If the file is missing (e.g. a scheme added later in the admin), the simple line icon is used instead.
export default function SchemeIcon({ slug }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    const Icon = schemeIcon(slug);
    return <span className="ico"><Icon aria-hidden="true" /></span>;
  }
  return <img className="ico-img" src={`/images/schemes/${slug}.webp`} alt="" width="210" height="147" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}