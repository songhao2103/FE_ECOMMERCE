import Footer from "./utils-component/footer/Footer";
import Header from "./utils-component/header/Header";
import { Outlet } from "react-router-dom";

const AppContent = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppContent;
