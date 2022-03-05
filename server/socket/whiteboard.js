export default (io) => {
    io.on('connect', (socket) => {
        

        //draw

        //erase

        //undo 

        //redo

        socket.on('sendMessage', (message, callback) => {
            const user = getUser(socket.id);

            io.to(user.room).emit('message', { user: user.name, text: message });

            callback();
        });

       
    });
}


