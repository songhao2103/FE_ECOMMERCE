import { useEffect, useState, useRef } from "react";
import baseUrl from "../../../config/baseUrl";
import CardProduct from "../../../utils-component/card-product/CardProduct";

const deadline = new Date("2025-06-15T00:00:00").getTime();
const formatNumber = (value) => (value < 10 ? `0${value}` : value);

const ProductSale = () => {
  const [productsSale, setProductsSale] = useState([]);
  const [currentTransform, setCurrentTransform] = useState(0);
  const listProductElement = useRef(null);
  const boxElement = useRef(null);

  const [showTime, setShowTime] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });

  useEffect(() => {
    const intervalShowTime = setInterval(() => {
      const now = Date.now(); // Lấy thời gian hiện tại
      const timeDiff = deadline - now; // Tính khoảng cách thời gian

      if (timeDiff <= 0) {
        // Nếu hết hạn, đặt thời gian về 0
        setShowTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(intervalShowTime); // Dừng interval
        return;
      }

      // Tính toán số ngày, giờ, phút, giây còn lại
      const newShowTime = {
        days: Math.floor(timeDiff / 86400000),
        hours: Math.floor((timeDiff % 86400000) / 3600000),
        minutes: Math.floor((timeDiff % 3600000) / 60000),
        seconds: Math.floor((timeDiff % 60000) / 1000),
      };

      setShowTime(newShowTime);
    }, 1000);

    return () => clearInterval(intervalShowTime);
  }, []);

  useEffect(() => {
    const fetchProductsSale = async () => {
      try {
        const response = await fetch(baseUrl + "/product/products-sale");

        if (!response.ok) {
          throw new Error(
            "Error when getting the list of products being sale!! " +
              response.status
          );
        }

        const data = await response.json();

        setProductsSale(data);
      } catch (error) {
        console.log(
          "Error when getting the list of products being sale!!! " +
            error.message
        );
      }
    };

    fetchProductsSale();
  }, []);

  //hàm xử lý khi click chuyển trang
  const handleTurnPageProduct = (value) => {
    if (
      (value === -1 && currentTransform === 0) ||
      (value === 1 && currentTransform === 2)
    )
      return;

    console.log(value, currentTransform);

    setCurrentTransform((prevCurrent) => prevCurrent + value);
  };

  useEffect(() => {
    const elementWidth =
      boxElement.current.getBoundingClientRect().width * 1.013333;

    listProductElement.current.style.transform = `translateX(-${
      currentTransform * elementWidth
    }px)`;
  }, [currentTransform]);
  return (
    <div className="product_sale">
      <div className="header_section">
        <div className="title_section">
          <p className="desc">Today's</p>
          <p className="title_36">Flash Sales</p>
        </div>

        <div className="time_sale">
          <div className="item">
            <p className="desc">Days</p>
            <p className="desc">{formatNumber(showTime.days)}</p>
          </div>
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="item">
            <p className="desc">Hours</p>
            <p className="desc">{formatNumber(showTime.hours)}</p>
          </div>
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="item">
            <p className="desc">Minutes</p>
            <p className="desc">{formatNumber(showTime.minutes)}</p>
          </div>
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="item">
            <p className="desc">Seconds</p>
            <p className="desc">{formatNumber(showTime.seconds)}</p>
          </div>
        </div>

        <div className="box_button">
          <div
            className={`icon ${currentTransform === 0 ? "no_drop" : ""}`}
            onClick={() => handleTurnPageProduct(-1)}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div
            className={`icon ${currentTransform === 2 ? "no_drop" : ""}`}
            onClick={() => handleTurnPageProduct(1)}
          >
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>

      {/* =========================================================== */}
      <div className="box_list_product_sale" ref={boxElement}>
        <div className="list_product_sale" ref={listProductElement}>
          {productsSale.map((product) => (
            <CardProduct key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSale;
