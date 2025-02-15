import { useEffect, useRef, useState } from "react";
import { isValidVietnamPhoneNumber } from "../../../utils/format/format";

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
const PopupInfoUserAtOrder = ({
  userLogged,
  deliveryAddress,
  handleTurnPopup,
  handleUpdateCurrentOrderAddress,
}) => {
  const [orderAddress, setOrderAddress] = useState({
    userName: userLogged.userName,
    phoneNumber: userLogged.phoneNumber || "",
    specificAddress: userLogged.address?.specific || "",
  });

  //lưu địa mà người dùng chọn
  const [addressSelect, setAddressSelect] = useState({
    cityOrProvince: { name: userLogged.address?.cityOrProvince || "" },
    district: { name: userLogged.address?.district || "" },
    wardOrCommune: { name: userLogged.address?.wardOrCommune || "" },
  });

  //lưu giá trị của ô input select
  const [valueInputSelect, setValueInputSelect] = useState(() => {
    let newValue = "";
    Object.values(addressSelect).forEach((item) => {
      if (!newValue) {
        newValue = item.name;
      } else {
        newValue = newValue + ", " + item.name;
      }
    });
    return newValue;
  });

  //Lưu giá trị của box_select
  const [valueBoxSelect, setValueBoxSelect] = useState({
    option: "cityOrProvince",
    hidden: false,
    listValue: [],
  });

  const [valueSearch, setValueSearch] = useState("");
  const clickElement = useRef(null);
  const [listValueOption, setListValueOption] = useState([]); //lưu danh sách option được hiển thị lên (phục vụ cho việc search)
  const [errorInput, setErrorInput] = useState({
    userName: false,
    phoneNumber: false,
    specificAddress: false,
    inputSelect: false,
  });
  const [listProvinceAndCities, setListProvinceAndCities] = useState([]); //lưu danh sách tỉnh, thành phố ở Việt Nam
  const [listDistricts, setListDistricts] = useState([]); //Lưu danh sách các quận huyện
  const [listWardOrCommune, setListWardOrCommune] = useState([]); //lưu danh sách các phường xã

  //lấy danh sách các tỉnh, thành phố
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

  //hàm xử lý thay đổi value input info_user
  const handleChangeInputInfoUser = (e) => {
    const { name, value } = e.target;
    setOrderAddress({ ...orderAddress, [name]: value });
  };

  //hàm xử lý khi thay đổi option
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
      setErrorInput({ ...errorInput, inputSelect: false });
      return;
    }
  };

  //hàm xử lý khi người dùng focus vào ô input select
  const handleFocusInputSelect = () => {
    setValueInputSelect("");
    setValueBoxSelect({ ...valueBoxSelect, hidden: true });
  };

  //hàm xử lý khi người dùng blur
  const handleBlurInputSelect = () => {
    const newValue = connectStringAddress(addressSelect);
    setValueInputSelect(newValue);
  };

  //hàm xử lý khi người dùng click chuột
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
        setErrorInput({ ...errorInput, inputSelect: true });
      }
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

  //hàm xử lý khi xác nhận address
  const handleConfirmAddress = () => {
    let newErrorInput = { ...errorInput };
    if (
      !orderAddress.userName ||
      !orderAddress.phoneNumber ||
      !orderAddress.specificAddress
    ) {
      newErrorInput = {
        ...newErrorInput,
        userName: !orderAddress.userName,
        phoneNumber: !orderAddress.phoneNumber,
        specificAddress: !orderAddress.specificAddress,
      };
    }

    if (!isValidVietnamPhoneNumber(orderAddress.phoneNumber)) {
      newErrorInput = { ...newErrorInput, phoneNumber: true };
    }

    if (!addressSelect.wardOrCommune.name) {
      newErrorInput = { ...newErrorInput, inputSelect: true };
    }

    if (
      newErrorInput.inputSelect ||
      newErrorInput.cityOrProvince ||
      newErrorInput.district ||
      newErrorInput.wardOrCommune ||
      newErrorInput.phoneNumber
    ) {
      setErrorInput(newErrorInput);
    } else {
      setErrorInput(newErrorInput);
      const newAddress = {
        ...orderAddress,
        cityOrProvince: addressSelect.cityOrProvince.name,
        district: addressSelect.district.name,
        wardOrCommune: addressSelect.wardOrCommune.name,
      };

      handleUpdateCurrentOrderAddress(newAddress);
      handleTurnPopup("turn_off");
    }
  };

  return (
    <div className="popup_info_user_at_order" onMouseDown={handleClickElement}>
      <div className="layout"></div>
      <div className="box_content">
        <div className="content">
          <div className="title_20">Address</div>
          <div className="info_user">
            <div className="box_input">
              <input
                type="text"
                name="userName"
                id="userName"
                placeholder="Enter your name"
                value={orderAddress.userName}
                onChange={handleChangeInputInfoUser}
                className={errorInput.userName ? "error" : ""}
              />
              <p
                className={`desc ${orderAddress.userName ? "active" : ""} ${
                  errorInput.userName ? "error" : ""
                }`}
              >
                Name
              </p>
            </div>

            <div className="box_input">
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Enter your phone number"
                value={orderAddress.phoneNumber}
                onChange={handleChangeInputInfoUser}
                className={errorInput.phoneNumber ? "error" : ""}
              />
              <p
                className={`desc ${orderAddress.phoneNumber ? "active" : ""} ${
                  errorInput.phoneNumber ? "error" : ""
                }`}
              >
                Phone number
              </p>
            </div>
          </div>

          <div className="box_select">
            <div className="box_input">
              <input
                type="text"
                onChange={handleChangeSearchValue}
                onFocus={handleFocusInputSelect}
                onBlur={handleBlurInputSelect}
                placeholder={`${
                  !valueInputSelect
                    ? "City/Province, District, Ward/Commune"
                    : valueInputSelect
                }`}
                value={valueInputSelect}
                data-type={"option_value"}
                className={errorInput.inputSelect ? "error" : ""}
              />
              <p
                className={`desc ${valueInputSelect ? "active" : ""} ${
                  errorInput.inputSelect ? "error" : ""
                }`}
              >
                Tỉnh/Thành phố, Quận/Huyện, Phường, Xã
              </p>
            </div>
            {valueBoxSelect.hidden && (
              <div className="box_option">
                <div className="title">
                  <p
                    className={`desc ${
                      valueBoxSelect.option === "cityOrProvince" ? "active" : ""
                    }`}
                    onClick={() => {
                      handleTurnOption("cityOrProvince");
                    }}
                    data-type={"option_value"}
                  >
                    Tỉnh/Thành phố
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
                    Quận/Huyện
                  </p>
                  <p
                    className={`desc ${
                      valueBoxSelect.option === "wardOrCommune" ? "active" : ""
                    }`}
                    onClick={() => {
                      handleTurnOption("wardOrCommune");
                    }}
                    data-type={"option_value"}
                  >
                    Phường/Xã
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

          <div className="box_input_specific_address">
            <input
              type="text"
              placeholder="Enter specific address"
              value={orderAddress.specificAddress}
              onChange={handleChangeInputInfoUser}
              name="specificAddress"
              className={errorInput.specificAddress ? "error" : ""}
            />
            <p
              className={`desc placeholder ${
                orderAddress.specificAddress ? "active" : ""
              } ${errorInput.specificAddress ? "error" : ""}`}
            >
              Specific address
            </p>
          </div>

          <div className="bottom_box_content">
            <button
              className="btn_dark_pink"
              onClick={() => handleTurnPopup("turn_off")}
            >
              Hủy bỏ
            </button>
            <button className="btn_dark_pink" onClick={handleConfirmAddress}>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupInfoUserAtOrder;
