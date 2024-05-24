import * as saveChat from '../controllers/save-chat-controller'
import { fetchArrayOfuser } from '../controllers/group-controller'
import { connectedUserExistInGroup } from '../sockets/middlewares/connected-user-in-group'

//@description  Private Messsage function
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

//@description Group Message function
export const groupMessage = async (io,socket) => {
    socket.on('groupChat', async (msg) => {
        //console.log(msg)
        const user = await fetchArrayOfuser(msg.groupKey)
        //console.log('user-', user)
        const userInSocket=await connectedUserExistInGroup(user)
        console.log("usersocket:",userInSocket)
        const response = await saveChat.saveGroupMessage(msg.groupKey, socket.userId, msg.message)    
        if (response) {
            io.to(userInSocket)
                .emit('groupMessage', msg)
            console.log(socket.userId)
        }
        else {
            socket.emit('error', 'message is in queue not sent to user')
        }
    })
}