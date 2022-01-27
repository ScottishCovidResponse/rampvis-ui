import { useRouter } from "next/router";
import * as React from "react";

export interface PostMountRedirectToPageProps {
  pageIdByRoute: Record<string, string>;
  children?: React.ReactNode;
}

/**
 * This component would not be necessary if we could return a redirect from getStaticProps.
 * However, this is not allowed as of Next.js 12.0:
 * https://nextjs.org/docs/messages/gsp-redirect-during-prerender
 */
const PostMountRedirectToPage: React.VoidFunctionComponent<
  PostMountRedirectToPageProps
> = ({ pageIdByRoute, children }) => {
  const [ready, setReady] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    const pageId = pageIdByRoute[router.asPath];
    if (pageId) {
      router.replace(`/page?id=${pageId}`);
    } else {
      setReady(true);
    }
  }, [pageIdByRoute, router]);

  if (!ready) {
    return <div></div>;
  }

  return <>{children}</>;
};

export default PostMountRedirectToPage;
