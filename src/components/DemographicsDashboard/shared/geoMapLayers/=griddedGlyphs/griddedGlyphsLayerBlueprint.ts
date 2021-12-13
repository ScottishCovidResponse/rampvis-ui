import { GeoMapLayerBlueprint } from "../types";
import GriddedGlyphsLayerPanel from "./GriddedGlyphsLayerPanel";
import GriddedGlyphsLayerView from "./GriddedGlyphsLayerView";
import { glyphBlueprintLookup } from "./shared/glyphs";
import { GriddedGlyphsLayerConfig } from "./types";

export const griddedGlyphsLayerBlueprint: GeoMapLayerBlueprint<GriddedGlyphsLayerConfig> =
  {
    generateDefaultConfig: () => ({
      geoMapLayerType: "griddedGlyphs",
      visible: true,
      dataAggregateDistance: 2000,
      gridPixelSize: 40,
      showDataPoints: false,
      smooth: false,
      glyph: glyphBlueprintLookup.heatmap.generateDefaultConfig(),
    }),
    Panel: GriddedGlyphsLayerPanel,
    View: GriddedGlyphsLayerView,
  };
