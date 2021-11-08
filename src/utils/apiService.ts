/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from "axios";

const API_JS = process.env.NEXT_PUBLIC_API_JS;

export class ApiService {
  private endpoint: string = API_JS;

  getEndpoint(url: string): string {
    if (url.indexOf("http") === 0) {
      return url;
    }

    if (!url.startsWith("/")) {
      url = `/${url}`;
    }

    console.log(API_JS, this.endpoint, url);
    return this.endpoint + url;
  }

  getAxiosInstance() {
    return axios.create({
      // timeout: 60 * 1 * 1000, // 1 minute
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
      },
    });
  }

  // HTTP Methods

  async get<T extends any>(url: string): Promise<T> {
    console.log(
      "ApiService:get: url = ",
      url,
      "endpoint = ",
      this.getEndpoint(url),
    );
    const res = await this.getAxiosInstance().get(this.getEndpoint(url));
    return res.data;
  }

  async post<T extends any>(url: string, body: T): Promise<T> {
    console.log(
      "ApiService:post: url = ",
      url,
      "endpoint = ",
      this.getEndpoint(url),
    );
    const res = await this.getAxiosInstance().post(this.getEndpoint(url), body);
    return res.data;
  }

  async delete<T extends any>(url: string): Promise<T> {
    const res = await this.getAxiosInstance().delete(this.getEndpoint(url));
    return res.data;
  }

  // async put<T extends any>(url: string, body: T): Promise<T> {
  //     console.log("ApiService:put: url = ", url, "endpoint = ", this.getEndpoint(url))
  //     const res = await this.getAxiosInstance().put(this.getEndpoint(url));
  //     return res.data;
  // }

  //   patch<T extends any>(url: string, body: T): Observable<T> {
  //     return ...patch<T>(this.getEndpoint(url), body);
  //   }
}

export const apiService = new ApiService();
