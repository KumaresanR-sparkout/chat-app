import { saveUserMessage } from '../utils/private-message.utils'
const user = {}
export const privateMessage = (socket) => {
    const userId = socket.handshake.query.userId
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
        const { userName, receiverId, content } = msg

        const response = await saveUserMessage(userName, userId, receiverId, content)
        if (response) {
            socket.to(user[receiverId]).emit('rechat', msg)
            console.log(msg)
        }
        else {
            socket.emit('error', 'message is in queue not sent to user')
        }
    })

}