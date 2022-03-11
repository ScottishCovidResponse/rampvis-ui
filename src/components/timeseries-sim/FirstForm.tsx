import { TextField, MenuItem } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

function FirstForm(props) {
  return (
    <div className={props.className}>
      <h2>
        <TextField
          id="first_run"
          label="Target Country"
          type="text"
          color="primary"
          variant="outlined"
          name="targetCountry"
          value={props.form.targetCountry}
          onChange={props.onChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </h2>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <h2>
          <DatePicker
            label="Match First Date"
            value={new Date(props.form.firstDate)}
            inputFormat="dd-MMM-yyyy"
            onChange={(newFirstDate) => {
              props.formChange((old) => {
                return { ...old, firstDate: props.dateParse(newFirstDate) };
              });
            }}
            key="firstDate"
            renderInput={(params) => <TextField {...params} />}
          />
        </h2>
        <h2>
          <DatePicker
            label="Match Last Date"
            value={new Date(props.form.lastDate)}
            inputFormat="dd-MMM-yyyy"
            onChange={(newLastDate) => {
              props.formChange((old) => {
                return { ...old, lastDate: props.dateParse(newLastDate) };
              });
            }}
            key="lastDate"
            renderInput={(params) => <TextField {...params} />}
          />
        </h2>
      </LocalizationProvider>

      <h2>
        <TextField
          select
          label="Covid Data Stream"
          value={props.form.indicator}
          variant="outlined"
          name="indicator"
          onChange={props.onChange}
        >
          {props.indicator.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </h2>
      <h2>
        <TextField
          select
          label="Similarity Measure"
          name="method"
          value={props.form.method}
          variant="outlined"
          onChange={props.onChange}
        >
          {props.method.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </h2>
      <h2>
        <TextField
          variant="outlined"
          id="first_run"
          label="Number of results"
          type="number"
          color="primary"
          name="numberOfResults"
          value={props.form.numberOfResults}
          onChange={props.onChange}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{ inputProps: { min: 0, max: 20 } }}
        />
      </h2>
    </div>
  );
}

export default FirstForm;
