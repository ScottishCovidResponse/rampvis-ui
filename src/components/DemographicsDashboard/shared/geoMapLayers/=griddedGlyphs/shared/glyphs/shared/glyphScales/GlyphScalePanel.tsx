import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  Typography,
} from "@mui/material";
import * as React from "react";
import { GlyphScaleConfig, GlyphScaleType } from "./types";
import { BaseGlyphConfig } from "../../types";
import AutoFixHigh from "@mui/icons-material/AutoFixHigh";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import { useHotkeys } from "../../../useHotkeys";
import { KeyBindingMap } from "tinykeys";

export interface GlyphScalePanelProps<GlyphConfig> {
  acceptedScaleTypes?: GlyphScaleType[];
  glyphConfig: GlyphConfig;
  onGlyphConfigChange?: (glyphConfig: GlyphConfig) => void;
  disabled?: boolean;
}

// TODO: Convert to blueprints when the logic of each scale becomes more complex
const scaleNameByScaleType: Record<GlyphScaleType, string> = {
  absolute: "absolute",
  relative: "relative",
  relativeWithLightness: "relative with lightness",
};

const GlyphScalePanel = <
  GlyphConfig extends BaseGlyphConfig & { scale: GlyphScaleConfig },
>({
  acceptedScaleTypes,
  glyphConfig,
  onGlyphConfigChange,
  disabled,
}: GlyphScalePanelProps<GlyphConfig>) => {
  const maxScaleValueIsApplicable = glyphConfig.scale.scaleType !== "relative";
  const maxScaleValue =
    glyphConfig.scale.scaleType !== "relative"
      ? glyphConfig.scale.maxScaleValue
      : undefined;

  const handleGlyphScaleTypeChange: SelectProps["onChange"] = (event) => {
    const scaleType = event.target.value as GlyphScaleType;
    onGlyphConfigChange?.({
      ...glyphConfig,
      scale: { scaleType },
    });
  };

  const updateMaxScaleValue = (newValue: number | undefined) => {
    onGlyphConfigChange?.({
      ...glyphConfig,
      scale: {
        ...glyphConfig.scale,
        maxScaleValue: newValue,
      },
    });
  };

  const handleArrowDownwardClick = () => {
    if (
      glyphConfig.scale.scaleType === "relative" ||
      typeof glyphConfig.scale.maxScaleValue !== "number"
    ) {
      return;
    }
    updateMaxScaleValue(Math.round(glyphConfig.scale.maxScaleValue / 1.2));
  };

  const handleAutoFixHighClick = () => {
    updateMaxScaleValue(undefined);
  };

  const handleArrowUpwardClick = () => {
    if (
      glyphConfig.scale.scaleType === "relative" ||
      typeof glyphConfig.scale.maxScaleValue !== "number"
    ) {
      return;
    }
    updateMaxScaleValue(Math.round(glyphConfig.scale.maxScaleValue * 1.2));
  };

  const keyBindingMap = React.useMemo<KeyBindingMap>(() => {
    const scaleConfig = glyphConfig.scale;
    if (disabled || scaleConfig.scaleType === "relative") {
      return {} as KeyBindingMap;
    }

    const applyMaxScaleValue = (newValue: number | undefined) => {
      const roundedValue =
        typeof newValue === "number"
          ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, Math.round(newValue)))
          : newValue;

      if (roundedValue !== scaleConfig.maxScaleValue) {
        onGlyphConfigChange?.({
          ...glyphConfig,
          scale: {
            ...glyphConfig.scale,
            maxScaleValue: roundedValue,
          },
        });
      }
    };

    return {
      ArrowUp: (event) => {
        if (scaleConfig.maxScaleValue) {
          applyMaxScaleValue(scaleConfig.maxScaleValue * 1.2);
        }
        event.preventDefault();
      },
      "Shift+ArrowUp": (event) => {
        if (scaleConfig.maxScaleValue) {
          applyMaxScaleValue(scaleConfig.maxScaleValue * 2);
        }
        event.preventDefault();
      },
      ArrowDown: (event) => {
        if (scaleConfig.maxScaleValue) {
          applyMaxScaleValue(scaleConfig.maxScaleValue / 1.2);
        }
        event.preventDefault();
      },
      "Shift+ArrowDown": (event) => {
        if (scaleConfig.maxScaleValue) {
          applyMaxScaleValue(scaleConfig.maxScaleValue / 2);
        }
        event.preventDefault();
      },
      s: (event) => {
        applyMaxScaleValue(undefined);
        event.preventDefault();
      },
    };
  }, [disabled, glyphConfig, onGlyphConfigChange]);
  useHotkeys(keyBindingMap);

  return (
    <>
      <FormControl fullWidth sx={{ marginTop: 1 }}>
        <InputLabel id="glyph-scale-type-label">scale</InputLabel>
        <Select
          disabled={disabled || acceptedScaleTypes?.length === 1}
          labelId="glyph-scale-type-label"
          id="glyph-type"
          value={glyphConfig.scale.scaleType}
          label="scale"
          onChange={handleGlyphScaleTypeChange}
          size="small"
        >
          {Object.entries(scaleNameByScaleType).map(
            ([glyphScaleType, name]) => (
              <MenuItem key={glyphScaleType} value={glyphScaleType}>
                {name}
              </MenuItem>
            ),
          )}
        </Select>
      </FormControl>
      <Typography gutterBottom sx={{ marginTop: 2 }}>
        max scale value:{" "}
        {maxScaleValue ?? (maxScaleValueIsApplicable ? "..." : "n/a")}
      </Typography>
      <ButtonGroup
        variant="outlined"
        color={disabled ? undefined : "primary"}
        size="small"
      >
        <Button
          onClick={handleArrowDownwardClick}
          disabled={disabled || typeof maxScaleValue !== "number"}
        >
          <ArrowDownward fontSize="small" />
        </Button>
        <Button
          onClick={handleAutoFixHighClick}
          disabled={disabled || !maxScaleValueIsApplicable}
        >
          <AutoFixHigh fontSize="small" />
        </Button>
        <Button
          onClick={handleArrowUpwardClick}
          disabled={disabled || typeof maxScaleValue !== "number"}
        >
          <ArrowUpward fontSize="small" />
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GlyphScalePanel;
