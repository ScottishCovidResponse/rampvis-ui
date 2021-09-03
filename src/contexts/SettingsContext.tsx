import { createContext, useEffect, useState } from "react";
import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { THEMES } from "../constants";

interface Settings {
  compact?: boolean;
  direction?: "ltr" | "rtl";
  responsiveFontSizes?: boolean;
  roundedCorners?: boolean;
  theme?: string;
}

export interface SettingsContextValue {
  settings: Settings;
  saveSettings: (update: Settings) => void;
}

interface SettingsProviderProps {
  children?: ReactNode;
}

const initialSettings: Settings = {
  compact: true,
  direction: "ltr",
  responsiveFontSizes: true,
  roundedCorners: true,
  theme: THEMES.LIGHT,
};

export const restoreSettings = (): Settings | null => {
  let settings = null;

  try {
    const storedData: string | null = window.localStorage.getItem("settings");

    if (storedData) {
      settings = JSON.parse(storedData);
    } else {
      settings = {
        compact: true,
        direction: "ltr",
        responsiveFontSizes: true,
        roundedCorners: true,
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches
          ? THEMES.DARK
          : THEMES.LIGHT,
      };
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return settings;
};

export const storeSettings = (settings: Settings): void => {
  window.localStorage.setItem("settings", JSON.stringify(settings));
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: initialSettings,
  saveSettings: () => {},
});

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const { children } = props;
  const [settings, setSettings] = useState<Settings>(initialSettings);

  useEffect(() => {
    const restoredSettings = restoreSettings();

    if (restoredSettings) {
      setSettings(restoredSettings);
    }
  }, []);

  const saveSettings = (updatedSettings: Settings): void => {
    setSettings(updatedSettings);
    storeSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
