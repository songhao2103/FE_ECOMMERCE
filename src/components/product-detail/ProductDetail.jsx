import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { formatCurrencyVND } from "../../utils/format/format";
import baseUrl from "../../config/baseUrl";
import fetchWithAuth from "../../utils/tokenApi/fetchWithAuth";
import refreshToken from "../../utils/tokenApi/refreshToken";
import Loader from "../../utils-component/loader/Loader";
import { showToast } from "../../redux-toolkit/redux-slice/toastSlice";
import Toast from "../../utils-component/toast/Toast";
import { showPopupAlert } from "../../redux-toolkit/redux-slice/popupAlertSlice";
import PopupAlert from "../../utils-component/popupAlert/PopupAlert";
import { updateCart } from "../../redux-toolkit/redux-slice/userLogged";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const userLogged =
    useSelector((state) => state.userLoggedSlice.userLogged) || null; //lấy thông tin người dùng đang đăng nhập từ store
  const [product, setProduct] = useState(null); //Lưu thông tin sản phẩm đang được hiển thị
  const [currentImage, setCurrentImage] = useState(null); //Lưu vị trí của ảnh đang được xem
  const [listImages, setListImages] = useState([]); //Lưu danh sách ảnh của sản phẩm
  const [isLoading, setIsLoading] = useState(true); //lưu trạng thái loading
  const listImagesElement = useRef(null);
  const [infoProductOnPage, setInfoProductOnPage] = useState({});
  const { productId } = useParams();
  const cart = useSelector((state) => state.userLoggedSlice.cart);

  //Lấy thông tin sản phẩm
  useEffect(() => {
    let isMounted = true;

    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          baseUrl + "/product/product-detail/" + productId
        );

        if (!response.ok) {
          throw new Error("Get defective product detail information!!!");
        }

        const data = await response.json();

        if (isMounted) {
          setProduct(data);
          setCurrentImage(0);
          setListImages(data.images);
          setInfoProductOnPage({
            productColor: data.images[0].color,
            quantity: 1,
            productId: data._id,
            userId: userLogged ? userLogged._id : null,
          });
        }
      } catch (error) {
        console.log(
          "Get defective product detail information!!!" + error.message
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProductDetail();
    console.log(product);

    return () => {
      isMounted = false;
    };
  }, [productId]);

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
  const handleSelectColor = (color) => {
    setInfoProductOnPage({ ...infoProductOnPage, productColor: color });
    const index = listImages.findIndex((image) => image.color === color);
    if (index !== -1) setCurrentImage(index);
  };

  //hàm xử lý thay đổi số lượng sản phẩm
  const handleChangeQuantityProduct = (value) => {
    // Nếu đang giảm và số lượng đang là 1 thì không làm gì
    if (infoProductOnPage.quantity === 1 && value === -1) return;

    // Nếu tăng số lượng nhưng đã đạt giới hạn trong kho
    if (
      value === 1 &&
      infoProductOnPage.quantity >=
        product[infoProductOnPage.productColor + "Quantity"]
    ) {
      dispatch(
        showToast({ message: "Số lượng sản phẩm trong kho không đủ!!!" })
      );
      return;
    }

    // Nếu các điều kiện đều ổn thì cập nhật state
    setInfoProductOnPage((prev) => ({
      ...prev,
      quantity: prev.quantity + value,
    }));
  };

  //hàm xử lý khi thêm sản phẩm vào giỏ hàng
  const handleAddProductToCart = async () => {
    //kiểm tra xem người dùng đã đăng nhập nay chưa
    if (!userLogged) {
      dispatch(
        showPopupAlert({
          message: "Bạn chưa đăng nhập, chuyển đến trang đăng nhập?",
          endpoint: "/log-in",
        })
      );
    } else {
      //kiểm tra trùng lặp
      const isDuplicate = cart.products.find(
        (productOnCart) => productOnCart.productId === product._id
      );

      console.log(cart.products);
      console.log(product._id);

      if (isDuplicate) {
        dispatch(showToast({ message: "Sản phẩm đã có trong giỏ hàng!!" }));
        return;
      }

      //nếu đã đăng nhập gọi API để thêm sản phẩm vào giỏ hàng
      try {
        setIsLoading(true);

        let response = await fetchWithAuth(
          baseUrl + "/cart/add-product-to-cart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(infoProductOnPage),
          }
        );

        if (response.status === 403) {
          await refreshToken();
        }

        response = await fetchWithAuth(baseUrl + "/cart/add-product-to-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(infoProductOnPage),
        });

        const data = await response.json();

        dispatch(
          showToast({
            message: data.message,
          })
        );

        dispatch(updateCart(data.cart));
      } catch (error) {
        console.log("Tạo mới store không thành công", error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <Loader />;

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

            <img src={listImages[currentImage].url} alt="" />

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
              {listImages.map((image, index) => (
                <img
                  src={image.url}
                  alt=""
                  key={image.url}
                  className={
                    listImages[currentImage].url === image.url ? "active" : null
                  }
                  onClick={() => handleTurnImage(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="product_info">
          <p className="title_24">{product.productName}</p>

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
                ((100 - product.discount) * product.price) / 100
              )}
            </p>
            {product.discount > 0 && (
              <p className="old_price desc">
                {formatCurrencyVND(product.price)}
              </p>
            )}
          </div>

          <p className="desc describe">{product.describe}</p>

          <div className="colors">
            <p className="desc">Colours:</p>
            {product.images.map(
              (item) =>
                item.color && (
                  <div
                    key={item.url}
                    className={`item ${
                      infoProductOnPage.productColor === item.color
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleSelectColor(item.color)}
                  >
                    <div
                      className="color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                  </div>
                )
            )}
          </div>

          <div className="box_order">
            <div className="quantity">
              <div
                className="item desc"
                onClick={() => handleChangeQuantityProduct(-1)}
              >
                -
              </div>
              <div className="item desc">{infoProductOnPage.quantity}</div>
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
