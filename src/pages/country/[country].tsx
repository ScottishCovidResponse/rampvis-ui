import { ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { useRouter } from "next/router";
import _ from "lodash";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import UnderConstruction from "src/components/errors/UnderConstruction";
import { GetStaticPaths, GetStaticProps } from "next";
import PostMountRedirectToPage from "src/components/PostMountRedirectToPage";

const pageIdByRoute = {
  "/country/england": process.env.NEXT_PUBLIC_PAGE_ID_ENGLAND,
  "/country/northern-ireland": process.env.NEXT_PUBLIC_PAGE_ID_NORTHERN_IRELAND,
  "/country/scotland": process.env.NEXT_PUBLIC_PAGE_ID_SCOTLAND,
  "/country/wales": process.env.NEXT_PUBLIC_PAGE_ID_WALES,
};

const MyPortal = () => {
  const router = useRouter();
  const country = `${router.query.country}`;

  return (
    <PostMountRedirectToPage pageIdByRoute={pageIdByRoute}>
      <Helmet>
        <title>{_.startCase(country)}</title>
      </Helmet>

      <UnderConstruction />
    </PostMountRedirectToPage>
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
