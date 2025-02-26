import Footer from "./utils-component/footer/Footer";
import Header from "./utils-component/header/Header";
import { Outlet } from "react-router-dom";
import Toast from "./utils-component/toast/Toast";
import ScrollToTop from "./utils-component/scroll-to-top/ScrollToTop";

const AppContent = () => {
  return (
    <div>
      <Header />
      <ScrollToTop />
      <Toast />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppContent;
