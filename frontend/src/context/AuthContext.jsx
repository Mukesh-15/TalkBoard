import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = "http://localhost:5000";

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
        localStorage.setItem("token", json.tempToken);
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
      }

      return json;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ signup, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
