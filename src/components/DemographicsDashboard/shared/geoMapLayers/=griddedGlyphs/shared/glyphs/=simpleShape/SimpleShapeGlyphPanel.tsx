import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Slider,
  SliderProps,
  Typography,
} from "@mui/material";
import { GlyphPanel } from "../types";
import { SimpleShapeGlyphConfig } from "./types";

const SimpleShapeGlyphPanel: GlyphPanel<SimpleShapeGlyphConfig> = ({
  glyphConfig,
  onGlyphConfigChange,
  disabled,
}) => {
  const handleOutlineRadiusChange: SliderProps["onChange"] = (event, value) => {
    onGlyphConfigChange?.({
      ...glyphConfig,
      outlineRadius: Array.isArray(value) ? value[0] : value,
    });
  };
  const handleShowDataPointCountChange = () => {
    onGlyphConfigChange?.({
      ...glyphConfig,
      showDataPointCount: !glyphConfig.showDataPointCount,
    });
  };

  return (
    <>
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <Typography gutterBottom>
          outline radius in pixels: {glyphConfig.outlineRadius}
        </Typography>
        <Slider
          disabled={disabled}
          value={glyphConfig.outlineRadius}
          step={1}
          min={0}
          max={100}
          onChange={handleOutlineRadiusChange}
        />
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={glyphConfig.showDataPointCount}
            disabled={disabled}
          />
        }
        onChange={handleShowDataPointCountChange}
        label="show data point count"
      />
    </>
  );
};

export default SimpleShapeGlyphPanel;
