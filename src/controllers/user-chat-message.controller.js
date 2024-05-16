import Chats from '../models/sender-chat.model'
import * as response from '../utils/response.util'

export const userChatMessage = async (req, res) => {
    try {
        const userMessage = await Chats.find({ sender_id: req.params.id })
        console.log(userMessage)
        return response.sendSuccess(res, 200, "data fetched by userId", userMessage)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}