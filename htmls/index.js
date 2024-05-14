let socket = io()


function sendMessage(event) {
    event.preventDefault()
    const username = document.getElementById("username")
    const message = document.getElementById("message")
    const data = {
        "username": username.value,
        "message": message.value
    }
    socket.emit('chatmessage', data, (response) => {
        console.log("chat-response:", response)
    })
    username.value = ''
    message.value = ''      
}


socket.emit('chat','hello',(response)=>{
console.log("common-response",response)
})


