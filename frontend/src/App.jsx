import { useState, useContext, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import TalkBoardAuth from "./components/TalkBoardAuth";
import Home from "./components/Home";
import Toast from "./components/Toast.jsx";
import Loader from "./components/Loader.jsx";
import OtpVerification from "./components/Otpverification.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import RoomPage from "./components/RoomPage.jsx";

function App() {
  const { fetchUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth" element={<TalkBoardAuth />} />

        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>

      <Toast/>
      <Loader />
    </>
  );
}

export default App;

