import { BaseGeoMapLayerConfig } from "../types";
import { GlyphConfig } from "./shared/glyphs";

export interface GriddedGlyphsLayerConfig extends BaseGeoMapLayerConfig {
  geoMapLayerType: "griddedGlyphs";

  glyph: GlyphConfig;

  dataAggregateDistance: number;
  showDataPoints: boolean;

  gridPixelSize: number;
  smooth: boolean;
}
