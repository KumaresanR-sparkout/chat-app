import { privateMessage } from './private-chat.socket'
import { groupMessage } from './grop-chat.socket'

export const commonSocket = (io) => {

    io.on('connection', (socket) => {
        console.log('connected-user-id-', socket.id)
        const userId = socket.handshake.query.userId
        const groupKey = socket.handshake.headers['x-group-key']

        if (userId && groupKey) {
            console.log("group message-chat going")
            groupMessage(userId, groupKey, socket)
        }
        else {
            console.log("private message-chat going")
            privateMessage(userId, socket)
        }
    })
}
