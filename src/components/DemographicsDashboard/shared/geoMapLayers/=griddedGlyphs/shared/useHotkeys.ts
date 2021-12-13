import * as React from "react";
import tinykeys, { KeyBindingMap } from "tinykeys";

export const useHotkeys = (keyBindingMap: KeyBindingMap): void => {
  React.useEffect(() => {
    const unsubscribe = tinykeys(window, keyBindingMap);
    return () => {
      unsubscribe();
    };
  }, [keyBindingMap]);
};
