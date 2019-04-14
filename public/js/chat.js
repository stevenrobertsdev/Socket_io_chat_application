const socket = io();

// elements
const   $mesageForm = document.querySelector("#message-form"),
        $messageFormInput = $mesageForm.querySelector("input"),
        $messageFormButton = $mesageForm.querySelector("button"),
        $sendLocationButton = document.querySelector("#send-location");

socket.on('message', (message) => {
    console.log(`${message}`);
});

$mesageForm.addEventListener("submit", function(e) {
    e.preventDefault();

    $messageFormButton.setAttribute("disabled", "disabled");

    const message = $messageFormInput.value;
    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = " ";
        $messageFormInput.focus();
        if(error) {
            return console.log(error);
        }
        console.log('Message delivered');
    });
});

$sendLocationButton.addEventListener('click',function() {
    if(!navigator.geolocation) {
        return alert("Geo location is not supported by your browser");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude:position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute("disabled");
            console.log('Location shared')
        });
    });

})