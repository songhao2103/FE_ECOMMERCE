import httpPrivate from "../axios/privateAxios";

const PREFIX_URL = "/api/cart";

export const CartApis = {
  addProductToCart: (data) => {
    return httpPrivate.post(`${PREFIX_URL}/add-product`, data);
  },
  getProductOnCart: () => {
    return httpPrivate.get(`${PREFIX_URL}/get-products`);
  },
  updateProductOnCart: (data) => {
    return httpPrivate.post(`${PREFIX_URL}/update-product`, data);
  },
  getQuantityOnCart: () => {
    return httpPrivate.get(`${PREFIX_URL}/get-quantity`);
  },
  removeProductFromCart: (id) => {
    return httpPrivate.delete(`${PREFIX_URL}/remove-product/${id}`);
  },
};
