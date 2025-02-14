import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import baseUrl from "../../../config/baseUrl.js";
import refreshToken from "../../../utils/tokenApi/refreshToken.js";
import { showToast } from "../../../redux-toolkit/redux-slice/toastSlice.js";
import Toast from "../../../utils-component/toast/Toast.jsx";
import Loader from "../../../utils-component/loader/Loader";

const AddProduct = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    productName: "",
    describe: "",
    price: "",
    discount: "",
    company: "",
    deviceType: "",
    defaultImage: null,
    blackImage: null,
    whiteImage: null,
    pinkImage: null,
    otherImages: null,
    totalQuantity: "",
    blackQuantity: "",
    whiteQuantity: "",
    pinkQuantity: "",
  });

  const [errorGlobal, setErrorGlobal] = useState("");

  const userLogged = useSelector((state) => state.userLoggedSlice.userLogged);

  const [isLoading, setIsLoading] = useState(false);
  //hàm theo dõi sự thay đổi của form data
  const handleChangeFormData = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && name !== "otherImages") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "file" && name === "otherImages") {
      const otherImages = Array.from(files);
      setFormData({
        ...formData,
        [name]: otherImages,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  //hàm submit form data

  const handleSubmitFormData = async (e) => {
    e.preventDefault();

    if (!userLogged) {
      setErrorGlobal("Not logged in yet!!");
      return;
    }

    if (
      !formData.productName ||
      !formData.describe ||
      !formData.price ||
      !formData.discount ||
      !formData.company ||
      !formData.deviceType ||
      !formData.totalQuantity
    ) {
      setErrorGlobal("Missing data!!");
      return;
    }

    if (
      formData.defaultImage &&
      !formData.blackImage &&
      !formData.whiteImage &&
      !formData.pinkImage
    ) {
      setErrorGlobal("Missing images!!");
      return;
    }

    if (
      (!!formData.blackImage && !formData.blackQuantity) ||
      (!!formData.whiteImage && !formData.whiteQuantity) ||
      (!!formData.pinkImage && !formData.pinkQuantity)
    ) {
      setErrorGlobal("Missing quantity!!");
      return;
    }

    if (isNaN(formData.price)) {
      setErrorGlobal("Price is not in correct format!!");
      return;
    }

    if (
      isNaN(formData.discount) ||
      formData.discount < 0 ||
      formData.discount > 100
    ) {
      setErrorGlobal("Discount is not in correct format!");
      return;
    }

    //tạo mới form data gồm các dữ liệu JSON
    const formDataJson = {
      productName: formData.productName,
      describe: formData.describe,
      price: formData.price,
      discount: formData.discount,
      company: formData.company,
      deviceType: formData.deviceType,
      totalQuantity: formData.totalQuantity,
      blackQuantity: formData.blackQuantity ? formData.blackQuantity : 0,
      whiteQuantity: formData.whiteQuantity ? formData.whiteQuantity : 0,
      pinkQuantity: formData.pinkQuantity ? formData.pinkQuantity : 0,
    };

    const formDataUpload = new FormData();

    formDataUpload.append("formDataJson", JSON.stringify(formDataJson));
    formDataUpload.append("blackImage", formData.blackImage);
    formDataUpload.append("whiteImage", formData.whiteImage);
    formDataUpload.append("pinkImage", formData.pinkImage);
    if (formData.otherImages) {
      Array.from(formData.otherImages).forEach((file) => {
        formDataUpload.append("otherImages", file); // Append từng file
      });
    }

    try {
      setIsLoading(true);
      let response = await fetchWithAuth(
        `${baseUrl}/store/add-product/${userLogged.storeId}`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      if (response.status === 403) {
        const refreshTokenResponse = await refreshToken();
        if (!refreshTokenResponse.ok) {
          throw new Error("Not to update token!! " + refreshToken.message);
        }

        response = await fetchWithAuth(
          `${baseUrl}/store/add-product/${userLogged.storeId}`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );
      }

      const data = await response.json();

      if (!data.success) {
        setErrorGlobal(data.error);
        return;
      }

      setFormData({
        productName: "",
        describe: "",
        price: "",
        discount: "",
        company: "",
        deviceType: "",
        defaultImage: null,
        blackImage: null,
        whiteImage: null,
        pinkImage: null,
        otherImages: null,
        totalQuantity: "",
        blackQuantity: "",
        whiteQuantity: "",
        pinkQuantity: "",
      });

      dispatch(
        showToast({
          message: "Added new product successfully!!",
        })
      );

      setErrorGlobal("");
    } catch (error) {
      console.log("Added new product failed!!!" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="add_product_store_page">
      <Toast />
      <form action="" onSubmit={handleSubmitFormData}>
        <div className="column_1">
          <label htmlFor="productName" className="desc">
            Product name:
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            placeholder="Product name"
            value={formData.productName}
            onChange={handleChangeFormData}
          />

          <label htmlFor="describe" className="desc">
            Describe:
          </label>
          <input
            type="text"
            id="describe"
            name="describe"
            placeholder="Describe"
            value={formData.describe}
            onChange={handleChangeFormData}
          />

          <label htmlFor="price" className="desc">
            Price (VND):
          </label>
          <input
            type="text"
            id="price"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChangeFormData}
          />

          <label htmlFor="discount" className="desc">
            Discount (%):
          </label>
          <input
            type="text"
            id="discount"
            name="discount"
            placeholder="Discount"
            value={formData.discount}
            onChange={handleChangeFormData}
          />

          <div className="select">
            <label htmlFor="company" className="desc">
              Company:
            </label>
            <select
              name="company"
              id="company"
              onChange={handleChangeFormData}
              value={formData.company}
            >
              <option value="" disabled selected>
                Company
              </option>
              <option value="apple">Apple</option>
              <option value="samsung">Samsung</option>
              <option value="oppo">Oppo</option>
              <option value="asus">Asus</option>
              <option value="dell">Dell</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="select">
            <label htmlFor="deviceType" className="desc">
              Device type:
            </label>
            <select
              name="deviceType"
              id="deviceType"
              onChange={handleChangeFormData}
              value={formData.deviceType}
            >
              <option value="" disabled selected>
                Device type
              </option>
              <option value="laptop">Laptop</option>
              <option value="smartphone">Smartphone</option>
              <option value="tablet">Tablet</option>
              <option value="accessories">Accessories</option>
              <option value="audio">Audio equipment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="column_2">
          <div className="inputs_image box_file">
            <p className="desc title">Product images</p>

            <div className="image">
              <label htmlFor="blackImage" className="desc">
                Black:
              </label>
              <input
                type="file"
                name="blackImage"
                id="blackImage"
                onChange={handleChangeFormData}
              />
              <label htmlFor="blackImage" className="icon_input_file">
                <p className="desc">+</p>
              </label>
              {formData.blackImage && (
                <div className="files_upload">
                  <p className="desc">{formData.blackImage.name}</p>
                </div>
              )}
            </div>

            <div className="image">
              <label htmlFor="whiteImage" className="desc">
                White:
              </label>
              <input
                type="file"
                name="whiteImage"
                id="whiteImage"
                onChange={handleChangeFormData}
              />
              <label htmlFor="whiteImage" className="icon_input_file">
                <p className="desc">+</p>
              </label>

              {formData.whiteImage && (
                <div className="files_upload">
                  <p className="desc">{formData.whiteImage.name}</p>
                </div>
              )}
            </div>

            <div className="image">
              <label htmlFor="pinkImage" className="desc">
                Pink:
              </label>
              <input
                type="file"
                name="pinkImage"
                id="pinkImage"
                onChange={handleChangeFormData}
              />
              <label htmlFor="pinkImage" className="icon_input_file">
                <p className="desc">+</p>
              </label>
              {formData.pinkImage && (
                <div className="files_upload">
                  <p className="desc">{formData.pinkImage.name}</p>
                </div>
              )}
            </div>

            <div className="image">
              <label htmlFor="otherImages" className="desc">
                Other:
              </label>
              <input
                type="file"
                name="otherImages"
                id="otherImages"
                onChange={handleChangeFormData}
                multiple
              />
              <label htmlFor="otherImages" className="icon_input_file">
                <p className="desc">+</p>
              </label>
              {formData.otherImages && (
                <div className="files_upload">
                  {formData.otherImages.map((image, index) => (
                    <p className="desc" key={index}>
                      {image.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="inputs_quantity box_file">
            <p className="desc title">Product quantity</p>

            <div className="quantity">
              <label htmlFor="totalQuantity" className="desc">
                Total:
              </label>
              <input
                type="text"
                name="totalQuantity"
                id="totalQuantity"
                onChange={handleChangeFormData}
                placeholder="Total quantity"
              />
            </div>

            <div className="quantity">
              <label htmlFor="blackQuantity" className="desc">
                Black:
              </label>
              <input
                type="text"
                name="blackQuantity"
                id="blackQuantity"
                onChange={handleChangeFormData}
                placeholder="Black quantity"
              />
            </div>

            <div className="quantity">
              <label htmlFor="whiteQuantity" className="desc">
                White:
              </label>
              <input
                type="text"
                name="whiteQuantity"
                id="whiteQuantity"
                onChange={handleChangeFormData}
                placeholder="White quantity"
              />
            </div>

            <div className="quantity">
              <label htmlFor="pinkQuantity" className="desc">
                Pink:
              </label>
              <input
                type="text"
                name="pinkQuantity"
                id="pinkQuantity"
                onChange={handleChangeFormData}
                placeholder="Pink quantity"
              />
            </div>
          </div>
        </div>

        <div className="bottom">
          {errorGlobal && <p className="error desc">{errorGlobal}</p>}
          <button className="btn_dark_pink" type="submit">
            Add product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
