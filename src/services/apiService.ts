/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from "axios";

const API_JS = process.env.REACT_APP_API_JS;
const API_TS = process.env.REACT_APP_API_TS;

export class ApiService {
  private endpoint: string = API_JS;
  private token!: string;

  getEndpoint(url: string): string {
    if (url.indexOf("http") === 0) {
      return url;
    }

    if (!url.startsWith("/")) {
      url = `/${url}`;
    }

    return this.endpoint + url;
  }

  getAxiosInstance() {
    return axios.create({
      timeout: 1000,
      headers: { Authorization: `Bearer ${window.localStorage.getItem("accessToken")}` },
    });
  }

  // HTTP Methods

  public async get<T extends any>(url: string): Promise<T> {
    const res = await this.getAxiosInstance().get(this.getEndpoint(url));
    return res.data;
  }

  public async post<T extends any>(url: string, body: T): Promise<T> {
    const res = await this.getAxiosInstance().post(this.getEndpoint(url), body);
    return res.data;
  }

  //   put<T extends any>(url: string, body: T): Promise<T> {
  //     return this.getAxiosInstance().put(...);
  //   }

  //   patch<T extends any>(url: string, body: T): Observable<T> {
  //     return ...patch<T>(this.getEndpoint(url), body);
  //   }
}

export const apiService = new ApiService();
