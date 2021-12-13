import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import * as React from "react";
import {
  GlyphConfig,
  GlyphType,
  glyphBlueprintLookup,
  getGlyphBlueprint,
} from "./blueprints";

export interface GlyphPanelProps {
  glyphConfig: GlyphConfig;
  disabled?: boolean;
  onGlyphConfigChange: (value: GlyphConfig) => void;
}

const GlyphPanel: React.VoidFunctionComponent<GlyphPanelProps> = ({
  disabled,
  glyphConfig,
  onGlyphConfigChange,
}) => {
  const handleGlyphTypeChange: SelectProps["onChange"] = (event) => {
    const glyphType = event.target.value as GlyphType;
    onGlyphConfigChange?.(getGlyphBlueprint(glyphType).generateDefaultConfig());
  };

  const glyphBlueprint = getGlyphBlueprint(glyphConfig.glyphType);

  return (
    <>
      <FormControl fullWidth sx={{ marginBottom: 1 }}>
        <InputLabel id="glyph-type-label">type</InputLabel>
        <Select
          disabled={disabled}
          labelId="glyph-type-label"
          id="glyph-type"
          value={glyphConfig.glyphType}
          label="type"
          onChange={handleGlyphTypeChange}
          size="small"
        >
          {Object.entries(glyphBlueprintLookup).map(([glyphType, { name }]) => (
            <MenuItem key={glyphType} value={glyphType}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <glyphBlueprint.Panel
        disabled={disabled}
        glyphConfig={glyphConfig}
        onGlyphConfigChange={onGlyphConfigChange}
      />
    </>
  );
};

export default GlyphPanel;
