import { useState, useEffect, useContext} from "react";
import {AuthContext} from '../context/AuthContext';
import IconField from './IconField';
import { useNavigate } from "react-router-dom";

export default function LoginPanel() {

  const {login} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await login(username, password);

    if(response.success){
      navigate("/verify-otp");
    }else{
      console.log(response);
    }
  }

  return (
    <div className="flex flex-col justify-center h-full px-14 py-10">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Sign in to TalkBoard</h2>
      <p className="text-sm text-gray-400 text-center mb-7">Welcome back! Please enter your details.</p>

      <IconField type="text"    ionicon="person-outline"        placeholder="Username"    id="l-email"  value={username} setValue={setUsername}/>
      <IconField type="password" ionicon="lock-closed-outline" placeholder="Password" id="l-pw" value={password} setValue={setPassword} />

      <div className="flex justify-between items-center mb-5">
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
          <input type="checkbox" className="accent-orange-500 w-3.5 h-3.5" />
          Remember me
        </label>
        <a href="#" className="text-xs text-gray-400 hover:text-orange-500 transition-colors">Forgot password?</a>
      </div>

      <button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-sm transition-colors mb-4 cursor-pointer" onClick={handleLogin}>
        Sign in
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-300">Or login with</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button className="w-full h-11 border border-gray-100 rounded-full flex items-center justify-center gap-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors mb-2.5 cursor-pointer">
        <ion-icon name="logo-google" style={{ fontSize: 18, color: "#4285F4" }} />
        Continue with Google
      </button>
    </div>
  );
}