const editorSocket = (io, socket) => {

  socket.on("text-change", ({ roomId, content }) => {
    socket.to(roomId).emit("receive-text-change", {
      content,
    });
  });

};

module.exports = editorSocket;