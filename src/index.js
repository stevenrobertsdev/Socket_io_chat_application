const   path = require('path'),
        http = require('http'),
        express = require('express'),
        socketio = require('socket.io');


const   app = express(),
        server = http.createServer(app),
        io = socketio(server);

const   port = process.env.PORT || 3000,
        publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
    console.log('New Websocket connection');

    socket.emit('message', "Welcome!");

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    })
});



server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})

