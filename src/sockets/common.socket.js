const socketResponse = (socket) => {
    
    console.log(socket.id, ' - has connected')
    socket.on('disconnect', () => console.log(socket.id, ' - has disconnected'))
    socket.on('chat', (msg, callback) => {
        console.log(msg)
        callback({
            "status": true,
            "message": msg
        })
    })
    const arr = [...socket.id]
    socket.on('chatmessage', (msg, callback) => {
        io.to(arr[2]).emit('second','second_user')
        console.log("id",socket.id)
        console.log("message",msg)
        callback({
            "status": false,
            "message": msg
        })
    })
}