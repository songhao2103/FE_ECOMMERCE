import { NavLink } from "react-router-dom";
const NavBar = () => {
  return (
    <ul className="nav_bar_header">
      <NavLink to={"/"} className="desc item">
        Home
      </NavLink>
      <NavLink className="desc item">Products</NavLink>
      <NavLink className="desc item">Contact</NavLink>
      <NavLink className="desc item">About</NavLink>
    </ul>
  );
};

export default NavBar;
