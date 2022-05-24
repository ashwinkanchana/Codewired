import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import monaco from './socket/monaco.js';
import chat from './socket/chat.js'
import piston from './routes/piston.js'
import room from './routes/room.js'

const app = express()
app.use(morgan('dev'))
const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origins: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

//const io = new Server(httpServer);


monaco(io)
chat(io)


app.use('/room', room)
app.use('/code', piston)


const port = process.env.PORT || 4001
httpServer.listen(port, () => {
    console.log(`listening to ${port}`)
})


