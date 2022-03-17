import { CardContent } from "@mui/material";
function GraphArea(props) {
  return (
    <CardContent id="chartArea" sx={{ height: 1 }}>
      <div className={props.style} id="segmentedchart"></div>
    </CardContent>
  );
}

export default GraphArea;
