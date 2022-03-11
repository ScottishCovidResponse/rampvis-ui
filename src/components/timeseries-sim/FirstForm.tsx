import { TextField, MenuItem, Autocomplete } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { autoFillList } from "src/components/timeseries-sim/variables/variables";

function FirstForm(props) {
  const initial_country = autoFillList.filter((obj) => {
    return obj.label == props.form.targetCountry;
  })[0];
  const options = autoFillList;
  return (
    <div className={props.className}>
      <h2>
        <Autocomplete
          freeSolo
          value={initial_country}
          options={options.sort(
            (a, b) => -b.continent.localeCompare(a.continent),
          )}
          autoHighlight
          getOptionLabel={(option) => option.label}
          groupBy={(option) => option.continent}
          onChange={(event) => {
            props.formChange((old) => {
              return { ...old, targetCountry: event.target.textContent };
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a country"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
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
