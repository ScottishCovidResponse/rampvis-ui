/* eslint-disable @typescript-eslint/no-unused-vars */

import { FC, useCallback, useState, useEffect } from "react";
import { createStyles, IconButton, Theme, makeStyles } from "@material-ui/core";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import PropTypes from "prop-types";
import { orange, grey } from "@material-ui/core/colors";

import ShowHideGuard from "./ShowHideGuard";
import { apiService } from "../services/apiService";

const useStyles = makeStyles((theme) => ({
  bookmarkIcon1: {
    color: orange[500],
  },
  bookmarkIcon2: {
    color: grey[500],
  },
}));

const Bookmark: FC<any> = ({ pageId }) => {
  const classes = useStyles();
  const [isBookmarked, setBookmark] = useState<boolean>(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await apiService.get<any>(`/bookmark/${pageId}`);
      console.log("Bookmark: fetched data = ", res);
      if (res) {
        setBookmark(true);
      } else {
        setBookmark(false);
      }
    } catch (err) {
      // prettier-ignore
      console.error(`Bookmark: Fetching error = ${err}`);
    }
  }, [pageId]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const bookmark = async () => {
    console.log(isBookmarked);
    if (isBookmarked) {
      const res = await apiService.delete<any>(`/bookmark/${pageId}`);
      console.log("Bookmark: deleted = ", res);
      setBookmark(false);
    } else {
      const res = await apiService.post<any>(`/bookmark`, { pageId });
      console.log("Bookmark: created = ", res);
      setBookmark(true);
    }
  };

  return (
    <ShowHideGuard>
      <IconButton
        aria-label="bookmark"
        size="small"
        onClick={() => bookmark()}
        className={isBookmarked ? classes.bookmarkIcon1 : classes.bookmarkIcon2}
      >
        <BookmarkIcon fontSize="inherit" />
      </IconButton>
    </ShowHideGuard>
  );
};

Bookmark.propTypes = {
  pageId: PropTypes.any,
};

export default Bookmark;
