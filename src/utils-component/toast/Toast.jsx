import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../../redux-toolkit/redux-slice/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();

  const { message, visible } = useSelector((state) => state.toastSlice);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  //   if (!visible) return null;
  return (
    <div className={visible ? "toast active" : "toast"}>
      <div className="icon">
        <i className="fa-solid fa-check"></i>
      </div>
      <p className="desc">{message}</p>
    </div>
  );
};

export default Toast;
