import React, { FC } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  createStyles,
  IconButton,
  Theme,
  makeStyles,
  Grid,
  Paper,
} from "@material-ui/core";
import Bookmark from "../Bookmark";
import Link from "next/link";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles({
  root: {
    width: 300,
    height: 300,
    padding: "10px 10px 10px 10px",
  },
});

interface PortalItemProps {
  id: string;
  image: string;
  title: string;
}

const PortalItem: FC<PortalItemProps> = ({ id, image, title }) => {
  const classes = useStyles();
  // prettier-ignore
  console.log("PortalItem: { image, title } =", image, title);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia component="img" height={250} alt="" image={image} title="" />
        <CardContent>
          <Link href={{ pathname: "/page", query: { id: id } }} passHref={true}>
            {" "}
          </Link>

          <Typography gutterBottom variant="subtitle1">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* <CardActions>
        <Bookmark pageId="xxxx" />
      </CardActions> */}
    </Card>
  );
};

export default PortalItem;
