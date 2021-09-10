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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
      m={1}
    >
      <List className={classes.root}>
        {data.map((dataRecord, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <Link
                href={{ pathname: "/page", query: { id: dataRecord.id } }}
                passHref={true}
              >
                <ListItemAvatar>
                  {/* <IconButton color="primary" aria-label="" component="a">
                    <ImageIcon />
                  </IconButton> */}
                  <Avatar
                    variant="square"
                    className={classes.large}
                    src={`/static/mock-images/thumbnails/${dataRecord.id}.jpeg`}
                  />
                </ListItemAvatar>
              </Link>

              <ListItemText
                primary={dataRecord?.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {/* {dataRecord.title} */}
                      <Divider orientation="vertical" />
                    </Typography>
                    {dataRecord.visDescription}
                    <Divider orientation="vertical" />

                    {/* {d.keywords.map((k: string) => (
                      <Chip size="small" variant="outlined" className={classes.chip} label={k} />
                    ))} */}
                  </React.Fragment>
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default SearchResultView;
