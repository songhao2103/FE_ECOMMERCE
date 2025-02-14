import BoxRight from "./box-right/BoxRight";
import Logo from "./logo/Logo";
import NavBar from "./nav-bar/NavBar";

const Header = () => {
  return (
    <div className="header">
      <Logo />
      <NavBar />
      <BoxRight />
    </div>
  );
};

export default Header;
