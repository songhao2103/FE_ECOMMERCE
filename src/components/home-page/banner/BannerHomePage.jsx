import React from "react";
import { useState, useRef, useEffect } from "react";
import { Banner1, Banner2, Banner3, Banner4, Banner5 } from "./Banners";

const BannerHomePage = () => {
  //lấy phần tử list_banner
  const listBannerElement = useRef(null);

  const autoSlideRef = useRef(null);

  //lưu index của banner hiện tại, bắt đầu từ phần tử 1 vì trong
  const [currentIndex, setCurrentIndex] = useState(1);

  //Kiểm soát trạng thái chuyển động của banner để ngăn người dùng thao tác khi đang chuyển động
  const [isTransitioning, setIsTransitioning] = useState(false);

  //Kiểm soát trạng thái tự chuyển động của banner
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  const banners = [
    Banner5,
    Banner1,
    Banner2,
    Banner3,
    Banner4,
    Banner5,
    Banner1,
  ];

  //hàm chuyển sang banner tiếp theo
  const handleNextBanner = () => {
    if (isTransitioning) return; //tránh người dùng thao tác khi đang chuyển

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  //hàm chuyển về banner trước đó
  const handlePrevBanner = () => {
    if (isTransitioning) return; //tránh người dùng thao tác khi đang chuyển

    setIsTransitioning(true);
    setCurrentIndex((prevBanner) => prevBanner - 1);
  };

  //dừng tự chuyển động của banner
  const stopAutoSlide = () => {
    setIsAutoSliding(false);
    clearInterval(autoSlideRef.current);
  };

  //hiệu ứng tự động chuyển banner
  useEffect(() => {
    if (isAutoSliding) {
      autoSlideRef.current = setInterval(() => {
        handleNextBanner();
      }, 3000);
    }

    return () => clearInterval(autoSlideRef.current);
  }, [isAutoSliding]);

  //reset vị trí khi đến đầu hoặc cuối
  useEffect(() => {
    if (isTransitioning) {
      const transitionTimeout = setTimeout(() => {
        setIsTransitioning(false);

        if (currentIndex === 0) {
          setCurrentIndex(banners.length - 2);

          listBannerElement.current.style.transition = "none";
          listBannerElement.current.style.transform = `translateX(-${
            (banners.length - 2) * 100
          }%)`;
        } else if (currentIndex === banners.length - 1) {
          setCurrentIndex(1);

          listBannerElement.current.style.transition = "none";
          listBannerElement.current.style.transform = "translateX(-100%)";
        }
      }, 600);

      return () => clearTimeout(transitionTimeout);
    }
  }, [currentIndex, banners.length]);

  useEffect(() => {
    if (listBannerElement.current) {
      listBannerElement.current.style.transition = isTransitioning
        ? `transform 0.6s ease-in-out`
        : "none";
      listBannerElement.current.style.transform = `translateX(-${
        currentIndex * 100
      }%)`;
    }
  }, [currentIndex, isTransitioning]);

  return (
    <div className="banner_home_page">
      <div className="box_icon_turn">
        <div
          className="icon"
          onClick={() => {
            stopAutoSlide();
            handleNextBanner();
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div
          className="icon"
          onClick={() => {
            stopAutoSlide();
            handlePrevBanner();
          }}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      </div>

      <div className="dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      <div className="banner_list" ref={listBannerElement}>
        {banners.map((Component, index) => (
          // Sử dụng React.Fragment để tránh tạo thêm phần tử DOM không cần thiết
          <React.Fragment key={index}>
            <Component />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BannerHomePage;
/*

*/
