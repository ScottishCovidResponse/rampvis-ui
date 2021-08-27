/* eslint-disable @typescript-eslint/no-unused-vars */

import jwt_decode from "jwt-decode";

import { apiService } from "./apiService";
import { IDataStoredInToken } from "../types/dataStoredInToken";

import { User } from "../types/user";
import { ITokenData } from "src/types/tokenData";

const API_JS = process.env.REACT_APP_API_JS;

export class AuthService {
  async login({ email, password }): Promise<string> {
    try {
      const url: string = `/auth/login`;
      const res: ITokenData = await apiService.post<any>(url, {
        email,
        password,
      });
      apiService.setToken(res.token);
      return res.token;
    } catch (err) {
      console.log("AuthApi:login: error = ", err);
      return err;
    }
  }

  async me(accessToken): Promise<User> {
    try {
      const decoded: IDataStoredInToken = jwt_decode(accessToken);
      const url: string = `/user/${decoded.id}`;
      const res = await apiService.get<any>(url);
      return res;
    } catch (err) {
      console.log("AuthApi:me: error = ", err);
      return err;
    }
  }
}

export const authService = new AuthService();
