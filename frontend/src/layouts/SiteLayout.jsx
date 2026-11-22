import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import RouteEffects from "../components/RouteEffects.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function SiteLayout() {
  const { t } = useLang();
  const { pathname } = useLocation();
  return (
    <>
      <a className="skip-link" href="#main">{t("common.skip")}</a>
      <TopBar />
      <SiteHeader />
      <RouteEffects />
      <main id="main" tabIndex={-1} key={pathname} className="page-fade">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}