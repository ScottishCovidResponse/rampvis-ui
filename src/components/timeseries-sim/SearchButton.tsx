import { Button } from "@material-ui/core";

function SearchButton(props) {
  return (
    <div className={props.className}>
      <Button variant="contained" color="primary" onClick={props.onClick}>
        Search
      </Button>
    </div>
  );
}
export default SearchButton;
