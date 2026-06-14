import { useState, useEffect, useContext} from "react";
import {AuthContext} from '../context/AuthContext';
import IconField from './IconField';

export default function RegisterPanel() {
  const {signup} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleSignup= () =>{
    signup(username, email, password, confirmPassword);
  }

  return (
    <div className="flex flex-col justify-center h-full px-14 py-10">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Create an account</h2>
      <p className="text-sm text-gray-400 text-center mb-7">Join TalkBoard.</p>

      <IconField type="text"     ionicon="person-outline"           placeholder="Username"         id="r-user"  value={username} setValue={setUsername}/>
      <IconField type="email"    ionicon="mail-outline"             placeholder="Gmail / Email"    id="r-email" value={email} setValue={setEmail}/>
      <IconField type="password" ionicon="lock-closed-outline"      placeholder="Create password"  id="r-pw1"   value={password} setValue={setPassword}/>
      <IconField type="password" ionicon="shield-checkmark-outline" placeholder="Confirm password" id="r-pw2"   value={confirmPassword} setValue={setConfirmPassword}/>

      <button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-sm transition-colors mt-1 mb-4 cursor-pointer" onClick={handleSignup}>
        Create account
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-300">Or sign up with</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button className="w-full h-11 border border-gray-100 rounded-full flex items-center justify-center gap-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
        <ion-icon name="logo-google" style={{ fontSize: 18, color: "#4285F4" }} />
        Continue with Google
      </button>
    </div>
  );
}