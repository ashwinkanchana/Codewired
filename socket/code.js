import ACTIONS from "./actions.js";
import { updateCode, updateRoomLanguage } from "../controllers/database.js";
const userSocketMap = {};

export default (io) => {
  function getAllConnectedClients(roomId) {
    // get allconnected users in that room (socket adapter)
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
      (socketId) => {
        return {
          socketId,
          username: userSocketMap[socketId],
        };
      }
    );
  }
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id); // browser socket id



    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      // join emitted event listen here
      userSocketMap[socket.id] = username; // { 'socket_id': 'usrname' }
      socket.join(roomId); // join room
      const clients = getAllConnectedClients(roomId); // [{ socketId: '', username: '' }, {}, {}. ...]
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          // to each client in array
          clients,
          username,
          socketId: socket.id,
        });
      });
    });

    socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
      await updateCode(roomId, code)
      socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });


    socket.on(ACTIONS.LANGUAGE_CHANGE, async ({ roomId, language }) => {
      await updateRoomLanguage(roomId, language)
      socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
    });

    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
          // notify on disconnect
          socketId: socket.id,
          username: userSocketMap[socket.id],
        });
      });
      delete userSocketMap[socket.id];
      socket.leave();
    });
  });
};
