import Footer from "./utils-component/footer/Footer";
import Header from "./utils-component/header/Header";
import { Outlet } from "react-router-dom";
import Toast from "./utils-component/toast/Toast";

const AppContent = () => {
  return (
    <div>
      <Header />
      <Toast />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppContent;
