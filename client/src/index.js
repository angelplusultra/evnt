import React from "react";
import ReactDOM from "react-dom/client";
import Views from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Views />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
