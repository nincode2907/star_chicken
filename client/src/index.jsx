import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import App from "./App";
import "./css/index.css";
import ChartView from "./views/ChartView";
import GridView from "./views/GridView";
import { MyProvider } from "./context/StateContext";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <GridView /> },
      { path: "/chart", element: <ChartView /> },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <MyProvider>
      <RouterProvider router={router} />
    </MyProvider>
  </StrictMode>
);
