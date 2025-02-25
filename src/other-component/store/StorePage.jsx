import { useState } from "react";
import AddProduct from "./add-product/AddProduct";
import StoreOrdersList from "./store-order-list/StoreOrderList";

const StorePage = () => {
  const [optionPage, setOptionPage] = useState("Add product");

  const handleClickOption = (e) => {
    if (
      e.target.classList.contains("item") &&
      optionPage !== e.target.textContent
    ) {
      setOptionPage(e.target.textContent);
    }
  };

  console.log(optionPage);

  return (
    <div className="store_page">
      <div className="nav_bar_store_page">
        <label htmlFor="options_store_page" className="icon">
          <i className="fa-solid fa-bars"></i>
        </label>

        <input type="checkbox" id="options_store_page" />

        <label htmlFor="options_admin_page" className="title_24">
          Store Page
        </label>

        <p className="desc">{optionPage}</p>

        <label
          htmlFor="options_store_page"
          className="layout_options_page"
        ></label>

        <ul className="options" onClick={handleClickOption}>
          <label htmlFor="options_store_page" className="item desc">
            Add product
          </label>
          <label htmlFor="options_store_page" className="item desc">
            Store order list
          </label>
          <label htmlFor="options_store_page" className="item desc">
            List of products to confirm
          </label>
          <label htmlFor="options_store_page" className="item desc">
            Store list
          </label>
          <label htmlFor="options_store_page" className="item desc">
            User list
          </label>
        </ul>
      </div>

      {optionPage === "Add product" && <AddProduct />}
      {optionPage === "Store order list" && <StoreOrdersList />}
    </div>
  );
};

export default StorePage;
