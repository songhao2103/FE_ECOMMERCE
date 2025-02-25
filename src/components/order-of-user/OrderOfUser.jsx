import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import baseUrl from "../../config/baseUrl";
import fetchWithAuth from "../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../utils/tokenApi/refreshToken";
import {
  capitalizeFirstLetter,
  formatCurrencyVND,
} from "../../utils/format/format";
import Loader from "../../utils-component/loader/Loader";
import { handleCopy } from "../../utils/interact-with-DOM/interactWithDOM";

const OrderOfUser = () => {
  const userLogged = useSelector((state) => state.userLoggedSlice.userLogged);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersList, setOrdersList] = useState();
  const [selectValue, setSelectValue] = useState("all");
  const [ordersRender, setOrdersRender] = useState([]);

  //gọi API để lấy danh sách các đơn hàng của người dùng
  useEffect(() => {
    const fetchData = async () => {
      if (userLogged) {
        setIsLoading(true);
        try {
          let response = await fetchWithAuth(
            baseUrl + `/order/order-of-user/${userLogged._id}`
          );

          if (response.status === 403) {
            const refreshTokenResponse = await refreshToken();

            if (!refreshTokenResponse.ok) {
              throw new Error(
                "Không lấy được danh sách đơn hàng của người dùng!!"
              );
            }

            response = await fetchWithAuth(
              baseUrl + `/order/order-of-user/${userLogged._id}`
            );
          }

          const data = await response.json();

          setOrdersList(data);
          setOrdersRender(data);
        } catch (error) {
          console.log(
            "Không lấy được danh sách đơn hàng của người dùng!! error: " +
              error.message
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [userLogged]);

  //Cập nhật lại ordersRender mỗi khi người dùng thay đổi lựa chọn
  useEffect(() => {
    if (selectValue === "all") {
      setOrdersRender(ordersList);
    } else {
      const newOrderRender = ordersList.filter(
        (order) => order.status === selectValue
      );
      setOrdersRender(newOrderRender);
    }
  }, [selectValue, ordersList]);

  //hàm xử lý khi người dùng thay đổi lựa chọn
  const handleTurnSelectOption = (newValue) => {
    if (newValue !== selectValue) {
      setSelectValue(newValue);
    }
  };

  //hàm sử lý khi người dùng chọn hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    //cập nhật ở state
    const newOrdersList = [...ordersList].map((order) =>
      order._id === orderId ? { ...order, status: "canceled" } : order
    );
    setOrdersList(newOrdersList);

    //gọi api để hủy đơn hàng
    try {
      let response = await fetchWithAuth(
        baseUrl + `/order/cancel-order/${orderId}`
      );

      if (response.status === 403) {
        const refreshTokenResponse = await refreshToken();

        if (!refreshTokenResponse.ok) {
          throw new Error("Lỗi khi người dùng hủy đơn hàng!!");
        }

        response = await fetchWithAuth(
          baseUrl + `/order/cancel-order/${orderId}`
        );
      }
    } catch (error) {
      console.log("Lỗi khi người dùng hủy đơn hàng!! " + error.message);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="order_of_user_page">
      <div className="top">
        <div className="title_36">My Order</div>
      </div>

      <div className="content_page">
        <div className="box_select">
          <p
            className={`desc ${selectValue === "all" ? "active" : ""}`}
            onClick={() => handleTurnSelectOption("all")}
          >
            All
          </p>
          <p
            className={`desc ${selectValue === "pending" ? "active" : ""}`}
            onClick={() => handleTurnSelectOption("pending")}
          >
            Pending
          </p>
          <p
            className={`desc ${selectValue === "shipping" ? "active" : ""}`}
            onClick={() => handleTurnSelectOption("shipping")}
          >
            Shipping
          </p>
          <p
            className={`desc ${selectValue === "completed" ? "active" : ""}`}
            onClick={() => handleTurnSelectOption("completed")}
          >
            Completed
          </p>
          <p
            className={`desc ${selectValue === "canceled" ? "active" : ""}`}
            onClick={() => handleTurnSelectOption("canceled")}
          >
            Canceled
          </p>
        </div>
        <div className="orders_list">
          {ordersRender.length > 0 &&
            ordersRender.map((order) => (
              <div className="box_order" key={order._id}>
                <div className="top">
                  <p className="store_name desc">
                    Store: <span className="desc">{order.storeName}</span>
                  </p>
                  <div className="box_right">
                    <p className="status desc">
                      Status:
                      <span className="desc">
                        {capitalizeFirstLetter(order.status)}
                      </span>
                    </p>

                    <div className="box_code">
                      <p className="desc"> Code:</p>
                      <p className="desc code" id={order._id}>
                        {order._id.toUpperCase()}
                      </p>
                      <p
                        className="desc copy"
                        onClick={() =>
                          handleCopy(
                            document.getElementById(order._id).innerText
                          )
                        }
                      >
                        Sao chép
                      </p>
                    </div>
                  </div>
                </div>
                <div className="products_list">
                  {order.products.map((product) => (
                    <div className="box_product" key={product.productId}>
                      <div className="box_image">
                        <img src={product.imageOrder.url} alt="" />
                      </div>

                      <div className="box_content">
                        <div className="info">
                          <p className="title_20">{product.productName}</p>
                          <p className="desc">
                            Quantity:
                            <span className="desc">{product.quantity}</span>
                          </p>
                          <p className="desc">
                            Color:
                            <span className="desc">
                              {capitalizeFirstLetter(product.imageOrder.color)}
                            </span>
                          </p>
                        </div>

                        <div className="box_right">
                          <div className="box_price">
                            <p className="new_price desc">
                              {formatCurrencyVND(
                                ((100 - product.discount) * product.price) / 100
                              )}
                            </p>
                            {product.discount > 0 && (
                              <p className="old_price desc">
                                {formatCurrencyVND(product.price)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bottom">
                  <div className="content_bottom">
                    <div className="price_order">
                      <p className="desc">
                        Shipping fee:
                        <span className="desc">
                          {formatCurrencyVND(order.shippingFee)}
                        </span>
                      </p>

                      <p className=" desc">
                        Total:
                        <span className="desc">
                          {formatCurrencyVND(
                            (order.products || []).reduce(
                              (sub, product) =>
                                sub +
                                (product.price * (100 - product.discount)) /
                                  100,
                              0
                            ) + (order.shippingFee || 0) // Tránh lỗi nếu order.shippingFee là undefined
                          )}
                        </span>
                      </p>
                    </div>
                    {order.status === "canceled" && (
                      <button className="btn_dark_pink">Buy back</button>
                    )}
                    {order.status === "pending" && (
                      <button
                        className="btn_dark_pink"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderOfUser;
