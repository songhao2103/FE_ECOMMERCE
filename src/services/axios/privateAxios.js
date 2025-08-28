import axios from "axios";
import {
  getLocalstorageData,
  setLocalstorageData,
} from "../../utils/localstorage/localstorageActions";
import { LOCALSTORAGE_KEY } from "../../utils/localstorage/localstorageKeys";
import { AuthApi } from "../apis/auth.api";
import baseUrl from "../../config/baseUrl";

const axiosInstance = axios.create({
  baseURL: baseUrl, // URL gốc
  timeout: 10000, // Timeout 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (nếu có)
    const token = getLocalstorageData(LOCALSTORAGE_KEY.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refetchTokenPromise;

axiosInstance.interceptors.response.use(
  (response) => response.data, // Trả luôn data
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const refetchToken = getLocalstorageData(LOCALSTORAGE_KEY.REFETCH_TOKEN);

      try {
        if (!refetchTokenPromise) {
          refetchTokenPromise = AuthApi.refetchToken(refetchToken)
            .then((response) => {
              const user = response?.data?.result?.user;
              const accessToken = response?.data?.result?.accessToken;
              const newrefetchToken = response?.data?.result?.refetchToken;
              if (!user || !refetchToken || !accessToken) {
                return;
              }
              setLocalstorageData(user, LOCALSTORAGE_KEY.USER);
              setLocalstorageData(accessToken, LOCALSTORAGE_KEY.ACCESS_TOKEN);
              setLocalstorageData(
                newrefetchToken,
                LOCALSTORAGE_KEY.REFETCH_TOKEN
              );
            })
            .catch((error) => {
              localStorage.clear();
              window.location.href("/log-in");
              throw error;
            })
            .finally(() => {
              refetchTokenPromise = null;
            });
        }

        const data = await refetchTokenPromise;
        refetchTokenPromise = null;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data?.data?.result?.accessToken}`;
      } catch (error) {
        localStorage.clear();
        window.location.href("/log-in");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
