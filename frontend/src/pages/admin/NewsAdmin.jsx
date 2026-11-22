import AdminCrud from "./AdminCrud.jsx";
import { fmtDate } from "../../hooks/format.js";

export default function NewsAdmin() {
  return (
    <AdminCrud
      title="News & announcements" itemName="announcement" endpoint="/admin/news"
      intro="Published announcements appear on the home page (latest three) and the News page. Untick “Sample” once an item is real."
      search={(n) => `${n.title.en} ${n.title.ta}`}
      columns={[
        { label: "Title", render: (n) => n.title.en },
        { label: "Date", render: (n) => fmtDate(n.date) },
        { label: "Status", render: (n) => `${n.published ? "Published" : "Draft"}${n.isSample ? " · Sample" : ""}` },
      ]}
      blank={() => ({ title: { en: "", ta: "" }, summary: { en: "", ta: "" }, body: { en: "", ta: "" }, date: new Date().toISOString().slice(0, 10), published: true, isSample: false })}
      fields={[
        { name: "title.en", label: "Title (English)", required: true, span: true },
        { name: "title.ta", label: "Title (Tamil)", span: true },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "summary.en", label: "Short description (English)", type: "textarea", span: true },
        { name: "summary.ta", label: "Short description (Tamil)", type: "textarea", span: true },
        { name: "body.en", label: "Full text (English)", type: "textarea", span: true },
        { name: "body.ta", label: "Full text (Tamil)", type: "textarea", span: true },
        { name: "published", label: "Published", type: "checkbox" },
        { name: "isSample", label: "Sample content", type: "checkbox", hint: "shown with a “Sample” label" },
      ]}
    />
  );
}
