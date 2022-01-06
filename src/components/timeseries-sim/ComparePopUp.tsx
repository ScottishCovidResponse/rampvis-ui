import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormGroup,
  Checkbox,
} from "@mui/material";

function ComparePopUp(props) {
  return (
    <div>
      <Dialog open={props.state} onClose={props.close}>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ComparePopUp;
