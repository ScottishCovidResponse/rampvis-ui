import { ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Card, CardContent, Container, Divider } from "@mui/material";
import { LoginJWT } from "src/components/auth/login";
import MainLayout from "src/components/main-layout/MainLayout";
import LoginGitHub from "src/components/auth/login/LoginGitHub";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm" sx={{ py: "80px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 8,
            }}
          ></Box>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 4,
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                <LoginGitHub />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                <LoginJWT />
              </Box>
              <Divider sx={{ my: 3 }} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Login;
