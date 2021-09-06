import React, { FC } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { orange } from "@material-ui/core/colors";
import { Grid } from "@material-ui/core";
import PortalItem from "./PortalItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    // imageList: {
    //   width: 1000,
    //   height: 1000,
    // },
    icon: {
      color: orange,
    },
  }),
);

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const itemData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
interface PortalViewProps {
  data: any[];
}

const PortalView: FC<PortalViewProps> = ({ data = [] }) => {
  const classes = useStyles();
  console.log("PortalView: data = ", data);

  // TODO: Use real images from backend
  const list = [
    "605e64ccdfb1d977d34aa3cc.png",
    "609728d27d47ae21406735bd.png",
    "60ecc0f3beb7791f01bebe49.png",
    "61006ed44fef9b1f276003de.png",
    "61031507be36153857a3de37.png",
    "608dd7dbd651fc539ce11801.png",
    "60ad693df52d2d641f4e45b9.png",
    "61006c9842248f1ef21219b1.png",
    "610314efc50719383382a6a2.png",
  ];

  data = data.map((d) => ({
    ...d,
    img: `/static/mock-images/${list[Math.floor(Math.random() * list.length)]}`,
  }));

  return (
    <>
      <Grid alignItems="stretch" className={classes.root}>
        {data.map((d, index) => (
          // TODO: Consider using d.id (or similar) instead of index for better DOM diffing
          <PortalItem key={index} data={d} />
        ))}
      </Grid>
    </>
  );
};

export default PortalView;
