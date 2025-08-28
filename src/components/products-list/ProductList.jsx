import { useEffect, useMemo, useState } from "react";
import { useGetProductList } from "../../services/queries/product.queries";
import CardProduct from "../../utils-component/card-product/CardProduct";
import {
  DEVICE_TYPES,
  getDeviceLabel,
  getProductsSortFieldLabel,
} from "./constance";

const limit = 8;
const ProductList = () => {
  //lưu danh sách các lựa chọn filter
  const [typeFilter, setTypeFilter] = useState({
    store: [],
    deviceType: [],
  });
  //lưu giá trị của sort
  const [sortValue, setSortValue] = useState({
    field: 5,
    value: 1,
  });
  //lưu giá trị của filter
  const [filterValue, setFilterValue] = useState({
    store: [],
    typeStore: "belong",
    deviceType: [],
    typeDevice: "belong",
  });
  const [searchValue, setSearchValue] = useState(""); //lưu giá trị của ô input search
  const [currentPage, setCurrentPage] = useState(1); //lưu trang hiện tại
  const [debounceSearchKey, setDebounceSearchKey] = useState("");

  const filters = useMemo(() => {
    return {
      DeviceTypes: filterValue.deviceType,
      SortField: sortValue.field,
      SortType: sortValue.value,
      PageIndex: currentPage,
      PageSize: limit,
      searchKey: debounceSearchKey,
    };
  }, [sortValue, filterValue, currentPage, limit, debounceSearchKey]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearchKey(searchValue);
    }, [500]);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const { data: productData, isPending: pendingGetDataList } =
    useGetProductList(filters);

  //hàm xử lý khi người dùng chọn option filter
  const handleSelectOptionFilter = (name, newValue) => {
    if (name === "typeStore" || name === "typeDevice") {
      if (filterValue[name] === newValue) {
        return;
      }
      setFilterValue({ ...filterValue, [name]: newValue });
      return;
    }

    //kiểm tra đã tồn tại hay chưa
    const isDuplicate = filterValue[name].find((value) => value === newValue);

    //nếu chưa thì thêm vào
    if (!isDuplicate) {
      setFilterValue({
        ...filterValue,
        [name]: [...filterValue[name], newValue],
      });
    }
  };

  //hàm xử lý khi xóa các option filter
  const handleDeleteOptionFilter = (name, valueDelete) => {
    const newListValue = filterValue[name].filter(
      (value) => value !== valueDelete
    );

    setFilterValue({ ...filterValue, [name]: newListValue });
  };

  //hàm xử lý khi người dùng chọn option sort
  const handleSelectOptionSort = (name, newValue) => {
    if (sortValue[name] === newValue) {
      return;
    }
    setSortValue({ ...sortValue, [name]: newValue });
  };

  //hàm turn page
  const handleTurnPage = (newCurrentPage) => {
    if (
      newCurrentPage >= 1 &&
      newCurrentPage <= Math.ceil(productData?.totalCount / limit)
    ) {
      setCurrentPage(newCurrentPage);
    }
  };

  return (
    <div className="products_list_page">
      <div className="top_page">
        <div className="title_36">Products List</div>
      </div>
      <div className="content_page">
        <div className="box_select">
          <div className="box_filter">
            <div className="filter">
              <input type="checkbox" id="deviceType" />
              <label htmlFor="deviceType" className="desc">
                Device type:
              </label>
              <div className="list_options">
                {DEVICE_TYPES.map((type) => (
                  <p
                    className="desc"
                    key={type.value}
                    onClick={() =>
                      handleSelectOptionFilter("deviceType", type.value)
                    }
                  >
                    {type.label}
                  </p>
                ))}
              </div>
              <label htmlFor="deviceType" className="layout"></label>
              <div className="list_option_select">
                {filterValue.deviceType.map((value) => (
                  <div className="option_select" key={value}>
                    <p className="desc">{getDeviceLabel(value)}</p>
                    <div
                      className="icon"
                      onClick={() =>
                        handleDeleteOptionFilter("deviceType", value)
                      }
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                ))}
              </div>
              {filterValue.deviceType.length > 0 && (
                <div className="box_operator">
                  <input type="checkbox" id="operator_device" />
                  <label htmlFor="operator_device" className="desc">
                    Type:
                  </label>
                  <p className="desc">{1}</p>
                  <div className="list_type">
                    <label
                      htmlFor="operator_device"
                      className="desc"
                      onClick={() =>
                        handleSelectOptionFilter("typeDevice", "belong")
                      }
                    >
                      Belong
                    </label>
                    <label
                      htmlFor="operator_device"
                      className="desc"
                      onClick={() =>
                        handleSelectOptionFilter("typeDevice", "not belong")
                      }
                    >
                      Not belong
                    </label>
                  </div>
                  <label
                    htmlFor="operator_device"
                    className="layout_operator"
                  ></label>
                </div>
              )}
            </div>
            <div className="filter">
              <input type="checkbox" name="" id="store" />
              <label htmlFor="store" className="desc">
                Store:
              </label>
              <div className="list_options">
                {typeFilter.store.map((type) => (
                  <p
                    className="desc"
                    key={type}
                    onClick={() => handleSelectOptionFilter("store", type)}
                  >
                    {getProductsSortFieldLabel(type)}
                  </p>
                ))}
              </div>
              <label htmlFor="store" className="layout"></label>

              <div className="list_option_select">
                {filterValue.store.map((value) => (
                  <div className="option_select" key={value}>
                    <p className="desc">{getProductsSortFieldLabel(value)}</p>
                    <div
                      className="icon"
                      onClick={() => handleDeleteOptionFilter("store", value)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                ))}
              </div>

              {filterValue.store.length > 0 && (
                <div className="box_operator">
                  <input type="checkbox" name="" id="operator_store" />
                  <label htmlFor="operator_store" className="desc">
                    Type:
                  </label>
                  <p className="desc">
                    {getProductsSortFieldLabel(filterValue.typeStore)}
                  </p>
                  <div className="list_type">
                    <label
                      htmlFor="operator_store"
                      className="desc"
                      onClick={() =>
                        handleSelectOptionFilter("typeStore", "belong")
                      }
                    >
                      Belong
                    </label>
                    <label
                      htmlFor="operator_store"
                      className="desc"
                      onClick={() =>
                        handleSelectOptionFilter("typeStore", "not belong")
                      }
                    >
                      Not belong
                    </label>
                  </div>

                  <label
                    htmlFor="operator_store"
                    className="layout_operator"
                  ></label>
                </div>
              )}
            </div>
          </div>

          <div className="box_right">
            <div className="box_sort">
              <div className="box_option">
                <input type="checkbox" name="" id="field" />
                <label htmlFor="field" className="desc">
                  Field:
                </label>
                <p className="desc">
                  {getProductsSortFieldLabel(sortValue.field)}
                </p>
                <div className="list_options">
                  <label
                    htmlFor="field"
                    className="desc"
                    onClick={() => handleSelectOptionSort("field", 1)}
                  >
                    Name
                  </label>
                  <label
                    htmlFor="field"
                    className="desc"
                    onClick={() => handleSelectOptionSort("field", 2)}
                  >
                    Price
                  </label>
                  <label
                    htmlFor="field"
                    className="desc"
                    onClick={() => handleSelectOptionSort("field", 5)}
                  >
                    Update time
                  </label>
                </div>
                <label htmlFor="field" className="layout"></label>
              </div>

              <div className="box_option">
                <input type="checkbox" id="typeSort" />
                <label htmlFor="typeSort" className="desc">
                  Type:
                </label>
                <p className="desc">
                  {sortValue.value === -1
                    ? "Decrease"
                    : sortValue.value === 1
                    ? "Increase"
                    : "No sort"}
                </p>
                <div className="list_options">
                  <label
                    htmlFor="typeSort"
                    className="desc"
                    onClick={() => handleSelectOptionSort("value", 0)}
                  >
                    No Sort
                  </label>
                  <label
                    htmlFor="typeSort"
                    className="desc"
                    onClick={() => handleSelectOptionSort("value", 1)}
                  >
                    Increase
                  </label>
                  <label
                    htmlFor="typeSort"
                    className="desc"
                    onClick={() => handleSelectOptionSort("value", -1)}
                  >
                    Decrease
                  </label>
                </div>

                <label htmlFor="typeSort" className="layout"></label>
              </div>
            </div>

            <div className="box_search">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
              <div className="icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="box_products_list">
          <div className="content">
            {pendingGetDataList && <p className="text-center">Loading...</p>}
            {productData?.items?.length > 0 &&
              !pendingGetDataList &&
              productData?.items.map((product) => (
                <CardProduct product={product} key={product.id} />
              ))}

            {!productData ||
              !productData.items ||
              (productData?.items.length === 0 && (
                <p className="desc">Không có sản phẩm nào!!</p>
              ))}
          </div>

          {productData?.totalCount > limit && (
            <div className="bottom">
              <div
                className={`icon ${currentPage <= 1 ? "no_drop" : ""}`}
                onClick={() => handleTurnPage(currentPage - 1)}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div className="page_numbers">
                {new Array(Math.ceil(productData?.totalCount / limit))
                  .fill(null)
                  .map((_, index) => (
                    <p
                      className={`desc item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                      key={index}
                      onClick={() => handleTurnPage(index + 1)}
                    >
                      {index + 1}
                    </p>
                  ))}
              </div>
              <div
                className={`icon ${
                  currentPage >= Math.ceil(productData?.totalCount / limit)
                    ? "no_drop"
                    : ""
                }`}
                onClick={() => handleTurnPage(currentPage + 1)}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
