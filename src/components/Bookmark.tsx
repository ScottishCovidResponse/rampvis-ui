/* eslint-disable @typescript-eslint/no-unused-vars */

import { FC, useCallback, useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { createStyles, IconButton, Theme } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { orange, grey } from "@mui/material/colors";
import ShowHideGuard from "src/components/auth/guards/ShowHideGuard";
import { apiService } from "src/utils/apiService";
// import useAuth from "src/hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  bookmarkedStyle: {
    color: orange[500],
    size: "medium",
  },
  unBookmarkedStyle: {
    color: grey[500],
    size: "medium",
  },
}));

const Bookmark: FC<any> = ({ pageId }) => {
  const classes = useStyles();
  const [isBookmarked, setBookmark] = useState<boolean>(false);
  // const { user } = useAuth();

  // if (user?.bookmarks?.includes(pageId)) {
  //   setBookmark(true);
  // }
  // console.log("Bookmark: isBookmarked = ", isBookmarked);

  const onClickBookmark = async () => {
    console.log("Bookmark: !isBookmarked = ", !isBookmarked);
    const res = await apiService.post(`/me/bookmark`, {
      pageId,
      status: !isBookmarked,
    });
    // if (user?.bookmarks?.includes(pageId)) {
    //   setBookmark(true);
    // }
    // TODO update user
    console.log("Bookmark: res = ", res);
  };

  return (
    <ShowHideGuard>
      <IconButton
        aria-label="bookmark"
        onClick={() => onClickBookmark()}
        className={
          isBookmarked ? classes.bookmarkedStyle : classes.unBookmarkedStyle
        }
      >
        <BookmarkIcon fontSize="inherit" />
      </IconButton>
    </ShowHideGuard>
  );
};

export default Bookmark;
