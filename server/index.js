const express = require("express");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");

const cors = require("cors");
app.use(cors());

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
connectDB();

// app.get("/", (req, res) => {
//   res.send("Api is running");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(5000, console.log(`server started on ${PORT}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room :" + room);
    // socket.emit('connected');
  });

  socket.on('typing',(room)=> socket.in(room).emit("typing"));
  socket.on('stop typing',(room)=> socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
        if(user._id == newMessageReceived.sender._id) return;

        socket.in(user._id).emit("message recieved",newMessageReceived);
    });
    
  });
});
