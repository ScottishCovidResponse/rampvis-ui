import { useContext } from 'react';
import SettingsContext from '../contexts/SettingsContext';
import type { SettingsContextValue } from '../contexts/SettingsContext';

const useSettings = (): SettingsContextValue => useContext(SettingsContext);

export default useSettings;
