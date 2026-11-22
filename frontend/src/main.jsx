import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { AccessibilityProvider } from "./context/AccessibilityContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { SiteProvider } from "./context/SiteContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AccessibilityProvider>
          <ToastProvider>
            <SiteProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </SiteProvider>
          </ToastProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
