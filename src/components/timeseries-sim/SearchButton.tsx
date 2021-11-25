import { Button } from "@mui/material";

function SearchButton(props) {
  return (
    <div className={props.className}>
      <h2>
        <Button variant="contained" color="primary" onClick={props.onClick}>
          Search
        </Button>
      </h2>
    </div>
  );
}
export default SearchButton;
