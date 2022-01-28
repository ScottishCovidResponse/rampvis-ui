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
import { IThumbnail } from "src/models/IThumbnail";

const useStyles = makeStyles({
  root: {
    width: 300,
    height: 300,
    padding: "10px 10px 10px 10px",
  },
});

const PortalItem: FC<IThumbnail> = ({ id, thumbnail, title }) => {
  const classes = useStyles();
  // prettier-ignore
  console.log("PortalItem: { id, thumbnail, title } =", id, thumbnail, title);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          height={250}
          alt=""
          image={thumbnail && `data:image/jpeg;base64,${thumbnail}`}
          title=""
        />
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
