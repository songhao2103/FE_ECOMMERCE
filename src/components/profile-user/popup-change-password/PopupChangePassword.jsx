import { useState } from "react";
import { useDispatch } from "react-redux";
import baseUrl from "../../../config/baseUrl";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../../utils/tokenApi/refreshToken";
import { showToast } from "../../../redux-toolkit/redux-slice/toastSlice";
import Loader from "../../../utils-component/loader/Loader";

const PopupChangePassword = ({ handleHiddenPopup, userId }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [hiddenPassword, setHiddenPassword] = useState({
    oldPassword: false,
    newPassword: false,
    reNewPassword: false,
  });

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    reNewPassword: "",
  });

  const [error, setError] = useState({
    oldPassword: "",
    newPassword: "",
    reNewPassword: "",
  });

  //hàm xử lý khi thay đổi ẩn hiện mật khẩu
  const handleTurnHiddenPassword = (key) => {
    setHiddenPassword({ ...hiddenPassword, [key]: !hiddenPassword[key] });
  };

  //hàm theo dõi thay đổi của form data
  const handleChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //hàm xử lý khi người dùng xác nhận thay đổi mật khẩu
  const handleSavePassword = async () => {
    let newError = { ...error };
    if (!formData.oldPassword) {
      newError.oldPassword = "Mật khẩu cũ không được để trống!!";
    } else if (formData.oldPassword.length < 6) {
      newError.oldPassword = "Mật khẩu cũ không đúng, thử lại!!";
    } else {
      newError.oldPassword = "";
    }

    if (!formData.newPassword) {
      newError.newPassword = "Mật khẩu mới không được để trống!!";
    } else if (formData.newPassword.length < 6) {
      newError.newPassword = "Mật khẩu mới phải trên 6 ký tự!!";
    } else if (formData.newPassword === formData.oldPassword) {
      newError.newPassword = "Mật khẩu mới trùng với mật khẩu cũ!!";
    } else {
      newError.newPassword = "";
    }

    if (!formData.reNewPassword) {
      newError.reNewPassword =
        "Phần nhập lại mật khẩu mới không được để trống!!";
    } else if (formData.reNewPassword !== formData.newPassword) {
      newError.reNewPassword = "Mật khẩu mới không khớp!!";
    } else {
      newError.reNewPassword = "";
    }

    if (
      newError.oldPassword ||
      newError.newPassword ||
      newError.reNewPassword
    ) {
      setError(newError);
    } else {
      try {
        setIsLoading(true);
        let response = await fetchWithAuth(
          baseUrl + `/user/change-password/${userId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (response.status === 403) {
          const refreshTokenResponse = await refreshToken();

          if (!refreshTokenResponse.ok) {
            throw new Error("Không cập nhật lại được access token!!");
          }

          response = await fetchWithAuth(
            baseUrl + `/user/change-password/${userId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            }
          );
        }

        const data = await response.json();

        if (!data.success) {
          setError(data.error);
          setFormData(data.formData);
        } else {
          dispatch(
            showToast({ message: "Thay đổi mật khẩu thành công rồi!!" })
          );
          setError({ oldPassword: "", newPassword: "", reNewPassword: "" });
          handleHiddenPopup(false);
        }
      } catch (error) {
        console.log("Lỗi khi người dùng thay đổi mật khẩu!!" + error.messgae);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="popup_change_password">
      <div className="bgc_popup"></div>
      <div className="content">
        <p className="desc title_24">Change password</p>
        <div className="box_item">
          <label htmlFor="oldPassword" className="desc">
            Old password:
          </label>
          <div className="box_input">
            <input
              type={hiddenPassword.oldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              placeholder="Old password"
              onChange={handleChangeFormData}
            />

            <div
              className="icon"
              onClick={() => handleTurnHiddenPassword("oldPassword")}
            >
              {hiddenPassword.oldPassword ? (
                <i className="fa-solid fa-eye"></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </div>
          </div>

          {error.oldPassword && (
            <div className="error desc">{error.oldPassword}</div>
          )}
        </div>
        <div className="box_item">
          <label htmlFor="newPassword" className="desc">
            New password:
          </label>
          <div className="box_input">
            <input
              type={hiddenPassword.newPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="New password"
              onChange={handleChangeFormData}
            />
            <div
              className="icon"
              onClick={() => handleTurnHiddenPassword("newPassword")}
            >
              {hiddenPassword.newPassword ? (
                <i className="fa-solid fa-eye"></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </div>
          </div>

          {error.newPassword && (
            <div className="error desc">{error.newPassword}</div>
          )}
        </div>
        <div className="box_item">
          <label htmlFor="reNewPassword" className="desc">
            Re-New password:
          </label>

          <div className="box_input">
            <input
              type={hiddenPassword.reNewPassword ? "text" : "password"}
              name="reNewPassword"
              id="reNewPassword"
              placeholder="Re-New password"
              onChange={handleChangeFormData}
            />
            <div
              className="icon"
              onClick={() => handleTurnHiddenPassword("reNewPassword")}
            >
              {hiddenPassword.reNewPassword ? (
                <i className="fa-solid fa-eye"></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </div>
          </div>

          {error.reNewPassword && (
            <div className="error desc">{error.reNewPassword}</div>
          )}
        </div>

        <div className="bottom">
          <button className="btn_dark_pink" onClick={handleSavePassword}>
            Save
          </button>
        </div>

        <div className="close" onClick={() => handleHiddenPopup(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>
  );
};

export default PopupChangePassword;
