import { SquareGridConfig } from ".";
import { GridBlueprint } from "../types";
import SquareGridPanel from "./SquareGridPanel";

export const squareGridBlueprint: GridBlueprint<SquareGridConfig> = {
  name: "square",
  generateGridCells: () => [],
  generateDefaultConfig: () => ({
    gridType: "square",
    pixelSize: 30,
  }),
  Panel: SquareGridPanel,
};
