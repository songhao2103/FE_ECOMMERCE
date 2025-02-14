import BannerHomePage from "./banner/BannerHomePage";
import BestSellingProduct from "./best-selling_product/BestSellingProduct";
import Category from "./category/Category";
import NewArrival from "./new-arrival/NewArrival";
import ProductSale from "./products-sale/ProductSale";
import ShopServices from "./shop-services/ShopServices";

const HomePage = () => {
  return (
    <div className="home_page">
      <BannerHomePage />
      <ProductSale />
      <Category />
      <BestSellingProduct />
      <NewArrival />
      <ShopServices />
    </div>
  );
};

export default HomePage;
