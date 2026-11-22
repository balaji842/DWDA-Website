import AdminCrud from "./AdminCrud.jsx";

export default function DistrictsAdmin() {
  return (
    <AdminCrud
      title="District offices" itemName="office" endpoint="/admin/districts" canCreate={false} canDelete={false} superOnly={false}
      intro="Enter each office's verified contact details. Empty fields show “Not yet added” to the public. The map link only shows when “Verified” is ticked. District admins can edit their own office."
      search={(o) => `${o.district} ${o.districtTa}`}
      columns={[
        { label: "District", render: (o) => o.district },
        { label: "Phone", render: (o) => o.phone || "—" },
        { label: "Email", render: (o) => o.email || "—" },
        { label: "Verified", render: (o) => (o.verified ? "Yes" : "No") },
      ]}
      blank={() => ({})}
      fields={[
        { name: "districtTa", label: "District name in Tamil" },
        { name: "officeName", label: "Office name", span: true },
        { name: "address", label: "Address", type: "textarea", span: true },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email", type: "email" },
        { name: "hours", label: "Working hours", hint: "e.g. Monday to Friday, 10 am to 5:45 pm", span: true },
        { name: "mapUrl", label: "Map link", hint: "Full https:// link to the office on a map", span: true },
        { name: "verified", label: "Verified", type: "checkbox", hint: "these details have been confirmed" },
      ]}
    />
  );
}
