import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

const socketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

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
