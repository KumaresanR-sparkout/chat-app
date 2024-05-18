import GroupMessage from '../models/group-message.model'
import Chats from '../models/chat.model'
import Message from '../models/message.model'

export const saveOneToOneMessage = async (userName, senderId, receiverID, content) => {
    try {
        const chatDetails = {
            "chat_name": userName,
            "users": [senderId, receiverID]
        }
        const messageDetails = {
            "sender_id": senderId,
            "content": content
        }

        const chat = await new Chats(chatDetails).save()

        messageDetails.chat_ref = chat._id

        const message = await new Message(messageDetails).save()
        console.log(chat)
        console.log(message)
        return true
    }
    catch (error) {
        console.log(error.message)
        return false
    }
}

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