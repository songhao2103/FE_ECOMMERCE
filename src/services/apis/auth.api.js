import httpPublic from "../axios/publicAxios";
import httpPrivate from "../axios/privateAxios";

const PREFIX_URL = "/api/auth";
export const AuthApi = {
  login: (data) => {
    return httpPublic.post(`${PREFIX_URL}/log-in`, data);
  },
  refetchToken: (refetchToken) => {
    return httpPublic.post(`${PREFIX_URL}/refetch`, refetchToken);
  },
  logout: (refetchToken) => {
    return httpPrivate.get(`${PREFIX_URL}/log-out`, refetchToken);
  },
};
