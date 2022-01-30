import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  Slider,
  SliderProps,
  Typography,
} from "@mui/material";
import * as React from "react";
import { gridPixelSizeSetup } from "../helpersForConfig";
import {
  GridConfig,
  GridType,
  gridBlueprintLookup,
  getGridBlueprint,
} from "./blueprints";

export interface GridPanelProps {
  gridConfig: GridConfig;
  disabled?: boolean;
  onGridConfigChange: (value: GridConfig) => void;
}

const GridPanel: React.VoidFunctionComponent<GridPanelProps> = ({
  disabled,
  gridConfig,
  onGridConfigChange,
}) => {
  const handleGridTypeChange: SelectProps["onChange"] = (event) => {
    const gridType = event.target.value as GridType;
    onGridConfigChange?.({
      ...getGridBlueprint(gridType).generateDefaultConfig(),
      pixelSize: gridConfig.pixelSize,
    });
  };

  const gridBlueprint = getGridBlueprint(gridConfig.gridType);

  const handlePixelSizeChange: SliderProps["onChange"] = (event, value) => {
    onGridConfigChange?.({
      ...gridConfig,
      pixelSize: Array.isArray(value) ? value[0] : value,
    });
  };

  return (
    <>
      <FormControl fullWidth sx={{ marginBottom: 1 }}>
        <InputLabel id="grid-type-label">type</InputLabel>
        <Select
          disabled={disabled}
          labelId="grid-type-label"
          id="grid-type"
          value={gridConfig.gridType}
          label="type"
          onChange={handleGridTypeChange}
          size="small"
        >
          {Object.entries(gridBlueprintLookup).map(([gridType, { name }]) => (
            <MenuItem key={gridType} value={gridType}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormGroup sx={{ marginTop: 2 }}>
        <FormControl>
          <Typography gutterBottom>
            grid size in pixels: {gridConfig.pixelSize}
          </Typography>
          <Slider
            disabled={disabled}
            value={gridConfig.pixelSize}
            step={5}
            min={gridPixelSizeSetup.min}
            max={gridPixelSizeSetup.max}
            onChange={handlePixelSizeChange}
          />
        </FormControl>
      </FormGroup>

      <gridBlueprint.Panel
        disabled={disabled}
        gridConfig={gridConfig}
        onGridConfigChange={onGridConfigChange}
      />
    </>
  );
};

export default GridPanel;
