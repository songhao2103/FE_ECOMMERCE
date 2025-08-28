import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetail } from "../../services/queries/product.queries";
import Loader from "../../utils-component/loader/Loader";
import PopupAlert from "../../utils-component/popupAlert/PopupAlert";
import Toast from "../../utils-component/toast/Toast";
import { formatCurrencyVND } from "../../utils/format/format";
import { useDispatch } from "react-redux";
import { showToast } from "../../redux-toolkit/redux-slice/toastSlice";
import { useAddProductToCart } from "../../services/queries/cart.queries";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(0); //Lưu vị trí của ảnh đang được xem
  const [listImages, setListImages] = useState([]); //Lưu danh sách ảnh của sản phẩm
  const listImagesElement = useRef(null);
  const [productSelected, setProductSelected] = useState({
    quantitySelected: 1,
    totalQuantity: 1,
    colorSelectedId: 0,
  });
  const { productId } = useParams();

  const { data: productDetail, isPending: pendingGetDetail } =
    useGetProductDetail(productId);
  const { mutate: mtAddProductToCart } = useAddProductToCart();

  //hàm xử lý khi click chuyển ảnh sản phẩm
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

  //hàm xử lý khi người dùng chọn màu sắc của sản phẩm
  const handleSelectColor = (id) => {
    const currentImage = listImages.find((image) => image.id == id);
    setProductSelected({
      ...productSelected,
      totalQuantity: currentImage.quantity || 1,
      colorSelectedId: id,
      quantitySelected:
        productSelected.quantitySelected > currentImage.quantity
          ? currentImage.quantity
          : productSelected.quantitySelected,
    });
  };

  useEffect(() => {
    if (productDetail?.images) {
      setListImages(productDetail.images);

      const imageHasColor = productDetail.images.find((image) =>
        Boolean(image.colorCode)
      );
      setProductSelected({
        quantitySelected: 1,
        totalQuantity: imageHasColor.quantity,
        colorSelectedId: imageHasColor.id,
      });
    }
  }, [productDetail]);

  //hàm xử lý thay đổi số lượng sản phẩm
  const handleChangeQuantityProduct = (value) => {
    // Nếu đang giảm và số lượng đang là 1 thì không làm gì
    if (productSelected.quantitySelected === 1 && value === -1) return;
    // Nếu tăng số lượng nhưng đã đạt giới hạn trong kho
    if (
      value == 1 &&
      productSelected.quantitySelected + value > productSelected.totalQuantity
    ) {
      dispatch(
        showToast({ message: "Số lượng sản phẩm trong kho không đủ!!!" })
      );
      return;
    }
    // Nếu các điều kiện đều ổn thì cập nhật state
    setProductSelected((prev) => ({
      ...prev,
      quantitySelected: prev.quantitySelected + value,
    }));
  };

  const handleAddProductToCart = () => {
    const payload = {
      quantityImageId: productSelected.colorSelectedId,
      quantity: productSelected.quantitySelected,
    };

    mtAddProductToCart(payload);
  };

  if (pendingGetDetail) return <Loader />;

  return (
    <div className="product_detail">
      <PopupAlert />
      <Toast />
      <div className="title_36">Product Detail</div>
      <div className="content">
        <div className="box_image">
          <div className="image_default">
            <div
              className={currentImage === 0 ? "icon no_drop" : "icon"}
              onClick={() => handleTurnImage(currentImage - 1)}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </div>

            <img src={listImages[currentImage]?.url} alt="" />

            <div
              className={
                currentImage === listImages.length - 1 ? "icon no_drop" : "icon"
              }
              onClick={() => handleTurnImage(currentImage + 1)}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>

          <div className="box_list_images">
            <div className="list_images" ref={listImagesElement}>
              {listImages?.map((image, index) => (
                <img
                  src={image.url}
                  alt=""
                  key={image.url}
                  className={
                    listImages[currentImage]?.url === image?.url
                      ? "active"
                      : null
                  }
                  onClick={() => handleTurnImage(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="product_info">
          <p className="title_24">{productDetail?.productName}</p>

          <div className="rating">
            <div className="icon">
              <i className="fa-solid fa-star"></i>
              <i className="fa-regular fa-star"></i>
              <i className="fa-regular fa-star"></i>
              <i className="fa-regular fa-star"></i>
              <i className="fa-regular fa-star"></i>
            </div>
          </div>

          <div className="box_price">
            <p className="new_price desc">
              {formatCurrencyVND(
                ((100 - productDetail?.discount) * productDetail?.price) / 100
              )}
            </p>
            {productDetail?.discount > 0 && (
              <p className="old_price desc">
                {formatCurrencyVND(productDetail?.price)}
              </p>
            )}
          </div>

          <p className="desc describe">{productDetail?.describe}</p>

          <div className="colors">
            <p className="desc">Colours:</p>
            {listImages?.map((item) => {
              if (item.colorCode) {
                const colorCode = item.colorCode.startsWith("#")
                  ? item.colorCode
                  : "#" + item.colorCode;

                return (
                  <div
                    key={item.url}
                    className={`item ${
                      productSelected.colorSelectedId === item.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleSelectColor(item.id)}
                  >
                    <div
                      className="color"
                      style={{ backgroundColor: colorCode }}
                    ></div>
                  </div>
                );
              }
            })}
          </div>

          <div className="box_order">
            <div className="quantity">
              <div
                className="item desc"
                onClick={() => handleChangeQuantityProduct(-1)}
              >
                -
              </div>
              <div className="item desc">
                {productSelected.quantitySelected}
              </div>
              <div
                className="item desc"
                onClick={() => handleChangeQuantityProduct(1)}
              >
                +
              </div>
            </div>
            <button className="btn_dark_pink">Buy Now</button>
            <button className="wishlist icon_add">
              <i className="fa-regular fa-heart"></i>
            </button>
            <button className="cart icon_add" onClick={handleAddProductToCart}>
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
          </div>

          <div className="bottom">
            <div className="item">
              <div className="icon">
                <i className="fa-solid fa-truck-moving"></i>
              </div>
              <div className="box_desc">
                <div className="desc">Free Delivery</div>
                <div className="desc">
                  Enter your postal code for Delivery Availability
                </div>
              </div>
            </div>
            <div className="item">
              <div className="icon">
                <i className="fa-solid fa-rotate-left"></i>
              </div>
              <div className="box_desc">
                <div className="desc">Return Delivery</div>
                <div className="desc">
                  Free 30 Days Delivery Returns. Details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
