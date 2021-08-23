// A custom hook that builds on useLocation to parse the query string for you.

import { useLocation } from "react-router-dom";

const useQuery = (): URLSearchParams =>
  new URLSearchParams(useLocation().search);

export default useQuery;
