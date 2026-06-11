import { useState, useEffect, useContext} from "react";
import {AuthContext} from '../context/AuthContext';
import LoginPanel from "./LoginPanel";
import RegisterPanel from './RegisterPanel';

export default function TalkBoardAuth() {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (!document.querySelector('script[src*="ionicons"]')) {
      const s1 = document.createElement("script");
      s1.type = "module";
      s1.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
      document.head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.setAttribute("nomodule", "");
      s2.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
      document.head.appendChild(s2);
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 font-sans">
      <div
        className="relative overflow-hidden bg-white rounded-2xl shadow-2xl"
        style={{ width: "min(95vw, 1000px)", height: "min(95vh, 700px)" }}
      >
        {/* Login — left half */}
        <div className="absolute left-0 top-0 w-1/2 h-full">
          <LoginPanel />
        </div>

        {/* Register — right half */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <RegisterPanel />
        </div>

        {/* Sliding orange overlay */}
        <div
          className="absolute top-0 h-full w-1/2 z-10 overflow-hidden"
          style={{
            left: isLogin ? "50%" : "0%",
            transition: "left 0.55s cubic-bezier(0.77,0,0.175,1)",
          }}
        >
          <div className="absolute inset-0 bg-orange-500 flex flex-col items-center justify-center gap-5 px-12">

            {/* Brand */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                <ion-icon name="bar-chart-outline" style={{ fontSize: 22, color: "#fff" }} />
              </div>
              <span className="text-white text-xl font-bold">TalkBoard</span>
            </div>

            <h3 className="text-white text-xl font-bold text-center leading-snug">
              {isLogin ? "New here?" : "Welcome back!"}
            </h3>

            <p className="text-white/75 text-sm text-center leading-relaxed max-w-[210px]">
              {isLogin
                ? "Sign up and discover a great amount of sales opportunities!"
                : "Already have an account? Sign in and pick up where you left off."}
            </p>

            <button
              onClick={() => setIsLogin(v => !v)}
              className="bg-white text-orange-500 font-bold rounded-full px-10 py-3 text-sm hover:opacity-90 transition-opacity cursor-pointer mt-1"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>

            <p className="text-white/60 text-xs flex items-center gap-1.5 -mt-1">
              <ion-icon
                name={isLogin ? "person-add-outline" : "log-in-outline"}
                style={{ fontSize: 14 }}
              />
              {isLogin ? (
                <>Have an account?{" "}
                  <a href="#" onClick={e => { e.preventDefault(); setIsLogin(false); }}
                    className="text-white underline font-semibold ml-1">
                    Sign in
                  </a>
                </>
              ) : (
                <>New user?{" "}
                  <a href="#" onClick={e => { e.preventDefault(); setIsLogin(true); }}
                    className="text-white underline font-semibold ml-1">
                    Sign up
                  </a>
                </>
              )}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}