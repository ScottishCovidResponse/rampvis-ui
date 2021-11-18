import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

//react style function for creating css classes and assigning attributes
//https://casbin.org/CssToAndFromReact/ good website for conversions

export const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
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
    marginBottom: theme.spacing(2),
    float: "right",
  },

  container: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "0.2fr 1.8fr",
    gap: "0px 0px",
    gridTemplateAreas: "title charts",
  },
  title: {
    gridArea: "title",
    textAlign: "center",
  },
  charts: {
    gridArea: "charts",
  },
}));
