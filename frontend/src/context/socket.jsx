import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";
import config from "../config";

const socketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(config.BACKEND_API);

    s.on("connect_error", (err) => console.log(err));
    s.on("connect_failed", (err) => console.log(err));

    setSocket((prev) => s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useSocket must be used within a ThemeProvider");
  }
  return context;
};
