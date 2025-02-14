import { useEffect, useMemo, useState } from "react";
import baseUrl from "../../../config/baseUrl";
import refreshToken from "../../../utils/tokenApi/refreshToken";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import { formatCurrencyVND } from "../../../utils/format/format";
import PopupInfoUserAtOrder from "../popup-info-user-at-order/PopupInfoUserAtOrder";

const OrderPage = ({ productsOnOrderPage, userLogged }) => {
  const [ordersList, setOrdersList] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({});

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

    let newShippingMoney = {};
    ordersList.forEach((order) => {
      newShippingMoney = !deliveryAddress.provinceOrCity
        ? 0
        : order.storeAddress === "foreign"
        ? formatCurrencyVND(50000)
        : order.storeAddress === deliveryAddress.provinceOrCity
        ? formatCurrencyVND(15000)
        : formatCurrencyVND(300000);
    });
    return newShippingMoney;
  }, [deliveryAddress, ordersList]);

  return (
    <div className="order_page">
      <PopupInfoUserAtOrder userLogged={userLogged} />
      <div className="top">
        <button className="btn_dark_pink">
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
                    !deliveryAddress.provinceOrCity
                      ? "Chưa có địa chỉ giao hàng!!"
                      : order.storeAddress === "foreign"
                      ? formatCurrencyVND(50000)
                      : order.storeAddress === deliveryAddress.provinceOrCity
                      ? formatCurrencyVND(15000)
                      : formatCurrencyVND(300000)
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

      <div className="box_place_order">
        <div className="content">
          {" "}
          <div className="box_payment">
            <label htmlFor="payment" className="desc">
              Hình thức thanh toán
            </label>
            <select name="" id="payment">
              <option value="thanh_toan_khi_nhan_hang">
                Thanh toán khi nhận hàng
              </option>
              <option value="the ngân hàng">Thẻ ngân hàng</option>
            </select>
          </div>
          <div className="total_product_amount item">
            <p className="desc">Tổng tiền sản phẩm:</p>
            <p className="desc">
              {formatCurrencyVND(
                Object.values(subtotalPriceOfOrder).reduce(
                  (sub, item) => sub + item,
                  0
                )
              )}
            </p>
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
          <div className="btn_dark_pink">Đặt hàng</div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
