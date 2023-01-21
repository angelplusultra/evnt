import React from "react";
import ReactDOM from "react-dom/client";
import Views from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <UserProvider>
        <BrowserRouter>
          <Views />
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
