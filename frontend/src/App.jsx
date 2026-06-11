import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import TalkBoardAuth from "./components/TalkBoardAuth";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <TalkBoardAuth/>
      </AuthProvider>
    </>
  );
}

export default App;
