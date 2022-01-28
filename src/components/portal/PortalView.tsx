import React, { FC } from "react";
import { makeStyles } from "@mui/styles";
import { Theme, Grid } from "@mui/material";
import PortalItem from "./PortalItem";
import { IThumbnail } from "src/models/IThumbnail";

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

const PortalView: FC<{ data: IThumbnail[] }> = ({ data = [] }) => {
  const classes = useStyles();
  console.log("PortalView: data = ", data);

  return (
    <>
      <Grid container spacing={3} className={classes.root}>
        {data.map((d) => (
          <PortalItem
            key={d.id}
            id={d.id}
            thumbnail={d.thumbnail}
            title={d.title}
          />
        ))}
      </Grid>
    </>
  );
};

export default PortalView;
