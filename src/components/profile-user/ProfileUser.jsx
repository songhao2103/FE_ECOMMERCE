import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../utils-component/loader/Loader";
import urlAvatarDefault from "../../config/avatarDefault";
import baseUrl from "../../config/baseUrl";
import fetchWithAuth from "../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../utils/tokenApi/refreshToken";
import { updateUserLogged } from "../../redux-toolkit/redux-slice/userLogged";
import { showToast } from "../../redux-toolkit/redux-slice/toastSlice";
import PopupChangePassword from "./popup-change-password/PopupChangePassword";

//hàm nối chuỗi address
const connectStringAddress = (objectAddress) => {
  let newValue = "";
  Object.values(objectAddress).forEach((item) => {
    if (!item) {
      return;
    }

    if (!newValue) {
      newValue = item.name;
    } else {
      newValue = newValue + ", " + item.name;
    }
  });

  return newValue;
};

const ProfileUser = () => {
  //lưu giá trị của form data
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.userLoggedSlice.userLogged); //lấy thông tin người dùng từ redux
  const [formData, setFormData] = useState(null); // lưu thông tin của form data
  const [avatar, setAvatar] = useState({
    type: "url",
    value: null,
  }); //lưu url của avatar
  const [addressSelect, setAddressSelect] = useState({}); //lưu địa chỉ của người dùng
  const [valueInputSelect, setValueInputSelect] = useState(""); //lưu giá trị của ô inputSelect
  //Lưu giá trị của box_select
  const [valueBoxSelect, setValueBoxSelect] = useState({
    option: "cityOrProvince",
    hidden: false,
    listValue: [],
  });

  const [valueSearch, setValueSearch] = useState("");
  const clickElement = useRef(null);
  const [listValueOption, setListValueOption] = useState([]); //lưu danh sách option được hiển thị lên (phục vụ cho việc search)
  const [listProvinceAndCities, setListProvinceAndCities] = useState([]); //lưu danh sách tỉnh, thành phố ở Việt Nam
  const [listDistricts, setListDistricts] = useState([]); //Lưu danh sách các quận huyện
  const [listWardOrCommune, setListWardOrCommune] = useState([]); //lưu danh sách các phường xã
  const [error, setError] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    specific: "",
    address: "",
  });

  const [hiddenPopup, setHiddenPopup] = useState(false);

  //cập nhật lại form data
  useEffect(() => {
    if (userLogged) {
      //cập nhật form data
      const newFormData = {
        userName: userLogged.userName || "",
        email: userLogged.email || "",
        phoneNumber: userLogged.phoneNumber || "",
        specific: userLogged.address?.specific || "",
      };

      //cập nhật lại form data
      setFormData(newFormData);

      const newAddressSelect = {
        cityOrProvince: userLogged.address?.cityOrProvince || "",
        district: userLogged.address?.district || "",
        wardOrCommune: userLogged.address?.wardOrCommune || "",
      };

      setAddressSelect(newAddressSelect);

      setValueInputSelect(connectStringAddress(newAddressSelect));

      //cập nhật lại urlAvatar
      setAvatar({ type: "url", value: userLogged.avatar || urlAvatarDefault });
    }
  }, [userLogged]);

  //lấy danh sách các tỉnh hoặc thành phố
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

        setListProvinceAndCities(newListProvinceAndCities.data);

        setValueBoxSelect({
          ...valueBoxSelect,
          listValue: newListProvinceAndCities.data,
        });

        setListValueOption(newListProvinceAndCities);
      } catch (error) {
        console.log("error when get data of provinces and cities", error);
      }
    };
    getProvinceAndCities();
  }, []);

  //hàm lấy danh sách các quận, huyện tương ứng
  const getDistricts = async (idProvinceOrCity) => {
    try {
      const response = await fetch(
        `https://esgoo.net/api-tinhthanh/2/${idProvinceOrCity}.htm`
      );

      if (!response.ok) {
        throw new Error("error when get data of district", response.status);
      }

      const newListDistrict = await response.json();
      return newListDistrict.data;
    } catch (error) {
      console.log("error when get data of district", error);
    }
  };

  //hàm lấy danh sách các thị xã tương ứng
  const getWardOrCommune = async (idDistricts) => {
    try {
      const response = await fetch(
        `https://esgoo.net/api-tinhthanh/3/${idDistricts}.htm`
      );

      if (!response.ok) {
        throw new Error("error when get data of district", response.status);
      }

      const listWardOrCommune = await response.json();
      return listWardOrCommune.data;
    } catch (error) {
      console.log("error when get data of district", error);
    }
  };

  //hàm xử lý khi người dùng lựa chọn ở box_select
  const handleTurnOption = (option) => {
    if (option === "cityOrProvince") {
      setValueBoxSelect({
        ...valueBoxSelect,
        option: option,
        listValue: listProvinceAndCities,
      });

      return;
    }

    //người dùng chưa chọn quận/huyện thì không được chọn thị xã
    if (
      (option === "district" && !addressSelect.cityOrProvince) ||
      (option === "wardOrCommune" && !addressSelect.cityOrProvince)
    ) {
      return;
    }

    if (option === "wardOrCommune" && !addressSelect.district) {
      return;
    }

    if (option === "district") {
      setValueBoxSelect({
        ...valueBoxSelect,
        option: option,
        listValue: listDistricts,
      });
      return;
    }

    if (option === "wardOrCommune") {
      setValueBoxSelect({
        ...valueBoxSelect,
        option: option,
        listValue: listWardOrCommune,
      });
      return;
    }
  };

  //hàm xử lý khi người dùng focus vào ô input select
  const handleFocusInputSelect = () => {
    setValueInputSelect("");
    setValueBoxSelect({ ...valueBoxSelect, hidden: true });
  };

  //hàm xử lý khi người dùng blur khỏi input select address
  const handleBlurInputSelect = () => {
    const newValue = connectStringAddress(addressSelect);
    setValueInputSelect(newValue);
  };

  //hàm xử lý khi người dùng click chuột, nếu người dùng click chuột vào vị trí không đúng thì sẽ tắt danh sách select
  const handleClickElement = (e) => {
    clickElement.current = e.target;

    //nếu người dùng không click vào các option thì tắt box_option
    if (clickElement.current.dataset.type === "option_value") {
      setValueBoxSelect({ ...valueBoxSelect, hidden: true });
    } else {
      setValueBoxSelect({ ...valueBoxSelect, hidden: false });
      if (
        !addressSelect.cityOrProvince ||
        !addressSelect.district ||
        !addressSelect.wardOrCommune
      ) {
        // setErrorInput({ ...errorInput, inputSelect: true });
      }
    }
  };

  //hàm xử lý khi người dùng lựa chọn
  const handleSelectOption = async (value) => {
    if (valueBoxSelect.option === "cityOrProvince") {
      //tạo địa chỉ mới
      const newAddressSelect = {
        ...addressSelect,
        cityOrProvince: value,
        district: "",
        wardOrCommune: "",
      };

      //cập nhật lại địa chỉ mới
      setAddressSelect(newAddressSelect);

      //lấy ra danh sách quận huyện rồi cập nhật để hiển thị
      const listDistrict = await getDistricts(value.id);
      setListDistricts(listDistrict);

      //cập nhật lại danh sách phường xã thành mảng rỗng
      setListWardOrCommune([]);

      //cập nhật lại box value
      setValueBoxSelect({
        ...valueBoxSelect,
        listValue: listDistrict,
        option: "district",
      });

      const newValue = connectStringAddress(newAddressSelect);
      setValueInputSelect(newValue);
      setValueSearch("");
      return;
    }

    if (valueBoxSelect.option === "district") {
      //tạo địa chỉ mới
      const newAddressSelect = {
        ...addressSelect,
        district: value,
        wardOrCommune: "",
      };

      //cập nhật lại địa chỉ mới
      setAddressSelect(newAddressSelect);

      //lấy danh sách phường xã rồi cập nhật lại
      const wardOrCommune = await getWardOrCommune(value.id);
      setListWardOrCommune(listDistricts);

      //cập nhật lại valueBoxSelect
      setValueBoxSelect({
        ...valueBoxSelect,
        listValue: wardOrCommune,
        option: "wardOrCommune",
      });

      const newValue = connectStringAddress(newAddressSelect);
      setValueInputSelect(newValue);
      setValueSearch("");
      return;
    }

    if (valueBoxSelect.option === "wardOrCommune") {
      //tạo địa chỉ mới
      const newAddressSelect = {
        ...addressSelect,
        wardOrCommune: value,
      };

      //cập nhật địa chỉ
      setAddressSelect(newAddressSelect);

      setValueBoxSelect({
        ...valueBoxSelect,
        option: "cityOrProvince",
        hidden: false,
        listValue: listProvinceAndCities,
      });

      const newValue = connectStringAddress(newAddressSelect);
      setValueInputSelect(newValue);
      setValueSearch("");
      //   setErrorInput({ ...errorInput, inputSelect: false });
      return;
    }
  };

  //hàm xử lý khi người dùng nhập dữ liệu vào thẻ inputSelect
  const handleChangeSearchValue = (e) => {
    setValueSearch(e.target.value);
    setValueInputSelect(e.target.value);
  };

  //cập nhật lại listValue mỗi khi người dùng search
  useEffect(() => {
    const newListValue = valueBoxSelect.listValue.filter((value) =>
      value.name.toLowerCase().includes(valueSearch.toLowerCase())
    );
    setListValueOption(newListValue);
  }, [valueSearch, valueBoxSelect]);

  //=======================================================================================================
  //hàm theo dõi sự thay đổi của formData
  const handleChangeInputFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //hàm xủa lý khi người dùng cập nhật ảnh đại diện mới
  ///// xử lý khi người dùng cập nhật bằng cách chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar({
        type: "file",
        value: file,
      });
    }
  };

  // Khi người dùng kéo ảnh vào vùng upload
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0]; // Lấy file từ sự kiện drop
    if (file) {
      setAvatar({ type: "file", value: file });
    }
  };

  // Ngăn chặn hành vi mặc định khi kéo file vào vùng upload
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  //hàm xử lý khi người dùng xác nhận lưu thông tin
  const handleSaveData = async () => {
    const newError = { ...error };
    let isEmailChange = true;
    //kiểm tra name
    if (!formData.userName) {
      newError.userName = "Tên không được để trống!";
    } else {
      newError.userName = "";
    }

    //kiểm tra email
    if (!formData.email) {
      newError.email = "Email không được để trống!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newError.email = "Email không đúng định dạng";
    } else if (formData.email === userLogged.email) {
      isEmailChange = false;
    } else {
      newError.email = "";
    }

    //kiểm tra số điện thoại
    if (
      formData.phoneNumber &&
      !/^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])\d{7}$/.test(
        formData.phoneNumber
      )
    ) {
      newError.phoneNumber = "Số điện thoại không đúng định dạng!!";
    } else {
      newError.phoneNumber = "";
    }

    if (
      (addressSelect.cityOrProvince && !addressSelect.district) ||
      (addressSelect.cityOrProvince && !addressSelect.wardOrCommune)
    ) {
      newError.address = "Thông tin địa chỉ chưa đầy đủ!";
    } else {
      newError.address = "";
    }

    setError(newError);

    if (
      newError.userName ||
      newError.email ||
      newError.phoneNumber ||
      newError.specific ||
      newError.address
    ) {
      return;
    }

    //gọi API để cập nhật thông tin người dùng
    try {
      setIsLoading(true);
      let errorAPI = { info: true, avatar: true };
      let newUserLogged = { ...userLogged };
      //gọi API để cập nhật form
      let response = await fetchWithAuth(
        baseUrl + `/user/update-profile-user/${userLogged._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formData,
            ...(addressSelect.cityOrProvince && {
              addressSelect: { ...addressSelect },
            }),
            isEmailChange,
          }),
        }
      );

      if (response.status === 403) {
        const refreshTokenResponse = await refreshToken();

        if (!refreshTokenResponse.ok) {
          throw new Error("Không cập nhật được access token!!");
        }

        response = await fetchWithAuth(
          baseUrl + `/user/update-profile-user/${userLogged._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              formData,
              ...(addressSelect.cityOrProvince && {
                addressSelect: { ...addressSelect },
              }),
              isEmailChange,
            }),
          }
        );
      }

      const data = await response.json();

      if (!data.success) {
        setError({ ...error, email: data.error });
        errorAPI.info = false;
      } else {
        setError(newError);
        errorAPI.info = true;

        //cập nhật phía redux
        newUserLogged = {
          ...newUserLogged,
          email: formData.email,
          userName: formData.userName,
          //chỉ thêm số điện thoại nếu cần thiết
          ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),

          // Chỉ thêm 'address' nếu có thông tin cập nhật từ formData.specific hoặc addressSelect.cityOrProvince
          ...((formData.specific || addressSelect.cityOrProvince) && {
            address: {
              ...userLogged.address,
              ...(formData.specific && { specific: formData.specific }),
              ...(addressSelect.cityOrProvince && { ...addressSelect }),
            },
          }),
        };
      }

      //gọi API để cập nhật avatar
      if (avatar.value instanceof File) {
        // Tạo FormDataFile và thêm file avatar vào
        const formDataFile = new FormData();
        formDataFile.append("fileAvatar", avatar.value);

        let responseUploadAvatar = await fetchWithAuth(
          baseUrl + `/user/update-avatar-user/${userLogged._id}`,
          { method: "POST", body: formDataFile }
        );

        if (responseUploadAvatar.status === 403) {
          const refreshTokenResponseUploadFile = await refreshToken();

          if (!refreshTokenResponseUploadFile.ok) {
            throw new Error(
              "Không cập nhật được accessToken khi cập nhật avatar"
            );
          }

          responseUploadAvatar = await fetchWithAuth(
            baseUrl + `/user/update-avatar-user/${userLogged._id}`,
            { method: "POST", body: formDataFile }
          );
        }

        const data = await responseUploadAvatar.json();

        if (!data.success) {
          errorAPI.avatar = false;
        } else {
          errorAPI.avatar = true;
          newUserLogged = { ...newUserLogged, avatar: data.urlAvatar };
        }
      }

      dispatch(updateUserLogged({ user: newUserLogged }));

      if (errorAPI.info && errorAPI.avatar) {
        dispatch(showToast({ message: "Cập nhật thông tin thành công!" }));
      } else if (!errorAPI.info && errorAPI.avatar) {
        dispatch(
          showToast({
            message:
              "Đã cập nhật được avatar chứ chưa cập nhật được thông tin!",
          })
        );
      } else if (errorAPI.info && !errorAPI.avatar) {
        dispatch(
          showToast({
            message:
              "Đã cập nhật được thông tin chứ chưa cập nhật được avatar!",
          })
        );
      } else {
        dispatch(
          showToast({
            message: "Chưa cập nhật được thông tin nha!!",
          })
        );
      }
    } catch (error) {
      console.log(
        "Lỗi khi cập nhật profile của người dùng! error: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  //hàm hiển thị popup change passowrd
  const handleHiddenPopup = (value) => {
    setHiddenPopup(value);
  };

  if (!userLogged || isLoading) return <Loader />;

  return (
    <div className="profile_user_page" onMouseDown={handleClickElement}>
      <div className="top_page">
        <p className="title_36">Profile</p>
      </div>

      <div className="content_page">
        <div className="box_info_user">
          <div className="box_left">
            <div className="avatar">
              <img
                src={
                  avatar.type === "url"
                    ? avatar.value
                    : URL.createObjectURL(avatar.value)
                }
                alt=""
              />
            </div>

            <div className="box_change_avatar">
              <input
                type="file"
                name=""
                id="change_avatar"
                onChange={handleFileChange}
              />
              <label
                htmlFor="change_avatar"
                className="btn_dark_pink"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                Change avatar
              </label>
            </div>
          </div>
          <div className="box_right">
            <div className="box_input">
              <label className="desc" htmlFor="userName" id="userName">
                Name:
              </label>
              <input
                type="text"
                name="userName"
                placeholder="Enter your name"
                value={formData?.userName}
                onChange={handleChangeInputFormData}
              />
              {error.userName && <p className="desc error">{error.userName}</p>}
            </div>
            <div className="box_input">
              <label className="desc" htmlFor="email" id="email">
                Email:
              </label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={handleChangeInputFormData}
              />
              {error.email && <p className="desc error">{error.email}</p>}
            </div>
            <div className="box_input">
              <label className="desc" htmlFor="phoneNumber" id="phoneNumber">
                Phone number:
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData?.phoneNumber}
                onChange={handleChangeInputFormData}
              />
              {error.phoneNumber && (
                <p className="desc error">{error.phoneNumber}</p>
              )}
            </div>

            <div className="box_address">
              <label htmlFor="address" className="desc">
                Address:
              </label>

              <div className="box_select">
                <div className="box_input">
                  <input
                    type="text"
                    data-type={"option_value"}
                    onFocus={handleFocusInputSelect}
                    onBlur={handleBlurInputSelect}
                    onChange={handleChangeSearchValue}
                    placeholder={`${
                      !valueInputSelect
                        ? "City/Province, District, Ward/Commune"
                        : valueInputSelect
                    }`}
                    value={valueInputSelect}
                    id="address"
                  />
                </div>
                {valueBoxSelect.hidden && (
                  <div className="box_option">
                    <div className="title">
                      <p
                        className={`desc ${
                          valueBoxSelect.option === "cityOrProvince"
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          handleTurnOption("cityOrProvince");
                        }}
                        data-type={"option_value"}
                      >
                        City/Province
                      </p>
                      <p
                        className={`desc ${
                          valueBoxSelect.option === "district" ? "active" : ""
                        }`}
                        onClick={() => {
                          handleTurnOption("district");
                        }}
                        data-type={"option_value"}
                      >
                        District
                      </p>
                      <p
                        className={`desc ${
                          valueBoxSelect.option === "wardOrCommune"
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          handleTurnOption("wardOrCommune");
                        }}
                        data-type={"option_value"}
                      >
                        Ward/Commune
                      </p>
                    </div>

                    <div className="list_value">
                      {listValueOption.map((item) => (
                        <p
                          data-type="option_value"
                          className="desc"
                          key={item.id}
                          onClick={() =>
                            handleSelectOption({ name: item.name, id: item.id })
                          }
                        >
                          {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error.address && <p className="desc error">{error.address}</p>}
            </div>
            <div className="box_input">
              <label className="desc" htmlFor="specific" id="specific">
                Specific address:
              </label>
              <input
                type="text"
                name="specific"
                placeholder="Enter your specific address"
                value={formData?.specific}
                onChange={handleChangeInputFormData}
              />
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="box_button">
            <p className="desc" onClick={() => handleHiddenPopup(true)}>
              Change password
            </p>
            <button className="btn_dark_pink" onClick={handleSaveData}>
              Save
            </button>
          </div>
        </div>
      </div>

      {hiddenPopup && (
        <PopupChangePassword
          handleHiddenPopup={handleHiddenPopup}
          userId={userLogged?._id}
        />
      )}
    </div>
  );
};

export default ProfileUser;
