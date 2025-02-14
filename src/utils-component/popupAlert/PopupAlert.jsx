import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hidePopupAlert } from "../../redux-toolkit/redux-slice/popupAlertSlice";
const PopupAlert = () => {
  const { message, endpoint, visible } = useSelector(
    (state) => state.popupAlertSlice
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //hàm xử lý khi chuyển đến trang đăng nhập
  const handleGoToLogIn = () => {
    dispatch(hidePopupAlert());
    navigate("/log-in");
  };

  //hàm xử lý khi tắt popup
  const handleTurnOffPopupAlert = () => {
    dispatch(hidePopupAlert());
  };

  if (!visible) return null;

  return (
    <div className="popup_alert">
      <div className="bgc_popup_alert" onClick={handleTurnOffPopupAlert}></div>

      <div className="content">
        <p className="desc">{message}</p>
        <button className="btn_dark_pink" onClick={handleGoToLogIn}>
          OK
        </button>
        <div className="icon close" onClick={handleTurnOffPopupAlert}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>
  );
};

export default PopupAlert;
