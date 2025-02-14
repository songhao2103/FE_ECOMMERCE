import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import urlAvatarDefault from "../../../config/avatarDefault";
import { updateUserLogged } from "../../../redux-toolkit/redux-slice/userLogged";

const BoxRight = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogged = useSelector((state) =>
    state.userLoggedSlice.userLogged ? state.userLoggedSlice.userLogged : null
  );
  const quantityProduct = useSelector((state) =>
    state.userLoggedSlice.cart
      ? state.userLoggedSlice.cart.products.length
      : null
  );
  const path = useLocation().pathname;

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

  return (
    <div className="box_right_header">
      <div className="search">
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      {path !== "/log-in" && path !== "/register" && (
        <div className="box_icon">
          <div className="icon wish_list">
            <i className="fa-regular fa-heart"></i>
          </div>
          <Link to="/cart" className="icon cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {quantityProduct > 0 && (
              <p className="desc quantity">{quantityProduct}</p>
            )}
          </Link>
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
              <li className="desc item">Profile</li>
              <li className="desc item">My Oder</li>

              {userLogged.role === "admin" && (
                <Link to="/admin-page" className="desc item">
                  Admin Page
                </Link>
              )}

              {userLogged.role === "store" && (
                <Link to="/store-page" className="desc item">
                  Store Page
                </Link>
              )}

              <li className="desc item" onClick={handleLogOut}>
                Log Out
              </li>
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
