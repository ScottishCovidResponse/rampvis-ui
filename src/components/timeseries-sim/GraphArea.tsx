import { CardContent } from "@mui/material";
function GraphArea(props) {
  return (
    <CardContent id="chartArea" sx={{ height: 1 }}>
      <div className={props.chartsClass} id="chart"></div>
    </CardContent>
  );
}

export default GraphArea;
