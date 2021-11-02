import { FC, KeyboardEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, TextField, InputAdornment } from "@mui/material";
import { Theme, makeStyles } from "@material-ui/core/styles";

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

interface SearchBarProps {
  onClick: (string) => void;
}

const SearchBar: FC<SearchBarProps> = (props) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = async (term: string) => {
    // console.log("handleChange: term = ", term);
    setSearchTerm(term);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
    // console.log(event.code);
    if (event.code === "Enter") {
      props.onClick(searchTerm);
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
          defaultValue={searchTerm}
          onChange={(e: any) => handleChange(e.target.value)}
          className={classes.input}
        />
        <Button
          color="primary"
          onClick={() => {
            props.onClick(searchTerm);
          }}
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

export default SearchBar;
