import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import urlAvatarDefault from "../../../config/avatarDefault";
import { updateUserLogged } from "../../../redux-toolkit/redux-slice/userLogged";
import PopupSearchHomePage from "../../../components/popup-search-home-page/PopupSearchHomePage";
import { useDebounce } from "../../../utils/custom-hook/customHook";
import { updateSearchValue } from "../../../redux-toolkit/redux-slice/searchSlice";

const BoxRight = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogged = useSelector((state) =>
    state.userLoggedSlice.userLogged ? state.userLoggedSlice.userLogged : null
  );
  const quantityProduct = useSelector((state) =>
    state.userLoggedSlice.cart
      ? state.userLoggedSlice.cart?.products?.length
      : null
  );
  const [valueSearch, setValueSearch] = useState(""); //lưu giá trị của ô input search
  const debouncedValueSearch = useDebounce(valueSearch, 2000);

  const path = useLocation().pathname;
  const [hiddenPopup, setHiddenPopup] = useState(false);

  //hàm xử lý khi người dùng click vào giỏ hàng
  const handleClickCartIcon = () => {
    if (!userLogged) {
      navigate("/log-in");
    } else {
      navigate("/cart");
    }
  };
  //lấy danh sách lịch sử tìm kiếm của người dùng từ localStorage
  const [historySearchs, setHistorySearchs] = useState(() => {
    const historySearchs =
      JSON.parse(localStorage.getItem("historySearchs")) || [];
    return historySearchs;
  });

  //hàm xử lý lhi người dùng log out
  const handleLogOut = () => {
    //xóa access token ở local
    localStorage.removeItem("accessToken");

    //xóa refresh token ở cookie
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    //cập nhật lại userLogged thành emtry Object
    dispatch(updateUserLogged({ cart: null, user: null }));

    //chuyển đến trang đăng nhập
    navigate("/log-in");
  };

  //hàm xử lý khi bật tắt popup
  const handleTurnPopup = (value) => {
    setHiddenPopup(value);
  };

  //hàm theo dõi thay đổi của input search
  const handleChangeInputSearch = (e) => {
    setValueSearch(e.target.value);
  };

  //hàm xử lý khi người dùng xóa lịch sử tìm kiếm
  const handleDeleteAllHistorySearch = () => {
    setHistorySearchs([]);
    //cập nhật localStorage
    localStorage.setItem("historySearchs", JSON.stringify([]));
  };

  //hàm xử lý khi người dùng click tìm kiếm
  const handleConfirmSearch = () => {
    if (!debouncedValueSearch) {
      handleTurnPopup(false);
      return;
    }
    //thêm mới gia trị tìm kiếm vào storage
    const currentHistorySearch = JSON.parse(
      localStorage.getItem("historySearchs")
    );

    setHistorySearchs([debouncedValueSearch, ...historySearchs]);

    localStorage.setItem(
      "historySearchs",
      JSON.stringify([debouncedValueSearch, ...currentHistorySearch])
    );

    //cập nhật ở redux
    dispatch(updateSearchValue(debouncedValueSearch));

    navigate("/get-products-of-search");
    handleTurnPopup(false);
  };

  //hàm xử lý khi người dùng click vào historyValue
  const handleClickHistoryValue = (historyValue) => {
    dispatch(updateSearchValue(historyValue));
    handleTurnPopup(false);
    navigate("/get-products-of-search");
  };

  //hàm xử lý khi người dùng click vào các options
  const handleClickOption = (path) => {
    navigate(path);
  };

  return (
    <div className="box_right_header">
      {hiddenPopup && (
        <div className="box_popup">
          <PopupSearchHomePage
            handleTurnPopup={handleTurnPopup}
            debouncedValueSearch={debouncedValueSearch}
            handleDeleteAllHistorySearch={handleDeleteAllHistorySearch}
            historySearchs={historySearchs}
            handleClickHistoryValue={handleClickHistoryValue}
          />
        </div>
      )}

      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          className={`input_search ${hiddenPopup ? "active" : ""}`}
          onChange={handleChangeInputSearch}
        />
        <div
          className="icon"
          onClick={() =>
            hiddenPopup ? handleConfirmSearch() : handleTurnPopup(true)
          }
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      {path !== "/log-in" && path !== "/register" && (
        <div className="box_icon">
          <div className="icon wish_list">
            <i className="fa-regular fa-heart"></i>
          </div>
          <div className="icon cart" onClick={handleClickCartIcon}>
            <i className="fa-solid fa-cart-shopping"></i>
            {quantityProduct > 0 && (
              <p className="desc quantity">{quantityProduct}</p>
            )}
          </div>
        </div>
      )}

      {path !== "/log-in" &&
        path !== "/register" &&
        (userLogged ? (
          <div className="box_account">
            <label htmlFor="optionAccount" className="name desc">
              {userLogged.userName}
            </label>
            <label htmlFor="optionAccount" className="avatar">
              <img
                src={userLogged.avatar ? userLogged.avatar : urlAvatarDefault}
                alt=""
              />
            </label>

            <input type="checkbox" id="optionAccount" />

            <label htmlFor="optionAccount" className="layout"></label>

            <ul className="option_account">
              <label
                htmlFor="optionAccount"
                onClick={() => handleClickOption("/profile-user")}
                className="desc item"
              >
                Profile
              </label>

              <label
                htmlFor="optionAccount"
                onClick={() => handleClickOption("/orders-of-user")}
                className="desc item"
              >
                My Oder
              </label>

              {userLogged.role === "admin" && (
                <label
                  htmlFor="optionAccount"
                  onClick={() => handleClickOption("/admin-page")}
                  className="desc item"
                >
                  Admin Page
                </label>
              )}

              {userLogged.role === "store" && (
                <label
                  htmlFor="optionAccount"
                  onClick={() => handleClickOption("/store-page")}
                  className="desc item"
                >
                  Store Page
                </label>
              )}

              <label
                htmlFor="optionAccount"
                className="desc item"
                onClick={handleLogOut}
              >
                Log Out
              </label>
            </ul>
          </div>
        ) : (
          <Link to={"/log-in"} className="box_right_log_in">
            <p className="desc">Log In</p>
          </Link>
        ))}
    </div>
  );
};

export default BoxRight;
