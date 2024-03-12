import axios, { AxiosInstance } from "axios";

const {
  VITE_CODER_SERVER_API: CODER_SERVER_API,
  VITE_CODER_API_KEY: CODER_API_KEY,
} = import.meta.env;

const instance: AxiosInstance = axios.create({
  baseURL: CODER_SERVER_API,
});

instance.interceptors.request.use(
  (config) => {
    config.headers["Coder-Session-Token"] = CODER_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
