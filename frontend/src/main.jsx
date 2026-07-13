import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { WebRTCProvider } from "./context/WebRTCContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { LoaderProvider } from "./context/LoaderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <ToastProvider>
          <AuthProvider>
            <SocketProvider>
              <WebRTCProvider>
                <App />
              </WebRTCProvider>
            </SocketProvider>
          </AuthProvider>
        </ToastProvider>
      </LoaderProvider>
    </BrowserRouter>
  </StrictMode>,
);
