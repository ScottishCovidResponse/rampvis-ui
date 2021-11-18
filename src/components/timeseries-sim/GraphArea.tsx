import { Grid } from "@material-ui/core";
function GraphArea(props) {
  return (
    <Grid className={props.containerClass} id="container">
      <Grid className={props.titleClass} id="title"></Grid>
      <Grid className={props.chartsClass} id="charts"></Grid>
    </Grid>
  );
}

export default GraphArea;