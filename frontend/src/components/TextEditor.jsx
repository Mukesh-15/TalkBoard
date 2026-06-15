import { useContext, useEffect, useState } from "react";

import { SocketContext } from "../context/SocketContext";

export default function TextEditor() {
  const [text, setText] = useState("");

  const {
    roomName,
    roomId,

    sendTextChange,
    listenTextChange,
    removeTextListener,
  } = useContext(SocketContext);

  useEffect(() => {
    listenTextChange((content) => {
      setText(content);
    });

    return () => {
      removeTextListener();
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;

    setText(value);

    sendTextChange(value);
  };

  return (
    <div className="flex-1 bg-white rounded-[22px] flex flex-col overflow-hidden shadow-lg
    "
    >
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b">
        <div className="w-2 h-2 bg-green-500 rounded-full" />

        <span className="font-bold">{roomName}</span>

        <span className="text-xs text-gray-400">
          {roomId}
        </span>
      </div>

      <textarea value={text} onChange={handleChange} className=" flex-1 p-5 outline-none resize-none " placeholder=" Start typing... "
      />
    </div>
  );
}
