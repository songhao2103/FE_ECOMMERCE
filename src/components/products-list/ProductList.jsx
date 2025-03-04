import { useEffect, useState } from "react";
import baseUrl from "../../config/baseUrl";
import { capitalizeFirstLetter } from "../../utils/format/format";
import CardProduct from "../../utils-component/card-product/CardProduct";

const limit = 8;
const ProductList = () => {
  //lưu danh sách các lựa chọn filter
  const [typeFilter, setTypeFilter] = useState({
    store: [],
    deviceType: [],
  });
  //lưu giá trị của sort
  const [sortValue, setSortValue] = useState({
    field: "updateAt",
    value: -1,
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
  const [productsList, setProductsList] = useState([]); //lưu danh sách sản phẩm
  const [totalQuantity, setTotalQuantity] = useState(0); //tổng số lượng sản phẩm (sau khi filter)

  //gọi API để lấy danh sách type filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl + "/product/get-type-filter");

        if (!response.ok) {
          throw new Error("Không lấy được danh sách type filter!!");
        }

        const data = await response.json();
        console.log(data);

        setTypeFilter(data);
      } catch (error) {
        console.log("Không lấy được danh sách type filter!! ", error.message);
      }
    };
    fetchData();
  }, []);

  //gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          baseUrl + `/product/get-products?page=${currentPage}&limit=${limit}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filterValue,
              sortValue,
              searchValue,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Không lấy được danh sách sản phẩm!!");
        }

        const data = await response.json();

        setProductsList(data.products);
        setTotalQuantity(data.totalQuantity);
      } catch (error) {
        console.log("Không lấy được danh sách sản phẩm!!", error.message);
      }
    };
    fetchData();
  }, [currentPage, filterValue, sortValue, searchValue]);

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
      newCurrentPage <= Math.ceil(totalQuantity / limit)
    ) {
      console.log("turn");

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
                {typeFilter.deviceType.map((type) => (
                  <p
                    className="desc"
                    key={type}
                    onClick={() => handleSelectOptionFilter("deviceType", type)}
                  >
                    {capitalizeFirstLetter(type)}
                  </p>
                ))}
              </div>
              <label htmlFor="deviceType" className="layout"></label>
              <div className="list_option_select">
                {filterValue.deviceType.map((value) => (
                  <div className="option_select" key={value}>
                    <p className="desc">{capitalizeFirstLetter(value)}</p>
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
                  <p className="desc">
                    {capitalizeFirstLetter(filterValue.typeDevice)}
                  </p>
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
                    {capitalizeFirstLetter(type)}
                  </p>
                ))}
              </div>
              <label htmlFor="store" className="layout"></label>

              <div className="list_option_select">
                {filterValue.store.map((value) => (
                  <div className="option_select" key={value}>
                    <p className="desc">{capitalizeFirstLetter(value)}</p>
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
                    {capitalizeFirstLetter(filterValue.typeStore)}
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
                <p className="desc">{capitalizeFirstLetter(sortValue.field)}</p>
                <div className="list_options">
                  <label
                    htmlFor="field"
                    className="desc"
                    onClick={() => handleSelectOptionSort("field", "name")}
                  >
                    Name
                  </label>
                  <label
                    htmlFor="field"
                    className="desc"
                    onClick={() => handleSelectOptionSort("field", "price")}
                  >
                    Price
                  </label>
                  <label
                    htmlFor="field"
                    className="desc"
                    onClick={() =>
                      handleSelectOptionSort("field", "update time")
                    }
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
            {productsList.length > 0 &&
              productsList.map((product) => (
                <CardProduct product={product} key={product._id} />
              ))}

            {productsList.length === 0 && (
              <p className="desc">Không có sản phẩm nào!!</p>
            )}
          </div>

          {totalQuantity > limit && (
            <div className="bottom">
              <div
                className={`icon ${currentPage <= 1 ? "no_drop" : ""}`}
                onClick={() => handleTurnPage(currentPage - 1)}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div className="page_numbers">
                {new Array(Math.ceil(totalQuantity / limit))
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
                  currentPage >= Math.ceil(totalQuantity / limit)
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
