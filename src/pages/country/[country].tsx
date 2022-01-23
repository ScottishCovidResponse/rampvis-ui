import { ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { useRouter } from "next/router";
import _ from "lodash";
import DashboardLayout from "src/components/dashboard-layout/DashboardLayout";
import UnderConstruction from "src/components/errors/UnderConstruction";
import { GetStaticProps, GetStaticPaths } from "next";

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

const pageIdByCountry: Record<string, string | undefined> = {
  england: process.env.NEXT_PUBLIC_PAGE_ID_ENGLAND,
  "northern-ireland": process.env.NEXT_PUBLIC_PAGE_ID_NOTHERN_IRELAND,
  scotland: process.env.NEXT_PUBLIC_PAGE_ID_SCOTLAND,
  wales: process.env.NEXT_PUBLIC_PAGE_ID_WALES,
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  const pageId =
    pageIdByCountry[
      typeof params["country"] === "string" ? params["country"] : ""
    ];

  if (pageId) {
    return {
      redirect: {
        destination: `/page?id=${pageId}`,
        permanent: false,
      },
    };
  }

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
