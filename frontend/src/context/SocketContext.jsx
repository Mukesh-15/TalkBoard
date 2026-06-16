import { createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [socket, setSocket] = useState(null);

  const [participants, setParticipants] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState("");
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) return;

    const newSocket = io(API_URL, {
      auth: {
        token,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket Connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // room created
    newSocket.on("room-created", ({ roomId, roomName }) => {
      setRoomId(roomId);
      setRoomName(roomName);

      navigate(`/room/${roomId}`);
    });

    // joined room
    newSocket.on("room-joined", ({ roomId, roomName }) => {
      setRoomId(roomId);
      setRoomName(roomName);

      navigate(`/room/${roomId}`);
    });

    // participants update
    newSocket.on("participants", (users) => {
      setParticipants(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // ROOM METHODS
  const createRoom = (roomName) => {
    socket?.emit("create-room", { roomName });
  };

  const joinRoom = (roomId) => {
    socket?.emit("join-room", { roomId });
  };

  const leaveRoom = () => {
    if (!roomId) return;

    socket?.emit("leave-room", {
      roomId,
    });

    setRoomId(null);
    setParticipants([]);

    navigate("/");
  };

  // EDITOR
  const sendTextChange = (content) => {
    socket?.emit("text-change", {
      roomId,
      content,
    });
  };

  const listenTextChange = (callback) => {
    socket?.on("receive-text-change", ({ content }) => {
      callback(content);
    });
  };

  const removeTextListener = () => {
    socket?.off("receive-text-change");
  };

  return (
    <SocketContext.Provider
      value={{
        socket,

        roomId,
        roomName,
        participants,

        createRoom,
        joinRoom,
        leaveRoom,

        sendTextChange,
        listenTextChange,
        removeTextListener,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
