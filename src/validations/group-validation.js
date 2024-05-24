import Joi from 'joi'
import * as response from '../utils/response-util'

//@description  validating create group data
export const createGroupValidation = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return response.sendError(res, 400, 'no body found')
    }
    const { group_name } = req.body
    const validateGroup = Joi.object({
        group_name: Joi.string().required()
    })
    const validatedSchema = await validateGroup.validateAsync({ group_name })
    next()
}

//@description  validating ading group user data
export const addGroupUserValidation = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 400, 'bad request')
        }
        const { groupId, userId } = req.body
        const validateDetails = Joi.object({
            groupId: Joi.string(),
            userId: Joi.string()
        }).with('groupId', 'userId')

        const validatedSchema = await validateDetails.validateAsync({ groupId, userId })
        next()
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

//@description  validating update group status data
export const updategroupStatusValidation=async(req,res,next)=>{
    if (Object.keys(req.body).length == 0) {
        return response.sendError(res, 400, "no body-of-content found")
    }
    const { senderId, groupId, users } = req.body
    const validateDetails = Joi.object({
        senderId: Joi.string(),
        groupId: Joi.string(),
        users: Joi.array().items(
            Joi.string().required()
        ).required()
    }).with('senderId','groupId')

    const validatedSchema = await validateDetails.validateAsync({ senderId, groupId, users })
    next()
}