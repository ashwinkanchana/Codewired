var conId = 1
var colors = [
    '#C0665F', '#C0975F', '#159D59', '#A408AC', '#94023B', '#029489'
]
var users = {}




export default (io) =>{
    io.on("connection", function (socket) {
        //console.log('conn')
        users[socket.id] = {}

        users[socket.id].user = socket.user = "user" + conId
        users[socket.id].admin = socket.admin = false
        users[socket.id].color = socket.color = colors[conId % colors.length]


        conId++
        //console.log('[Socket.IO] : Connect ' + socket.id)
        if (io.sockets.length == 1) {
            socket.emit('admin')
            socket.admin = true


        }
        else
            socket.emit('userdata', Object.values(users))
            
        socket.broadcast.emit('connected', { user: socket.user, color: socket.color })

        socket.on('selection', function (data) {
            data.color = socket.color
            data.user = socket.user
            socket.broadcast.emit('selection', data)
        })
        socket.on('filedata', function (data) {
            socket.broadcast.emit('resetdata', data)
        })
        socket.on('disconnect', function (data) {
            socket.broadcast.emit("exit", users[socket.id].user)
            delete users[socket.id]
        })
        socket.on('key', function (data) {
            data.user = socket.user
            socket.broadcast.emit('key', data)
        })
    })

}