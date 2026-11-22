import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Video } from "lucide-react";
import { useLang, useStrings } from "../context/LanguageContext.jsx";
import { useSite } from "../context/SiteContext.jsx";
import PageHero from "../components/PageHero.jsx";
import DistrictFinder from "../components/DistrictFinder.jsx";
import { Notice } from "../components/States.jsx";

const S = {
  en: { title: "Contact us", lead: "Call the helpline, write to the head office, or visit your district office.", helpline: "Helpline", head: "Head office", email: "Email", phone: "Phone", address: "Address", notSet: "The department will publish its official contact details here. Until then, please visit your district office.", offices: "All district offices", rti: "Right to information requests", rtiLink: "RTI details" },
  ta: { title: "தொடர்பு கொள்ள", lead: "உதவி எண்ணை அழையுங்கள், தலைமை அலுவலகத்திற்கு எழுதுங்கள், அல்லது மாவட்ட அலுவலகத்திற்குச் செல்லுங்கள்.", helpline: "உதவி எண்", head: "தலைமை அலுவலகம்", email: "மின்னஞ்சல்", phone: "தொலைபேசி", address: "முகவரி", notSet: "துறையின் அதிகாரப்பூர்வத் தொடர்பு விவரங்கள் இங்கு வெளியிடப்படும். அதுவரை மாவட்ட அலுவலகத்தை அணுகவும்.", offices: "அனைத்து மாவட்ட அலுவலகங்கள்", rti: "தகவல் அறியும் உரிமைக் கோரிக்கைகள்", rtiLink: "RTI விவரங்கள்" },
};

export default function Contact() {
  const { t } = useLang();
  const s = useStrings(S);
  const { settings } = useSite();
  const st = settings || {};
  const tel = (n) => `tel:${n.replace(/[^\d+]/g, "")}`;
  const missing = !st.helpline && !st.officeEmail && !st.officePhone && !st.officeAddress;
  const val = (v, node) => (v ? node : <span className="not-set">{t("common.notAdded")}</span>);
  return (
    <>
      <PageHero title={s.title} lead={s.lead} />
      <section className="section">
        <div className="container">
          {missing && settings && <div style={{ marginBottom: 20 }}><Notice kind="warn">{s.notSet}</Notice></div>}
          <div className="grid-3">
            <div className="card card-pad"><Phone aria-hidden="true" style={{ color: "var(--green-700)" }} /><h2 style={{ fontSize: "1.05rem", margin: "10px 0 6px" }}>{s.helpline}</h2>
              <p>{val(st.helpline, <a href={tel(st.helpline || "")} style={{ fontSize: "1.25rem", fontWeight: 600 }}>{st.helpline}</a>)}</p>
              {st.whatsapp && <p style={{ marginTop: 10 }}><MessageCircle aria-hidden="true" style={{ width: 16, height: 16, verticalAlign: "-3px" }} /> WhatsApp: <a href={`https://wa.me/91${st.whatsapp.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer">{st.whatsapp}</a></p>}
              {st.videoCall && <p style={{ marginTop: 6 }}><Video aria-hidden="true" style={{ width: 16, height: 16, verticalAlign: "-3px" }} /> {t("contact.video")}: {st.videoCall}</p>}</div>
            <div className="card card-pad"><MapPin aria-hidden="true" style={{ color: "var(--green-700)" }} /><h2 style={{ fontSize: "1.05rem", margin: "10px 0 6px" }}>{s.head}</h2>
              <dl className="dl-grid" style={{ gridTemplateColumns: "80px minmax(0,1fr)" }}>
                <dt>{s.address}</dt><dd style={{ whiteSpace: "pre-line" }}>{val(st.officeAddress, st.officeAddress)}</dd>
                <dt>{s.phone}</dt><dd>{val(st.officePhone, <a href={tel(st.officePhone || "")}>{st.officePhone}</a>)}</dd>
              </dl></div>
            <div className="card card-pad"><Mail aria-hidden="true" style={{ color: "var(--green-700)" }} /><h2 style={{ fontSize: "1.05rem", margin: "10px 0 6px" }}>{s.email}</h2>
              <p>{val(st.officeEmail, <a href={`mailto:${st.officeEmail}`}>{st.officeEmail}</a>)}</p>
              <p style={{ marginTop: 14 }} className="muted">{s.rti}: <Link to="/rti">{s.rtiLink}</Link></p></div>
          </div>
          <p style={{ marginTop: 20 }}><Link className="link-arrow" to="/district-offices">{s.offices}</Link></p>
        </div>
      </section>
      <DistrictFinder />
    </>
  );
}