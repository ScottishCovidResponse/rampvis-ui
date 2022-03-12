import { makeStyles } from "@mui/styles";
import { blue } from "@mui/material/colors";
import { borderRadius } from "@mui/system";

//react style function for creating css classes and assigning attributes
//https://casbin.org/CssToAndFromReact/ good website for conversions

export const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
  firstRunForm: {
    marginBottom: theme.spacing(2),
    float: "left",
  },
  searchButton: {
    float: "right",
  },

  chartTitle: {
    textAlign: "center",
  },
  chart: {},

  listArea: {
    borderStyle: "solid",
    borderColor: "#c4c4c4",
    borderWidth: "2px",
    borderRadius: "12px",
  },
}));
