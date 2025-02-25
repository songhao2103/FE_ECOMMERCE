import BoxRight from "./box-right/BoxRight";
import Logo from "./logo/Logo";
import NavBar from "./nav-bar/NavBar";

const Header = () => {
  return (
    <div className="box_header">
      <div className="bgc_header"></div>
      <div className="header">
        <Logo />
        <NavBar />
        <BoxRight />
      </div>
    </div>
  );
};

export default Header;
