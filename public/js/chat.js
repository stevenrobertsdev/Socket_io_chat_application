const socket = io();

// Elements
const   $mesageForm = document.querySelector("#message-form"),
        $messageFormInput = $mesageForm.querySelector("input"),
        $messageFormButton = $mesageForm.querySelector("button"),
        $sendLocationButton = document.querySelector("#send-location"),
        $messages = document.querySelector('#messages');

// Templates
const   messageTemplate = document.querySelector("#message-template").innerHTML,
        locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message:message.text
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationMessageTemplate, {
        url
    })
    $messages.insertAdjacentHTML('beforeend', html);
});


// send message code
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

    });
});



// send location code
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