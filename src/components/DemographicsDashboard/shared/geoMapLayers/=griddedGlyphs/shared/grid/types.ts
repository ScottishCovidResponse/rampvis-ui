export interface BaseGridConfig {
  gridType: string;
  pixelSize: number;
  [rest: string]: unknown;
}

export type BoundingRect = [
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
];

export interface GridCell {
  innerRect: BoundingRect;
  outerRect: BoundingRect;
  outline: [number, number][];
}

export type GridPanel<GridConfig extends BaseGridConfig> =
  React.VoidFunctionComponent<{
    disabled?: boolean;
    gridConfig: GridConfig;
    onGridConfigChange?: (config: GridConfig) => void;
  }>;

export type GenerateGridCells<GridConfig extends BaseGridConfig> = (payload: {
  gridConfig: GridConfig;
}) => GridCell[];

export type GridBlueprint<GridConfig extends BaseGridConfig> = {
  generateGridCells: GenerateGridCells<GridConfig>;
  generateDefaultConfig: () => GridConfig;
  name: string;
  Panel: GridPanel<GridConfig>;
};
