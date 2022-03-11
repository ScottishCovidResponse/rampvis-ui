import {
  Button,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Autocomplete,
  TextField,
  Grid,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { autoFillList } from "src/components/timeseries-sim/variables/variables";

function BenchmarkCountryList(props) {
  const continentList = Object.keys(props.form.continentCheck).filter(
    (keys) => props.form.continentCheck[keys] == true,
  );
  const options = autoFillList.filter((count) =>
    continentList.includes(count.continent),
  );

  return (
    <div>
      <h2>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Autocomplete
              freeSolo
              options={options.sort(
                (a, b) => -b.continent.localeCompare(a.continent),
              )}
              autoHighlight
              getOptionLabel={(option) => option.label}
              groupBy={(option) => option.continent}
              onChange={(event) => {
                const manualCountryEvent = event.target as Element;
                props.manualCountrySet(() => manualCountryEvent.textContent);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Target Country"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={props.manualValueAdd}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </h2>

      <h2>
        <List sx={{ position: "relative", overflow: "auto", maxHeight: 300 }}>
          {props.list.map(
            (
              series, // time series bag list creation
            ) => (
              <ListItem
                key={series}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={props.removeFromList}
                  >
                    <DeleteOutline />
                  </IconButton>
                }
              >
                <ListItemText primary={series} />
              </ListItem>
            ),
          )}
        </List>
      </h2>
      <h2>
        <Button variant="outlined" color="primary" onClick={props.setToDefault}>
          Set to default
        </Button>
      </h2>
      <h2>
        <Button variant="contained" color="primary" onClick={props.onClick}>
          Compare
        </Button>
      </h2>
    </div>
  );
}
export default BenchmarkCountryList;
