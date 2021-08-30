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
import ImageIcon from "@material-ui/icons/Image";
// import { Link } from "react-router-dom";

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
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: "5px 10px",
  },
}));

interface SearchResultProps {
  data: any[];
}

const SearchResultView: FC<SearchResultProps> = ({ data = [] }) => {
  const classes = useStyles();
 
  const bookmark = async (e) => {
    console.log(e)
  }

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
            <ListItem 
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar variant="square" className={classes.large} >
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="TODO: title"
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {d.visDescription}
                      <Divider orientation="vertical" />
                    </Typography>
                    {d.dataDescription}
                    <Divider orientation="vertical" />

                    {d.keywords.map((k: string) => (
                      <Chip size="small" className={classes.chip} label={k} />
                    ))}
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
