import * as saveChat from '../controllers/save-chat.controller'
import { fetchArrayOfuser } from '../controllers/group.controller'

export const privateMessage = (socket) => {

    socket.on('chat', async (msg) => {
        const { userName, receiverId, content } = msg
        const response = await saveChat.saveOneToOneMessage(userName, socket.userId, receiverId, content)
        if (response) {
            socket.to(receiverId).emit('rechat', msg)
            console.log(msg)
        }
        else {
            socket.emit('error', 'message is in queue not sent to user')
        }
    })
}

export const groupMessage = async (socket) => {
    const groupKey = socket.handshake.headers['x-group-key']
    console.log('groupKey-', groupKey)
    const user = await fetchArrayOfuser(groupKey, socket.userId)
    console.log('user-', user)
    try {
        if (!user) {
            throw new Error('you are not allowed to chat with that group')
        }
        else {
            socket.join(groupKey)
            socket.on('groupChat', async (msg) => {
                const response = await saveChat.saveGroupMessage(groupKey, socket.userId, msg.message)
                if (response) {
                    socket.to(groupKey)
                        .emit('groupMessage', msg)
                    console.log(socket.userId)
                }
                else {
                    socket.emit('error', 'message is in queue not sent to user')
                }
            })
        }
    }

    catch (error) {
        console.log(error.message)
    }
}