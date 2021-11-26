import { TextField, MenuItem } from "@mui/material";

function FirstForm(props) {
  return (
    <div className={props.className}>
      <h2>
        <TextField
          id="first_run"
          label="Target Country"
          type="text"
          color="primary"
          variant="standard"
          name="targetCountry"
          value={props.form.targetCountry}
          onChange={props.onChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </h2>
      <h2>
        <TextField
          id="first_run"
          label="Match First Date"
          type="date"
          color="primary"
          variant="standard"
          name="firstDate"
          value={props.form.firstDate}
          onChange={props.onChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </h2>
      <h2>
        <TextField
          id="first_run"
          label="Match Last Date"
          type="date"
          color="primary"
          variant="standard"
          name="lastDate"
          value={props.form.lastDate}
          onChange={props.onChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </h2>

      <h2>
        <TextField
          select
          label="Covid Data Stream"
          value={props.form.indicator}
          variant="standard"
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
          variant="standard"
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
          variant="standard"
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
          InputProps={{ inputProps: { min: 0, max: 10 } }}
        />
      </h2>
    </div>
  );
}

export default FirstForm;
