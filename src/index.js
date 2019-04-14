const   path = require('path'),
        http = require('http'),
        express = require('express'),
        socketio = require('socket.io'),
        Filter = require('bad-words'),
        {generateMessage, generateLocationMessage} = require("./utils/messages"),
        {addUser, getUser, removeUser, getUsersInRoom} = require("./utils/users");

const   app = express(),
        server = http.createServer(app),
        io = socketio(server);

const   port = process.env.PORT || 3000,
        publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {

    socket.on("join", (options, callback) => {
        const {error, user} = addUser({id: socket.id, ...options })

        if(error) {
            return callback(error);
        }

        socket.join(user.room)

        socket.emit('message', generateMessage("Admin", "Welcome!"));
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined.`));

        io.to(user.room).emit('roomData', {
            room:user.room,
            users: getUsersInRoom(user.room)
        })

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if(filter.isProfane(message)) {
            return callback("Profanity is not allowed!")
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    })

    socket.on('sendLocation', (position, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("locationMessage", generateLocationMessage(user.username,`https://www.google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();
    })

 

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', generateMessage("Admin", `${user.username} as left.`));
            io.to(user.room).emit('roomData', {
                room:user.room,
                users: getUsersInRoom(user.room)
            })
        }

        
    })

}); // io.on





server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})

