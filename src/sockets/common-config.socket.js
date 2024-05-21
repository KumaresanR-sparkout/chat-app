import * as chat from './chat.socket'

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
        console.log('userId:', socket.userId)
        socket.join(socket.userId)
        chat.privateMessage(socket)
        chat.groupMessage(socket)
    })
}
