import { GeoMapLayerBlueprint } from "../types";
import GeoBoundariesLayerPanel from "./GeoBoundariesLayerPanel";
import GeoBoundariesLayerView from "./GeoBoundariesLayerView";
import { GeoBoundariesLayerConfig } from "./types";

export const geoBoundariesLayerBlueprint: GeoMapLayerBlueprint<GeoBoundariesLayerConfig> =
  {
    generateDefaultConfig: () => ({
      geoMapLayerType: "geoBoundaries",
      visible: true,
      renderMethod: "canvas",
      outlineColor: "#ccc",
      simplificationTolerance: 100,
    }),
    Panel: GeoBoundariesLayerPanel,
    View: GeoBoundariesLayerView,
  };
