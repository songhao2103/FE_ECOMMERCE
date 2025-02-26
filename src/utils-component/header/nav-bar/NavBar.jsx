import { NavLink } from "react-router-dom";
const NavBar = () => {
  return (
    <ul className="nav_bar_header">
      <NavLink to={"/"} className="desc item">
        Home
      </NavLink>
      <NavLink to={"/products-list"} className="desc item">
        Products
      </NavLink>
      <NavLink to={"/contact"} className="desc item">
        Contact
      </NavLink>
      <NavLink to={"/about"} className="desc item">
        About
      </NavLink>
    </ul>
  );
};

export default NavBar;
