import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import * as socket from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './Routs/userRouter.js';
import postRouter from './Routs/postRouter.js';
import commentRouter from './Routs/commentRouter.js';
import SocketServer from './socketServer.js';
import notifyRouter from './Routs/notifyRouter.js';
import messageRouter from './Routs/messageRouter.js';
import { ExpressPeerServer } from 'peer';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://mehdi:ip6iE8y98dTSrTG@cluster0.d2kea.mongodb.net/mhgram?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
);

// Socket.io
const http = createServer(app);
const io = new socket.Server(http);

io.on("connection", socket => {
    SocketServer(socket);
})

// Peer server
ExpressPeerServer(http, { path: "/" });

//Routes
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", notifyRouter);
app.use("/api", messageRouter);

app.get("/", (req, res) => {
    res.send("server start");
})

const port = process.env.PORT || 5000;
http.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
})