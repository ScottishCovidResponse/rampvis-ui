import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

function PredictPopUp(props) {
  return (
    <div>
      <Dialog fullScreen open={props.state} onClose={props.close}>
        <DialogTitle>Observation-based Forecasting Screen</DialogTitle>

        <DialogContent>
          <div id="predictScreen" />
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

export default PredictPopUp;
