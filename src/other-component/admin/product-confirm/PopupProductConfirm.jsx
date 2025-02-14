import { useState, useRef } from "react";

import {
  formatCurrencyVND,
  capitalizeFirstLetter,
} from "../../../utils/format/format";

const PopupProductConfirm = ({
  product,
  handleSelectProductPopup,
  handleAcceptProduct,
  handleGetProductRefuse,
}) => {
  //Lưu danh sách ảnh của sản phẩm
  const listImages = product ? [...product.images] : [];
  //Vị trí của ảnh hiện tại trong danh sách
  const [currentImage, setCurrentImage] = useState(0);
  //lẩy phần tử listImagesElement
  const listImagesElement = useRef(null);

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  //hàm xử lí khi chuyển ảnh
  const handleTurnImage = (value) => {
    if (value >= 0 && value < listImages.length) {
      setCurrentImage(value);

      if (value > 1 && listImages.length - 2 > value) {
        const listImagesWidth =
          listImagesElement.current.getBoundingClientRect().width;

        listImagesElement.current.style.transform = `translateX(-${
          ((value - 2) * listImagesWidth * 20.5) / 100
        }px)`;
      }
    }
  };

  return (
    <div className="popup_product_confirm">
      <div
        className="layout_popup"
        onClick={() => handleSelectProductPopup(null)}
      ></div>
      <div className="content_popup">
        <div className="box_image">
          <div className="image_default">
            <div
              className={currentImage === 0 ? "icon no_drop" : "icon"}
              onClick={() => handleTurnImage(currentImage - 1)}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </div>

            <img src={listImages[currentImage].url} alt="" />

            <div
              className={
                currentImage + 1 === listImages.length ? "icon no_drop" : "icon"
              }
              onClick={() => handleTurnImage(currentImage + 1)}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
          <div className="box_list_images">
            <div className="list_images" ref={listImagesElement}>
              {listImages.map((image, index) => (
                <div
                  className={`image_item ${
                    currentImage === index ? "active" : ""
                  }`}
                  key={image.url}
                  onClick={() => handleTurnImage(index)}
                >
                  <img src={image.url} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content_product">
          <div className="product_name title_24">{product.productName}</div>

          <p className="desc">{product.describe}</p>

          <div className="box_price">
            {product.discount !== 0 && (
              <p className="desc old_price">
                {formatCurrencyVND(product.price)}
              </p>
            )}

            {product.discount !== 0 && (
              <p className="desc discount">{`-${product.discount}%`}</p>
            )}
            <p className="desc new_price">
              {formatCurrencyVND(
                Math.ceil((product.price * (100 - product.discount)) / 100)
              )}
            </p>
          </div>

          <p className="desc store">{`Store: ${capitalizeFirstLetter(
            product.storeName
          )}`}</p>

          <p className="desc device_type">{`Device Type: ${capitalizeFirstLetter(
            product.deviceType
          )}`}</p>

          <p className="desc total_quantity">{`Quantity: ${product.totalQuantity}`}</p>

          <div className="bottom">
            <button
              className="btn_dark_pink"
              onClick={() => handleAcceptProduct(product._id)}
            >
              Accep
            </button>
            <button
              className="btn_dark_pink"
              onClick={() => handleGetProductRefuse(product._id)}
            >
              Refure
            </button>
          </div>
        </div>

        <div className="close" onClick={() => handleSelectProductPopup(null)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>
  );
};

export default PopupProductConfirm;
