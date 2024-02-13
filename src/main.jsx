/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Registration from "./Pages/Registration/Registration.jsx";
import Login from "./Pages/Registration/Login/Login.jsx";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Registration/Home/Home";
import ForgetPassword from "./Pages/Registration/ForgetPassword/ForgetPassword";
import Store from "./Store/Store.jsx";
import {Provider} from 'react-redux'
import Chat from "./Pages/Chat/Chat.jsx";


const router = createBrowserRouter([
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/ForgetPassword",
    element: <ForgetPassword/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={Store}>
    <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
