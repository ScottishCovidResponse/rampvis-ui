import React, { FC } from "react";
import { Theme, makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import PortalItem from "./PortalItem";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    padding: "10px 10px 10px 0px",
  },
}));

interface PortalViewProps {
  data: any[];
}

const PortalView: FC<PortalViewProps> = ({ data = [] }) => {
  const classes = useStyles();
  console.log("PortalView: data = ", data);

  return (
    <>
      <Grid container spacing={3} className={classes.root}>
        {data.map((d) => (
          <PortalItem
            key={d.id}
            id={d.id}
            image={`/static/mock-images/thumbnails/${d.id}.jpeg`}
            title={d.title}
          />
        ))}
      </Grid>
    </>
  );
};

export default PortalView;
