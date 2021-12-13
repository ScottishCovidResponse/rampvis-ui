import { GeoMapLayerConfig } from "./shared/geoMapLayers";

export type GeoExtent = [
  x: [min: number, max: number],
  y: [min: number, max: number],
];

export interface GeoMapConfig {
  layers: GeoMapLayerConfig[];
}
