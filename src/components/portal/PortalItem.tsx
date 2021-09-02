import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { createStyles, IconButton, Theme, makeStyles } from "@material-ui/core";
import Bookmark from '../Bookmark';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

interface PortalItemProps {
  data: any;
}

const PortalItem: FC<PortalItemProps> = ({ data }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={data}
          title=""
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            Title of page
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Data descriptions
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Bookmark pageId={"xxxx"}/>
      </CardActions>
    </Card>
  );
}

export default PortalItem;
