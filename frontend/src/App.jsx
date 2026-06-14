import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import TalkBoardAuth from "./components/TalkBoardAuth";
import OtpVerification from "./components/Otpverification.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path= '/auth' element={<TalkBoardAuth/>}/>
          <Route path= '/verify-otp' element={<OtpVerification/>}/>
        </Routes>
        {/* <TalkBoardAuth/> */}
        {/* <OtpVerification/> */}
      </AuthProvider>
    </>
  );
}

export default App;
