const express = require("express");
const errorHandler = require("./middlewares/errorMiddleware");
const connectDB = require("./config/connectdb");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

require("dotenv").config();
require("colors");

// CORS configuration for frontend
app.use(
  cors({
    origin: "https://dashboard-sooty-alpha.vercel.app", // Your frontend URL
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true, // Include if sending cookies or auth headers
  })
);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users/", require("./routes/userRoutes"));
app.use("/api/company/", require("./routes/companyRoutes"));
app.use("/api/partner/", require("./routes/partnerRoutes"));
app.use("/api/customer/", require("./routes/customerRoutes"));

app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: "https://dashboard-sooty-alpha.vercel.app", // Match frontend URL
    methods: ["POST", "GET", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected on host:${socket.id.blue}`);
  socket.on("sent_message", (data) => {
    const messageData = {
      ...data,
      username: data.username || "Anonymous",
    };
    console.log(data);
    socket.broadcast.emit("show_message", messageData);
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server started on port:${process.env.PORT.yellow}`)
);
