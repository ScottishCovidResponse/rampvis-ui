import {
  geoBoundariesLayerBlueprint,
  GeoBoundariesLayerConfig,
} from "./=geoBoundaries";
import {
  griddedGlyphsLayerBlueprint,
  GriddedGlyphsLayerConfig,
} from "./=griddedGlyphs";
import { GeoMapLayerBlueprint } from "./types";

export type GeoMapLayerConfig =
  | GeoBoundariesLayerConfig
  | GriddedGlyphsLayerConfig;

export type GeoMapLayerType = GeoMapLayerConfig["geoMapLayerType"];

export const geoMapLayerBlueprintLookup = {
  geoBoundaries: geoBoundariesLayerBlueprint,
  griddedGlyphs: griddedGlyphsLayerBlueprint,
};

export const getGeoMapLayerBlueprint = (geoMapLayerType: GeoMapLayerType) => {
  return geoMapLayerBlueprintLookup[
    geoMapLayerType
  ] as GeoMapLayerBlueprint<GeoMapLayerConfig>;
};
