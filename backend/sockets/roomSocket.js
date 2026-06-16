const Room = require("../models/Room");

const activeRooms = {};

const roomSocket = (io, socket) => {
  socket.on("create-room", async ({ roomName }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    await Room.create({
      roomId,
      roomName,
      host: socket.user.id,
      participants: [socket.user.id],
    });

    activeRooms[roomId] = [
      {
        userId: socket.user.id,
        username: socket.user.username,
      },
    ];

    socket.join(roomId);

    socket.emit("room-created", {
      roomId,
      roomName,
    });
  });

  socket.on("join-room", async ({ roomId }) => {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return socket.emit("error", {
        message: "Room not found",
      });
    }

    socket.join(roomId);

    if (!activeRooms[roomId]) {
      activeRooms[roomId] = [];
    }

    const alreadyExists = activeRooms[roomId].some(
      (user) => user.userId === socket.user.id,
    );

    if (!alreadyExists) {
      activeRooms[roomId].push({
        userId: socket.user.id,
        username: socket.user.username,
      });
    }

    socket.emit("room-joined", {
      roomId,
      roomName: room.roomName,
    });

    io.to(roomId).emit("participants", activeRooms[roomId]);

    if (activeRooms[roomId].length === 2) {
      io.to(roomId).emit("start-call");
    }
  });

  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);

    activeRooms[roomId] = activeRooms[roomId]?.filter(
      (user) => user.userId !== socket.user.id,
    );

    io.to(roomId).emit("participants", activeRooms[roomId]);
  });

  socket.on("disconnect", () => {
    for (const roomId in activeRooms) {
      activeRooms[roomId] = activeRooms[roomId].filter(
        (user) => user.userId !== socket.user.id,
      );

      io.to(roomId).emit("participants", activeRooms[roomId]);
    }
  });
};

module.exports = roomSocket;
