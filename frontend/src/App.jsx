import { useState, useContext, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import TalkBoardAuth from "./components/TalkBoardAuth";
import Home from "./components/Home";
import OtpVerification from "./components/Otpverification.jsx";
import { AuthContext} from "./context/AuthContext.jsx";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./App.css";

function App() {
  const { validateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await validateUser();

      if (!user) {
        navigate("/auth");
      }
    };

    checkAuth();
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
