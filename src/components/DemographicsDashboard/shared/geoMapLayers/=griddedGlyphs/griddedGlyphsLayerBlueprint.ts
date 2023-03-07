import { GeoMapLayerBlueprint } from "../types";
import GriddedGlyphsLayerPanel from "./GriddedGlyphsLayerPanel";
import GriddedGlyphsLayerView from "./GriddedGlyphsLayerView";
import { glyphBlueprintLookup } from "./shared/glyphs";
import { gridBlueprintLookup } from "./shared/grid/blueprints";
import { GriddedGlyphsLayerConfig } from "./types";

export const griddedGlyphsLayerBlueprint: GeoMapLayerBlueprint<GriddedGlyphsLayerConfig> =
  {
    generateDefaultConfig: () => ({
      geoMapLayerType: "griddedGlyphs",

      dataAggregateDistance: 2000,
      glyph: glyphBlueprintLookup.heatmap.generateDefaultConfig(),
      grid: gridBlueprintLookup.square.generateDefaultConfig(),
      showDataPoints: false,
      showGridOutline: false,
      smooth: false,
      visible: true,
    }),
    Panel: GriddedGlyphsLayerPanel,
    View: GriddedGlyphsLayerView,
  };
