import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import baseUrl from "../../config/baseUrl";
import Loader from "../../utils-component/loader/Loader";
import CardProduct from "../../utils-component/card-product/CardProduct";

const limit = 8;
const ProductsListOfSearch = () => {
  const debouncedValueSearch = useSelector(
    (state) => state.searchSlice.debouncedValueSearch
  );
  const [productsList, setProductsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(0); //tổng số lượng sản phẩm (sau khi filter)
  const [isLoading, setIsLoading] = useState(true);
  const [sortValue, setSortValue] = useState(0);

  //gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          baseUrl +
            `/product/get-products-of-search?debouncedValueSearch=${debouncedValueSearch}&limit=${limit}&page=${currentPage}&sortValue=${sortValue}`
        );

        if (!response.ok) {
          throw new Error("Không lấy được danh sách sản phẩm!!");
        }

        const data = await response.json();
        setProductsList(data.products);
        setTotalQuantity(data.totalQuantity);
      } catch (error) {
        console.log("Có lỗi: error: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, debouncedValueSearch, sortValue]);

  //hàm xử lý khi người dùng click chuyển trang
  const handleTurnPage = (value) => {
    if (value === currentPage) {
      return;
    }

    setCurrentPage(value);
  };

  //hàm xử lý khi người dùng lựa chọn kiểu sắp xếp
  const handleSelectSortValue = (newSortValue) => {
    if (newSortValue === sortValue) {
      setSortValue(0);
    } else {
      setSortValue(newSortValue);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="products_list_of_search_page">
      <div className="top">
        <p className="desc">{`Kết quả tìm kiếm với từ khóa: "${debouncedValueSearch}"`}</p>
        <div className="box_sort">
          <p className="desc">Sort</p>
          <div
            className={`sort ${sortValue === -1 ? "active" : ""}`}
            onClick={() => handleSelectSortValue(-1)}
          >
            <div className="icon">
              <i className="fa-solid fa-arrow-down"></i>
            </div>
            <p className="desc">High price</p>
          </div>
          <div
            className={`sort ${sortValue === 1 ? "active" : ""}`}
            onClick={() => handleSelectSortValue(1)}
          >
            <div className="icon">
              <i className="fa-solid fa-arrow-up"></i>
            </div>
            <p className="desc">Low price</p>
          </div>
        </div>
      </div>

      <div className="box_products_list">
        {productsList.length > 0 &&
          productsList.map((product) => (
            <CardProduct product={product} key={product._id} />
          ))}

        {productsList.length === 0 && (
          <div className="alert_page">
            <p className="desc">Không có sản phẩm nào phù hợp</p>
          </div>
        )}
      </div>

      {totalQuantity > limit && (
        <div className="bottom">
          <div
            className={`icon ${currentPage === 1 ? "no_drop" : ""}`}
            onClick={() => handleTurnPage(currentPage - 1)}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          <div className="page_numbers">
            {new Array(Math.ceil(totalQuantity / limit))
              .fill(null)
              .map((_, index) => (
                <p
                  className={`desc ${
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
              currentPage === Math.ceil(totalQuantity / limit) ? "no_drop" : ""
            }`}
            onClick={() => handleTurnPage(currentPage + 1)}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsListOfSearch;
