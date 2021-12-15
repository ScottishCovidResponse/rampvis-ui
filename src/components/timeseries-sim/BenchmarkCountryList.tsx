import {
  Button,
  OutlinedInput,
  List,
  ListItem,
  IconButton,
  ListItemText,
  FormGroup,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

function BenchmarkCountryList(props) {
  return (
    <div>
      {" "}
      <h2>
        <OutlinedInput
          name="timeSeries"
          value={props.manualValue}
          onChange={props.manualValueChange}
          endAdornment={
            <Button
              variant="contained"
              color="primary"
              onClick={props.manualValueAdd}
            >
              +
            </Button>
          }
        />
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
        <Button variant="contained" color="primary">
          Compare
        </Button>
      </h2>
    </div>
  );
}
export default BenchmarkCountryList;
