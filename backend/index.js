require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const auth = require("./routes/auth");
const connectToMongo = require("./db/db");

const verifySocket = require("./middleware/verifySocket");
const socketHandler = require("./sockets/socketHandler");

const app = express();

connectToMongo();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(verifySocket);

socketHandler(io);

app.use("/auth", auth);

app.get("/", (req, res) => {
  res.send("Server working");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
