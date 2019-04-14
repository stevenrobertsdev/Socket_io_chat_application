const   path = require('path'),
        http = require('http'),
        express = require('express'),
        socketio = require('socket.io'),
        Filter = require('bad-words');


const   app = express(),
        server = http.createServer(app),
        io = socketio(server);

const   port = process.env.PORT || 3000,
        publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
    console.log('New Websocket connection');

    socket.emit('message', "Welcome!");
    socket.broadcast.emit("message", "A new user has joined");

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if(filter.isProfane(message)) {
            return callback("Profanity is not allowed!")
        }

        io.emit('message', message);
        callback();
    })

    socket.on('sendLocation', (position, callback) => {
        io.emit("message", `https://www.google.com/maps?q=${position.latitude},${position.longitude}`);
        callback();
    })



    socket.on('disconnect', () => {
        io.emit('message', "A user has left");
    })

}); // io.on





server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})

