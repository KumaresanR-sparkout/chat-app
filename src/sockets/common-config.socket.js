import { privateMessage } from './private-chat.socket'
import { groupMessage } from './grop-chat.socket'

export const commonSocket = (io) => {

    io.on('connection', (socket) => {
        console.log('connected-user-id-', socket.id)
        groupMessage(socket)
        privateMessage(socket)
    })
}
