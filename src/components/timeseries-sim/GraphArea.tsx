import { CardContent } from "@material-ui/core";
function GraphArea(props) {
  return (
    <CardContent id="chartArea" sx={{ height: 1 }}>
      <div className={props.chartsClass} id="chart"></div>
    </CardContent>
  );
}

export default GraphArea;
