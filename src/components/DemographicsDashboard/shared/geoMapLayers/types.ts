import * as React from "react";

export interface BaseGeoMapLayerConfig {
  geoMapLayerType: string;
  visible: boolean;
  [rest: string]: unknown;
}

export type GeoMapLayerView<LayerConfig extends BaseGeoMapLayerConfig> =
  React.VoidFunctionComponent<{
    layerConfig: LayerConfig;
    onLayerConfigChange?: (config: LayerConfig) => void;

    width: number;
    height: number;

    geoToScreenX: (geoX: number) => number;
    geoToScreenY: (geoY: number) => number;
  }>;

export type GeoMapLayerPanel<LayerConfig extends BaseGeoMapLayerConfig> =
  React.VoidFunctionComponent<{
    layerConfig: LayerConfig;
    onLayerConfigChange?: (config: LayerConfig) => void;
  }>;

export interface GeoMapLayerBlueprint<
  LayerConfig extends BaseGeoMapLayerConfig,
> {
  generateDefaultConfig: () => LayerConfig;
  Panel: GeoMapLayerPanel<LayerConfig>;
  View: GeoMapLayerView<LayerConfig>;
}
