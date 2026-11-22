import AdminCrud from "./AdminCrud.jsx";
import { useSite } from "../../context/SiteContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const TYPES = [["special-school", "Special school"], ["rehabilitation-home", "Rehabilitation home"], ["day-care", "Day care centre"], ["early-intervention", "Early intervention centre"], ["training-centre", "Training centre"], ["ngo", "NGO"], ["other", "Other"]];
const MANAGED = [["government", "Government"], ["ngo", "NGO"], ["aided", "Aided"], ["other", "Other"]];

export default function InstitutionsAdmin() {
  const { meta } = useSite();
  const { admin } = useAuth();
  return (
    <AdminCrud
      title="Institutions" itemName="institution" endpoint="/admin/institutions" superOnly={false}
      intro="The public directory on the Institutions page. Delete the sample entries once real ones are added."
      search={(i) => `${i.name} ${i.district}`}
      columns={[
        { label: "Name", render: (i) => i.name },
        { label: "Type", render: (i) => TYPES.find(([v]) => v === i.type)?.[1] },
        { label: "District", render: (i) => i.district },
        { label: "Status", render: (i) => `${i.published ? "Published" : "Hidden"}${i.isSample ? " · Sample" : ""}` },
      ]}
      blank={() => ({ name: "", type: "special-school", district: admin.district || "", managedBy: "government", address: "", phone: "", published: true, isSample: false })}
      fields={[
        { name: "name", label: "Name", required: true, span: true },
        { name: "type", label: "Type", type: "select", options: TYPES, required: true, placeholder: false },
        ...(admin.role === "superadmin" ? [{ name: "district", label: "District", type: "select", options: (meta?.districts || []).map((d) => [d, d]), required: true }] : []),
        { name: "managedBy", label: "Run by", type: "select", options: MANAGED, placeholder: false },
        { name: "phone", label: "Phone" },
        { name: "address", label: "Address", type: "textarea", span: true },
        { name: "published", label: "Published", type: "checkbox" },
        { name: "isSample", label: "Sample content", type: "checkbox" },
      ]}
    />
  );
}
