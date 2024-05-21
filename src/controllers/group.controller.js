import Groups from '../models/group.model'
import * as response from '../utils/response.util'


export const fetchArrayOfuser=async(groupKey)=>{
    const groupUser=await Groups.findById(groupKey,{users:1,_id:0})
    return groupUser.users
    return response.sendSuccess(res,200,'fetched array of users',groupUser)
}

export const addGroupUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendSuccess(res, 400, 'bad request')
        }
        const { groupId, userId } = req.body
        const isExist=await Groups.findOne({
            users:userId
        })
        if(isExist){
            return response.sendError(res, 400, 'already you have been added to the group')  
        }
        const group = await Groups.findByIdAndUpdate(groupId, {
            $addToSet:{ users: userId } 
        }, {
            new: true
        })
        return response.sendSuccess(res, 201, 'updated data', group)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}