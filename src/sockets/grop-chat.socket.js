import { saveGroupMessage } from '../utils/group-message.utils'

const groupRooms = {}
export const groupMessage = async (socket) => {
    const userId = socket.handshake.query.userId
    const groupKey = socket.handshake.headers['x-group-key']
    console.log(groupKey)
    if (userId && groupKey) {
        const key = Object.keys(groupRooms)
        if (key.includes(groupKey)) {
            groupRooms[groupKey] = [...groupRooms[groupKey], socket.id]
        }
        else {
            groupRooms[groupKey] = [socket.id]
        }
    }
    console.log(groupRooms)
    socket.on('groupChat', async (msg) => {
        const response = await saveGroupMessage(groupKey, userId, msg.message)
        if (response) {
            socket.to(groupRooms[groupKey])
                .emit('groupMessage', msg)
        }
        else {
            socket.emit('error', 'message is in queue not sent to user')
        }


    })
}