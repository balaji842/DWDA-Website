import AdminCrud from "./AdminCrud.jsx";
import useApi from "../../hooks/useApi.js";
import { useSite } from "../../context/SiteContext.jsx";
import { money, CATS } from "../donate/strings.js";

export default function NeedsAdmin() {
  const inst = useApi("/admin/institutions");
  const { meta } = useSite();
  const cats = Object.entries(CATS.en);
  return (
    <AdminCrud
      title="Needs (for donations)" itemName="need" endpoint="/admin/needs" superOnly={false}
      intro="Items institutions need, shown on Donate → Donate to a specific need. A need closes automatically when fully funded. Delete the sample needs once real ones are added."
      search={(n) => `${n.title.en} ${n.institution?.name} ${n.district}`}
      columns={[
        { label: "SubCategory", render: (n) => n.title.en },
        { label: "Category", render: (n) => CATS.en[n.category] || n.category },
        { label: "Institution", render: (n) => n.institution?.name || "—" },
        { label: "Funded", render: (n) => `${n.quantityFunded} / ${n.quantityRequired}` },
        { label: "Unit cost", render: (n) => money(n.unitCost) },
        { label: "Status", render: (n) => `${n.status}${n.isSample ? " · Sample" : ""}` },
      ]}
      blank={() => ({ institution: "", category: "civil-infrastructure", disability: "", title: { en: "", ta: "" }, description: { en: "", ta: "" }, unitCost: "", quantityRequired: 1, quantityFunded: 0, status: "open", isSample: false })}
      fields={[
        { name: "institution", label: "Institution", type: "select", options: (inst.data?.items || []).map((i) => [i._id, `${i.name} (${i.district})`]), required: true, span: true },
        { name: "category", label: "Category", type: "select", options: cats, placeholder: false },
        { name: "status", label: "Status", type: "select", options: [["open", "Open"], ["funded", "Funded"], ["closed", "Closed"]], placeholder: false },
        { name: "disability", label: "Disability served", type: "select", options: (meta?.disabilityCategories || []).map((d) => [d, d]) },
        { name: "title.en", label: "SubCategory — what is needed (English)", required: true, span: true },
        { name: "title.ta", label: "SubCategory (Tamil)", span: true },
        { name: "description.en", label: "Details (English)", type: "textarea", span: true },
        { name: "description.ta", label: "Details (Tamil)", type: "textarea", span: true },
        { name: "unitCost", label: "Cost per unit (₹)", type: "number", required: true },
        { name: "quantityRequired", label: "Quantity needed", type: "number", required: true },
        { name: "quantityFunded", label: "Quantity already funded or pledged", type: "number" },
        { name: "isSample", label: "Sample content", type: "checkbox" },
      ]}
    />
  );
}