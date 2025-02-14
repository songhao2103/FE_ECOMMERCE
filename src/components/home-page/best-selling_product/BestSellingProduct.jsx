import { useEffect, useState } from "react";
import baseUrl from "../../../config/baseUrl";
import CardProduct from "../../../utils-component/card-product/CardProduct";

const BestSellingProduct = () => {
  const [productsSelling, setProductsSelling] = useState([]);

  useEffect(() => {
    const fetchProductsSale = async () => {
      try {
        const response = await fetch(baseUrl + "/product/product-selling");

        if (!response.ok) {
          throw new Error(
            "Error when getting the list of products being sale!! " +
              response.status
          );
        }

        const data = await response.json();

        setProductsSelling(data);
      } catch (error) {
        console.log(
          "Error when getting the list of products being sale!!! " +
            error.message
        );
      }
    };

    fetchProductsSale();
  }, []);

  return (
    <div className="product_selling">
      <div className="header_section">
        <div className="title_section">
          <p className="desc">This month</p>
          <p className="title_36">Best Selling Products</p>
        </div>
      </div>

      {/* =========================================================== */}
      <div className="box_list_product_selling">
        <div className="list_product_selling">
          {productsSelling.map((product) => (
            <CardProduct key={product._id} product={product} value={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellingProduct;
