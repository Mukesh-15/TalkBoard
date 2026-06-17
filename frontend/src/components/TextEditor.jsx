import { useContext, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { SocketContext } from "../context/SocketContext";

export default function TextEditor() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("java");

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

  return (
    <div className="flex-1 bg-white rounded-[22px] flex flex-col overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-5 py-3.5 border-b">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-green-500 rounded-full" />

          <span className="font-bold">{roomName}</span>

          <span className="text-xs text-gray-400">{roomId}</span>
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none cursor-pointer"
        >
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c">C</option>
        </select>
      </div>

      <Editor
        height="100%"
        language={language}
        theme="vs"
        value={text}
        onChange={(value) => {
          const content = value || "";
          setText(content);
          sendTextChange(content);
        }}
      />
    </div>
  );
}
