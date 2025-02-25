import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import baseUrl from "../../../config/baseUrl";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../../utils/tokenApi/refreshToken";
import Loader from "../../../utils-component/loader/Loader";
import { showToast } from "../../../redux-toolkit/redux-slice/toastSlice";
import {
  capitalizeFirstLetter,
  formatCurrencyVND,
  formatDate,
} from "../../../utils/format/format";
import { handleCopy } from "../../../utils/interact-with-DOM/interactWithDOM";

//hàm tính tổng số tiền của 1 order
const calculateTotalAmountOrder = (productsList, shippingFee) => {
  const subAmount = productsList.reduce((sub, product) => {
    sub += (product.quantity * product.price * (100 - product.discount)) / 100;
    return sub;
  }, 0);

  return subAmount + shippingFee;
};

//hàm đếm trong map có bao nhiêu key có value là true
const countTrueInMap = (map) => {
  let count = 0;
  for (const value of map.values()) {
    if (value) count++;
  }
  return count;
};

const StoreOrderList = () => {
  const dispatch = useDispatch();
  const [ordersList, setOrdersList] = useState([]); //lưu danh sách các đơn hàng của cửa hàng
  const [ordersListRender, setOrdersListRender] = useState([]); //lưu danh sách đơn hàng được render
  const userLogged = useSelector((state) => state.userLoggedSlice.userLogged); //lấy thông tin tài khoản của cửa hàng từ redux
  const [filterValue, setFilterValue] = useState("pending"); //lưu giá trị của lựa chọn
  const [sortValue, setSortValue] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [checkeds, setCheckeds] = useState(new Map()); //lưu trạng thái lựa chọn của các đơn hàng

  //lấy thông tin các đơn hàng của cửa hàng
  useEffect(() => {
    const fetchData = async () => {
      if (userLogged) {
        try {
          setIsLoading(true);
          let response = await fetchWithAuth(
            baseUrl + `/store/get-store-orders-list/${userLogged.storeId}`
          );

          if (response.status === 403) {
            const refreshTokenResponse = await refreshToken();
            if (!refreshTokenResponse.ok) {
              throw new Error(
                "Không lấy được danh sách đơn hàng của cửa hàng!!"
              );
            }

            response = await fetchWithAuth(
              baseUrl + `/store/get-store-orders-list/${userLogged.storeId}`
            );
          }

          const data = await response.json();
          setOrdersList(data);
        } catch (error) {
          console.log(
            "Không lấy được danh sách đơn hàng của cửa hàng!! error: " +
              error.message
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [userLogged]);

  //cập nhật lại ordersListRender mỗi khi người dùng lọc
  useEffect(() => {
    if (!ordersList?.length) return;

    const newOrdersListRender = ordersList
      .reduce((acc, order) => {
        if (order.status === filterValue) acc.push(order);
        return acc;
      }, [])
      .sort((a, b) =>
        sortValue === 1
          ? new Date(a.updatedAt) - new Date(b.updatedAt)
          : new Date(b.updatedAt) - new Date(a.updatedAt)
      );

    const newCheckeds = new Map(
      newOrdersListRender.map((order) => [order._id, false])
    );
    setCheckeds(newCheckeds);
    setOrdersListRender(newOrdersListRender);
  }, [filterValue, sortValue, ordersList]);

  //hàm xử lý khi khi người dùng chọn option filter
  const handleSelectFilterValue = (value) => {
    if (value !== filterValue) {
      setFilterValue(value);
    }
  };

  //hàm xử lý khi người dùng chọn option sort
  const handleSelectSortValue = (value) => {
    if (value !== sortValue) {
      setSortValue(value);
    }
  };

  //hàm xử lý khi người dùng chọn order
  const handleSelectOrder = (type, orderId) => {
    if (type === "single") {
      const newCheckeds = new Map(checkeds);
      newCheckeds.set(orderId, !newCheckeds.get(orderId));

      setCheckeds(newCheckeds);
    } else if (type === "select_all") {
      const newCheckeds = new Map(checkeds);
      newCheckeds.forEach((_, key) => {
        newCheckeds.set(key, true);
      });

      setCheckeds(newCheckeds);
    } else {
      const newCheckeds = new Map(checkeds);
      newCheckeds.forEach((_, key) => {
        newCheckeds.set(key, false);
      });

      setCheckeds(newCheckeds);
    }
  };

  //hàm xử lý khi cửa hàng xác nhận đơn hàng
  const handleStoreConfirmOrder = async (type, orderId) => {
    let listOrderIds = [];
    if (type === "single") {
      listOrderIds.push(orderId);

      //cập nhật ở state
      let newOrdersList = [...ordersList].map((order) =>
        order._id === orderId ? { ...order, status: "shipping" } : order
      );

      setOrdersList(newOrdersList);
      dispatch(showToast({ message: "Xác nhận thành công 1 đơn hàng!!" }));
    } else {
      checkeds.forEach((value, key) => {
        if (value) {
          listOrderIds.push(key);
        }
      });

      //cập nhật ở state
      const newOrdersList = [...ordersList].map((order) =>
        checkeds.get(order._id) ? { ...order, status: "shipping" } : order
      );
      setOrdersList(newOrdersList);
      dispatch(
        showToast({
          message: `Cập nhật thành công ${listOrderIds.length} đơn hàng!!`,
        })
      );
    }

    //gọi API để xác nhận đơn hàng
    try {
      let response = await fetchWithAuth(
        baseUrl + "/order/store-confirm-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listOrderIds),
        }
      );

      if (response.status === 403) {
        const refreshTokenResponse = await refreshToken();

        if (!refreshTokenResponse.ok) {
          throw new Error("Cửa hàng không xác nhận được đơn hàng!!");
        }

        response = await fetchWithAuth(baseUrl + "/order/store-confirm-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listOrderIds),
        });
      }
    } catch (error) {
      console.log(
        "Cửa hàng không cập nhật được đơn hàng!! error: " + error.message
      );
    }
  };

  //hàm xử lý khi cửa hàng từ chối nhận sản phẩm
  const handleStoreRefureOrder = async (orderId) => {
    const newOrdersList = [...ordersList].map((order) =>
      order._id === orderId ? { ...order, status: "rejected" } : order
    );
    setOrdersList(newOrdersList);
    dispatch(showToast({ message: "Đã từ chối 1 đơn hàng!!" }));

    //gọi API để cập nhật phía database
    try {
      let response = await fetchWithAuth(
        baseUrl + `/order/store-reject-order/${orderId}`
      );

      if (response.status === 403) {
        const refreshTokenResponse = await refreshToken();

        if (!refreshTokenResponse.ok) {
          throw new Error("Lỗi khi cửa hàng từ chối nhận đơn hàng!!");
        }

        response = await fetchWithAuth(
          baseUrl + `/order/store-reject-order/${orderId}`
        );
      }
    } catch (error) {
      console.log(
        "Lỗi khi cửa hàng từ chối nhận đơn hàng!! error: " + error.message
      );
    }
  };
  if (isLoading) return <Loader />;

  return (
    <div className="store_order_list_page">
      <div className="top_page">
        <div className="box_left">
          <div className="option_select">
            <p
              className={`desc ${filterValue === "pending" ? "active" : ""}`}
              onClick={() => handleSelectFilterValue("pending")}
            >
              Pending
            </p>
            <p
              className={`desc ${filterValue === "shipping" ? "active" : ""}`}
              onClick={() => handleSelectFilterValue("shipping")}
            >
              Shipping
            </p>
            <p
              className={`desc ${filterValue === "completed" ? "active" : ""}`}
              onClick={() => handleSelectFilterValue("completed")}
            >
              Completed
            </p>
            <p
              className={`desc ${filterValue === "rejected" ? "active" : ""}`}
              onClick={() => handleSelectFilterValue("rejected")}
            >
              Rejected
            </p>
            <p
              className={`desc ${filterValue === "canceled" ? "active" : ""}`}
              onClick={() => handleSelectFilterValue("canceled")}
            >
              Canceled
            </p>
          </div>

          <div className="box_sort">
            <input type="checkbox" id="sort" />
            <label htmlFor="sort" className="desc sort">
              Sort
              <span className="desc">
                <i className="fa-solid fa-chevron-down"></i>
              </span>
              :
            </label>
            <p className="desc info">{sortValue === 1 ? "Oldest" : "Latest"}</p>
            <div className="box_option_sort">
              <label
                htmlFor="sort"
                className="desc"
                onClick={() => handleSelectSortValue(-1)}
              >
                Latest
              </label>
              <label
                htmlFor="sort"
                className="desc"
                onClick={() => handleSelectSortValue(1)}
              >
                Oldest
              </label>
            </div>

            <label htmlFor="sort" className="layout_sort_option"></label>
          </div>
        </div>

        {filterValue === "pending" && (
          <div className="box_right">
            <button
              className={`btn_dark_pink ${
                countTrueInMap(checkeds) === checkeds.size ? "no_drop" : ""
              }`}
              onClick={() => handleSelectOrder("select_all")}
            >
              Select all
            </button>
            <button
              className={`btn_dark_pink ${
                countTrueInMap(checkeds) === 0 ? "no_drop" : ""
              }`}
              onClick={() => handleSelectOrder("deselect_all")}
            >
              Deselect all
            </button>

            {countTrueInMap(checkeds) > 0 && (
              <button
                className="btn_dark_pink"
                onClick={() => handleStoreConfirmOrder("multiple")}
              >
                Confirm all
              </button>
            )}
          </div>
        )}
      </div>
      <div className="list_orders_of_store">
        {ordersListRender.map((order) => (
          <div className="box_order" key={order._id}>
            <div className="box_list_products_of_order">
              {order.products.map((product) => (
                <div key={product.productId} className="box_product">
                  <div className="box_image">
                    <img src={product.imageOrder.url} alt="" />
                  </div>

                  <div className="box_info">
                    <p className="title_20">{product.productName}</p>
                    <p className="desc">
                      Color:
                      <span className="desc">
                        {capitalizeFirstLetter(product.color)}
                      </span>
                    </p>
                    <div className="box_price">
                      {product.discount > 0 && (
                        <p className="old_price desc">
                          {formatCurrencyVND(product.price * product.quantity)}
                        </p>
                      )}
                      <p className="new_price desc">
                        {formatCurrencyVND(
                          (((100 - product.discount) * product.price) / 100) *
                            product.quantity
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="box_right">
                    <p className="desc">
                      Quantity order:
                      <span className="desc">{product.quantity}</span>
                    </p>
                    <p className="desc">
                      Quantity in stock:
                      <span className="desc">{product.quantityStock}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bottom_order">
              <div className="info_order">
                <p className="desc">
                  Orderer's name: <span className="desc">{order.userName}</span>
                </p>
                <p className="desc">
                  Address:{" "}
                  <span className="desc">
                    {order.orderAddress.wardOrCommune +
                      ", " +
                      order.orderAddress.district +
                      ", " +
                      order.orderAddress.cityOrProvince}
                  </span>
                </p>
                <p className="desc">
                  Order time:
                  <span className="desc">{formatDate(order.updatedAt)}</span>
                </p>

                <div className="box_code">
                  <p className="desc"> Code:</p>
                  <p className="desc code" id={order._id}>
                    {order._id.toUpperCase()}
                  </p>
                  <p
                    className="desc copy"
                    onClick={() =>
                      handleCopy(document.getElementById(order._id).innerText)
                    }
                  >
                    Sao chép
                  </p>
                </div>
              </div>

              <div className="box_right">
                <p className="desc">
                  Shipping fee:
                  <span className="desc">
                    {formatCurrencyVND(order.shippingFee)}
                  </span>
                </p>
                <p className="desc">
                  Total price:
                  <span className="desc">
                    {formatCurrencyVND(
                      calculateTotalAmountOrder(
                        order.products,
                        order.shippingFee
                      )
                    )}
                  </span>
                </p>

                {order.status === "pending" && (
                  <div className="box_button">
                    <button
                      className="btn_dark_pink refuse"
                      onClick={() => handleStoreRefureOrder(order._id)}
                    >
                      Reject
                    </button>
                    <button
                      className="btn_dark_pink"
                      onClick={() =>
                        handleStoreConfirmOrder("single", order._id)
                      }
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>

            {filterValue === "pending" && (
              <div className="box_input_checkbox">
                <input
                  type="checkbox"
                  onChange={() => handleSelectOrder("single", order._id)}
                  checked={checkeds.get(order._id)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreOrderList;
