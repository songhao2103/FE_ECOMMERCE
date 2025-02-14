import { useState } from "react";
import { useSelector } from "react-redux";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../../utils/tokenApi/refreshToken.js";
import baseUrl from "../../../config/baseUrl.js";
import Loader from "../../../utils-component/loader/Loader.jsx";

const AddStore = () => {
  //state form data
  const [formData, setFormData] = useState({
    storeName: "",
    storeEmail: "",
  });

  //state error
  const [errors, setErrors] = useState({
    storeName: "",
    storeEmail: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const userLogged = useSelector((state) => state.userLoggedSlice.userLogged);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //hàm theo dõi thay đổi giá trị của form

  const handleChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //hàm submit form
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    //kiểm tra nếu chưa đăng nhập
    if (!userLogged) {
      setErrors({ ...errors, storeEmail: "Chưa đăng nhập!" });
      return;
    } else if (userLogged.role !== "admin") {
      setErrors({ ...errors, storeEmail: "Không có quyền!" });
      return;
    } else {
      setErrors({
        storeName: "",
        storeEmail: "",
      });
    }

    //Kiểm tra
    if (!formData.storeName || !formData.storeEmail) {
      setErrors({ ...errors, storeEmail: "Điền thiếu thông tin!!" });
      return;
    } else if (!emailRegex.test(formData.storeEmail)) {
      setErrors({ ...errors, storeEmail: "Email không đúng định dạng!!" });
      return;
    } else {
      //nếu data thỏa mãn gọi API để tạo store
      try {
        setIsLoading(true);
        let response = await fetchWithAuth(baseUrl + "/store/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        //refresh lại token
        if (response.status === 403) {
          await refreshToken();
        }

        //gọi lại API tạo store
        response = await fetchWithAuth(baseUrl + "/store/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = response ? await response.json() : "undefine";

        if (!data.success) {
          setErrors(data.errors);
          return;
        }

        console.log("Tạo mới store thành công!!");
      } catch (error) {
        console.log("Tạo mới store không thành công", error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="add_store">
      <form action="" onSubmit={handleSubmitForm}>
        <label htmlFor="storeName" className="desc">
          Store name:
        </label>
        <input
          type="text"
          name="storeName"
          id="storeName"
          placeholder="Enter store name"
          onChange={handleChangeFormData}
          value={formData.storeName}
        />
        <div className="error">{errors.storeName}</div>

        <label htmlFor="storeEmail" className="desc">
          Store email:
        </label>
        <input
          type="text"
          name="storeEmail"
          id="storeEmail"
          placeholder="Enter store email"
          onChange={handleChangeFormData}
          value={formData.storeEmail}
        />
        <div className="error">{errors.storeEmail}</div>

        <button className="btn_dark_pink" type="submit">
          Create Store
        </button>
      </form>
    </div>
  );
};

export default AddStore;
