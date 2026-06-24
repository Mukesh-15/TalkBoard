import { useContext, useEffect, useRef } from "react";

import { WebRTCContext } from "../context/WebRTCContext";

export default function VideoPanel({ partnerName = "Partner", onExit }) {
  const { localStream, remoteStream } = useContext(WebRTCContext);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    console.log("localStream in VideoPanel:", localStream);
    console.log("videoRef:", localVideoRef.current);

    if (!localVideoRef.current || !localStream) return;

    localVideoRef.current.srcObject = localStream;

    localVideoRef.current
      .play()
      .then(() => {
        console.log("video playing");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const partnerInitials = partnerName.slice(0, 2).toUpperCase();

  return (
    <div className="flex-1 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)] rounded-[22px] overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-gray-900">
              {partnerName}'s Session
            </span>
          </div>

          <p className="text-[12px] text-gray-400 mt-0.5">Live Room</p>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 bg-[#1c1c2e] relative overflow-hidden">
        {/* Remote Video */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-[26px] font-bold text-white">
                {partnerInitials}
              </div>

              <span className="text-white/30 text-[13px]">
                Waiting for video...
              </span>
            </div>
          </div>
        )}

        {/* Partner Label */}
        <div className="absolute bottom-5 left-5 bg-black/45 backdrop-blur-sm text-white text-[12px] font-semibold px-3 py-1.5 rounded-[8px]">
          {partnerName}
        </div>

        {/* Self Video (PiP) */}
        <div
          className="absolute bottom-4 right-4 w-[28%] aspect-video rounded-[14px] overflow-hidden border-[2.5px] border-white/20 bg-black"
          style={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          }}
        >
          {localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#2e2245] text-white text-sm">
              Camera off
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10.5px] font-semibold px-2 py-1 rounded-[6px]">
            You
          </div>
        </div>
      </div>
    </div>
  );
}
