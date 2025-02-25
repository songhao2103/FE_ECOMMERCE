import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../utils-component/loader/Loader";
import fetchWithAuth from "../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../utils/tokenApi/refreshToken";
import baseUrl from "../../config/baseUrl";
import {
  formatCurrencyVND,
  capitalizeFirstLetter,
} from "../../utils/format/format";
import { updateCart } from "../../redux-toolkit/redux-slice/userLogged";
import { showToast } from "../../redux-toolkit/redux-slice/toastSlice";
import Toast from "../../utils-component/toast/Toast";
import OrderPage from "./order-page/OrderPage";

const Cart = () => {
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.userLoggedSlice.userLogged);
  const [productsOfCart, setProductsOfCart] = useState([]); //lưu thông tin của các sản phẩm có trong giỏ hàng
  const [isLoading, setIsLoading] = useState(true);
  const [productsSelect, setProductSelect] = useState([]); // lưu các sản phẩm mà người dùng chọn
  const [isOrder, setIsOrder] = useState(false);
  const cart = useSelector((state) => state.userLoggedSlice.cart); //lấy giỏ hàng từ   store của redux

  //lấy thông tin chi tiết của các sản phẩm có trong cửa hàng
  useEffect(() => {
    if (cart?.products?.length > 0) {
      const fetchProductsOfCart = async () => {
        try {
          setIsLoading(true);
          let response = await fetchWithAuth(baseUrl + "/cart/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cart),
          });

          if (response.status === 403) {
            const refreshTokenResponse = await refreshToken();

            if (!refreshTokenResponse.ok) {
              throw new Error(
                "Lỗi khi cập nhật lại accessToken!! " +
                  refreshTokenResponse.status
              );
            }
          }

          response = await fetchWithAuth(baseUrl + "/cart/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cart),
          });

          const data = await response.json();

          const productsSelect = new Map(
            data.products.map((product) => [product._id, false])
          );

          setProductSelect(productsSelect);
          setProductsOfCart(data.products);
        } catch (error) {
          console.log(
            "Lỗi khi lấy danh sách sản phẩm của giỏ hàng!! " + error.message
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchProductsOfCart();
    } else {
      setIsLoading(false);
    }
  }, [cart]);

  //hàm tính toán lại tổng số tiền của giỏ hàng
  const subtotal = useMemo(() => {
    let sub = 0;
    productsOfCart.forEach((product) => {
      if (productsSelect.get(product._id)) {
        sub =
          sub +
          ((product.price * (100 - product.discount)) / 100) *
            product.quantityOnCart;
      }
    });
    return sub;
  }, [productsSelect, productsOfCart]);

  //hàm gọi API để cập nhật lại cart
  const updateCartOnDatabase = async (newCart) => {
    try {
      let response = await fetchWithAuth(baseUrl + "/cart/update-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCart),
      });

      if (response.status === 403) {
        const refreshTokenResponse = await refreshToken();

        if (!refreshTokenResponse.ok) {
          throw new Error("Không cập nhật được lại access token!!");
        }
      }

      response = await fetchWithAuth(baseUrl + "/cart/update-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCart),
      });
    } catch (error) {
      console.log("Không cập nhật được giỏ hàng!!" + error.message);
    }
  };

  //hàm xử lý khi người dùng chọn sản phẩm
  const handleSelectProduct = (productId, type) => {
    if (type === "select_all") {
      setProductSelect((prev) => {
        const newMap = new Map(prev);
        newMap.forEach((value, key) => newMap.set(key, true)); // Đặt tất cả thành true
        return newMap;
      });
    } else if (type === "deselect_all") {
      setProductSelect((prev) => {
        const newMap = new Map(prev);
        newMap.forEach((value, key) => newMap.set(key, false)); // Đặt tất cả thành false
        return newMap;
      });
    } else {
      setProductSelect((prev) => {
        const newMap = new Map(prev);
        newMap.set(productId, !prev.get(productId)); // Đảo trạng thái sản phẩm được chọn
        return newMap;
      });
    }
  };

  //hàm kiểm tra xem toàn các giá trị trong map và trả về true hoặc false
  const checkMapValue = (map, valueCheck) =>
    [...map.values()].every((value) => value === valueCheck);

  //hàm xử lý tăng giảm số lượng
  const handleTurnQuantity = async (
    productId,
    value,
    currentQuantity,
    quantityInStock
  ) => {
    if (value === -1 && currentQuantity === 1) {
      return;
    }

    if (value === 1 && currentQuantity >= quantityInStock) {
      dispatch(
        showToast({ message: "Số lượng sản phẩm trong kho không đủ!!" })
      );
      return;
    }

    //cập nhật ở state
    const newProductsOfCart = productsOfCart.map((product) =>
      product._id === productId
        ? { ...product, quantityOnCart: product.quantityOnCart + value }
        : product
    );
    setProductsOfCart(newProductsOfCart);

    //cập nhật ở state của redux
    const newCart = {
      ...cart,
      products: cart.products.map((product) =>
        product.productId == productId
          ? { ...product, quantity: product.quantity + value }
          : product
      ),
    };

    dispatch(updateCart(newCart));

    //cập nhật giỏ hàng ở database
    await updateCartOnDatabase(newCart);
  };

  //hàm xử lý khi xóa 1 sản phẩm
  const handleDeleteProductOnCart = async (productId) => {
    const newProductsOfCart = productsOfCart.filter(
      (product) => product._id !== productId
    );

    //cập nhật lại state
    setProductsOfCart(newProductsOfCart);

    //cập nhật lại state ở redux
    const newCart = { ...cart, products: newProductsOfCart };
    dispatch(updateCart(newCart));

    //cập nhật lại giỏ hàng ở database
    await updateCartOnDatabase(newCart);
  };

  //hàm xử lý bật tắt trang order
  const handleTurnOrderPage = (value) => {
    if (value) {
      if (subtotal > 0) {
        setIsOrder(true);
      }
    } else {
      setIsOrder(false);
    }
  };

  //hàm xử lý cập nhật lại giỏ hàng ở redux
  const updateCartOnRedux = (newCart) => {
    dispatch(updateCart(newCart));
  };

  //hàm cập nhật lại danh sách sản phẩm có trong giỏ hàng
  const handleUpdateProductsOfCart = (productIds) => {
    const newProductsOfCart = [...productsOfCart].filter(
      (product) => !productIds.includes(product.productId)
    );
    setProductsOfCart(newProductsOfCart);
  };
  if (isLoading && productsOfCart.length === 0) return <Loader />;

  if (isOrder)
    return (
      <OrderPage
        userLogged={userLogged}
        productsOnOrderPage={productsOfCart.filter((product) =>
          productsSelect.get(product._id)
        )}
        handleTurnOrderPage={handleTurnOrderPage}
        updateCartOnRedux={updateCartOnRedux}
        handleUpdateProductsOfCart={handleUpdateProductsOfCart}
      />
    );

  return (
    <div className="cart_page">
      <Toast />
      <div className="title_36">Cart</div>
      <div className="products_of_cart">
        {productsOfCart.length === 0 && (
          <p className="desc">Chưa có sản phẩm nào</p>
        )}
        {productsOfCart.length > 0 && (
          <div className="select_all">
            <button
              className={`btn_dark_pink ${
                checkMapValue(productsSelect, true) ? "active" : ""
              }`}
              onClick={() => handleSelectProduct("", "select_all")}
            >
              Select All
            </button>
            <button
              className={`btn_dark_pink ${
                checkMapValue(productsSelect, false) ? "active" : ""
              }`}
              onClick={() => handleSelectProduct("", "deselect_all")}
            >
              Deselect All
            </button>
          </div>
        )}
        {productsOfCart.length > 0 &&
          productsOfCart.map((product) => (
            <div className="box_product" key={product._id}>
              <div className="box_image">
                <img src={product.imageDefault.url} alt="" />
              </div>

              <div className="content">
                <div className="info">
                  <div className="title_20">{`${
                    product.productName
                  } - ${capitalizeFirstLetter(product.colorOnCart)}`}</div>
                  <div className="box_price">
                    {product.discount > 0 && (
                      <p className="old_price desc">
                        {formatCurrencyVND(product.price)}
                      </p>
                    )}

                    <p className="new_price desc">
                      {formatCurrencyVND(
                        ((100 - product.discount) * product.price) / 100
                      )}
                    </p>
                  </div>
                </div>

                <div className="box_options">
                  <div className="box_quantity">
                    <div
                      className="icon desc"
                      onClick={() =>
                        handleTurnQuantity(
                          product._id,
                          -1,
                          product.quantityOnCart
                        )
                      }
                    >
                      -
                    </div>
                    <div className="quantity desc">
                      {product.quantityOnCart}
                    </div>
                    <div
                      className="icon desc"
                      onClick={() =>
                        handleTurnQuantity(
                          product._id,
                          1,
                          product.quantityOnCart,
                          product[product.colorOnCart + "Quantity"]
                        )
                      }
                    >
                      +
                    </div>
                  </div>
                  <div className="total_price desc">
                    {`Total: ${formatCurrencyVND(
                      ((product.price * (100 - product.discount)) / 100) *
                        product.quantityOnCart
                    )}`}
                  </div>
                </div>
              </div>

              <div className="input_select">
                <input
                  type="checkbox"
                  onChange={() => handleSelectProduct(product._id)}
                  checked={productsSelect.get(product._id)}
                />
              </div>
              <div
                className="delete icon"
                onClick={() => handleDeleteProductOnCart(product._id)}
              >
                <i className="fa-solid fa-trash-can"></i>
              </div>
            </div>
          ))}
      </div>

      <div className="bottom">
        <div className="content">
          <p className="desc">
            Total Amount:
            <span className="desc total">{formatCurrencyVND(subtotal)}</span>
          </p>

          <button
            className={`btn_dark_pink ${subtotal > 0 ? "" : "no_drop"}`}
            onClick={() => handleTurnOrderPage(true)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
