import React, { FC } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";

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
