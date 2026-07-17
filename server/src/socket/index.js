const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = cookie.parseCookie(socket.handshake.headers.cookie || "");

      const accessToken = cookies.accessToken;

      if (!accessToken) {
        return next(new Error("Unauthorized"));
      }

      const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      socket.userId = payload.userId;

      next();
    } catch (error) {
      console.log(error);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);

    console.log(`${socket.userId} joined room ${socket.userId}`);

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId);
    });
    socket.on("disconnect", () => {
      console.log(`${socket.userId} disconnected`);
    });
  });
}
function emitNewMessage(
  conversationId,
  message,
) {
  io.to(conversationId).emit(
    "new-message",
    message,
  );
}

function emitUnreadCountUpdated(userId) {
  io.to(userId.toString()).emit(
    "unread-count-updated",
  );
}


function getIO() {
  return io;
}

module.exports = {
  initSocket,
  getIO,
  emitNewMessage,
  emitUnreadCountUpdated
};
