const users = {};
const drawing = {};
const sockets = {};

export default (io) => {
  io.on("connection", (socket) => {
    socket.on("join-drawing", ({ drawingId, name, color }) => {
      socket.join(drawingId);
      if (!users[drawingId]) {
        users[drawingId] = {};
      } else {
        users[drawingId][color] = { name, color };
      }
      sockets[socket.id] = { drawingId, color };
      socket.to(drawingId).emit("joined-users", {
        users: users[drawingId],
      });
      io.to(socket.id).emit("joined-drawing", {
        users: users[drawingId],
        drawing: drawing[drawingId] || [],
      });
    });

    socket.on("leave-drawing", () => {
      const canvasInfo = sockets[socket.id] || {};
      if (canvasInfo.drawingId && canvasInfo.color) {
        delete users[canvasInfo.drawingId][canvasInfo.color];
        socket
          .to(canvasInfo.drawingId)
          .emit("left-drawing", users[canvasInfo.drawingId]);
        socket.leave(canvasInfo.drawingId);
      }
    });

    socket.on("disconnect", () => {
      const canvasInfo = sockets[socket.id] || {};
      if (canvasInfo.drawingId && canvasInfo.color) {
        delete users[canvasInfo.drawingId][canvasInfo.color];
        socket
          .to(canvasInfo.drawingId)
          .emit("left-drawing", users[canvasInfo.drawingId]);
        socket.leave(canvasInfo.drawingId);
      }
    });

    socket.on("input-canvas", ({ drawingId, msg }) => {
      if (!drawing[drawingId]) {
        drawing[drawingId] = [];
      } else {
        drawing[drawingId].push(msg);
      }
      socket.to(drawingId).emit("update-canvas", msg);
    });

    socket.on("update-canvas", ({ drawingId, msg }) => {
      drawing[drawingId] = msg;
    });

    socket.on("input-control", ({ drawingId, type }) => {
      socket.to(drawingId).emit("update-control", type);
    });
  });
};
