import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {ToastContext} from "./ToastContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const {setMsg} = useContext(ToastContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const signup = async (username, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const json = await response.json();

      console.log(json);

      if (json.success) {
        localStorage.setItem("token", json.tempToken);
      }else{
        setMsg(json.message);
        setTimeout(() => setMsg(null), 2000);
      }

      return json;
    } catch (err) {
      console.error("Login error:", err);
      // toast.error("Something went wrong. Please try again.");
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const json = await response.json();

      console.log(json);

      if (json.success) {
        if (json.tempToken) {
          localStorage.setItem("token", json.tempToken);
        }

        if (json.authToken) {
          localStorage.setItem("token", json.authToken);
        }
      }else{
        setMsg(json.message);
        setTimeout(() => setMsg(null), 2000);
      }

      return json;
    } catch (err) {
      console.error("Login error:", err);
      // toast.error("Something went wrong. Please try again.");
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          otp: otp,
        }),
      });

      const json = await response.json();

      console.log(json);

      if (json.success) {
        localStorage.setItem("token", json.authToken);
      }

      return json;
    } catch (err) {
      console.error("Login error:", err);
      // toast.error("Something went wrong. Please try again.");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("token"),
        },
      });

      const json = await response.json();

      if (json.success) {
        localStorage.removeItem("token");
        navigate("/auth");
      }

      return json;
    } catch (error) {
      console.log(error);
    }
  };

  // const validateUser = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       return false;
  //     }

  //     const response = await fetch(`${API_URL}/auth/me`, {
  //       method: "GET",
  //       headers: {
  //         authToken: token,
  //       },
  //     });

  //     const json = await response.json();

  //     if (json.success) {
  //       return json.user;
  //     }

  //     localStorage.removeItem("token");

  //     return false;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          authToken: token,
        },
      });

      const json = await response.json();

      if (json.success) {
        setUser(json.user);
      } else {
        localStorage.removeItem("token");
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ signup, login, verifyOtp, logout, fetchUser, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
