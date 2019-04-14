const socket = io();

socket.on('message', (message) => {
    console.log(`${message}`);
});

document.getElementById('message-form').addEventListener("submit", function(e) {
    e.preventDefault();

    const message = document.getElementsByTagName('input')[0].value;

    socket.emit("sendMessage", message);
});