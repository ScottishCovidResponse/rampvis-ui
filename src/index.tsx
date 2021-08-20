import "react-perfect-scrollbar/dist/css/styles.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-quill/dist/quill.snow.css";
import "nprogress/nprogress.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import StyledEngineProvider from "@material-ui/core/StyledEngineProvider";
import App from "./App";
import { AuthProvider } from "./contexts/JWTContext";
import { SettingsProvider } from "./contexts/SettingsContext";

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SettingsProvider>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </SettingsProvider>
        </LocalizationProvider>
      </StyledEngineProvider>
    </HelmetProvider>
  </StrictMode>,
  document.getElementById("root")
);
