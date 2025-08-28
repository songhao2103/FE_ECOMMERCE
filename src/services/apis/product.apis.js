import httpClient from "../axios/publicAxios";

const PREFIX_URL = "/api/product";
export const ProductApis = {
  getProductList: (filters) => {
    return httpClient.post(`${PREFIX_URL}/list`, filters);
  },
  getProductBestSelling: () => {
    return httpClient.get(`${PREFIX_URL}/best-selling`);
  },
  getProductDetail: (productId) => {
    return httpClient.get(`${PREFIX_URL}/detail/${productId}`);
  },
};
