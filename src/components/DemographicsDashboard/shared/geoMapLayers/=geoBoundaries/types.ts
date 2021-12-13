import { BaseGeoMapLayerConfig } from "../types";
import * as turf from "@turf/turf";

export type GeoBoundary = turf.Feature<
  turf.Polygon | turf.MultiPolygon,
  {
    name: string; // e.g. "Dumfries and Galloway"
    code: string; // e.g. "S30000016"
    eurocode: string; // e.g. "UKM3200"
    label: string; // e.g. "UKM3200"
  }
>;

export type RenderMethod = "canvas" | "svg";

export interface GeoBoundariesLayerConfig extends BaseGeoMapLayerConfig {
  geoMapLayerType: "geoBoundaries";
  renderMethod: RenderMethod;
  outlineColor: string;
  simplificationTolerance: number;
}

export type GeoBoundariesViewRenderer = React.VoidFunctionComponent<{
  geoBoundaries: GeoBoundary[];
  width: number;
  height: number;
  outlineColor: string;
  geoToScreenX: (geoX: number) => number;
  geoToScreenY: (geoY: number) => number;
}>;
