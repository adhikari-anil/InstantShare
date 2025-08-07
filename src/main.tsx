import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./router.tsx";
import { SocketProvider } from "./context/SocketProvider.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
       <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </SocketProvider>
  </StrictMode>
);
