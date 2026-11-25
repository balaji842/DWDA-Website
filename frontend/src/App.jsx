import { Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import Schemes from "./pages/Schemes.jsx";
import SchemeDetail from "./pages/SchemeDetail.jsx";
import Disabilities from "./pages/Disabilities.jsx";
import DisabilityDetail from "./pages/DisabilityDetail.jsx";
import Apply from "./pages/Apply.jsx";
import Track from "./pages/Track.jsx";
import IdCard from "./pages/IdCard.jsx";
import Institutions from "./pages/Institutions.jsx";
import DistrictOffices from "./pages/DistrictOffices.jsx";
import ActsPolicies from "./pages/ActsPolicies.jsx";
import News from "./pages/News.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import Contact from "./pages/Contact.jsx";
import Accessibility from "./pages/Accessibility.jsx";
import { About, Rti, ScreenReader, Sitemap } from "./pages/InfoPages.jsx";
import NotFound from "./pages/NotFound.jsx";
import DonateHome from "./pages/donate/DonateHome.jsx";
import QuickDonate from "./pages/donate/QuickDonate.jsx";
import NeedsDonate from "./pages/donate/NeedsDonate.jsx";
import InstitutionsDonate from "./pages/donate/InstitutionsDonate.jsx";
import DonateTerms from "./pages/donate/DonateTerms.jsx";
import Pay from "./pages/donate/Pay.jsx";
import Receipt from "./pages/donate/Receipt.jsx";
import DonationsAdmin from "./pages/admin/DonationsAdmin.jsx";
import NeedsAdmin from "./pages/admin/NeedsAdmin.jsx";
import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Applications from "./pages/admin/Applications.jsx";
import ApplicationDetail from "./pages/admin/ApplicationDetail.jsx";
import SchemesAdmin from "./pages/admin/SchemesAdmin.jsx";
import NewsAdmin from "./pages/admin/NewsAdmin.jsx";
import DistrictsAdmin from "./pages/admin/DistrictsAdmin.jsx";
import DocumentsAdmin from "./pages/admin/DocumentsAdmin.jsx";
import InstitutionsAdmin from "./pages/admin/InstitutionsAdmin.jsx";
import SettingsAdmin from "./pages/admin/SettingsAdmin.jsx";
import UsersAdmin from "./pages/admin/UsersAdmin.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="schemes" element={<Schemes />} />
        <Route path="schemes/:slug" element={<SchemeDetail />} />
        <Route path="disabilities" element={<Disabilities />} />
        <Route path="disabilities/:slug" element={<DisabilityDetail />} />
        <Route path="apply" element={<Apply />} />
        <Route path="track" element={<Track />} />
        <Route path="id-card" element={<IdCard />} />
        <Route path="institutions" element={<Institutions />} />
        <Route path="district-offices" element={<DistrictOffices />} />
        <Route path="acts-policies" element={<ActsPolicies />} />
        <Route path="news" element={<News />} />
        <Route path="news/:slug" element={<NewsDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="donate" element={<DonateHome />} />
        <Route path="donate/quick" element={<QuickDonate />} />
        <Route path="donate/needs" element={<NeedsDonate />} />
        <Route path="donate/institutions" element={<InstitutionsDonate />} />
        <Route path="donate/institutions/:id" element={<InstitutionsDonate />} />
        <Route path="donate/terms" element={<DonateTerms />} />
        <Route path="donate/pay/:id" element={<Pay />} />
        <Route path="donate/receipt/:id" element={<Receipt />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="about" element={<About />} />
        <Route path="rti" element={<Rti />} />
        <Route path="screen-reader-access" element={<ScreenReader />} />
        <Route path="sitemap" element={<Sitemap />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin/login" element={<Login />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/:id" element={<ApplicationDetail />} />
        <Route path="schemes" element={<SchemesAdmin />} />
        <Route path="news" element={<NewsAdmin />} />
        <Route path="districts" element={<DistrictsAdmin />} />
        <Route path="documents" element={<DocumentsAdmin />} />
        <Route path="institutions" element={<InstitutionsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="donations" element={<DonationsAdmin />} />
        <Route path="needs" element={<NeedsAdmin />} />
      </Route>
    </Routes>
  );
}