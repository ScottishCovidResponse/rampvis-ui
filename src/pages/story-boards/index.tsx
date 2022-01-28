import React, { useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import { experimentalStyled as styled } from "@mui/material/styles";
import Link from "next/link";

import styles from "src/components/story-boards/StoryBoards.module.css";

// https://ssvg.io/examples

const StoryBoards = () => {
  return (
    <>
      <Head>
        <title>Storyboards</title>
      </Head>
      <DashboardLayout>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 8,
          }}
        >
          <Container>
            <Card sx={{ minWidth: 1200 }}>
              <CardContent>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={6}>
                    <Link href="/story-boards/story-1" passHref>
                      <div className={styles.container}>
                        <img
                          src="/static/story-boards/story-1.png"
                          className={styles.image}
                        ></img>
                        <div className={styles.overlay}>
                          <div className={styles.text}>Story-1</div>
                        </div>
                      </div>
                    </Link>
                  </Grid>
                  <Grid item xs={6}>
                    <Link href="/story-boards/story-2" passHref>
                      <div className={styles.container}>
                        <img
                          src="/static/story-boards/story-2.png"
                          className={styles.image}
                        ></img>
                        <div className={styles.overlay}>
                          <div className={styles.text}>Story-2</div>
                        </div>
                      </div>
                    </Link>
                  </Grid>

                  <Grid item xs={6}>
                    <Link href="/story-boards/story-3" passHref>
                      <div className={styles.container}>
                        <img
                          src="/static/story-boards/story-3.png"
                          className={styles.image}
                        ></img>
                        <div className={styles.overlay}>
                          <div className={styles.text}>Story-3</div>
                        </div>
                      </div>
                    </Link>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Link href="/story-boards/story-4" passHref>
                      <div className={styles.container}>
                        <img
                          src="/static/story-boards/story-.png"
                          className={styles.image}
                        ></img>
                        <div className={styles.overlay}>
                          <div className={styles.text}>Story-4</div>
                        </div>
                      </div>
                    </Link>
                  </Grid> */}
                </Grid>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default StoryBoards;
