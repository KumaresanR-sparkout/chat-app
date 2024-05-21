import Message from '../models/message.model'
import GroupMessage from '../models/group-message.model'
import mongoose from 'mongoose'
import * as response from '../utils/response.util'

export const privateMessage = async (req, res) => {
    try {

        if (Object.keys(req.query).length == 0) {
            return response.sendError(res, 400, "bad request")
        }
        const { senderId, receiverId } = req.query

        const message = await Message.find({
            $and: [
                {
                    $or: [
                        { sender_id: senderId },
                        { receiver_id: senderId }
                    ]
                },
                {
                    $or: [
                        { sender_id: receiverId },
                        { receiver_id: receiverId }
                    ]
                },

            ]
        })
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

//@description  get unseen messsage count  based on sender and receiver
//@route        GET /api/message-count
//@acess        nill

export const getMessageStatus = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.query.userId)
        const message = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender_id: id },
                        { receiver_id: id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $addFields: {
                    user1: {
                        $cond: {
                            if: { $gt: ['$sender_id', '$receiver_id'] },
                            then: '$sender_id',
                            else: '$receiver_id'
                        }
                    },
                    user2: {
                        $cond: {
                            if: { $gt: ['$sender_id', '$receiver_id'] },
                            then: '$receiver_id',
                            else: '$sender_id'
                        }
                    },
                    status: {
                        $cond: {
                            if: { $eq: ['$seen_by', false] },
                            then: 1,
                            else: 0
                        }
                    },
                    chat_id:{
                        $cond:{
                            if:{$eq:['$sender_id',id]},
                            then:'$receiver_id',
                            else:'$sender_id'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        user1: '$user1',
                        user2: '$user2'
                    },
                    chat_id:{$first:'$chat_id'},
                    count: { $sum: '$status' },
                    content:{$first:'$content'}
                }
            },
            {
                $project: { 
                    _id: 0,
                    chat_id: '$chat_id',
                    last_message: '$content',
                    unread_count: '$count'
                }
            }
        ])
        return response.sendSuccess(res, 200, "not seen message count has been fetched", message)

    
        // const status = {}
        // isStatus.forEach((data => {
        //     if (status[data.sender_id.toString()]) {
        //         status[data.sender_id.toString()]['unread_count']++
        //         status[data.sender_id.toString()]['content'] = data.content
        //     }
        //     else {

        //         status[data.sender_id.toString()] = { sender_id: data.sender_id.toString(), content: data.content, unread_count: 1 }
        //     }
        // }))
        //console.log(isStatus)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}


//@description  Update seen_status based on sender and receiver
//@route        FETCH /api/message-status
//@acess        nill

export const updateMessageStatus = async (req, res) => {

    try {

        if (Object.keys(req.query).length == 0) {
            return response.sendError(res, 400, "bad request")
        }

        const { senderId, receiverId } = req.query

        const isStatus = await Message.find({
            sender_id: senderId, seen_by: false,
            $and: [
                {
                    $or: [
                        { sender_id: senderId },
                        { receiver_id: senderId }
                    ]
                },
                {
                    $or: [
                        { sender_id: receiverId },
                        { receiver_id: receiverId }
                    ]
                },

            ]
        })
        isStatus.map((status) => {
            status.seen_by = true
            status.save()
        })

        return response.sendSuccess(res, 200, "message status has been updated", isStatus)

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

