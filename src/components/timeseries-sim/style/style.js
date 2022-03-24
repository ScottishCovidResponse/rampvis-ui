import { makeStyles } from "@mui/styles";
import { blue } from "@mui/material/colors";
import { TwentyThreeMp } from "@mui/icons-material";
//react style function for creating css classes and assigning attributes
//https://casbin.org/CssToAndFromReact/ good website for conversions

export const timeSeriesStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[500],
  },
  icon: {
    fill: blue[500],
  },
  firstRunForm: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    float: "left",
  },

  chartTitle: {
    textAlign: "center",
  },
  chart: {},

  benchmarkArea: {
    borderStyle: "solid",
    borderColor: "#c4c4c4",
    borderWidth: "1px",
    borderRadius: "12px",
  },

  timeseriesArea: {
    borderStyle: "solid",
    borderColor: "#c4c4c4",
    borderWidth: "1px",
    borderRadius: "12px",
    minHeight: "200px",
  },
  segmentedGraph: {},
  instruction: {
    fontSize: "10px",
  },
}));
