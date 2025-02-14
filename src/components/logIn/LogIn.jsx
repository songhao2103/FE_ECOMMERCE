import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import media from "/media_images/login_and_register_media.png";
import baseUrl from "../../config/baseUrl";
import { updateUserLogged } from "../../redux-toolkit/redux-slice/userLogged";
import Loader from "../../utils-component/loader/Loader";
import { Link, useNavigate } from "react-router-dom";

const LogIn = () => {
  //=====================State================================================================
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.statusGlobalSlice.status);
  const [hiddenPassword, setHiddenPassword] = useState(false); //Lưu trạng thái hiện thị giá trị của các ô input có type là password

  //Lưu giá trị của form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //lưu trạng thái lỗi của của các giá trị ở ô input
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  //lưu giá trị của ô input checkbox
  const [inputCheckbox, setInputCheckbox] = useState(false);

  // ========================Handler========================================================================
  //hàm xử lý hiển thị giá trị các ô input có type là password
  const handleHiddenInputTypePassword = () => {
    setHiddenPassword(!hiddenPassword);
  };

  //hàm theo dõi sự thay đổi của form data
  const handleChangeInputForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //hàm submit form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const newErrors = { ...errors };

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

    setErrors(newErrors);

    if (!newErrors.password && !newErrors.email) {
      try {
        const response = await fetch(baseUrl + "/login", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include", // Quan trọng
        });

        // if (!response.ok) {
        //   throw new Error("Lỗi khi gọi API đăng ký " + response.message);
        // }

        const data = await response.json();

        //kiểm tra đăng nhập thành công
        if (!data.success) {
          setErrors(data.errors);
        } else {
          // setFormData({ email: "", password: "" });

          //cập nhật accessToken lên localStorage
          localStorage.setItem("accessToken", JSON.stringify(data.accessToken));

          // gọi action để cập nhật userLogged ở store của redux
          dispatch(updateUserLogged(data));

          //Chuyển đến trang đăng nhập
          navigate("/");
        }
      } catch (error) {
        console.error("Lỗi khi gửi API đăng ký " + error.message);
      }
    }
  };

  //hàm xử lý giá trị của ô input checkbox
  const handleChangeInputCheckbox = (e) => {
    setInputCheckbox(e.target.checked);
  };

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="log_in">
          <div className="media">
            <img src={media} alt="Log in media" />
          </div>
          <div className="form_log_in">
            <div className="top">
              <div className="title_36">Log in to Exclusive</div>
              <p className="desc">Enter your details below</p>
            </div>

            <form onSubmit={handleSubmitForm}>
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
                  type={hiddenPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={handleChangeInputForm}
                />
                <div
                  className="box_eye"
                  onClick={() => handleHiddenInputTypePassword("password")}
                >
                  {hiddenPassword ? (
                    <i className="fa-regular fa-eye"></i>
                  ) : (
                    <i className="fa-regular fa-eye-slash"></i>
                  )}
                </div>
              </div>
              {!!errors.password && (
                <div className="error">{errors.password}</div>
              )}

              <button type="submit" className="btn_dark_pink">
                Log In
              </button>
            </form>

            <div className="bottom">
              <div className="forget_password desc">Forget Password?</div>
              <div className="save_account">
                <input
                  type="checkbox"
                  id="saveAccount"
                  name="saveAccount"
                  onChange={handleChangeInputCheckbox}
                  value={inputCheckbox}
                />
                <label htmlFor="saveAccount" className="desc">
                  Save account?
                </label>
              </div>

              <div className="turn_page">
                <span className="desc">I don't have an account yet!</span>
                <Link to={"/register"} className="desc">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogIn;
