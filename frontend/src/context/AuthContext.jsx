import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = 'http://localhost:5000';

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
        localStorage.setItem("token", json.authToken);

        if (json.isVerified) {
          // toast.success("Login Successful");
          alert("login Successful");
          // navigate("/");
        } else {
          // navigate("/VerifyOtp");
          // toast.success("Login Successful but Not Verified");
          alert("verify");
        }
      } else {
        // toast.error(json.message);
        alert("json.message");
      }
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
        localStorage.setItem("token", json.authToken);

        if (json.isVerified) {
          // toast.success("Login Successful");
          alert("login Successful");
          // navigate("/");
        } else {
          // navigate("/VerifyOtp");
          // toast.success("Login Successful but Not Verified");
          alert("verify");
        }
      } else {
        // toast.error(json.message);
        alert("json.message");
      }
    } catch (err) {
      console.error("Login error:", err);
      // toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ signup, login }}>
      {children}
    </AuthContext.Provider>
  );
};
