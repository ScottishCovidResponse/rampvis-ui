import React, { FC } from "react";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Link from "next/link";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    // backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  chip: {
    // margin: theme.spacing(0.5),
  },
  large: {
    // width: theme.spacing(5),
    // height: theme.spacing(5),
    margin: "5px 10px",
  },
}));

interface SearchResultProps {
  data: any[];
}

const SearchResultView: FC<SearchResultProps> = ({ data = [] }) => {
  const classes = useStyles();

  // FIXME: Remove (useEffect makes sure that data is not logged during SSR)
  React.useEffect(() => {
    console.log("SearchResultView: data =", data);
  }, [data]);

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
              <a
                href={`/page?id=${dataRecord.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    className={classes.large}
                    src={`/static/mock-images/${dataRecord.id}.jpeg`}
                  >
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
              </a>

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
