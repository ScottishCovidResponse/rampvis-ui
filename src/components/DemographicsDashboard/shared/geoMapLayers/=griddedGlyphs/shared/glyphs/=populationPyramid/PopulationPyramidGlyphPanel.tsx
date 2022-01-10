import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Slider,
  SliderProps,
  Typography,
} from "@mui/material";
import { GlyphScalePanel } from "../shared/glyphScales";
import { GlyphPanel } from "../types";
import { PopulationPyramidGlyphConfig } from "./types";

const yearsInAgeBinSetup = {
  acceptedValues: [1, 2, 5, 10, 20],
};

const PopulationPyramidGlyphPanel: GlyphPanel<PopulationPyramidGlyphConfig> = ({
  disabled,
  glyphConfig,
  onGlyphConfigChange,
}) => {
  const handleYearsPerAgeBinChange: SliderProps["onChange"] = (
    event,
    value,
  ) => {
    onGlyphConfigChange?.({
      ...glyphConfig,
      yearsPerAgeBin:
        yearsInAgeBinSetup.acceptedValues[
          Array.isArray(value) ? value[0] : value
        ],
    });
  };

  const handleShowGenderChange = () => {
    onGlyphConfigChange?.({
      ...glyphConfig,
      showGender: !glyphConfig.showGender,
    });
  };

  return (
    <>
      <GlyphScalePanel
        glyphConfig={glyphConfig}
        onGlyphConfigChange={onGlyphConfigChange}
        disabled={disabled}
      />
      <FormControl sx={{ marginTop: 2 }} fullWidth>
        <Typography gutterBottom>
          years per age bin: {glyphConfig.yearsPerAgeBin}
        </Typography>
        <Slider
          disabled={disabled}
          value={yearsInAgeBinSetup.acceptedValues.indexOf(
            glyphConfig.yearsPerAgeBin,
          )}
          step={null}
          min={0}
          max={yearsInAgeBinSetup.acceptedValues.length - 1}
          marks={yearsInAgeBinSetup.acceptedValues.map((value, index) => ({
            value: index,
          }))}
          onChange={handleYearsPerAgeBinChange}
        />
      </FormControl>
      <FormControlLabel
        sx={{ marginTop: 2 }}
        control={
          <Checkbox checked={glyphConfig.showGender} disabled={disabled} />
        }
        onChange={handleShowGenderChange}
        label="show gender"
      />
    </>
  );
};

export default PopulationPyramidGlyphPanel;
