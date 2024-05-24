import * as chat from './chat-socket'
import { connectedSocketUsers } from './middlewares/connected-socket-users'

//@description  middleware for socket and connecting the users
export const commonSocket = (io) => {
    io.use((socket, next) => {
        const userId = socket.handshake.query.userId
        socket.userId = userId
        if (socket.userId) {
            next()
        }
        else {
            const err = new Error('userId is not defined')
            next(err)
        }
    })

    io.on('connection', (socket) => {
        console.log('socket-id:', socket.id)
        socket.join(socket.userId)
        connectedSocketUsers(socket.userId)
        chat.privateMessage(socket)
        chat.groupMessage(io,socket)
        console.log('connected userId in socket:', socket.userId)
    })
}
