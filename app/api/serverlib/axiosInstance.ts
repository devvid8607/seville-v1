import axios, { InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "https://dev-gateway.seville.studio",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers["Content-Type"] = "application/json";
    config.headers["Ocp-Apim-Subscription-Key"] =
      "2426f99ff0bb4f04a0454cbd7a5a2308";
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
