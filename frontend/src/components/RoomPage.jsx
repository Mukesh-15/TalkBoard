import { useContext, useEffect } from "react";
import TextEditor from "./TextEditor";
import VideoPanel from "./Videopanel";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { WebRTCContext } from "../context/WebRTCContext";

export default function RoomPage() {
  const { roomName, roomId, participants, leaveRoom } =
    useContext(SocketContext);

  const { user } = useContext(AuthContext);

  const { startLocalStream, stopCall } = useContext(WebRTCContext);

  useEffect(() => {
    startLocalStream();

    return () => {
      stopCall();
    };
  }, []);

  const handleExit = () => {
    stopCall();
    leaveRoom();
  };

  return (
    <div className="min-h-screen bg-[#f0f0f7] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div>
          <h2 className="font-bold text-lg">{roomName}</h2>
          <p className="text-sm text-gray-500">{roomId}</p>
        </div>

        <div className="flex items-center gap-4">
          <span>Hello, {user?.username}</span>

          <button
            onClick={handleExit}
            className="px-4 py-2 bg-red-500 text-white rounded-xl cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="flex flex-1 p-4 gap-4">
        <TextEditor />
        <VideoPanel participants={participants} />
      </div>
    </div>
  );
}
