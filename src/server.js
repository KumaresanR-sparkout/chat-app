import app from './index'
import env from 'dotenv'
import Io from 'socket.io'
import { saveUserMessage } from '../src/utils/user-message.utils'

env.config()

const server = app.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`)
})

const io = Io(server)
const user = {}
let privateSocket = (socket) => {
    const userId = socket.handshake.query.userId
    console.log('user connected - ', socket.userId)
    if (userId) {
        const key = Object.keys(user)
        if (key.includes(userId)) {
            user[userId] = [...user[userId], socket.id]
        }
        else {
            user[userId] = [socket.id]
        }
        console.log(user)
    }

    socket.on('chat', async (msg) => {
        const { receiver_id, message } = msg
        const response =await saveUserMessage(userId,receiver_id, message)
        if(response){
            io.of('/api/private').to(user[receiver_id]).emit('rechat', message)
            console.log(msg)
        }
        else{
            socket.emit('error','message is in queue not sent to user')
        }
    })
}


io.of('/api/private').on('connection', privateSocket)



















// const user = {}

// const socketResponse = (socket) => {
//     console.log(socket.id, ' - has connected')
//     const id = socket.handshake.query.id
//     if (id) {
//         const key = Object.keys(user)
//         if (key.includes(id)) {
//             user[id] = [...user[id], socket.id]
//         }
//         else {
//             user[id] = [socket.id]
//         }
//         console.log(user)
//     }
//     socket.on('chat', (msg) => {
//         const { recevier_id, message } = msg
//         socket.join(user[recevier_id])
//         socket.to(user[recevier_id]).emit('rechat', msg)

//     })
//     socket.on('disconnect', () => console.log(socket.id, ' - has disconnected'))
// }

// const rooms = {}
// const groupChat = (socket) => {
//     const id = socket.handshake.query.id
//     const room = socket.handshake.headers['token']
//     console.log(socket.id, ' - has connected')
//     console.log(room)
//     if (id && room) {
//         const roomKey = Object.keys(rooms)
//         if (roomKey.includes(room)) {
//             rooms[room] = [...rooms[room], socket.id]
//         }
//         else {
//             rooms[room] = [socket.id]
//         }
//     }
//     socket.on('chat',(msg)=>{
//         console.log(rooms)
//         socket.broadcast.to(rooms[room]).emit('rechat',msg)
//     })

//     socket.on('disconnect', () => console.log(socket.id, ' - has disconnected'))

// }



