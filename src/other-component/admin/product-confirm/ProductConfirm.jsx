import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import fetchWithAuth from "../../../utils/tokenApi/fetchWithAuth";
import baseUrl from "../../../config/baseUrl";
import refreshToken from "../../../utils/tokenApi/refreshToken";
import PopupProductConfirm from "./PopupProductConfirm";
import {
  formatCurrencyVND,
  capitalizeFirstLetter,
  formatDate,
} from "../../../utils/format/format.js";
import { showToast } from "../../../redux-toolkit/redux-slice/toastSlice.js";
import Toast from "../../../utils-component/toast/Toast.jsx";

//số lượng sản phẩm trên 1 trang
const productsLimit = 5;

//component=================================================================================================
const ProductConfirm = () => {
  ////////////////////////////////////state/////////////////////////////////////////////

  const dispatch = useDispatch();

  //lưu danh sách các lựa chọn
  const [selects, setSelects] = useState(null);

  //lưu giá trị của bộ lọc
  const [filters, setFilters] = useState({
    stores: [],
    typeStore: "belong",
    deviceTypes: [],
    typeDeviceType: "belong",
    search: "",
  });

  //lưu giá trị của sắp xếp
  const [sort, setSort] = useState({
    field: "name",
    type: "0",
  });

  //lưu danh sách sản phẩm
  const [products, setProducts] = useState([]);

  //lưu giá trị của trang sản phẩm hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  //lưu số lượng sản phẩm
  const [pages, setPages] = useState([]);

  //sản phẩm ở popup
  const [productInpopup, setProductInPopup] = useState(null);

  //lưu danh sách sản phẩm được chọn
  const [checkeds, setCheckeds] = useState(new Set());

  //state dùng để reload lại trang
  const [reload, setReload] = useState(null);

  //lưu giá trị của thẻ textarea
  const [valueTextarea, setValueTextarea] = useState("");

  //lưu sản phẩm từ chối
  const [productRefuse, setProuctRefuse] = useState(null);
  /////////////////////////////////////handler//////////////////////////////////

  //Lấy danh sách các lựa chọn store và device type
  useEffect(() => {
    const fetchSelects = async () => {
      try {
        let response = await fetchWithAuth(
          baseUrl + "/admin/get-select-product-confirm"
        );

        if (response.status === 403) {
          const refreshTokenResponse = await refreshToken();

          if (!refreshTokenResponse.ok) {
            throw new Error(
              "Access token update failed!!" + refreshTokenResponse.message
            );
          }

          response = await fetchWithAuth(
            baseUrl + "/admin/get-select-product-confirm"
          );
        }

        const data = await response.json();

        setSelects(data);
      } catch (error) {
        console.log(
          "Can not get selects of ProductConfirm page!!" + error.message
        );
      }
    };
    fetchSelects();
  }, []);

  //lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        let response = await fetchWithAuth(
          baseUrl +
            `/admin/get-product-pending?currentPage=${currentPage}&limit=${productsLimit}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filters, sort }),
          }
        );

        if (response.status == 403) {
          const refreshTokenResponse = await refreshToken();

          if (!refreshTokenResponse.ok) {
            throw new Error(
              "Access token update failed!!" + refreshTokenResponse.message
            );
          }

          response = await fetchWithAuth(
            baseUrl +
              `/admin/get-product-pending?currentPage=${currentPage}&limit=${productsLimit}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ filters, sort }),
            }
          );
        }

        const data = await response.json();

        setProducts(data.products);

        const newPages = Array.from(
          {
            length: Math.ceil(data.totalQuantity / productsLimit),
          },
          (_, index) => index + 1
        );

        setPages(newPages);

        setCheckeds(new Set());
      } catch (error) {
        console.log("Can not get product pending!!" + error.message);
      }
    };

    fetchProductData();
  }, [filters, sort, currentPage, reload]);

  //hàm xử xử lý chọn filters
  const handleSelectFilters = (option, value) => {
    let values;

    if (
      option !== "search" &&
      option !== "typeStore" &&
      option !== "typeDeviceType"
    ) {
      values = [...new Set([...filters[option], value])];
    } else {
      values = value;
    }

    setFilters({ ...filters, [option]: values });
  };

  // hàm xử lý lựa chọn sort
  const handleSelectSort = (field, event) => {
    setSort({
      ...sort,
      [field]: event.target.value,
    });
  };

  //hàm xử lý chuyển trang
  const handleTurnPage = (value) => {
    if (
      currentPage !== value &&
      value > 0 &&
      value <= pages[pages.length - 1]
    ) {
      window.scrollTo({
        top: 80, // Vị trí dọc (0 là đầu trang)
        behavior: "smooth", // Hiệu ứng cuộn mượt
      });
      setCurrentPage(value);
    }
  };

  //hàm xóa các option ở filter
  const handleDeleteOption = (option, value) => {
    const newOptions = [...filters[option]].filter(
      (option) => option !== value
    );

    let fieldType = "";
    if (option === "stores") {
      fieldType = "typeStore";
    } else {
      fieldType = "typeDeviceType";
    }

    setFilters({
      ...filters,
      [option]: newOptions,
      [fieldType]: newOptions.length === 0 ? "belong" : filters[fieldType],
    });
  };

  //hàm cập nhật sản phẩm ở popup
  const handleSelectProductPopup = (product) => {
    setProductInPopup(product);
  };

  //hàm theo dõi giá trị của ô input checkbox
  const handleChangeInputCheckbox = (_id, valueHandler) => {
    const newCheckeds = new Set(checkeds);
    if (!valueHandler) {
      if (newCheckeds.has(_id)) {
        newCheckeds.delete(_id);
      } else {
        newCheckeds.add(_id);
      }
    } else if (valueHandler === "select") {
      products.forEach((product) => newCheckeds.add(product._id));
    } else {
      newCheckeds.clear();
    }

    setCheckeds(newCheckeds);
  };

  //hàm accept product
  const handleAcceptProduct = async (id) => {
    const fetchAccepProduct = async (productIds) => {
      //chuyển mảng dang sách productIds từ Set sang Array vì Set không chuyển thành JSON được
      const arrayProductIds = Array.from(productIds);

      try {
        let response = await fetchWithAuth(baseUrl + "/admin/accept-products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(arrayProductIds),
        });

        if (response.status === 403) {
          const refreshTokenResponse = await refreshToken();

          if (!refreshTokenResponse.ok) {
            throw new Error(
              "Access token update failed!!" + refreshTokenResponse.status
            );
          }

          response = await fetchWithAuth(baseUrl + "/admin/accept-products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(arrayProductIds),
          });
        }

        const data = await response.json();

        dispatch(
          showToast({
            message: data.message,
          })
        );

        setReload(Date.now());
      } catch (error) {
        console.log("Can not accep product!!" + error.message);
      }
    };

    if (!id) {
      await fetchAccepProduct(checkeds);
    } else {
      const newArray = new Array([id]);
      await fetchAccepProduct(newArray);
    }
  };

  //hàm lấy giá trị của thẻ textarea
  const handleChangeValueTextarea = (e) => {
    setValueTextarea(e.target.value);
  };

  //hàm xử lý để lấy ra sản phẩm để refuse
  const handleGetProductRefuse = (productId) => {
    setProuctRefuse(productId);
    setProductInPopup(null);
  };

  //hàm từ chối sản phẩm
  const handleRefuseProduct = async () => {
    if (!valueTextarea || !productRefuse) {
      dispatch(
        showToast({
          message: "Thiếu thông tin!!!",
        })
      );
      return;
    }

    try {
      let response = await fetchWithAuth(baseUrl + "/admin/refuse-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productRefuse,
          reasonForRefusal: valueTextarea,
        }),
      });

      if (response.status === 403) {
        const refreshTokenResponse = await refreshToken();

        if (!refreshTokenResponse.ok) {
          throw new Error(
            "Access token updated failed!!! " + refreshTokenResponse.status
          );
        }

        response = await fetchWithAuth(baseUrl + "/admin/refuse-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productRefuse,
            reasonForRefusal: valueTextarea,
          }),
        });
      }

      const data = await response.json();

      dispatch(
        showToast({
          message: data.message,
        })
      );

      setValueTextarea("");

      setProuctRefuse(null);

      setReload(Date.now());
    } catch (error) {
      console.log("Không refuse được sản phẩm!! " + error.message);
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="product_confirm">
      <Toast />

      {/* ===============nav bar================================ */}
      <div className="nav_bar_product_confirm">
        <div className="box_option">
          <div className="option">
            <label htmlFor="selectStore" className="desc">
              Store <span>&#8893;</span>:
            </label>

            <input type="checkbox" id="selectStore" />

            <label
              className="layout layout_store"
              htmlFor="selectStore"
            ></label>

            {filters.stores.length > 0 && (
              <div className="content">
                {filters.stores.map((option, index) => (
                  <div className="select_item" key={index}>
                    <p className="desc"> {capitalizeFirstLetter(option)}</p>
                    <p
                      className="desc delete"
                      onClick={() => {
                        handleDeleteOption("stores", option);
                      }}
                    >
                      Delete
                    </p>
                  </div>
                ))}
              </div>
            )}

            {filters.stores.length > 0 && (
              <div className="box_type">
                <div className="type desc">Type:</div>
                <select
                  onChange={(event) =>
                    handleSelectFilters("typeStore", event.target.value)
                  }
                >
                  <option value={"belong"}>Belong</option>
                  <option value={"not belong"}>Not belong</option>
                </select>
              </div>
            )}

            <ul className="select select_store">
              {selects
                ? selects.storeNames.map((storeName) => (
                    <li
                      className="desc"
                      key={storeName}
                      onClick={() => handleSelectFilters("stores", storeName)}
                    >
                      {storeName}
                    </li>
                  ))
                : null}
            </ul>
          </div>
          <div className="option">
            <label htmlFor="select_device_type" className="desc">
              Device Type <span>&#8893;</span>
            </label>
            <input type="checkbox" id="select_device_type" />
            <label
              htmlFor="select_device_type"
              className=" layout layout_device_type"
            ></label>

            {filters.deviceTypes.length > 0 && (
              <div className="content">
                {filters.deviceTypes.map((option, index) => (
                  <div className="select_item" key={index}>
                    <p className="desc">{capitalizeFirstLetter(option)}</p>
                    <p
                      className="desc delete"
                      onClick={() => {
                        handleDeleteOption("deviceTypes", option);
                      }}
                    >
                      Delete
                    </p>
                  </div>
                ))}
              </div>
            )}

            {filters.deviceTypes.length > 0 && (
              <div className="box_type">
                <div className="type desc">Type:</div>
                <select
                  onChange={(event) =>
                    handleSelectFilters("typeDeviceType", event.target.value)
                  }
                >
                  <option value={"belong"}>Belong</option>
                  <option value={"not belong"}>Not belong</option>
                </select>
              </div>
            )}

            <ul className="select select_device_type">
              {selects
                ? selects.deviceTypes.map((deviceType) => (
                    <li
                      className="desc"
                      key={deviceType}
                      onClick={() =>
                        handleSelectFilters("deviceTypes", deviceType)
                      }
                    >
                      {capitalizeFirstLetter(deviceType)}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>

        <div className="box_rigth">
          <div className="box_sort">
            <div className="sort">
              <p className="desc"> Field:</p>
              <select
                className="field"
                id="admin_sort_field"
                onChange={(event) => handleSelectSort("field", event)}
              >
                <option value="price">Price</option>
                <option value="updatedAt">Update time</option>
                <option value="productName">Name</option>
              </select>
            </div>

            <div className="sort">
              <p className="desc">Type:</p>
              <select
                name=""
                id=""
                className="type"
                onChange={(event) => handleSelectSort("type", event)}
              >
                <option value="0">Not sort</option>
                <option value="1">Increase</option>
                <option value="-1">Decrease</option>
              </select>
            </div>
          </div>
          <div className="box_input">
            <input
              type="text"
              placeholder="Search..."
              onChange={(event) =>
                handleSelectFilters("search", event.target.value)
              }
            />
            <div className="icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
        </div>
      </div>

      {/* ====================products============================================== */}
      <table className="list_products_confirm">
        <thead>
          <tr>
            <th className="desc image">Image</th>
            <th className="desc name">Name</th>
            <th className="desc store">Store</th>
            <th className="desc price">Price</th>
            <th className="desc quantity">Update time</th>
            <th className="desc btn"></th>
            <th className="desc btn"></th>
            <th className="input">
              <div className="box_select">
                <span
                  className="desc"
                  onClick={() => handleChangeInputCheckbox("", "select")}
                >
                  Select
                </span>
                <span
                  className="desc"
                  onClick={() => handleChangeInputCheckbox("", "deselect")}
                >
                  Deselect
                </span>
              </div>
            </th>
          </tr>
        </thead>
        {products && products.length > 0 && (
          <tbody>
            {products.map((product) => (
              <tr className="product" key={product.id}>
                <td
                  className="image"
                  onClick={() => handleSelectProductPopup(product)}
                >
                  <img src={product.images[0].url} alt="" />
                </td>

                <td
                  className="title_20 name"
                  onClick={() => handleSelectProductPopup(product)}
                >
                  {product.productName}
                </td>

                <td className="desc store">Apple</td>

                <td className="desc price">
                  {formatCurrencyVND(product.price)}
                </td>

                <td className="desc quantity">
                  {formatDate(product.updatedAt)}
                </td>

                <td className="btn">
                  <button
                    className="btn_dark_pink accep"
                    onClick={() => handleAcceptProduct(product._id)}
                  >
                    Accep
                  </button>
                </td>

                <td className="btn refure">
                  <button
                    className="btn_dark_pink refure"
                    onClick={() => handleGetProductRefuse(product._id)}
                  >
                    Refuse
                  </button>
                </td>

                <td className="input">
                  <label
                    htmlFor={`input_checkbox_${product._id}`}
                    className="box_input_checkbox"
                  >
                    <input
                      id={`input_checkbox_${product._id}`}
                      type="checkbox"
                      checked={checkeds.has(product._id)}
                      onChange={() =>
                        handleChangeInputCheckbox(product._id, "")
                      }
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {productInpopup && (
        <PopupProductConfirm
          product={productInpopup}
          handleSelectProductPopup={handleSelectProductPopup}
          handleAcceptProduct={handleAcceptProduct}
          handleGetProductRefuse={handleGetProductRefuse}
        />
      )}

      {/* ===================pagination====================================== */}
      {pages.length > 1 && (
        <div className="pagination_product_confirm">
          <div
            className={`icon item ${currentPage === 1 ? "no_drop" : ""}`}
            onClick={() => handleTurnPage(currentPage - 1)}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          {pages.map((page) => (
            <p
              className={
                currentPage === page ? "desc item active" : "desc item"
              }
              key={page}
              onClick={() => handleTurnPage(page)}
            >
              {page}
            </p>
          ))}
          <div
            className={`icon item ${
              currentPage === pages.length ? "no_drop" : ""
            }`}
            onClick={() => handleTurnPage(currentPage + 1)}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      )}

      {checkeds.size > 0 && (
        <div className="other">
          <button
            className="btn_dark_pink"
            onClick={() => handleAcceptProduct("")}
          >
            Accep
          </button>
        </div>
      )}

      {/* popup refuse product  */}
      {productRefuse && (
        <div className="popup_refuse_product">
          <div
            className="layout_refuse"
            onClick={() => handleGetProductRefuse(null)}
          ></div>
          <div className="content">
            <label htmlFor="textarea_refuse" className="desc">
              Reason for refusal:
            </label>
            <textarea
              name=""
              id="textarea_refuse"
              rows={7}
              cols={50}
              className="desc"
              onChange={handleChangeValueTextarea}
              value={valueTextarea}
              placeholder="Reason...."
            ></textarea>
            <div className="btn">
              <button className="btn_dark_pink" onClick={handleRefuseProduct}>
                Refuse
              </button>
            </div>
            <div className="close" onClick={() => handleGetProductRefuse(null)}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductConfirm;
