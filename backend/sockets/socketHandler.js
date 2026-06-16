const roomSocket = require("./roomSocket");
const editorSocket = require("./editorSocket");
const webrtcSocket = require("./webrtcSocket");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    roomSocket(io, socket);
    editorSocket(io, socket);
    webrtcSocket(io, socket);
  });
};

module.exports = socketHandler;