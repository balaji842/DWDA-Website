import AdminCrud from "./AdminCrud.jsx";

const CATS = [["identity", "Identity"], ["children", "Children"], ["education", "Education"], ["employment", "Employment"], ["devices", "Devices"], ["care", "Care"], ["social-security", "Social security"], ["awards", "Awards"]];
const bi = (name, label, type = "text", required) => [
  { name: `${name}.en`, label: `${label} (English)`, type, required, span: type === "textarea" },
  { name: `${name}.ta`, label: `${label} (Tamil)`, type, span: type === "textarea" },
];

export default function SchemesAdmin() {
  return (
    <AdminCrud
      title="Schemes" itemName="scheme" endpoint="/admin/schemes" canDelete
      intro="Official scheme content. Eligibility, benefits and documents stay hidden from the public (they see “not yet published”) until you fill them in. Tick “Verified” once the department has approved the text."
      search={(s) => `${s.title.en} ${s.title.ta} ${s.category}`}
      columns={[
        { label: "Scheme", render: (s) => s.title.en },
        { label: "Category", render: (s) => CATS.find(([v]) => v === s.category)?.[1] },
        { label: "Verified", render: (s) => (s.verified ? "Yes" : "No") },
        { label: "Online", render: (s) => (s.acceptsOnline ? "Yes" : "No") },
        { label: "Shown", render: (s) => (s.active ? "Yes" : "Hidden") },
      ]}
      blank={() => ({ slug: "", category: "", audiences: [], title: { en: "", ta: "" }, summary: { en: "", ta: "" }, verified: false, acceptsOnline: true, active: true, order: 99 })}
      fields={[
        { name: "slug", label: "Web address name", hint: "Lower case and hyphens, e.g. assistive-devices", required: true },
        { name: "category", label: "Category", type: "select", options: CATS, required: true },
        { name: "audiences", label: "Shown under “Start here” for", type: "multi", options: [["person", "Differently abled persons"], ["parent", "Parents and caregivers"], ["institution", "Institutions and NGOs"]] },
        ...bi("title", "Title", "text", true), ...bi("summary", "One-line summary", "textarea"),
        ...bi("description", "About this scheme", "textarea"), ...bi("eligibility", "Who can apply", "textarea"),
        ...bi("benefits", "What you get", "textarea"), ...bi("documentsRequired", "Documents needed", "textarea"), ...bi("howToApply", "How to apply", "textarea"),
        { name: "order", label: "Display order", type: "number" },
        { name: "verified", label: "Verified", type: "checkbox", hint: "the department has approved this content" },
        { name: "acceptsOnline", label: "Accepts online applications", type: "checkbox" },
        { name: "active", label: "Show on the website", type: "checkbox" },
      ]}
    />
  );
}
