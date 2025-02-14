import { useState } from "react";
import AddProduct from "./add-product/AddProduct";

const StorePage = () => {
  const [optionPage, setOptionPage] = useState("Add Product");

  const handleClickOption = (e) => {
    if (e.target.classList.contains("item")) {
      setOptionPage(e.target.textContent);
    }
  };

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
          <li className="item desc">Add product</li>
          <li className="item desc">Information</li>
          <li className="item desc">List of products to confirm</li>
          <li className="item desc">Store list</li>
          <li className="item desc">User list</li>
        </ul>
      </div>

      <AddProduct />
    </div>
  );
};

export default StorePage;
