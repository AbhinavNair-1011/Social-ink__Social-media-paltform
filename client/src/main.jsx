import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";

import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import "./index.css";

import router from "./app/router/Router";
import store from "./app/redux_store/store";
import queryClient from "./app/tanstack_query/queryClient";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);