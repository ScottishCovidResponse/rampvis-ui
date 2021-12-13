import { GlyphMapRecord } from "../../../../../../../shared/glyphMapRecords";

export interface BaseGlyphConfig {
  glyphType: string;
  [rest: string]: unknown;
}

export type DrawGlyph<
  GlyphDataset,
  GlyphConfig extends BaseGlyphConfig,
> = (payload: {
  glyphDataset: GlyphDataset;
  glyphConfig: GlyphConfig;
  canvasContext: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  pixelRatio: number;
}) => void;

export type GlyphPanel<GlyphConfig extends BaseGlyphConfig> =
  React.VoidFunctionComponent<{
    disabled?: boolean;
    glyphConfig: GlyphConfig;
    onGlyphConfigChange?: (config: GlyphConfig) => void;
  }>;

export type AggregateGlyphDatasets<GlyphDataset> = (
  inputs: Array<[glyphMapRecord: GlyphMapRecord, weight: number]>,
) => GlyphDataset;

export type AmendConfigTrigger<GlyphDataset> =
  | {
      reason: "visibleDatasetsChange";
      glyphDatasetMatrix: GlyphDataset[][];
    }
  | {
      reason: "mouseEvent";
      relativeX: number;
      relativeY: number;
      width: number;
      height: number;
    };

export type AmendConfig<GlyphConfig extends BaseGlyphConfig, GlyphDataset> = (
  glyphConfig: GlyphConfig,
  trigger: AmendConfigTrigger<GlyphDataset>,
) => GlyphConfig;

export type GlyphBlueprint<
  GlyphDataset,
  GlyphConfig extends BaseGlyphConfig,
> = {
  aggregateDatasets: AggregateGlyphDatasets<GlyphDataset>;
  amendConfig: AmendConfig<GlyphConfig, GlyphDataset>;
  draw: DrawGlyph<GlyphDataset, GlyphConfig>;
  generateDefaultConfig: () => GlyphConfig;
  name: string;
  Panel: GlyphPanel<GlyphConfig>;
};
