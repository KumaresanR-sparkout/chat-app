// export const privateSocket = async(socket) => {
//     const id=socket.handshake.query.id
//     console.log('user connected - ',socket.id)
//     socket.on('chat',(msg)=>{
//         socket.join(id)
//         socket.of('/api/private').to(msg.receiver_id).emit('rechat',msg)
//         console.log(msg)
//         console.log(id)
//     })
// }