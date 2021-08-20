import { useEffect, useState } from "react";
import type { FC } from "react";
import {
  Box,
  Button,
  Drawer,
  Fab,
  FormControlLabel,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { THEMES } from "../constants";
import useSettings from "../hooks/useSettings";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const getValues = (settings) => ({
  compact: settings.compact,
  direction: settings.direction,
  responsiveFontSizes: settings.responsiveFontSizes,
  roundedCorners: settings.roundedCorners,
  theme: settings.theme,
});

const SettingsDrawer: FC = () => {
  const { settings, saveSettings } = useSettings();
  const [open, setOpen] = useState<boolean>(false);
  const [values, setValues] = useState(getValues(settings));

  useEffect(() => {
    setValues(getValues(settings));
  }, [settings]);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleChange = (field, value): void => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const handleSave = (): void => {
    saveSettings(values);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Settings">
        <Fab
          color="primary"
          onClick={handleOpen}
          size="medium"
          sx={{
            bottom: 0,
            margin: (theme) => theme.spacing(4),
            position: "fixed",
            right: 0,
            zIndex: (theme) => theme.zIndex.speedDial,
          }}
        >
          <MoreVertIcon fontSize="small" />
        </Fab>
      </Tooltip>
      <Drawer
        anchor="right"
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            p: 2,
            width: 320,
          },
        }}
      >
        <Typography color="textPrimary" variant="h6">
          Settings
        </Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Theme"
            name="theme"
            onChange={(event): void =>
              handleChange("theme", event.target.value)
            }
            select
            SelectProps={{ native: true }}
            value={values.theme}
            variant="outlined"
          >
            {Object.keys(THEMES).map((theme) => (
              <option key={theme} value={theme}>
                {theme
                  .split("_")
                  .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
                  .join(" ")}
              </option>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.direction === "rtl"}
                color="primary"
                edge="start"
                name="direction"
                onChange={(event): void =>
                  handleChange(
                    "direction",
                    event.target.checked ? "rtl" : "ltr"
                  )
                }
              />
            }
            label={
              <div>
                RTL
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Change text direction
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.responsiveFontSizes}
                color="primary"
                edge="start"
                name="direction"
                onChange={(event): void =>
                  handleChange("responsiveFontSizes", event.target.checked)
                }
              />
            }
            label={
              <div>
                Responsive font sizes
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Adjust font for small devices
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.compact}
                color="primary"
                edge="start"
                name="compact"
                onChange={(event): void =>
                  handleChange("compact", event.target.checked)
                }
              />
            }
            label={
              <div>
                Compact
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Fixed width on some screens
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.roundedCorners}
                color="primary"
                edge="start"
                name="roundedCorners"
                onChange={(event): void =>
                  handleChange("roundedCorners", event.target.checked)
                }
              />
            }
            label={
              <div>
                Rounded Corners
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Increase border radius
                </Typography>
              </div>
            }
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button
            color="primary"
            fullWidth
            onClick={handleSave}
            variant="contained"
          >
            Save Settings
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default SettingsDrawer;
