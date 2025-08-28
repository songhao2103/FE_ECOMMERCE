import { useQuery } from "@tanstack/react-query";
import { ProductApis } from "../apis/product.apis";

const PRODUCT_QUERIES = {
  get_product_list: "get_product_list",
  get_product_best_selling: "get_product_best_selling",
  get_product_detaild: "get_product_detaild",
};

export const useGetProductList = (filters) => {
  return useQuery({
    queryKey: [PRODUCT_QUERIES.get_product_list, filters],
    queryFn: async () => {
      const response = await ProductApis.getProductList(filters);

      return response?.data?.data || [];
    },
  });
};

export const useGetProductBestSelling = () => {
  return useQuery({
    queryKey: [PRODUCT_QUERIES.get_product_best_selling],
    queryFn: async () => {
      const response = await ProductApis.getProductBestSelling();
      return response?.data?.data || {};
    },
  });
};

export const useGetProductDetail = (productId) => {
  return useQuery({
    queryKey: [PRODUCT_QUERIES.get_product_detaild, productId],
    queryFn: async () => {
      const response = await ProductApis.getProductDetail(productId);

      return response?.data?.data || {};
    },
  });
};
