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

function AdvancedFilter(props) {
  return (
    <div className={props.className}>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={props.open}
      >
        Advanced Filters
      </Button>

      <Dialog
        open={props.state}
        onClose={props.close}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Advanced Filters</DialogTitle>
        <DialogTitle>Continents to include:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormGroup>
              {props.continents.map((continent) => (
                <label key={continent.value}>
                  {continent.value}
                  <Checkbox
                    value={continent.value}
                    onChange={props.onChange}
                    checked={props.form.continentCheck[continent.value]}
                  />
                </label>
              ))}
            </FormGroup>
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            <FormGroup>
              <TextField
                id="first_run"
                label="Minimum Population"
                type="number"
                color="primary"
                variant="standard"
                name="minPopulation"
                value={props.form.minPopulation}
                onChange={props.onChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: { min: 500000, step: 50000 },
                }}
              />

              <TextField
                id="first_run"
                label="Start Date"
                type="date"
                color="primary"
                variant="standard"
                name="startDate"
                value={props.form.startDate}
                onChange={props.onChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                id="first_run"
                label="End Date"
                type="date"
                color="primary"
                variant="standard"
                name="endDate"
                value={props.form.endDate}
                onChange={props.onChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormGroup>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdvancedFilter;
