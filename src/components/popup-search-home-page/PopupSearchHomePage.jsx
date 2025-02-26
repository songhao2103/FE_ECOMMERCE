import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../config/baseUrl";

const PopupSearchHomePage = ({
  handleTurnPopup,
  debouncedValueSearch,
  historySearchs,
  handleDeleteAllHistorySearch,
  handleClickHistoryValue,
}) => {
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState([]);

  //gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          baseUrl + "/product/get-product-search-home-page",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ debouncedValueSearch, historySearchs }),
          }
        );

        if (!response.ok) {
          throw new Error("Không lấy được danh sách sản phẩm!!");
        }

        const data = await response.json();

        setProductsList(data);
      } catch (error) {
        console.log(
          "Có lỗi khi lấy danh sách sản phẩm khi search homepage!! error: ",
          error.message
        );
      }
    };
    fetchData();
  }, [debouncedValueSearch]);

  //hàm xử lý khi người dùng click vào sản phẩm
  const handleClickProduct = (productId) => {
    //nếu người dùng có nhập tìm kiếm rồi mới click vào sản phẩm thì thêm giá trị tìm kiếm vào localStorage
    if (debouncedValueSearch) {
      const newHistorySearch = [...newHistorySearch, debouncedValueSearch];
      localStorage.setItem("historySearchs", JSON.stringify(newHistorySearch));
    }

    navigate(`/product-detail/${productId}`);
    handleTurnPopup(false);
  };

  return (
    <div className="popup_search_home_page">
      <div className="bgc_popup" onClick={() => handleTurnPopup(false)}></div>
      <div className="content_page">
        {historySearchs.length > 0 && (
          <div className="box_search_history">
            <div className="top">
              <p className="desc">Search history</p>
              <div className="box_right" onClick={handleDeleteAllHistorySearch}>
                <p className="desc">Delete all</p>
                <div className="icon">
                  <i className="fa-solid fa-trash-can"></i>
                </div>
              </div>
            </div>

            <div className="list_history_searchs">
              {historySearchs.map((value, index) => (
                <p
                  className="desc value"
                  key={index}
                  onClick={() => handleClickHistoryValue(value)}
                >
                  {value}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="box_list_product">
          <p className="desc title">Product list</p>
          <div className="list_product">
            {productsList.length > 0 &&
              productsList.map((product) => (
                <div
                  className="box_product"
                  key={product._id}
                  onClick={() => handleClickProduct(product._id)}
                >
                  <div className="box_image">
                    <img src={product.images[0].url} alt="" />
                  </div>
                  <p className="desc">{product.productName}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupSearchHomePage;
