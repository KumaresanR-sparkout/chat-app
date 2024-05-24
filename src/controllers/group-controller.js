import Groups from '../models/group.model'
import GroupMessage from '../models/group-message.model'
import * as response from '../utils/response-util'

//@description  Fetching all users id
//@route        nill
export const fetchArrayOfuser = async (groupKey) => {
    const groupUser = await Groups.findOne({_id:groupKey},{users:1})
    return groupUser.users
    console.log(groupUser)
}

//@description  creating new group
//@route        POST /api/chat/group
//@acess        protected
export const createGroup = async (req, res) => {
    try {
        const isExist=await Groups.findOne({group_name:req.body.group_name})
        if(isExist){
            return response.sendError(res,401,'already group has been created')
        }
        const createGroup = await new Groups(req.body).save()
        console.log(createGroup)
        return response.sendSuccess(res, 201, 'created group', createGroup)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

//@description  Adding new users to the group
//@route        PATCH /api/chat/group-user
//@acess        protected
export const addGroupUser = async (req, res) => {
    try {
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
        return response.sendSuccess(res, 201, 'user added to the group', group)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

//@description  Updating seen group status
//@route        PATCH/api/chat/group-status
//@acess        protected
export const updategroupStatus = async (req, res) => {
    try {
        const { senderId, groupId, users } = req.body
        const isExist=await GroupMessage.findOne({group_id:groupId,sender_id:senderId})
        if(!isExist){
            return response.sendError(res,401,'you are not allowed to update the seen status')
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
