import GroupMessage from '../models/group-message.model'
import Message from '../models/message.model'

//@description  creating one to one chats
//@route        nill
export const saveOneToOneMessage = async (userName, senderId, receiverID, content) => {
    try {
        const messageDetails = {
            "chat_name": userName,
            "sender_id": senderId,
            "receiver_id": receiverID,
            "content": content
        }

        const message = await new Message(messageDetails).save()
        console.log(message)
        return true
    }
    catch (error) {
        console.log(error.message)
        return false
    }
}

//@description  creating group chats
//@route        nill
export const saveGroupMessage = async (group_id, sender_id, message) => {
    try {
        const Message = {
            "group_id": group_id,
            "sender_id": sender_id,
            "message": message
        }
        const _response = await new GroupMessage(Message).save()
        console.log(_response)
        return true
    }
    catch (error) {
        return false
    }
}