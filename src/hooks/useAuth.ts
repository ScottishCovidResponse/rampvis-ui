import { useContext } from "react";
import AuthContext from "src/contexts/AuthProviderJWT";

const useAuth = () => useContext(AuthContext);

export default useAuth;
