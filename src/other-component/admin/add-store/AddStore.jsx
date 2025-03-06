import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../../utils/tokenApi/refreshToken.js";
import baseUrl from "../../../config/baseUrl.js";
import Loader from "../../../utils-component/loader/Loader.jsx";
import { showToast } from "../../../redux-toolkit/redux-slice/toastSlice";

const AddStore = () => {
  const dispatch = useDispatch();
  //state form data
  const [formData, setFormData] = useState({
    storeName: "",
    storeEmail: "",
    storeAddress: "",
  });

  //state error
  const [errors, setErrors] = useState({
    storeName: "",
    storeEmail: "",
    storeAddress: "",
  });

  const [listProvinceAndCities, setListProvinceAndCities] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const userLogged = useSelector((state) => state.userLoggedSlice.userLogged);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //gọi API để lấy danh sách tỉnh thành của Viet Nam
  useEffect(() => {
    const getProvinceAndCities = async () => {
      try {
        const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        if (!response.ok) {
          throw new Error(
            "error when get data of provinces and cities",
            response.status
          );
        }
        const newListProvinceAndCities = await response.json();

        setListProvinceAndCities([
          ...[{ name: "foreign", id: -1 }],
          ...newListProvinceAndCities.data,
        ]);
      } catch (error) {
        console.log("error when get data of provinces and cities", error);
      }
    };
    getProvinceAndCities();
  }, []);

  //hàm theo dõi thay đổi giá trị của form
  const handleChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //hàm xử lý khi người dùng lựa chọn địa chỉ
  const handleSelectAddress = (newArress) => {
    if (newArress === formData.storeAddress) {
      return;
    }
    setFormData({ ...formData, storeAddress: newArress });
  };

  //hàm submit form
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    //kiểm tra nếu chưa đăng nhập
    if (!userLogged) {
      setErrors({ ...errors, storeAddress: "Chưa đăng nhập!" });
      return;
    } else if (userLogged.role !== "admin") {
      setErrors({ ...errors, storeAddress: "Không có quyền!" });
      return;
    } else {
      setErrors({
        storeName: "",
        storeEmail: "",
      });
    }

    //Kiểm tra
    if (!formData.storeName || !formData.storeEmail || !formData.storeAddress) {
      setErrors({ ...errors, storeAddress: "Điền thiếu thông tin!!" });
      return;
    } else if (!emailRegex.test(formData.storeEmail)) {
      setErrors({ ...errors, storeAddress: "Email không đúng định dạng!!" });
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

        setFormData({ storeName: "", storeEmail: "", storeAddress: "" });
        dispatch(showToast({ message: "Tạo mới cửa hàng thành công!!" }));
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

        <div className="box_province_and_city">
          <label htmlFor="provinceOrCity" className="desc">
            Province Or City
          </label>
          <label htmlFor="provinceOrCity" className="desc value">
            {formData.storeAddress ? formData.storeAddress : "Not selected yet"}
          </label>
          <input type="checkbox" name="" id="provinceOrCity" />
          <div className="list_province_or_cities">
            {listProvinceAndCities.map((item) => (
              <label
                htmlFor="provinceOrCity"
                className="desc"
                key={item.id}
                onClick={() => handleSelectAddress(item.name)}
              >
                {item.name}
              </label>
            ))}
          </div>

          <p className="desc error">{errors.storeAddress}</p>
        </div>
        <button className="btn_dark_pink" type="submit">
          Create Store
        </button>
      </form>
    </div>
  );
};

export default AddStore;
