import { useContext } from "react";
import AuthContext from "../contexts/AuthProviderJWT";

const useAuth = () => useContext(AuthContext);

export default useAuth;
