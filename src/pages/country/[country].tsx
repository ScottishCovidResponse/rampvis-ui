import { ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { useRouter } from "next/router";
import _ from "lodash";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import UnderConstruction from "src/components/errors/UnderConstruction";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";

const MyPortal = () => {
  const router = useRouter();
  const country = `${router.query.country}`;

  return (
    <>
      <Helmet>
        <title>{_.startCase(country)}</title>
      </Helmet>

      <UnderConstruction />
    </>
  );
};

MyPortal.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticProps: GetStaticProps = () => {
  return { props: {} };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      "/country/england",
      "/country/northern-ireland",
      "/country/scotland",
      "/country/wales",
    ],
    fallback: false,
  };
};

export default MyPortal;
