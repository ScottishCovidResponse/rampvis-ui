import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

function ComparePopUp(props) {
  return (
    <div>
      <Dialog fullScreen open={props.state} onClose={props.close}>
        <DialogTitle>Benchmark Country Comparison Screen</DialogTitle>
        <Button onClick={props.close} color="primary">
          Close
        </Button>
        <DialogContent>
          <div id="countryCompare" />
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

export default ComparePopUp;
