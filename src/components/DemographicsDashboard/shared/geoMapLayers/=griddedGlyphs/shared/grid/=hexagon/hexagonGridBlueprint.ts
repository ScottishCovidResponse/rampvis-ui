import { HexagonGridConfig } from ".";
import { GridBlueprint } from "../types";
import HexagonGridPanel from "./HexagonGridPanel";

export const hexagonGridBlueprint: GridBlueprint<HexagonGridConfig> = {
  name: "hexagon",
  generateGridCells: () => [],
  generateDefaultConfig: () => ({
    gridType: "hexagon",
    pixelSize: 30,
    orientation: "vertical",
  }),
  Panel: HexagonGridPanel,
};
