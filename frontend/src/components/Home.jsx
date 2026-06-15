import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";

function Toast({ message }) {
  return (
    <div
      className={`
        fixed bottom-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white
        text-sm px-6 py-2.5 rounded-full whitespace-nowrap z-50
        transition-all duration-300
        ${message ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      {message}
    </div>
  );
}

function JoinCard({ onToast }) {
  const [code, setCode] = useState("");
  const { joinRoom } = useContext(SocketContext);

  const handle = () => {
    if (!code.trim()) {
      onToast("Please enter room code");
      return;
    }

    joinRoom(code.trim().toUpperCase());

    setCode("");
  };

  return (
    <div className="bg-white rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-12 h-12 rounded-[14px] bg-orange-50 flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: "0 4px 14px rgba(230,112,25,0.18)" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E67019"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </div>
        <span className="text-[17px] font-bold text-gray-900">Join a room</span>
      </div>
      <p className="text-[13px] text-gray-400 leading-relaxed mb-4">
        Enter the room code shared by your host to jump in instantly.
      </p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handle()}
        placeholder="Room code  e.g. SAL-4829"
        maxLength={12}
        className="w-full h-12 bg-gray-100 rounded-2xl px-4 text-[14px] text-gray-900 outline-none placeholder-gray-300 focus:bg-gray-200 transition-colors"
      />
      <button
        onClick={handle}
        className="w-full h-12 rounded-2xl text-[14.5px] font-bold mt-3 cursor-pointer transition-all active:scale-[0.98]"
        style={{
          background: "#fff3eb",
          color: "#E67019",
          boxShadow: "0 2px 8px rgba(230,112,25,0.12)",
        }}
      >
        Join room →
      </button>
    </div>
  );
}

function CreateCard({ onToast }) {
  const [name, setName] = useState("");
  const { createRoom } = useContext(SocketContext);

  const handle = () => {
    if (!name.trim()) {
      onToast("Please enter room name");
      return;
    }

    createRoom(name);

    setName("");
  };

  return (
    <div className="bg-white rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-12 h-12 rounded-[14px] bg-orange-500 flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: "0 4px 14px rgba(230,112,25,0.35)" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <span className="text-[17px] font-bold text-gray-900">
          Create a room
        </span>
      </div>
      <p className="text-[13px] text-gray-400 leading-relaxed mb-4">
        Start a new room and invite your team to collaborate in real time.
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handle()}
        placeholder="Room name  e.g. Q3 Sales Review"
        className="w-full h-12 bg-gray-100 rounded-2xl px-4 text-[14px] text-gray-900 outline-none placeholder-gray-300 focus:bg-gray-200 transition-colors"
        maxLength={12}
      />
      <button
        onClick={handle}
        className="w-full h-12 rounded-2xl text-[14.5px] font-bold text-white mt-3 cursor-pointer transition-all active:scale-[0.98] hover:opacity-90"
        style={{
          background: "#E67019",
          boxShadow: "0 4px 16px rgba(230,112,25,0.38)",
        }}
      >
        Create room →
      </button>
    </div>
  );
}

export default function Home() {
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  console.log(user);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const handleLogout = async () => {
    showToast("Logged out successfully");
    logout();
  };

  const hour = new Date().getHours();
  const timeGreet =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#f0f0f7] px-7 py-8 font-sans">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[30px] font-extrabold text-gray-900 leading-tight">
            {timeGreet},{" "}
            <span className="text-orange-500">{user?.username}</span> 👋
          </h1>
          <p className="text-[14px] text-gray-400 mt-1">
            Ready to collaborate? Let's go.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-1 px-4 py-2.5 rounded-2xl bg-white text-gray-500 text-[13.5px] font-semibold cursor-pointer transition-all active:scale-95 hover:text-orange-500"
          style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <JoinCard onToast={showToast} />
        <CreateCard onToast={showToast} />
      </div>

      <Toast message={toast} />
    </div>
  );
}
