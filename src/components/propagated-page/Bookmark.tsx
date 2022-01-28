import { FC, useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { orange, grey } from "@mui/material/colors";
import ShowHideGuard from "src/components/auth/guards/ShowHideGuard";
import { apiService } from "src/utils/ApiService";
import useAuth from "src/hooks/useAuth";

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
  const { user } = useAuth();
  const [isBookmarked, setBookmark] = useState<boolean>(false);

  useEffect(() => {
    if (user?.bookmarks?.includes(pageId)) {
      setBookmark(true);
    }
    // prettier-ignore
    console.log("Bookmark: pageId = ", pageId, " user = ", user, " isBookmarked = ", isBookmarked);
  }, [pageId, user?.bookmarks]);

  const onClickBookmark = async () => {
    console.log("Bookmark: onClickBookmark: isBookmarked = ", isBookmarked);

    try {
      const res = await apiService.post(`/me/bookmark`, {
        pageId,
        status: !isBookmarked,
      });

      if (res.bookmarks?.includes(pageId)) {
        setBookmark(true);
      } else {
        setBookmark(false);
      }
      // prettier-ignore
      console.log("Bookmark: onClickBookmark: res = ", res, "user.bookmarks = ", user.bookmarks, ", isBookmarked = ", isBookmarked);
    } catch (e) {
      console.error("Bookmark: onClickBookmark: error = ", e);
    }
  };

  return (
    <ShowHideGuard>
      {user?.id && (
        <IconButton
          aria-label="bookmark"
          onClick={() => onClickBookmark()}
          className={
            isBookmarked ? classes.bookmarkedStyle : classes.unBookmarkedStyle
          }
        >
          <BookmarkIcon fontSize="inherit" />
        </IconButton>
      )}
    </ShowHideGuard>
  );
};

export default Bookmark;
