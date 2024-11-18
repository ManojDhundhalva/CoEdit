import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//imported
import { SocketProvider } from "./context/socket";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/auth";
import { UserProvider } from "./context/user";

//css
import "./CSS/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <UserProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                zIndex: 9999,
                fontFamily: "Quicksand",
                fontWeight: "600",
              },
            }}
          />
        </UserProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
