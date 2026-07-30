const jwt = require("jsonwebtoken");
const User = require("../models/User");

const initSockets = (io) => {
  // Authenticate every socket connection using the same JWT used for REST calls
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No auth token provided"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.user.name} (${socket.id})`);

    // Personal room for direct notifications
    socket.join(`user:${socket.user._id}`);

    socket.on("workspace:join", (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);
    });

    socket.on("workspace:leave", (workspaceId) => {
      socket.leave(`workspace:${workspaceId}`);
    });

    socket.on("board:join", (boardId) => {
      socket.join(`board:${boardId}`);
      socket.to(`board:${boardId}`).emit("presence:joined", {
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    socket.on("board:leave", (boardId) => {
      socket.leave(`board:${boardId}`);
      socket.to(`board:${boardId}`).emit("presence:left", {
        userId: socket.user._id,
      });
    });

    // Realtime note editing broadcast (content sync between open editors)
    socket.on("note:typing", ({ noteId, workspaceId }) => {
      socket.to(`workspace:${workspaceId}`).emit("note:typing", {
        noteId,
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    socket.on("note:edit", ({ noteId, workspaceId, contentMarkdown, title }) => {
      socket.to(`workspace:${workspaceId}`).emit("note:edit", {
        noteId,
        contentMarkdown,
        title,
        userId: socket.user._id,
      });
    });

    socket.on("task:typing", ({ taskId, boardId }) => {
      socket.to(`board:${boardId}`).emit("task:typing", {
        taskId,
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.user.name}`);
    });
  });
};

// Helper used by controllers to push a notification to a specific user in realtime
const notifyUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit("notification:new", notification);
};

module.exports = { initSockets, notifyUser };
