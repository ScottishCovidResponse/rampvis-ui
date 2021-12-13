import { Switch } from "@mui/material";
import * as React from "react";
import { BaseGeoMapLayerConfig } from "../types";

const GeoMapLayerPanelEssentials = <
  GeoMapLayerConfig extends BaseGeoMapLayerConfig,
>({
  header,
  layerConfig,
  onLayerConfigChange,
  children,
}: {
  header: string;
  layerConfig: GeoMapLayerConfig;
  onLayerConfigChange?: (newValue: GeoMapLayerConfig) => void;
  children?: React.ReactNode;
}) => {
  const handleSwitchChange = (event: unknown, checked: boolean) => {
    onLayerConfigChange?.({
      ...layerConfig,
      visible: checked,
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <h3>{header}</h3>
      <Switch
        checked={layerConfig.visible}
        onChange={handleSwitchChange}
        sx={{ position: "absolute", top: -10, right: -10 }}
      />
      {children}
    </div>
  );
};

export default GeoMapLayerPanelEssentials;
