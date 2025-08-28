import { useGetProductList } from "../../../services/queries/product.queries";
import CardProduct from "../../../utils-component/card-product/CardProduct";

const BestSellingProduct = () => {
  const { data: productBestSellingData } = useGetProductList({
    pageIndex: 1,
    pageSize: 4,
    sortType: -1,
    sortField: 3,
  });

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
          {productBestSellingData?.items?.map((product) => (
            <CardProduct key={product.id} product={product} value={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellingProduct;
