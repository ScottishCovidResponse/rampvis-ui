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

function InfoPopUp(props) {
  return (
    <div className={props.className}>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={props.open}
      >
        ?
      </Button>

      <Dialog
        fullScreen
        open={props.state}
        onClose={props.close}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Time-period Search Info Screen
        </DialogTitle>
        <DialogContent>
          <h1>Time-period Search</h1>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InfoPopUp;
