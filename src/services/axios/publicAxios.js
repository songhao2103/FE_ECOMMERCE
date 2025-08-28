import axios from "axios";
import baseUrl from "../../config/baseUrl";

const publicAxios = axios.create({
  baseURL: baseUrl, // URL public
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicAxios;
