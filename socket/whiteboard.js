const workspaces = {};
const workspacePeers = {};


export default (io) => {
    io.on('connection', (socket) => {
        socket.on('join-room', ({ roomName, userName }) => {
            // each user in a workspace will join a room identified by the room name
            // create a new entry in workspaces if none exists
            try {
                if (workspaces[roomName] == null) {
                    workspaces[roomName] = {
                        drawMode: true,
                        isDrawing: false,
                        // currentPaths: new _immutable.List(),
                        currentPaths: [],
                        canvasColor: "white",
                        strokeColor: "red",
                        strokeWidth: 4,
                        eraserWidth: 20,
                    }
                }
                socket.join(roomName);
                logger.debug(`socket ${socket.id} joined room ${roomName}`);
                socket.to(roomName).emit('join-room', userName);
                socketio.to(roomName).emit('whiteboard-paths', {
                    currentPaths: workspaces[roomName].currentPaths,
                    isDrawing: workspaces[roomName].isDrawing
                });
            } catch (error) {
                logger.error(`join-room - ${error.message}`);
            }

        });

        // if server restarts, it seems room info is lost, 
        // need to rejoin but don't want to emit to the other sockets in room
        socket.on('join-room-re', ({ roomName }) => {
            socket.join(roomName); // will be ignored if socket already in room
        });

        socket.on('leave-room', ({ roomName, userName }) => {
            // TODO: send localPeerId as well and remove it from workspacePeers
            socket.to(roomName).emit('leave-room', userName);
        });
        socket.on('disconnect', ({ roomName, userName }) => {
            socket.to(roomName).emit('leave-room', userName);
        });

        socket.on('chat-msg', ({ roomName, txt, senderName }) => {
            socket.to(roomName).emit('chat-msg', { txt, senderName });
        });

        socket.on('peer-join', ({ roomName, peerId }) => {
            if (workspacePeers[roomName] == null) {
                workspacePeers[roomName] = {};
                workspacePeers[roomName][peerId] = peerId;
            } else {
                workspacePeers[roomName][peerId] = peerId;
            }
            socketio.to(roomName).emit('peer-join', workspacePeers[roomName]);
            // socketio.to(roomName).emit('peer-join', workspacePeers[roomName]);
            // socket.to(roomName).emit('peer-join', peerId);
        });
        socket.on('peer-leave', ({ roomName, peerId }) => {
            if (workspacePeers[roomName] != null && workspacePeers[roomName][peerId] != null) {
                delete workspacePeers[roomName][peerId];
            }
            // socket.to(roomName).emit('peer-leave', workspacePeers[roomName]);
            socket.to(roomName).emit('peer-leave', peerId);
        });

        // Pointer down event
        socket.on("sketchPointerDown", function ({ roomName, point, toDraw }) {
            try {
                if (workspaces[roomName] == null) {
                    workspaces[roomName] = {
                        drawMode: toDraw,
                        isDrawing: false,
                        currentPaths: [],
                        canvasColor: "white",
                        strokeColor: "red",
                        strokeWidth: 4,
                        eraserWidth: 20,
                    }
                }
                workspaces[roomName].isDrawing = true;
                const { strokeColor, canvasColor, strokeWidth, eraserWidth } = workspaces[roomName];
                const cp = workspaces[roomName].currentPaths.slice();
                cp.push({
                    drawMode: toDraw,
                    strokeColor: toDraw ? strokeColor : canvasColor,
                    strokeWidth: toDraw ? strokeWidth : eraserWidth,
                    paths: [point]
                });
                workspaces[roomName].currentPaths = cp;

                socketio.to(roomName).emit('whiteboard-paths', {
                    currentPaths: workspaces[roomName].currentPaths,
                    isDrawing: workspaces[roomName].isDrawing
                });
            } catch (error) {
                logger.error(`join-room - ${error.message}`);
            }

        });

        // Pointer move event
        socket.on("sketchPointerMove", function ({ roomName, point, toDraw }) {
            try {
                if (workspaces[roomName] == null) {
                    workspaces[roomName] = {
                        drawMode: toDraw,
                        isDrawing: false,
                        currentPaths: [],
                        canvasColor: "white",
                        strokeColor: "red",
                        strokeWidth: 4,
                        eraserWidth: 20,
                    }
                }
                if (!workspaces[roomName].isDrawing) return;

                const cp = workspaces[roomName].currentPaths.slice();
                cp[workspaces[roomName].currentPaths.length - 1].paths.push(point);
                workspaces[roomName].currentPaths = cp;

                socketio.to(roomName).emit('whiteboard-paths', {
                    currentPaths: workspaces[roomName].currentPaths,
                    isDrawing: workspaces[roomName].isDrawing
                });
            } catch (error) {
                logger.error(`join-room - ${error.message}`);
            }

        });

        // Pointer up event
        socket.on("sketchPointerUp", function ({ roomName }) {
            try {
                if (workspaces[roomName] == null) {
                    workspaces[roomName] = {
                        drawMode: true,
                        isDrawing: false,
                        currentPaths: [],
                        canvasColor: "white",
                        strokeColor: "red",
                        strokeWidth: 4,
                        eraserWidth: 20,
                    }
                }
                workspaces[roomName].isDrawing = false;
            } catch (error) {
                logger.error(`join-room - ${error.message}`);
            }

        });

        socket.on('sketch-undo', ({ roomName }) => {
            socket.to(roomName).emit('sketch-undo');
        });
        socket.on('sketch-redo', ({ roomName }) => {
            socket.to(roomName).emit('sketch-redo');
        });
        socket.on('sketch-clear', ({ roomName }) => {
            try {
                // if the workspace data exists, reset it
                if (workspaces[roomName] != null) {
                    workspaces[roomName] = {
                        drawMode: true,
                        isDrawing: false,
                        currentPaths: [],
                        canvasColor: "white",
                        strokeColor: "red",
                        strokeWidth: 4,
                        eraserWidth: 20,
                    }
                }
                // socket.to(roomName).emit('sketch-clear');
                socketio.to(roomName).emit('whiteboard-paths', {
                    currentPaths: workspaces[roomName].currentPaths,
                    isDrawing: workspaces[roomName].isDrawing
                });
            } catch (error) {
                logger.error(`join-room - ${error.message}`);
            }
        });

}


