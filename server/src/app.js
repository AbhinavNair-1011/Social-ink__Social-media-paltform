const express = require("express");
require("dotenv").config()
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const commentRoutes = require("./routes/comment.route");
const notificationRoutes = require("./routes/notification.route")
const conversationRoutes = require("./routes/conversation.route")
const messageRoutes= require("./routes/message.route")
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const notFoundHandler = require("./middlewares/notFoundHandler");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/api/check", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully",
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/posts", postRoutes);
app.use("/posts", commentRoutes)
app.use(commentRoutes);
app.use("/notifications", notificationRoutes)
app.use('/conversations', conversationRoutes)
app.use("/messages", messageRoutes)
app.use(notFoundHandler);

app.use(globalErrorHandler);


module.exports=app




