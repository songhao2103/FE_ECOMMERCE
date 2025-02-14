import { Link } from "react-router-dom";
import { formatCurrencyVND } from "../../utils/format/format";

const CardProduct = ({ product, value }) => {
  if (!product) return "...";

  return (
    <div className="card_product">
      <div className="box_image">
        <Link to={`product-detail/${product._id}`} className="image">
          <img src={product.images[0].url} alt="" />
        </Link>
        <p className="sale desc">{`-${product.discount}%`}</p>

        <div className="icon">
          <i className="fa-regular fa-heart"></i>
        </div>

        <div className="add_to_cart">
          <p className="desc">Add To Cart</p>
        </div>
      </div>

      <div className="product_info">
        <p className="title_20">{product.productName}</p>
        <div className="box_price">
          <p className="new_price desc">
            {formatCurrencyVND(
              ((100 - product.discount) * product.price) / 100
            )}
          </p>
          {product.discount > 0 && (
            <p className="old_price desc">{formatCurrencyVND(product.price)}</p>
          )}
        </div>

        <div className="bottom">
          <div className="rating">
            <i className="fa-solid fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
          </div>

          {value && (
            <div className="sold desc">
              Quantity Sold: {product.quantitySold}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
