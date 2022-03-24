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

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

function AdvancedFilter(props) {
  return (
    <div>
      <Button
        sx={{ width: "1" }}
        size="large"
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
              <h2>
                <TextField
                  id="first_run"
                  label="Minimum Population"
                  type="number"
                  color="primary"
                  variant="outlined"
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
              </h2>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <h2>
                  <DatePicker
                    label="Start Date"
                    value={new Date(props.form.startDate)}
                    minDate={new Date(props.initialValue.startDate)}
                    maxDate={new Date(props.form.endDate)}
                    inputFormat="dd-MMM-yyyy"
                    onChange={(newStartDate) => {
                      props.formChange((old) => {
                        return {
                          ...old,
                          startDate: props.dateParse(newStartDate),
                        };
                      });
                    }}
                    key="startDate"
                    renderInput={(params) => (
                      <TextField sx={{ width: "1" }} {...params} />
                    )}
                  />
                </h2>
                <h2>
                  <DatePicker
                    label="End Date"
                    value={new Date(props.form.endDate)}
                    minDate={new Date(props.form.startDate)}
                    maxDate={new Date(props.initialValue.endDate)}
                    inputFormat="dd-MMM-yyyy"
                    onChange={(newEndDate) => {
                      props.formChange((old) => {
                        return { ...old, endDate: props.dateParse(newEndDate) };
                      });
                    }}
                    key="endDate"
                    renderInput={(params) => (
                      <TextField sx={{ width: "1" }} {...params} />
                    )}
                  />
                </h2>
              </LocalizationProvider>
            </FormGroup>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="large" onClick={props.close} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdvancedFilter;
