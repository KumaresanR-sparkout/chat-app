import Message from '../models/message.model'
import GroupMessage from '../models/group-message.model'
import * as response from '../utils/response.util'

export const privateMessage = async (req, res) => {
    try {
        const array = [req.query.senderId, req.query.receiverId]
        const message = await Message.find().populate({ path: 'chat_ref', select: { 'createdAt': 0, 'updatedAt': 0 }, populate: { path: 'users', select: { 'user_name': 1 } } })
            .then(data => data.filter(data => {
                console.log(data.sender_id)
                return array.includes(data.sender_id.toString())
            }))
        console.log(message)
        return response.sendSuccess(res, 200, "data fetched by userId", message)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

export const groupMessage = async (req, res) => {
    try {
        const message = await GroupMessage.find()
            .populate({ path: 'group_id', select: { "__v": 0 } })
            .populate({ path: 'sender_id',select:{'user_name':1}, options: { strictPopulate: false } })

        console.log(message)
        return response.sendSuccess(res, 200, "data fetched by the group based on users", message)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}