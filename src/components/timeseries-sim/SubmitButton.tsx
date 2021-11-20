import { Button } from "@mui/material";

function SubmitButton(props) {
  return (
    <div className={props.className}>
      <Button variant="outlined" color="primary" onClick={props.onClick}>
        Submit
      </Button>
    </div>
  );
}
export default SubmitButton;
