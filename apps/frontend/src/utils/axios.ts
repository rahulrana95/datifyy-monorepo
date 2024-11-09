// src/utils/axiosInstance.ts
import axios from "axios";

const baseUrl =
  process.env.REACT_APP_ENV === "dev"
    ? "http://localhost:3453/api/v1"
    : "https://datifyy-monorepo.onrender.com/api/v1";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: baseUrl, // Replace with your API's base URL
  headers: {
    "Content-Type": "application/json",
    // You can add other headers here like Authorization
  },
});

export default axiosInstance;
