import Groups from '../models/group.model'
import GroupMessage from '../models/group-message.model'
import * as response from '../utils/response.util'

//@description  Fetching all users id
//@route        nill
export const fetchArrayOfuser = async (groupKey,senderId) => {
    const groupUser = await Groups.findOne({_id:groupKey,users:{
        $elemMatch:{
            $eq:senderId
        }
    }})
    return groupUser
    console.log(groupUser)
}

//@description  creating new group
//@route        POST /api/create-group
export const createGroup = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 400, 'no body found')
        }
        const isExist=await Groups.findOne({group_name:req.body.group_name})
        if(isExist){
            return response.sendError(res,401,'already group has been created')
        }
        const createGroup = await new Groups(req.body).save()
        console.log(createGroup)
        return response.sendSuccess(res, 200, 'created group', createGroup)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

//@description  Adding new users to the group
//@route        PATCH /api/add-group-user
export const addGroupUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendSuccess(res, 400, 'bad request')
        }
        const { groupId, userId } = req.body
        const isExist = await Groups.findOne({_id:groupId,
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

//@description  Updating seen group status
//@route        PATCH/api/group-status
export const updategroupStatus = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 400, "no body-of-content found")
        }
        const { senderId, groupId, users } = req.body
        const isExist=await GroupMessage.findOne({group_id:groupId,sender_id:senderId})
        if(!isExist){
            response.sendError(res,401,'you are not allowed to update the seen status')
        }
        const updatedStatus = await GroupMessage.updateMany({ group_id: groupId, sender_id: senderId }, {
            $addToSet: {
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
