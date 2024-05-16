import { saveUserMessage } from '../utils/user-message.utils'
const user = {}
export const privateMessage = (userid, socket) => {
    const userId = userid
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
        const response = await saveUserMessage(userId, receiver_id, message)
        if (response) {
            socket.broadcast.to(user[receiver_id]).emit('rechat', message)
            console.log(msg)
        }
        else {
            socket.emit('error', 'message is in queue not sent to user')
        }
    })

}