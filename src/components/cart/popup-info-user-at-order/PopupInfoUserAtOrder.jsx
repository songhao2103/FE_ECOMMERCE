import { useEffect, useState, useRef } from "react";

const PopupInfoUserAtOrder = ({ userLogged, deliveryAddress }) => {
  const [orderAddress, setOrderAddress] = useState({
    userName: userLogged.userName,
    phoneNumber: userLogged.phoneNumber || "",
    specific: userLogged.address?.specific || "",
  });

  //lưu địa mà người dùng chọn
  const [addressSelect, setAddressSelect] = useState({
    cityOrProvince: { name: userLogged.address?.cityOrProvince || "" },
    wardOrCommune: { name: userLogged.address?.wardOrCommune || "" },
    district: { name: userLogged.address?.district || "" },
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

  //hàm xử lý thay đổi giá trị của ô input select
  const handleChangeInputSelect = (e) => {
    setValueInputSelect(e.target.value);
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
      setAddressSelect({
        ...addressSelect,
        cityOrProvince: value,
        district: "",
        wardOrCommune: "",
        changed: true,
      });

      const listDistrict = await getDistricts(value.id);
      setListDistricts(listDistrict);
      setValueBoxSelect({
        ...valueBoxSelect,
        listValue: listDistrict,
        option: "district",
      });
      return;
    }

    if (valueBoxSelect.option === "district") {
      setAddressSelect({
        ...addressSelect,
        district: value,
        wardOrCommune: "",
      });

      const wardOrCommune = await getWardOrCommune(value.id);
      setListWardOrCommune(listDistricts);
      setValueBoxSelect({
        ...valueBoxSelect,
        listValue: wardOrCommune,
        option: "wardOrCommune",
      });

      return;
    }

    if (valueBoxSelect.option === "wardOrCommune") {
      setAddressSelect({
        ...addressSelect,
        wardOrCommune: value,
      });

      setValueBoxSelect({
        ...valueBoxSelect,
        option: "cityOrProvince",
        hidden: false,
      });
      return;
    }
  };

  //hàm xử lý khi người dùng
  return (
    <div className="popup_info_user_at_order">
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
              />
              <p className={`desc ${orderAddress.userName ? "active" : ""}`}>
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
              />
              <p className={`desc ${orderAddress.phoneNumber ? "active" : ""}`}>
                Phone number
              </p>
            </div>
          </div>

          <div className="box_select">
            <div className="box_input">
              <input
                type="text"
                onFocus={() => {
                  setValueInputSelect("");
                }}
                onBlur={() => {
                  let newValue = "";
                  Object.values(addressSelect).forEach((item) => {
                    if (!newValue) {
                      newValue = item.name;
                    } else {
                      newValue = newValue + ", " + item.name;
                    }
                  });
                  setValueInputSelect(newValue);
                }}
                placeholder={`${
                  !valueInputSelect
                    ? "City/Province, District, Ward/Commune"
                    : valueInputSelect
                }`}
                value={valueInputSelect}
              />
              <p className="desc">Tỉnh/Thành phố, Quận/Huyện, Phường, Xã</p>
            </div>

            <div className="box_option">
              <div className="title">
                <p
                  className={`desc ${
                    valueBoxSelect.option === "cityOrProvince" ? "active" : ""
                  }`}
                  onClick={() => {
                    handleTurnOption("cityOrProvince");
                  }}
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
                >
                  Phường/Xã
                </p>
              </div>

              <div className="list_value">
                {valueBoxSelect.listValue.map((item) => (
                  <p
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupInfoUserAtOrder;
