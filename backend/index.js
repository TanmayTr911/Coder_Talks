const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const msgRoutes = require("./routes/msgRoutes");
const { notFound, errorHandler } = require("./middleware/errmiddle");
const path = require("path");

dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());

// app.get("/chat", (req, res) => {
//   res.send({ "hello there": "hiii" });
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/msg", msgRoutes);

// ------------------------------DEPLOYMENT-----------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// ------------------------------DEPLOYMENT-----------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`server running on ${PORT}`));

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
    console.log("user joined room" + room);
  });

  socket.on("new message", (newMsg) => {
    let chat = newMsg.chat;

    if (!chat.users) {
      return console.log("no users found");
    }

    chat.users.forEach((user) => {
      if (user._id === newMsg.sender._id) return;

      socket.to(user._id).emit("msg received", newMsg);
    });
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
    // console.log("typing");
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });
});
