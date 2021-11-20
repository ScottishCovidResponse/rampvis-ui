import { Box } from "@mui/material";
function GridItem(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        p: 1,
        borderRadius: 1,
        textAlign: "left",
        fontSize: 19,
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

export default GridItem;
