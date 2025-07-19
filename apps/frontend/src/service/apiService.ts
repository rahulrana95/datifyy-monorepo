// apps/frontend/src/service/apiService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ServiceResponse } from "./ErrorTypes";

class ApiService {
  private axiosInstance: AxiosInstance;
  private authToken: string;
  private prefixPath: string;

  constructor() {
    const baseURL =
      process.env.REACT_APP_ENV === "prod"
        ? process.env.REACT_APP_BACKENDEND_URL_PROD
        : process.env.REACT_APP_BACKENDEND_URL_DEV;
    
    this.authToken = "";
    this.prefixPath = 'api/v1'; // Default API prefix path

    if (!baseURL) {
      throw new Error(
        "Base URL is not defined. Check REACT_APP_FRONTEND_URL_PROD or REACT_APP_FRONTEND_URL_DEV in your environment variables."
      );
    }

    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.authToken,
      },
    });

    this.setupInterceptors();
  }

  handleError(error: any) {
    return error?.message ?? ''
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error("API Error:", error?.response?.data || error.message);
        return Promise.reject(error?.response?.data || error.message);
      }
    );
  }

  private async handleRequest<T>(
    request: Promise<AxiosResponse<T>>
  ): Promise<ServiceResponse<T>> {
    try {
      const { data } = await request;
      return { response: data };
    } catch (error: any) {
      return {
        error: {
          code: error?.response?.status || 500,
          message: error?.response?.data?.message || error?.message || "An error occurred",
        },
      };
    }
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    const url = this.prefixPath ? `${this.prefixPath}/${path}` : path;
    return this.handleRequest<T>(
      this.axiosInstance.get<T>(url, config)
    );
  }

  async post<T>(
    path: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ServiceResponse<T>> {
    const url = this.prefixPath ? `${this.prefixPath}/${path}` : path;
    return this.handleRequest<T>(
      this.axiosInstance.post<T>(url, data, config)
    );
  }

  async put<T>(
    path: string, 
    data?: unknown, 
    config?: AxiosRequestConfig
  ): Promise<ServiceResponse<T>> {
    const url = this.prefixPath ? `${this.prefixPath}/${path}` : path;
    return this.handleRequest<T>(
      this.axiosInstance.put<T>(url, data, config)
    );
  }

  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    const url = this.prefixPath ? `${this.prefixPath}/${path}` : path;
    return this.handleRequest<T>(
      this.axiosInstance.delete<T>(url, config)
    );
  }

  async setAuthToken(token: string) {
    this.authToken = token;
    this.axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  }

  async setTokenFromCookies(): Promise<boolean> { 
    const token = await this.getTokenFromCookies();
    this.setTokenInCookies(token);
    if (token) {
      this.setAuthToken(token);
    }
    return !!this.authToken;
  }

  async setTokenInCookies(token: string) {
    document.cookie = `Authorization=${token}; path=/;`;
    this.setAuthToken(token);
  }

  async getTokenFromCookies(): Promise<string> { 
    const match = document.cookie.match(new RegExp('(^| )Authorization=([^;]+)'));
    if (match) {
      this.setAuthToken(match[2]);
    }
    return match?.[2] ?? '';
  }
  
  async clearToken() {
    this.authToken = "";
    this.axiosInstance.defaults.headers.Authorization = "";
    document.cookie = "Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

const apiService = new ApiService();
export default apiService;