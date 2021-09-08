import type { ReactElement } from "react";
import Link from "next/link";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
  Button,
} from "@material-ui/core";
import { LoginJWT } from "src/components/auth/login";
import Logo from "src/components/Logo";
import useAuth from "src/hooks/useAuth";
import MainLayout from "src/components/main-layout/MainLayout";

const Login = () => {
  const { platform } = useAuth() as any;

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
          >
            <Logo
              sx={{
                height: 60,
                width: 60,
              }}
            />
          </Box>
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
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <div>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    Log in
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Log in on the RAMPVIS platform
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                {platform === "JWT" && <LoginJWT />}
              </Box>
              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 6,
                }}
              >
                {/* 
                <Button
                  color="primary"
                  component={Link}
                  href="/"
                  variant="outlined"
                >
                  Go to Home
                </Button> 
              */}
              </Box>
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
