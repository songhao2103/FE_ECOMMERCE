import { useState, useEffect } from "react";
import baseUrl from "../../config/baseUrl";

const PopupSearchHomePage = ({ handleTurnPopup }) => {
  //lấy danh sách lịch sử tìm kiếm của người dùng từ localStorage
  const historySearchs =
    JSON.parse(localStorage.getItem("historySearch")) || [];

  const [productsList, setProductsList] = useState([]);
  const [valueSearch, setValueSearch] = useState("");

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
              body: JSON.stringify({ valueSearch, historySearchs }),
            },
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
  }, [valueSearch]);

  return (
    <div className="popup_search_home_page">
      <div className="bgc_popup" onClick={() => handleTurnPopup(false)}></div>
      <div className="content_page">
        <div className="box_search_history">
          <div className="top">
            <p className="desc">Search history</p>
            <div className="box_right">
              <p className="desc">Delete all</p>
            </div>
          </div>

          <div className="list_history_searchs">
            {historySearchs.map((value, index) => (
              <div className="box_value" key={index}>
                <p className="desc">{value}</p>
                <div className="icon">
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupSearchHomePage;
