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
  })
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
  data.map((d) => console.log(`/static/mock-images/${d}`));

  return (
    // <div className={classes.root}>
    //   <ImageList>
    //     <ImageListItem key="Subheader" cols={3} style={{ height: "auto" }}>
    //       {/* <ListSubheader component="div">XXXX</ListSubheader> */}
    //     </ImageListItem>
    //     {data.map((d) => (
    //       <ImageListItem key={d} >
    //         <img src={`/static/mock-images/${d}`} alt={"xx"} />
    //         <ImageListItemBar
    //           title={d}
    //           subtitle={<span>{"xx"}</span>}
    //           actionIcon={
    //             <IconButton
    //               aria-label={`info about ${"xx"}`}
    //               className={classes.icon}
    //             >
    //               <BookmarkIcon />
    //             </IconButton>
    //           }
    //           position="bottom"
    //         />
    //       </ImageListItem>
    //     ))}
    //   </ImageList>
    // </div>
    <>
      <Grid alignItems="stretch" className={classes.root}>
        {data.map((d) => (
          <PortalItem data={`/static/mock-images/${d}`}></PortalItem>
        ))}
      </Grid>
    </>
  );
};

export default PortalView;
