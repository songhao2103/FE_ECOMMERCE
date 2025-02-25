import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Toast from "../../utils-component/toast/Toast";
import { showToast } from "../../redux-toolkit/redux-slice/toastSlice";
import Loader from "../../utils-component/loader/Loader";
import media from "/media_images/login_and_register_media.png";
import baseUrl from "../../config/baseUrl";

const Register = () => {
  //=====================State====================================
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  //Lưu trạng thái hiện thị giá trị của các ô input có type là password
  const [hiddenInputTypePassword, setHiddenInputTypePassword] = useState({
    password: false,
    rePassword: false,
  });

  //Lưu giá trị của form data
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  //lưu trạng thái lỗi của của các giá trị ở ô input
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  // ========================Handler==================================
  //hàm xử lý hiển thị giá trị các ô input có type là password
  const handleHiddenInputTypePassword = (value) => {
    setHiddenInputTypePassword({
      ...hiddenInputTypePassword,
      [value]: !hiddenInputTypePassword[value],
    });
  };

  //hàm theo dõi sự thay đổi của form data
  const handleChangeInputForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //hàm submit form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const { userName, email, password, rePassword } = formData;

    const newErrors = { ...errors };

    //kiểm tra userName
    if (!userName) {
      newErrors.userName = "Name không được để trống!";
    } else {
      newErrors.userName = "";
    }

    //kiểm tra email
    if (!email) {
      newErrors.email = "Email không được để trống!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không đúng định dạng!";
    } else {
      newErrors.email = "";
    }

    //kiểm tra password
    if (!password) {
      newErrors.password = "Password không được để trống!";
    } else {
      newErrors.password = "";
    }

    //kiểm tra rePassword
    if (!rePassword) {
      newErrors.rePassword = "Re-password không được để trống!";
    } else if (password !== rePassword) {
      newErrors.rePassword = "Password không khớp, thử lại!";
    } else {
      newErrors.rePassword = "";
    }

    setErrors(newErrors);

    if (
      newErrors.userName ||
      newErrors.email ||
      newErrors.password ||
      newErrors.rePassword
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Thêm credentials nếu gửi cookie
      });

      const data = await response.json();

      if (!data.success) {
        console.log(data.errors);
        setErrors(data.errors);
      } else {
        navigate("/log-in");
        dispatch(showToast({ message: "Đăng ký tài khoản thành công!!" }));
      }
    } catch (error) {
      console.error("Lỗi khi gửi API đăng ký " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="register">
      <Toast />
      <div className="media">
        <img src={media} alt="register media" />
      </div>
      <div className="form_register">
        <div className="top">
          <div className="title_36">Create an account</div>
          <p className="desc">Enter your details below</p>
        </div>

        <form onSubmit={handleSubmitForm}>
          <label className="desc" htmlFor="userName" id="userName">
            Name:
          </label>
          <br />
          <input
            type="text"
            name="userName"
            id="userName"
            placeholder="Enter your name"
            onChange={handleChangeInputForm}
          />
          {!!errors.userName && <div className="error">{errors.userName}</div>}

          <label className="desc" htmlFor="email" id="email">
            Email:
          </label>
          <br />
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter your email"
            onChange={handleChangeInputForm}
          />
          {!!errors.email && <div className="error">{errors.email}</div>}

          <label className="desc" htmlFor="password">
            Password:
          </label>
          <br />
          <div className="box_input">
            <input
              type={hiddenInputTypePassword.password ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={handleChangeInputForm}
            />
            <div
              className="box_eye"
              onClick={() => handleHiddenInputTypePassword("password")}
            >
              {hiddenInputTypePassword.password ? (
                <i className="fa-regular fa-eye"></i>
              ) : (
                <i className="fa-regular fa-eye-slash"></i>
              )}
            </div>
          </div>
          {!!errors.password && <div className="error">{errors.password}</div>}

          <label className="desc" htmlFor="rePassword">
            Re-Password:
          </label>
          <div className="box_input">
            <input
              type={hiddenInputTypePassword.rePassword ? "text" : "password"}
              name="rePassword"
              id="rePassword"
              placeholder="Enter your re-password"
              onChange={handleChangeInputForm}
            />
            <div
              className="box_eye"
              onClick={() => handleHiddenInputTypePassword("rePassword")}
            >
              {hiddenInputTypePassword.rePassword ? (
                <i className="fa-regular fa-eye"></i>
              ) : (
                <i className="fa-regular fa-eye-slash"></i>
              )}
            </div>
          </div>
          {!!errors.rePassword && (
            <div className="error">{errors.rePassword}</div>
          )}

          <button type="submit" className="btn_dark_pink">
            Create Account
          </button>
        </form>

        <div className="bottom">
          <span className="desc">Already have account?</span>
          <Link to={"/log-in"} className="desc">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
