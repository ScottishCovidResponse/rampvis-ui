/* eslint-disable react/jsx-fragments */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */

import React, { FC } from "react";
import { Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Chip, Box } from "@material-ui/core";
import Link from "next/link";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    margin: "5px 10px",
  },
}));

interface SearchResultProps {
  data: any[];
}

const SearchResultView: FC<SearchResultProps> = ({ data = [] }) => {
  const classes = useStyles();

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

  console.log("SearchResultView: data =", data);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
      m={1}
    >
      <List className={classes.root}>
        {data.map((d: any) => (
          <>
            <ListItem alignItems="flex-start">
              <Link href={`/page/${d.id}`} passHref={true}>
                <ListItemAvatar>
                  {/* <IconButton color="primary" aria-label="" component="a">
                    <ImageIcon />
                  </IconButton> */}
                  <Avatar
                    variant="square"
                    className={classes.large}
                    src={`/static/mock-images/${
                      list[Math.floor(Math.random() * list.length)]
                    }`}
                  />
                </ListItemAvatar>
              </Link>

              <ListItemText
                primary={d?.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {d.title}
                      <Divider orientation="vertical" />
                    </Typography>
                    {d.visDescription}
                    <Divider orientation="vertical" />

                    {/* {d.keywords.map((k: string) => (
                      <Chip size="small" variant="outlined" className={classes.chip} label={k} />
                    ))} */}
                  </React.Fragment>
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </Box>
  );
};

export default SearchResultView;
