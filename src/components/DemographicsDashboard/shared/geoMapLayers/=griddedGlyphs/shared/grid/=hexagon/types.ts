import { BaseGridConfig } from "../types";

export type HexagonGridOrientation = "vertical" | "horizontal";

export interface HexagonGridConfig extends BaseGridConfig {
  gridType: "hexagon";
  orientation: HexagonGridOrientation;
}
