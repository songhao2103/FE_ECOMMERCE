import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartApis } from "../apis/cart.api";
import { showToast } from "../../redux-toolkit/redux-slice/toastSlice";

const CART_QUERY_KEY = {
  get_products_on_cart: "get_products_on_cart",
  get_quantity_on_cart: "get_quantity_on_cart",
};
export const useAddProductToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => CartApis.addProductToCart(data),
    onSuccess: () => {
      console.log("add");
      queryClient.invalidateQueries({
        queryKey: [CART_QUERY_KEY.get_quantity_on_cart],
      });
      showToast("Thêm sản phẩm thành công!");
    },
    onError: () => {
      showToast("Thêm sản phẩm thất bại");
    },
  });
};

export const useGetProductOnCart = () => {
  return useQuery({
    queryKey: [CART_QUERY_KEY.get_products_on_cart],
    queryFn: async () => {
      const response = await CartApis.getProductOnCart();
      return response?.data;
    },
  });
};

export const useUpdateProductOnCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => CartApis.updateProductOnCart(data),
    onSuccess: () => {
      showToast("Thêm sản phẩm thành công!");
      queryClient.invalidateQueries({
        queryKey: [CART_QUERY_KEY.get_products_on_cart],
      });
    },
    onError: () => {
      showToast("Thêm sản phẩm thất bại");
    },
  });
};

export const useGetQuantityOnCart = () => {
  return useQuery({
    queryKey: [CART_QUERY_KEY.get_quantity_on_cart],

    queryFn: async () => {
      var response = await CartApis.getQuantityOnCart();
      return response?.data;
    },
  });
};

export const useRemoveProductFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => CartApis.removeProductFromCart(id),
    onSuccess: () => {
      showToast("Xóa sản phẩm thành công nhaa!");
      queryClient.invalidateQueries({
        queryKey: [CART_QUERY_KEY.get_quantity_on_cart],
      });
      queryClient.invalidateQueries({
        queryKey: [CART_QUERY_KEY.get_products_on_cart],
      });
    },
    onError: () => {
      showToast("Xóa sản phẩm không thành công");
    },
  });
};
