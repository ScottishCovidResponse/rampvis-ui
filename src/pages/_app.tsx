import React, { ReactElement, ReactNode, StrictMode } from "react";
import type { AppProps, AppContext } from "next/app";
import Head from "next/head";
import type { NextPage } from "next";
import App from "next/app";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@material-ui/core";
import { Toaster } from "react-hot-toast";
import { LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

import useSettings from "src/hooks/useSettings";
import { createCustomTheme } from "src/theme";
import useScrollReset from "src/hooks/useScrollReset";
import useAuth from "src/hooks/useAuth";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "src/contexts/SettingsContext";
import { AuthProviderJWT } from "src/contexts/AuthProviderJWT";

//
// Import all the css files created for d3 charts
// TODO: These are imported globally. @Phong to advice how to scope them.
//
import "src/lib/vis/css/common.css";
import "src/lib/vis/css/dashboard.css";
import "src/lib/vis/css/default-dashboard.css";
import "src/lib/vis/css/overview-top-level-screen-a.css";
import "src/lib/vis/css/portal.css";
import "src/lib/vis/css/pv-legend.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { settings } = useSettings();
  const auth = useAuth();

  useScrollReset();

  const theme = createCustomTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  const getLayout =
    Component.getLayout ??
    ((page) => {
      console.log("App:getLayout: page = ", page);
      return page;
    });

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>RAMPVIS</title>
      </Head>
      <StrictMode>
        <HelmetProvider>
          <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <AuthProviderJWT>
                  <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Toaster position="top-center" />
                    {getLayout(<Component {...pageProps} />)}
                  </ThemeProvider>
                </AuthProviderJWT>
              </SettingsProvider>
            </LocalizationProvider>
          </StyledEngineProvider>
        </HelmetProvider>
      </StrictMode>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
