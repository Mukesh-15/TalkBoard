import { useState, useContext, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import TalkBoardAuth from "./components/TalkBoardAuth";
import Home from "./components/Home";
import OtpVerification from "./components/Otpverification.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  const { fetchUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/auth" element={<TalkBoardAuth />} />

      <Route path="/verify-otp" element={<OtpVerification />} />
    </Routes>
  );
}

export default App;
