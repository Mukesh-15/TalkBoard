import { useState, useEffect, useContext} from "react";
import {AuthContext} from '../context/AuthContext';

export default function IconField({ type, ionicon, placeholder, id , value, setValue}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  const inputType = isPw ? (show ? "text" : "password") : type;
  
  //nksfn
  return (
    <div className="relative mb-3">
      <ion-icon
        name={ionicon}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
        style={{ fontSize: 18 }}
      />
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={(e) => {setValue(e.target.value)}}
        placeholder={placeholder}
        className="w-full h-11 bg-gray-100 rounded-full pl-10 pr-11 text-sm text-gray-800 outline-none focus:bg-gray-200 transition-colors placeholder-gray-300"
      />
      {isPw && (
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
          aria-label="Toggle password"
        >
          <ion-icon
            name={show ? "eye-outline" : "eye-off-outline"}
            style={{ fontSize: 18 }}
          />
        </button>
      )}
    </div>
  );
}