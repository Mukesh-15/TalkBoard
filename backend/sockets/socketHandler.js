const roomSocket = require("./roomSocket");
const editorSocket = require("./editorSocket");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    roomSocket(io, socket);
    editorSocket(io, socket);
  });
};

module.exports = socketHandler;