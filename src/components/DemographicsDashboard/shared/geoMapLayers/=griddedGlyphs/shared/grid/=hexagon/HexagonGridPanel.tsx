import { HexagonGridConfig } from "./types";
import { GridPanel } from "../types";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { HexagonOutlined } from "@mui/icons-material";
import { HexagonGridOrientation } from ".";

const HexagonGridPanel: GridPanel<HexagonGridConfig> = ({
  disabled,
  gridConfig,
  onGridConfigChange,
}) => {
  const handleOrientationChange = (
    event: unknown,
    value: HexagonGridOrientation,
  ) => {
    onGridConfigChange?.({ ...gridConfig, orientation: value });
  };

  return (
    <>
      <ToggleButtonGroup
        value={gridConfig.orientation}
        color={disabled ? undefined : "primary"}
        exclusive
        size="small"
        sx={{
          marginTop: 1,
          display: "flex",
          button: { flexGrow: 1 },
        }}
        onChange={handleOrientationChange}
      >
        <ToggleButton disabled={disabled} value="vertical">
          <HexagonOutlined
            fontSize="small"
            sx={{ marginRight: 0.5, transform: "rotate(90deg)" }}
          />
          vertical
        </ToggleButton>
        <ToggleButton disabled={disabled} value="horizontal">
          <HexagonOutlined fontSize="small" sx={{ marginRight: 0.5 }} />
          horizontal
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default HexagonGridPanel;
