/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */

import { FC, KeyboardEvent } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Box, Button, TextField, InputAdornment } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    flexDirection: "row",
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    flexDirection: "row",
  },
}));

interface PageSearchBarProps {
  input: string;
  onChange: (string) => void;
  onClick: () => void;
}

const PageSearchBar: FC<PageSearchBarProps> = ({
  input: keyword,
  onChange: handleChange,
  onClick: handleClick,
}) => {
  const classes = useStyles();

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
    console.log(event.code);
    if (event.code === "Enter") {
      handleClick();
    }
  };

  return (
    <>
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
          onKeyUp={handleKeyUp}
          placeholder="Search..."
          value={keyword}
          onChange={(e: any) => handleChange(e.target.value)}
          className={classes.input}
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
    </>
  );
};

export default PageSearchBar;
