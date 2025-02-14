import { createBrowserRouter } from "react-router-dom";
import AppContent from "../AppContent";
import LogIn from "../components/logIn/LogIn";
import Register from "../components/register/Register";
import StorePage from "../other-component/store/StorePage";
import HomePage from "../components/home-page/HomePage";
import AdminPage from "../other-component/admin/AdminPage";
import ProductDetail from "../components/product-detail/ProductDetail";
import Cart from "../components/cart/Cart";

const createAppRouter = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <AppContent />,

      children: [
        {
          index: true,
          element: <HomePage />,
        },

        {
          path: "/log-in",
          element: <LogIn />,
        },

        {
          path: "/register",
          element: <Register />,
        },

        {
          path: "/admin-page",
          element: <AdminPage />,
        },

        {
          path: "/store-page",
          element: <StorePage />,
        },

        {
          path: "/product-detail/:productId",
          element: <ProductDetail />,
        },

        {
          path: "/cart",
          element: <Cart />,
        },
      ],
    },
  ]);
};

export default createAppRouter;
