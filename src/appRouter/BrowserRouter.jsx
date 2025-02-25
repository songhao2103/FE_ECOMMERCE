import { createBrowserRouter } from "react-router-dom";
import AppContent from "../AppContent";
import LogIn from "../components/logIn/LogIn";
import Register from "../components/register/Register";
import StorePage from "../other-component/store/StorePage";
import HomePage from "../components/home-page/HomePage";
import AdminPage from "../other-component/admin/AdminPage";
import ProductDetail from "../components/product-detail/ProductDetail";
import Cart from "../components/cart/Cart";
import ProductList from "../components/products-list/ProductList";
import OrderOfUser from "../components/order-of-user/OrderOfUser";
import ProfileUser from "../components/profile-user/ProfileUser";

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

        {
          path: "/products-list",
          element: <ProductList />,
        },

        {
          path: "/orders-of-user",
          element: <OrderOfUser />,
        },

        { path: "/profile-user", element: <ProfileUser /> },
      ],
    },
  ]);
};

export default createAppRouter;
