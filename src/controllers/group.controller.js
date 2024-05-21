import Groups from '../models/group.model'
import GroupMessage from '../models/group-message.model'
import * as response from '../utils/response.util'

export const fetchArrayOfuser = async (groupKey) => {
    const groupUser = await Groups.findById(groupKey, { users: 1, _id: 0 })
    return groupUser.users
}

export const addGroupUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendSuccess(res, 400, 'bad request')
        }
        const { groupId, userId } = req.body
        const isExist = await Groups.findOne({
            users: userId
        })
        if (isExist) {
            return response.sendError(res, 400, 'already you have been added to the group')
        }
        const group = await Groups.findByIdAndUpdate(groupId, {
            $addToSet: { users: userId }
        }, {
            new: true
        })
        return response.sendSuccess(res, 201, 'updated data', group)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

export const updategroupStatus = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 400, "no body-of-content found")
        }
        const { senderId, groupId, users } = req.body
        const updatedStatus = await GroupMessage.updateMany({ group_id: groupId, sender_id: senderId }, {
                $addToSet:{
                    seen_by: {
                        $each: users
                    }
                }
        })
        return response.sendSuccess(res, 201, 'updated seen-users array', updatedStatus)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}
