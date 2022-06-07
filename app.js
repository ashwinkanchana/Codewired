import * as path from "path";
import "./config/config.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";

import monaco from "./socket/monaco.js";
import chat from "./socket/chat.js";
import piston from "./routes/piston.js";
import room from "./routes/room.js";
import token from "./routes/token.js";

const app = express();
app.use(morgan("dev"));
// const corsOptions = {
//     origin: '*'
// }
// app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origins: ["*"],
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

//const io = new Server(httpServer);

monaco(io);

app.use("/room", room);
app.use("/code", piston);
app.use("/call", token);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("./client/build"));
  app.get("*", (req, res) => {
    const dirname = path.resolve(path.dirname(''));
    res.sendFile(path.resolve(dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 4001;
httpServer.listen(port, () => {
  console.log(`listening to ${port}`);
});
