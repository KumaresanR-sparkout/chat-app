import { saveGroupMessage } from '../utils/group-message.utils'

const groupRooms = {}
export const groupMessage = async (userid, groupkey, socket) => {
    const userId = userid
    const groupKey = groupkey
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
        const response=await saveGroupMessage(groupKey,userId,msg.message)
        if(response){
            socket.broadcast.to(groupRooms[groupKey])
            .emit('groupMessage', msg)
        }
        else{
            socket.emit('error', 'message is in queue not sent to user')
        }

        
    })
}