import Chats from '../models/chat.model'
export const saveUserMessage = async (senderId,receiverID,message) => {
    try {
        const Message={
            "sender_id":senderId,
            "receiver_id":receiverID,
            "message":message
        }
        const saveUserMessage=await Chats(Message).save()
        console.log(saveUserMessage)
        return true
    }
    catch (error) {
        console.log(error.message)
        return false
    }
}