/* eslint-disable react/no-array-index-key */
import { useState } from "react";
import type { FC, KeyboardEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import Scrollbar from "../Scrollbar";
import wait from "../../utils/wait";

interface Result {
  description: string;
  title: string;
}

const results: Result[] = [
  {
    description: "Description ...",
    title: "Plot X",
  },
  {
    description: "Description ...",
    title: "Dashboard B",
  },
  {
    description: "Description ...",
    title: "Plot Y",
  },
];

const ContentSearch: FC = () => {
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const search = async (): Promise<void> => {
    setShowResults(false);
    setIsLoading(true);
    // Do search here
    await wait(1500);
    setIsLoading(false);
    setShowResults(true);
  };

  const handleClick = (): void => {
    search();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.code === "ENTER") {
      search();
    }
  };

  return (
    <>
      <Tooltip title="Search">
        <IconButton color="inherit" onClick={handleOpen}>
          <SearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="top"
        ModalProps={{ BackdropProps: { invisible: true } }}
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: "100%" },
        }}
        variant="temporary"
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton onClick={handleClose}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ p: 3 }}>
          <Container maxWidth="md">
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                onChange={(event): void => setValue(event.target.value)}
                onKeyUp={handleKeyUp}
                placeholder="Search..."
                value={value}
              />
              <Button
                color="primary"
                onClick={handleClick}
                size="large"
                sx={{ ml: 2 }}
                variant="contained"
              >
                Search
              </Button>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Scrollbar options={{ suppressScrollX: true }}>
                {isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {showResults && (
                      <>
                        {results.map((result, i) => (
                          <Box key={i} sx={{ mb: 2 }}>
                            <Link
                              color="textPrimary"
                              component={RouterLink}
                              to="/dashboard"
                              variant="h5"
                            >
                              {result.title}
                            </Link>
                            <Typography color="textPrimary" variant="body2">
                              {result.description}
                            </Typography>
                          </Box>
                        ))}
                      </>
                    )}
                  </>
                )}
              </Scrollbar>
            </Box>
          </Container>
        </Box>
      </Drawer>
    </>
  );
};

export default ContentSearch;
