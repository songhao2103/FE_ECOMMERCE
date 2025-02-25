import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../../utils/tokenApi/refreshToken";
import baseUrl from "../../../config/baseUrl";
import {
  formatCurrencyVND,
  capitalizeFirstLetter,
  formatDate,
} from "../../../utils/format/format";
import { handleCopy } from "../../../utils/interact-with-DOM/interactWithDOM";
import Loader from "../../../utils-component/loader/Loader";
import { showToast } from "../../../redux-toolkit/redux-slice/toastSlice";

//hàm tính tổng số tiền của 1 order
const calculateTotalAmountOrder = (productsList, shippingFee) => {
  const subAmount = productsList.reduce((sub, product) => {
    sub += (product.quantity * product.price * (100 - product.discount)) / 100;
    return sub;
  }, 0);

  return subAmount + shippingFee;
};
const OrderShippingPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [ordersList, setOrdersList] = useState([]); //lưu danh sách order
  const [ordersRender, setOrderRender] = useState(); //lưu danh sách order được render
  const [sortValue, setSortValue] = useState(-1);
  const [searchValue, setSearchValue] = useState(""); //lưu giá trị của search value
  const inputSearchElement = useRef(null); //lấy ra phần tử input search

  //lấy danh sách order pending xuống
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let response = await fetchWithAuth(
          baseUrl + "/admin/get-orders-shipping"
        );

        if (response.status === 403) {
          const refreshTokenResponse = await refreshToken();

          if (!refreshTokenResponse.ok) {
            throw new Error(
              "KHông lấy được danh sách đơn hàng đang được giao!"
            );
          }

          response = await fetchWithAuth(
            baseUrl + "/admin/get-orders-shipping"
          );
        }

        const data = await response.json();

        setOrdersList(data);
      } catch (error) {
        console.log("Lỗi xảy ra: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  //hàm xử lý khi người dùng chọn kiểu sắp xếp
  const handleSelectSort = (newValue) => {
    if (newValue !== sortValue) {
      setSortValue(newValue);
    }
  };

  //hàm xử lý khi người dùng click tìm kiếm
  const handleSearch = () => {
    setSearchValue(inputSearchElement.current.value);
  };

  //tìm kiếm hoặc sắp xếp lại danh sách order
  useEffect(() => {
    if (!searchValue) {
      const newOrdersRender = [...ordersList].sort((a, b) =>
        sortValue === 1
          ? new Date(a.updatedAt) - new Date(b.updatedAt)
          : new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      setOrderRender(newOrdersRender);
    } else {
      const newOrderRender = [...ordersList].filter(
        (order) => order._id === searchValue.toLowerCase()
      );
      setOrderRender(newOrderRender);
    }
  }, [searchValue, sortValue, ordersList]);

  //hàm xử lý khi admin complete đơn hàng
  const handleCompeleOrder = async (orderId) => {
    //cập nhật ở state
    const newOrdersList = [...ordersList].filter(
      (order) => order._id !== orderId
    );

    setOrdersList(newOrdersList);

    //gọi API để cập nhật lại phía database
    try {
      let response = await fetchWithAuth(
        baseUrl + `/admin/admin-complete-order/${orderId}`
      );

      if (response.status === 403) {
        const refreshTokenResponse = await refreshToken();
        if (!refreshTokenResponse.ok) {
          throw new Error(
            "Không refresh được token khi admin complete đơn hàng!!"
          );
        }

        response = await fetchWithAuth(
          baseUrl + `/admin/admin-complete-order/${orderId}`
        );
      }

      if (response.ok) {
        dispatch(showToast({ message: "Completed!" }));
      }
    } catch (error) {
      console.log("Lỗi khi admin cập nhật đơn hàng!! " + error.message);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="order_shipping_page">
      <div className="top_page">
        <div className="box_sort">
          <p
            className={`button_sort desc ${sortValue === -1 ? "active" : ""}`}
            onClick={() => handleSelectSort(-1)}
          >
            Latest
          </p>
          <p
            className={`button_sort desc ${sortValue === 1 ? "active" : ""}`}
            onClick={() => handleSelectSort(1)}
          >
            Oldest
          </p>
        </div>
        <div className="box_search">
          <label htmlFor="searchByCode" className="desc">
            Search by code:
          </label>
          <input
            type="text"
            id="searchByCode"
            placeholder="Search..."
            ref={inputSearchElement}
            onBlur={(e) => setSearchValue(e.target.value)}
          />
          <div className="icon" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>

      <div className="orders_list">
        {ordersList.length > 0 && (
          <div className="content_order_list">
            {ordersRender.map((order) => (
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

                <div className="bottom_order">
                  <div className="info_order">
                    <p className="desc">
                      Orderer's name:{" "}
                      <span className="desc">{order.userName}</span>
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
                      <span className="desc">
                        {formatDate(order.updatedAt)}
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

                    <button
                      className="btn_dark_pink"
                      onClick={() => handleCompeleOrder(order._id)}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderShippingPage;
