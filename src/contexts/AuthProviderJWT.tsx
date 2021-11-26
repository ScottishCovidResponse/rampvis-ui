import { createContext, useEffect, useReducer } from "react";
import type { FC, ReactNode } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import type { User } from "src/types/user";
import { ITokenData } from "src/types/tokenData";
import { apiService } from "src/utils/apiService";
import { IDataStoredInToken } from "src/types/dataStoredInToken";

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends State {
  platform: "JWT";
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: "INITIALIZE";
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: "LOGIN";
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: "LOGOUT";
};

type RegisterAction = {
  type: "REGISTER";
  payload: {
    user: User;
  };
};

type Action = InitializeAction | LoginAction | LogoutAction | RegisterAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: "JWT",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const AuthProviderJWT: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken) {
          // TODO: check if we need to call again?
          const user = await me();

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error("AuthProviderJWT: error =", err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res: ITokenData = await apiService.post(`/auth/login`, {
        email,
        password,
      });

      const accessToken = res.token;
      const decoded: IDataStoredInToken = await jwt_decode(res.token);
      let user = null;
      if (decoded && decoded.id) {
        localStorage.setItem("accessToken", accessToken);
        user = await me();
      }

      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });

      router.push(`/`);
    } catch (err) {
      console.error("AuthProviderJWT:login: error =", err);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem("accessToken");
    dispatch({ type: "LOGOUT" });
    router.push(`/auth/login`);
  };

  const me = async (): Promise<User> => {
    try {
      return await apiService.get(`/me`);
    } catch (err) {
      console.log("AuthProviderJWT:me: error = ", err);
      return err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "JWT",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
