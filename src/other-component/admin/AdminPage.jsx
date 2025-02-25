import { useState } from "react";
import AddStore from "./add-store/AddStore";
import ProductConfirm from "./product-confirm/ProductConfirm";
import OrderShippingPage from "./order-shipping-page/OrderShippingPage";

const AdminPage = () => {
  const [optionPage, setOptionPage] = useState("Add Store");

  //hàm click option
  const handleClickOption = (e) => {
    if (e.target.classList.contains("item")) {
      setOptionPage(e.target.textContent);
    }
  };

  return (
    <div className="admin_page">
      <div className="nav_bar_admin_page">
        <label htmlFor="options_admin_page" className="icon">
          <i className="fa-solid fa-bars"></i>
        </label>

        <input type="checkbox" id="options_admin_page" />

        <label htmlFor="options_admin_page" className="title_24">
          Admin Page
        </label>

        <p className="desc">{optionPage}</p>

        <label
          htmlFor="options_admin_page"
          className="layout_options_page"
        ></label>

        <ul className="options" onClick={handleClickOption}>
          <label htmlFor="options_admin_page" className="item desc">
            Add Store
          </label>
          <label htmlFor="options_admin_page" className="item desc">
            Information
          </label>
          <label htmlFor="options_admin_page" className="item desc">
            List of products to confirm
          </label>
          <label htmlFor="options_admin_page" className="item desc">
            Store list
          </label>
          <label htmlFor="options_admin_page" className="item desc">
            User list
          </label>
          <label htmlFor="options_admin_page" className="item desc">
            Order shipping
          </label>
        </ul>
      </div>
      {optionPage === "Add Store" && <AddStore />}
      {optionPage === "List of products to confirm" && <ProductConfirm />}
      {optionPage === "Order shipping" && <OrderShippingPage />}
    </div>
  );
};

export default AdminPage;
