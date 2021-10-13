import React, { FC, useEffect, useState } from "react";
import { Avatar, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import Link from "next/link";
import { apiService } from "src/utils/apiService";
import { IDataStoredInToken } from "src/types/dataStoredInToken";
import useMounted from "src/hooks/useMounted";
import useAuth from "src/hooks/useAuth";
import { User } from "src/types/user";

const LoginGitHub: FC = (props) => {
  const mounted = useMounted();
  const { login } = useAuth() as any;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const token =
        typeof router.query.token === "string" ? router.query.token : undefined;
      console.log("LoginGitHub: token =", token);

      if (token) {
        setLoading(true);

        const decoded: IDataStoredInToken = await jwt_decode(token);
        let user = null;
        if (decoded && decoded.id) {
          localStorage.setItem("accessToken", token);
          user = await me();
          console.log("LoginGitHub: user =", user);
          setLoading(false);

          router.push(`/home`);
        }
      }
    };

    initialize();
  });

  const me = async (): Promise<User> => {
    try {
      return await apiService.get<any>(`/me`);
    } catch (err) {
      console.log("AuthProviderJWT:me: error = ", err);
      return err;
    }
  };

  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          mb: 0,
        }}
      >
        <Link href="http://localhost:4000/api/v1/auth/github-login" passHref>
          <LoadingButton
            style={{ width: "100%" }}
            variant="contained"
            color="primary"
            startIcon={
              <Avatar src={"/static/logos/GitHub-Mark-Light-64px.png"} />
            }
            loading={loading}
          >
            Login with GitHub
          </LoadingButton>
        </Link>
      </Box>
    </>
  );
};

export default LoginGitHub;
