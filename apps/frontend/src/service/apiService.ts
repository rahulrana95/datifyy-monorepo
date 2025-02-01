import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiService {
  private axiosInstance: AxiosInstance;
  private authToken: string;

  constructor() {
    const baseURL =
      process.env.REACT_APP_ENV === "prod"
        ? process.env.REACT_APP_BACKENDEND_URL_PROD
        : process.env.REACT_APP_BACKENDEND_URL_DEV;
    
    this.authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaXNhZG1pbiI6ZmFsc2UsImlhdCI6MTczODM1NzM1NiwiZXhwIjoxNzM4NTMwMTU2fQ.nlj0gewX_PsZYTeGbYy38dqL13EdoiSUPktY28CLlEo';

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
    //   withCredentials: true, // Ensures cookies (e.g., JWT tokens) are sent
    });

    this.setupInterceptors();
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
  ): Promise<{ response?: T; error?: { code: number; message: string } }> {
    try {
      const { data } = await request;
      return { response: data };
    } catch (error: any) {
      return {
        error: {
          code: error?.response?.status || 500,
          message: error?.response?.data?.message || "An error occurred",
        },
      };
    }
  }

  async get<T>(path: string, config?: AxiosRequestConfig) {
    return this.handleRequest<T>(this.axiosInstance.get<T>(path, config));
  }

  async post<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.handleRequest<T>(
      this.axiosInstance.post<T>(path, data, config)
    );
  }

  async put<T>(path: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.handleRequest<T>(this.axiosInstance.put<T>(path, data, config));
  }

  async delete<T>(path: string, config?: AxiosRequestConfig) {
    return this.handleRequest<T>(this.axiosInstance.delete<T>(path, config));
  }

  async setAuthToken(token: string) {
    this.authToken = token;
    this.axiosInstance.defaults.headers.Authorization = `${token}`;
  }

  async setTokenFromCookies() { 
    const token = await this.getTokenFromCookies();
    if (token) {
      this.setAuthToken(token);
    }
  }


   async getTokenFromCookies() { 
    const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
    if (match) {
      this.authToken = match[2];
      this.setAuthToken(this.authToken);
    }
    return this.authToken;
  }
}

const apiService = new ApiService();
export default apiService;
