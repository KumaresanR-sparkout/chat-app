import Message from '../models/message.model'
import GroupMessage from '../models/group-message.model'
import mongoose from 'mongoose'
import * as response from '../utils/response.util'

//@description  Getting private chat lists
//@route        GET /api/message    
export const privateMessage = async (req, res) => {
    try {

        if (Object.keys(req.query).length == 0) {
            return response.sendError(res, 400, "bad request")
        }
        const { senderId, receiverId } = req.query

        const message = await Message.find({
            $or: [
                {
                    $and: [
                        { sender_id: senderId },
                        { receiver_id: receiverId }
                    ]
                },
                {
                    $or: [
                        { sender_id: receiverId },
                        { receiver_id: senderId }
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

//@description  Getting indivaidual group chats
//@route        GET /api/group-messsage/:id 
export const groupChatsBasedOnGroupId = async (req, res) => {
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
//@route        GET /api/user-chat-details
export const getUserBasedMessageDetails = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.query.userId)
        const userChatDetails = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender_id: userId },
                        { receiver_id: userId }
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
                    chat_id: {
                        $cond: {
                            if: { $eq: ['$sender_id', userId] },
                            then: '$receiver_id',
                            else: '$sender_id'
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
                    senderId: { $first: '$sender_id' },
                    receiverId: { $first: '$receiver_id' },
                    count: { $sum: '$status' },
                    content: { $first: '$content' },
                    createdAt: { $first: '$createdAt' }
                }
            },
            {
                $project: {
                    _id: 0,
                    senderID: '$senderId',
                    receiverId: '$receiverId',
                    lastMessage: '$content',
                    unreadCount: '$count',
                    createdAt: '$createdAt'
                }
            }
        ])

        const userGroupChatDetails = await GroupMessage.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $lookup: {
                    from: 'groups',
                    localField: 'group_id',
                    foreignField: '_id',
                    as: 'result'
                },
            },
            {
                $match: {
                    'result.users': userId
                }
            },
            {
                $project: {
                    'result.createdAt': 0,
                    'result.updatedAt': 0,
                    'result.__v': 0
                }
            },
            {
                $addFields: {
                    unread_count: {
                        $cond: {
                            if: {
                                $in: [userId, '$seen_by']
                            },
                            then: 0,
                            else: 1
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$group_id',
                    senderId: { $first: '$sender_id' },
                    message: { $first: '$message' },
                    unread_count: { $sum: '$unread_count' },
                    createdAt: { $first: '$createdAt' }
                }
            },
            {
                $project: {
                    _id: 0,
                    groupId: '$_id',
                    senderId: '$senderId',
                    lastMessage: '$message',
                    unreadCount: '$unread_count',
                    createdAt: '$createdAt'
                }
            }

        ])
        const listUserChats = [...userChatDetails, ...userGroupChatDetails]
        listUserChats.sort((a, b) => {
            return b.createdAt - a.createdAt
        })

        return response.sendSuccess(res, 200, "last send message and unread count data", listUserChats)

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}


//@description  Update seen_status based on sender and receiver
//@route        FETCH /api/message-status
export const updateMessageStatus = async (req, res) => {

    try {

        if (Object.keys(req.query).length == 0) {
            return response.sendError(res, 400, "bad request")
        }

        const { senderId, receiverId } = req.query

        const isStatus = await Message.find({
            sender_id: senderId, seen_by: false,
            $or: [
                {
                    $and: [
                        { sender_id: senderId },
                        { receiver_id: receiverId }
                    ]
                },
                {
                    $and: [
                        { sender_id: receiverId },
                        { receiver_id: senderId }
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

//@description  List group-chat 
//@route        GET /api/user-chat-details-loop'
//@acess        nill

export const getUserBasedMessageDetailsUsingLoop = async (req, res) => {
    try {
        const { userId } = req.query
        const userChatDetails = await Message.find({
            $or: [
                { sender_id: userId },
                { receiver_id: userId }
            ]
        }).sort({
            createdAt: 1
        })
        const userDetails = {}

        userChatDetails.forEach((data) => {
            const id = (data.sender_id.toString() + data.receiver_id.toString()).split('').sort().join('')
            const seenValue = data.seen_by ? 0 : 1
            if (userDetails[id]) {
                userDetails[id]['readCount'] = userDetails[id]['readCount'] + seenValue
                userDetails[id]['lastMessage'] = data.content
                userDetails[id]['createdAt'] = data.createdAt

            }
            else {
                userDetails[id] = { senderId: data.sender_id.toString(), receiverId: data.receiver_id.toString(), lastMessage: data.content, readCount: seenValue, createdAt: data.createdAt }
            }

        })
        console.log(userDetails)

        const userGroupChatDetails = await GroupMessage.find().sort({ createdAt: 1 }).populate({
            path: 'group_id', match: {
                users: {
                    $elemMatch: {
                        $eq: userId
                    }
                }
            },
            select: {
                group_name: 1,
                users: 1
            }
        })

        const groupUserDetails = {}
        userGroupChatDetails.forEach(data => {
            const seenValue = data.seen_by.toString().split(',').includes(userId) ? 0 : 1
            if (groupUserDetails[data.group_id._id.toString()]) {
                groupUserDetails[data.group_id._id.toString()]['lastMessage'] = data.message
                groupUserDetails[data.group_id._id.toString()]['readCount'] = groupUserDetails[data.group_id._id.toString()]['readCount'] + seenValue
                groupUserDetails[data.group_id._id.toString()]['createdAt'] = data.createdAt
            }
            else {
                groupUserDetails[data.group_id._id.toString()] = { groupId: data.group_id._id.toString(), senderId: data.sender_id.toString(), lastMessage: data.message, readCount: seenValue, createdAt: data.createdAt }
            }
        })

        console.log(groupUserDetails)
        const listUserChats = [...Object.values(userDetails), ...Object.values(groupUserDetails)]
        listUserChats.sort((a, b) => {
            return b.createdAt - a.createdAt
        })
        return response.sendSuccess(res, 200, 'group-list', listUserChats)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}


