import { React, useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export default function Toast({ message }) {
  const { msg } = useContext(ToastContext);

  return (
    <div
      className={`
        fixed bottom-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white
        text-sm px-6 py-2.5 rounded-full whitespace-nowrap z-50
        transition-all duration-300
        ${msg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      {msg}
    </div>
  );
}
