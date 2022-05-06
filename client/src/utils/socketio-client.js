import socketIOClient from "socket.io-client";
import { getBaseURL } from './utils';

const backendUrl = getBaseURL();
let socketIoInstance;

export const getsocketIoInstance = (roomName, userName, componentName = '') => {
    if (socketIoInstance == null) {
        socketIoInstance = socketIOClient(backendUrl);
        socketIoInstance.emit('join-room', { roomName, userName });
        // console.log('new socketio instance created', componentName);
    }
    return socketIoInstance;
}