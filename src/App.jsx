import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import AppContent from "./AppContent";
import createAppRouter from "./appRouter/BrowserRouter";
import "./App.css";
import { updateUserLoggedEveryReload } from "./redux-toolkit/thunkAction/updatedUserLoggedEveryReload";

function App() {
  const dispatch = useDispatch();
  //cập nhật lại userLogged mỗi khi người dùng reload lại trang
  useEffect(() => {
    dispatch(updateUserLoggedEveryReload());
  }, []);

  const router = createAppRouter();
  return (
    <div className="main_content">
      <RouterProvider router={router}>
        <AppContent></AppContent>
      </RouterProvider>
    </div>
  );
}

export default App;
