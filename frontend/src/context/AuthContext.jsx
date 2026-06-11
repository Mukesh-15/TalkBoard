import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const signin = async (
    username,
    gmail,
    password,
    confirmPassword
  ) => {
    try {
      console.log("request sent");
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (email, password) => {
    try{
      console.log("loggginnn");
    }catch (error){
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signin, login}}>
      {children}
    </AuthContext.Provider>
  );
};