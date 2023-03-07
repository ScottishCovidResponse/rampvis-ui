import { BaseGeoMapLayerConfig } from "../types";
import { GlyphConfig } from "./shared/glyphs";
import { GridConfig } from "./shared/grid/blueprints";

export interface GriddedGlyphsLayerConfig extends BaseGeoMapLayerConfig {
  geoMapLayerType: "griddedGlyphs";

  dataAggregateDistance: number;
  glyph: GlyphConfig;
  grid: GridConfig;
  showDataPoints: boolean;
  showGridOutline: boolean;
  smooth: boolean;
}
