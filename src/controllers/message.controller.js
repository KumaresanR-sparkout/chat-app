import Message from '../models/message.model'
import GroupMessage from '../models/group-message.model'
import Chat from '../models/chat.model'
import * as response from '../utils/response.util'

export const privateMessage = async (req, res) => {
    try {

        if (Object.keys(req.query).length==0) {
            return response.sendError(res, 400, "bad request")
        }
        const array = [req.query.senderId, req.query.receiverId]

        const message = await Message.find()
            .populate({ path: 'chat_ref', select: { 'createdAt': 0, 'updatedAt': 0 }, populate: { path: 'users', select: { 'user_name': 1 } } })
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

        if (!req.params) {
            return response.sendError(res, 400, "bad request")
        }

        const message = await GroupMessage.find()
            .populate({ path: 'group_id', select: { "__v": 0 } })
            .populate({ path: 'sender_id', select: { 'user_name': 1 }, options: { strictPopulate: false } })
            .then(data => data.filter(data => data.group_id._id == req.params.id))

        console.log(message)
        return response.sendSuccess(res, 200, "data fetched by the group based on users", message)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}


export const getMessageStatus = async (req, res) => {
    try {
        const isStatus = await Message.find({ seen_by: true })
            .populate({ path: 'chat_ref' })

        console.log(isStatus.length)
        return response.sendSuccess(res, 200, "not seen message count has been fetched", { "not_seen": isStatus.length })
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}


//@description  Update seen_status based on sender and receiver
//@route        Fetch /api/message-status
//@acess        nill

export const updateMessageStatus = async (req, res) => {

    try {
        
        if (Object.keys(req.query).length==0) {
            return response.sendError(res, 400, "bad request")
        }

        const isStatus = await Message.find({ sender_id: req.query.senderId,seen_by:false })
            .populate({ path: 'chat_ref', match: { users: { $in: [req.query.senderId, req.query.receiverId] } } })
        isStatus.map((status) => {
            status.seen_by = true
            status.save()
        })

        //@description  Update seen_status based on sender and receiver using sub-query method
        
        // const Status = await Message.updateMany({
        //     _id: {
        //         $in: await Message.find({}, { _id: 1 })
        //             .populate({ path: 'chat_ref', match: { users: { $in: ['66471e7c9fa50773ae8b164a', '66471e3b9fa50773ae8b1647'] } } })

        //     }, sender_id: '66471e3b9fa50773ae8b1647'
        // }, { $set: { seen_by: true } }, { new: true })

        return response.sendSuccess(res, 200, "message status has been updated", isStatus)

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

