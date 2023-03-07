import { GridBlueprint } from "./types";
import { hexagonGridBlueprint, HexagonGridConfig } from "./=hexagon";
import { squareGridBlueprint, SquareGridConfig } from "./=square";

export type GridConfig = HexagonGridConfig | SquareGridConfig;

export type GridType = GridConfig["gridType"];

export const gridBlueprintLookup = {
  hexagon: hexagonGridBlueprint,
  square: squareGridBlueprint,
};

export const getGridBlueprint = (GridType: GridType) => {
  return gridBlueprintLookup[GridType] as GridBlueprint<GridConfig>;
};
