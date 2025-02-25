import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import baseUrl from "../../../config/baseUrl";
import refreshToken from "../../../utils/tokenApi/refreshToken";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import { formatCurrencyVND } from "../../../utils/format/format";
import PopupInfoUserAtOrder from "../popup-info-user-at-order/PopupInfoUserAtOrder";
import Toast from "../../../utils-component/toast/Toast";
import { showToast } from "../../../redux-toolkit/redux-slice/toastSlice";

const OrderPage = ({
  productsOnOrderPage,
  userLogged,
  handleTurnOrderPage,
  updateCartOnRedux,
  handleUpdateProductsOfCart,
}) => {
  const [ordersList, setOrdersList] = useState([]);
  const [turnPopup, setTurnPopup] = useState(false);
  const dispatch = useDispatch();

  const [currentOrderAddress, setCurrentOrderAddress] = useState({
    userName: userLogged.userName,
    phoneNumber: userLogged.phoneNumber || "",
    cityOrProvince: userLogged.address?.cityOrProvince || "",
    district: userLogged.address?.district || "",
    wardOrCommune: userLogged.address?.wardOrCommune || "",
    specificAddress: userLogged.address?.specific || "",
  });

  const [paymentOrder, setPaymentOrder] = useState("derect_payment");
  const [errorOrder, setErrorOrder] = useState({
    address: false,
    payment: false,
  });

  // Tạo các order, chia các sản phẩm của cùng 1 store thành 1 order
  useEffect(() => {
    //khởi tạo orderList mới
    let newOrderList = [];

    productsOnOrderPage.forEach((product) => {
      //kiểm tra trong newOrderList đã có order này chưa
      const isExist = newOrderList.find(
        (order) => order.storeName === product.storeName
      );

      //nếu chưa có tạo 1 order mới
      if (!isExist) {
        const newOrder = {
          storeName: product.storeName,
          products: [product],
        };

        //thêm vào list
        newOrderList.push(newOrder);
      } else {
        //nếu đã có thì thêm sản phẩm vào order
        newOrderList.map((order) =>
          order.storeName === product.storeName
            ? { ...order, products: order.products.push(product) }
            : order
        );
      }
    });

    //gọi API để lấy địa chỉ của các store
    const fetchAddressStore = async () => {
      try {
        let response = await fetchWithAuth(baseUrl + "/store/get-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrderList),
        });

        if (response.status === 403) {
          const refreshTokenResponse = await refreshToken();

          if (!refreshTokenResponse.ok) {
            throw new Error("Không cập nhật được access token!!");
          }
        }

        response = await fetchWithAuth(baseUrl + "/store/get-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrderList),
        });

        const data = await response.json();
        setOrdersList(data);
      } catch (error) {
        console.log(
          "Không lấy được địa chỉ của các cửa hàng!! " + error.message
        );
      }
    };
    fetchAddressStore();
  }, []);

  //hàm tính toán tổng hàng của các đơn hàng
  const subtotalPriceOfOrder = useMemo(
    () =>
      ordersList.reduce((acc, order) => {
        acc[order.storeName] = order.products.reduce(
          (storeTotal, product) =>
            storeTotal +
            ((product.price * (100 - product.discount)) / 100) *
              product.quantityOnCart,
          acc[order.storeName] || 0
        );
        return acc;
      }, {}),
    [ordersList]
  );

  //hàm tính tiền vận chuyển của các order
  const shippingMoney = useMemo(() => {
    if (!ordersList) {
      return;
    }

    let newShippingMoney = 0;
    ordersList.forEach((order) => {
      newShippingMoney += !currentOrderAddress?.cityOrProvince?.name
        ? 0
        : order.storeAddress === "foreign"
        ? 50000
        : order.storeAddress === currentOrderAddress?.cityOrProvince?.name
        ? 15000
        : 30000;
    });

    return newShippingMoney;
  }, [currentOrderAddress, ordersList]);

  //hàm xử lý bật tắt popup
  const handleTurnPopup = (turnType) => {
    if (turnType === "turn_on") {
      setTurnPopup(true);
    } else {
      setTurnPopup(false);
    }
  };

  //hàm xử lý tính cập nhật lại currentOrderAddress
  const handleUpdateCurrentOrderAddress = (newCurrentOrderAddress) => {
    setCurrentOrderAddress(newCurrentOrderAddress);
    let newError = { ...errorOrder };
    if (
      !newCurrentOrderAddress.userName ||
      !newCurrentOrderAddress.phoneNumber ||
      !newCurrentOrderAddress.specificAddress ||
      !newCurrentOrderAddress.cityOrProvince.name ||
      !newCurrentOrderAddress.district.name ||
      !newCurrentOrderAddress.wardOrCommune.name
    ) {
      newError.address = true;
    } else {
      newError.address = false;
    }
  };

  //hàm lựa chọn phương thức thanh toán
  const handleChangePaymentSelect = (e) => {
    setPaymentOrder(e.target.value);
  };

  //hàm xử lý khi người dùng xác nhận order
  const handleConfirmOrder = async () => {
    let newError = { ...errorOrder };
    if (
      !currentOrderAddress.userName ||
      !currentOrderAddress.phoneNumber ||
      !currentOrderAddress.specificAddress ||
      !currentOrderAddress.cityOrProvince.name ||
      !currentOrderAddress.district.name ||
      !currentOrderAddress.wardOrCommune.name
    ) {
      newError.address = true;
    } else {
      newError.address = false;
    }

    if (paymentOrder === "bank_card") {
      newError.payment = true;
    } else {
      newError.payment = false;
    }

    if (newError.payment || newError.address) {
      setErrorOrder(newError);
    } else {
      setErrorOrder(newError);

      //gọi API để tạo các order
      try {
        let response = await fetchWithAuth(baseUrl + "/order/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentOrderAddress,
            ordersList,
            userId: userLogged._id,
          }),
        });

        if (response.status === 403) {
          const refreshTokenResponse = await refreshToken();

          if (!refreshTokenResponse.ok) {
            throw new Error("Không tạo mới được order!!");
          }
        }

        response = await fetchWithAuth(baseUrl + "/order/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentOrderAddress,
            ordersList,
            userId: userLogged._id,
          }),
        });

        if (response.ok) {
          dispatch(
            showToast({
              message: "Đặt hàng thành công!!",
            })
          );

          //cập nhật lại giỏ hàng ở redux
          const data = await response.json();
          const productIds = data.products.map((product) => product.productId);
          handleUpdateProductsOfCart(productIds);
          updateCartOnRedux(data);
          handleTurnOrderPage(false);
        }
      } catch (error) {
        console.log("Không tạo được order!!  " + error.message);
      }
    }
  };

  return (
    <div className="order_page">
      <Toast />
      {turnPopup && (
        <PopupInfoUserAtOrder
          userLogged={userLogged}
          handleTurnPopup={handleTurnPopup}
          handleUpdateCurrentOrderAddress={handleUpdateCurrentOrderAddress}
          currentOrderAddress={currentOrderAddress}
        />
      )}

      <div className="top">
        <button
          className="btn_dark_pink"
          onClick={() => handleTurnOrderPage(false)}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <p className="title_36">Order</p>
      </div>

      <div className="orders_list">
        {ordersList.map((order) => (
          <div className="box_order" key={order.storeName}>
            {order.products.map((product) => (
              <div className="product_item" key={product._id}>
                <div className="box_image">
                  <img src={product.imageDefault.url} alt="" />
                </div>
                <p className="title_20">{product.productName}</p>
                <p className="desc price">
                  {formatCurrencyVND(
                    (product.price * (100 - product.discount)) / 100
                  )}
                </p>
                <p className="desc quantity">{`Số lượng: ${product.quantityOnCart}`}</p>
              </div>
            ))}

            <div className="box_bottom">
              <div className="bottom">
                <div className="item box_shipping desc">
                  <p className="desc">Shipping fee: </p>
                  <p className="desc">{`${
                    !currentOrderAddress.cityOrProvince?.name
                      ? "Chưa có địa chỉ giao hàng!!"
                      : order.storeAddress === "foreign"
                      ? formatCurrencyVND(50000)
                      : order.storeAddress ===
                        currentOrderAddress.cityOrProvince?.name
                      ? formatCurrencyVND(15000)
                      : formatCurrencyVND(30000)
                  }`}</p>
                </div>

                <div className="item subtotal desc">
                  <p className="desc">Subtotal:</p>
                  <p className="desc">{`${formatCurrencyVND(
                    subtotalPriceOfOrder[order.storeName]
                  )}`}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom_order">
        <div className="box_address">
          {errorOrder.address && (
            <div className="error_order">
              <p className="desc">Địa chỉ chưa hợp lệ!</p>
            </div>
          )}

          <div className="top">
            <div className="title_20">Address</div>
            <p className="desc" onClick={() => handleTurnPopup("turn_on")}>
              Thay đổi
            </p>
          </div>

          <div className="box_info">
            <p className="desc">User name:</p>
            <p className="desc">{currentOrderAddress.userName}</p>
          </div>
          <div className="box_info">
            <p className="desc">Phone number:</p>
            <p className="desc">
              {currentOrderAddress.phoneNumber
                ? currentOrderAddress.phoneNumber
                : "Chưa có số điện thoại!"}
            </p>
          </div>

          <div className="address box_info">
            <p className="desc">Address:</p>
            {currentOrderAddress.cityOrProvince ? (
              <p className="desc">{`${
                currentOrderAddress.wardOrCommune.name
                  ? currentOrderAddress.wardOrCommune.name + ","
                  : ""
              } ${
                currentOrderAddress.district.name
                  ? currentOrderAddress.district.name + ","
                  : ""
              } ${
                currentOrderAddress.cityOrProvince.name
                  ? currentOrderAddress.cityOrProvince.name + ","
                  : ""
              }`}</p>
            ) : (
              <p className="desc">Chưa có địa chỉ!</p>
            )}
          </div>
        </div>
        <div className="box_place_order">
          <div className="content">
            {errorOrder.payment && (
              <div className="error_order">
                <p className="desc">
                  Chưa cập nhật thanh toán bằng thẻ ngân hàng!!
                </p>
              </div>
            )}
            <div className="box_payment">
              <label htmlFor="payment" className="desc">
                Hình thức thanh toán
              </label>
              <select name="" id="payment" onChange={handleChangePaymentSelect}>
                <option value="derect_payment">Thanh toán khi nhận hàng</option>
                <option value="bank_card">Thẻ ngân hàng</option>
              </select>
            </div>
            <div className="total_product_amount item">
              <p className="desc">Tổng tiền sản phẩm:</p>
              <p className="desc">{formatCurrencyVND(shippingMoney)}</p>
            </div>
            <div className="total_shipping_amount item">
              <p className="desc">Tổng tiền vận chuyển:</p>
              <p className="desc">{formatCurrencyVND(shippingMoney)}</p>
            </div>
            <div className="total_amount item">
              <p className="desc">Tổng thanh toán:</p>
              <p className="desc">
                {formatCurrencyVND(
                  shippingMoney +
                    Object.values(subtotalPriceOfOrder).reduce(
                      (sub, item) => sub + item,
                      0
                    )
                )}
              </p>
            </div>
            <div className="btn_dark_pink" onClick={handleConfirmOrder}>
              Đặt hàng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
