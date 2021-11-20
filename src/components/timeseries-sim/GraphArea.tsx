import { Grid } from "@mui/material";
function GraphArea(props) {
  return (
    <Grid className={props.containerClass} id="container">
      <Grid className={props.legendClass} id="legend"></Grid>
      <Grid className={props.chartsClass} id="charts"></Grid>
    </Grid>
  );
}

export default GraphArea;
