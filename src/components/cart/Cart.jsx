import { useEffect, useMemo, useState } from "react";
import {
  useGetProductOnCart,
  useRemoveProductFromCart,
  useUpdateProductOnCart,
} from "../../services/queries/cart.queries";
import Loader from "../../utils-component/loader/Loader";
import Toast from "../../utils-component/toast/Toast";
import {
  capitalizeFirstLetter,
  formatCurrencyVND,
} from "../../utils/format/format";
import OrderPage from "./order-page/OrderPage";

const Cart = () => {
  const [productOnCart, setProductOnCart] = useState([]); //lưu thông tin của các sản phẩm có trong giỏ hàng
  const [isOrder, setIsOrder] = useState(false);
  const { data: cartData, isPending: pendingGetCartData } =
    useGetProductOnCart();
  const { mutate: mtUpdateProductOnCart } = useUpdateProductOnCart();
  const { mutate: mtRemoveProductFromCart } = useRemoveProductFromCart();

  useEffect(() => {
    if (cartData) {
      setProductOnCart(
        cartData.map((item) => ({ ...item, isSelected: false }))
      );
    }
  }, [cartData]);

  //hàm tính toán lại tổng số tiền của giỏ hàng
  const subtotal = useMemo(() => {
    return productOnCart.reduce((sum, product) => {
      return sum + Math.floor((product.price * product.discount) / 100);
    }, 0);
  }, [productOnCart]);

  //hàm xử lý khi người dùng chọn sản phẩm
  const handleSelectProduct = (productId, type) => {
    if (type === "select_all") {
      if (isAllSelected) return;
      setProductOnCart((prev) => {
        return prev.map((item) => ({ ...item, isSelected: true }));
      });
    } else if (type === "deselect_all") {
      if (isHasItemSelected) return;
      setProductOnCart((prev) => {
        return prev.map((item) => ({ ...item, isSelected: false }));
      });
    } else {
      setProductOnCart((prev) => {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, isSelected: !item.isSelected }
            : item
        );
      });
    }
  };

  const isHasItemSelected = useMemo(() => {
    return productOnCart.some((pro) => pro.isSelected);
  }, [productOnCart]);

  const isAllSelected = useMemo(() => {
    return productOnCart.every((pro) => pro.isSelected);
  }, [productOnCart]);

  const handleUpdateQuantityProduct = (productOnCartId, value) => {
    const currentProductOnCart = productOnCart.find(
      (p) => p.productOnCartId == productOnCartId
    );

    if (!currentProductOnCart) return;

    const newQuantity = currentProductOnCart.quantityOnCart + value;
    if (
      newQuantity > currentProductOnCart.remainingProduct ||
      newQuantity <= 0
    ) {
      return;
    }
    const payload = {
      productOnCartId: currentProductOnCart.productOnCartId,
      newQuantity: newQuantity,
    };

    mtUpdateProductOnCart(payload);
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

  if (pendingGetCartData) return <Loader />;

  if (isOrder)
    return (
      <OrderPage
        productsOnOrderPage={productOnCart.filter(
          (product) => product.isSelected
        )}
        handleTurnOrderPage={handleTurnOrderPage}
      />
    );

  return (
    <div className="cart_page">
      <Toast />
      <div className="title_36">Cart</div>
      <div className="products_of_cart">
        {productOnCart?.length === 0 && (
          <p className="desc">Chưa có sản phẩm nào</p>
        )}
        {productOnCart?.length > 0 && (
          <div className="select_all">
            <button
              className={`btn_dark_pink ${isAllSelected ? "active" : ""}`}
              onClick={() => handleSelectProduct("", "select_all")}
            >
              Select All
            </button>
            <button
              className={`btn_dark_pink ${!isHasItemSelected ? "active" : ""}`}
              onClick={() => handleSelectProduct("", "deselect_all")}
            >
              Deselect All
            </button>
          </div>
        )}
        {productOnCart?.length > 0 &&
          productOnCart?.map((product) => (
            <div className="box_product" key={product.id}>
              <div className="box_image">
                <img src={product.imageDefault} alt="" />
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
                      onClick={() => {
                        handleUpdateQuantityProduct(
                          product.productOnCartId,
                          -1
                        );
                      }}
                    >
                      -
                    </div>
                    <div className="quantity desc">
                      {product.quantityOnCart}
                    </div>
                    <div
                      className="icon desc"
                      onClick={() => {
                        handleUpdateQuantityProduct(product.productOnCartId, 1);
                      }}
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
                  onChange={() => handleSelectProduct(product?.id)}
                  checked={product.isSelected}
                />
              </div>
              <div
                className="delete icon"
                onClick={() => {
                  mtRemoveProductFromCart(product.productOnCartId);
                }}
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
