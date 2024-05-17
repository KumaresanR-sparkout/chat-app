import Chats from '../models/chat.model'
import Message from '../models/message.model'
export const saveUserMessage = async (userName, senderId, receiverID, content) => {
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