import { RouterProvider } from "react-router-dom";
import "./App.css";
import AppContent from "./AppContent";
import createAppRouter from "./appRouter/BrowserRouter";

function App() {
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
