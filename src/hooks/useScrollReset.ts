import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import { useRouter } from 'next/router'

const useScrollReset = (): null => {
  // const location = useLocation();
  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.asPath] );

  return null;
};

export default useScrollReset;
