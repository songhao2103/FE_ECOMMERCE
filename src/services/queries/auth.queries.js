import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "../apis/auth.api";
import { useNavigate } from "react-router-dom";
import {
  getLocalstorageData,
  setLocalstorageData,
} from "../../utils/localstorage/localstorageActions";
import { LOCALSTORAGE_KEY } from "../../utils/localstorage/localstorageKeys";

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => AuthApi.login(data),
    onSuccess: (data) => {
      const user = data?.data?.data?.user;
      const accessToken = data?.data?.data?.accessToken;
      const refetchToken = data?.data?.data?.refetchToken;

      if (!user || !refetchToken || !accessToken) {
        return;
      }

      setLocalstorageData(user, LOCALSTORAGE_KEY.USER);
      setLocalstorageData(accessToken, LOCALSTORAGE_KEY.ACCESS_TOKEN);
      setLocalstorageData(refetchToken, LOCALSTORAGE_KEY.REFETCH_TOKEN);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => {
      const refetchToken = getLocalstorageData(LOCALSTORAGE_KEY.REFETCH_TOKEN);

      return AuthApi.logout(refetchToken);
    },
    onSuccess: () => {
      localStorage.clear();
      window.location.href("/log-in");
    },
  });
};
