import {
  Button,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
function TimeSeriesBag(props) {
  return (
    <div>
      <h2>
        <div
          style={{
            borderStyle: "solid",
            borderColor: "#c4c4c4",
            borderWidth: "1px",
            borderRadius: "12px",
            minHeight: "200px",
          }}
        >
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
        </div>
      </h2>

      <h2>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={props.onClick}
        >
          Predict
        </Button>
      </h2>
    </div>
  );
}
export default TimeSeriesBag;
