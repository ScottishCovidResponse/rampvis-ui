import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";

const AuthorizationRequired: FC = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <>
      <Helmet>
        <title>Error: Authorization Required | Material Kit Pro</title>
      </Helmet>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "background.paper",
          display: "flex",
          minHeight: "100%",
          px: 3,
          py: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            align="center"
            color="textPrimary"
            variant={mobileDevice ? "h4" : "h1"}
          >
            401: Authorization required
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            sx={{ mt: 0.5 }}
            variant="subtitle2"
          >
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <Box
              alt="Under development"
              component="img"
              src={`/static/error/error401_${theme.palette.mode}.svg`}
              sx={{
                height: "auto",
                maxWidth: "100%",
                width: 400,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={() => handleClick}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AuthorizationRequired;
