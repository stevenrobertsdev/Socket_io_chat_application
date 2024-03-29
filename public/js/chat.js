const socket = io();

// Elements
const   $mesageForm = document.querySelector("#message-form"),
        $messageFormInput = $mesageForm.querySelector("input"),
        $messageFormButton = $mesageForm.querySelector("button"),
        $sendLocationButton = document.querySelector("#send-location"),
        $messages = document.querySelector('#messages');

// Templates
const   messageTemplate = document.querySelector("#message-template").innerHTML,
        locationMessageTemplate = document.querySelector("#location-message-template").innerHTML,
        sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true});

const autoScroll = () => {
    // new message
    const $newMessage = $messages.lastElementChild;
    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // visable height
    const visableHeight = $messages.offsetHeight;

    // height of messages container
    const containerHeight = $messages.scrollHeight;

    // how far has been scrolled
    const scrollOffset = $messages.scrollTop + visableHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format("h:mma")
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
});

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format("h:mma")
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
});

socket.on('roomData', ({room,users}) => {
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
})


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

socket.emit("join", {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = "/"
    }
}); 