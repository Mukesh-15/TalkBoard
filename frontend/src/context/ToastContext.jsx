import { createContext, useState } from "react";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [msg, setMsg] = useState(null);


    return (
    <ToastContext.Provider
      value={{msg, setMsg}}
    >
      {children}
    </ToastContext.Provider>
  );
};
