import Joi from 'joi'
import * as response from '../utils/response-util'

//@description  validating update message status
export const updateMessageStatusValidation=async(req,res,next)=>{  
    try{
        if (Object.keys(req.query).length == 0) {
            return response.sendError(res, 400, "bad request")
        }
    
        const { senderId, receiverId } = req.query
        const validateIds=Joi.object({
            senderId:Joi.string(),
            receiverId:Joi.string()
        }).with('senderId','receiverId')

        const validatedSchema=await validateIds.validateAsync({senderId, receiverId})
        next()
    }
    catch(error){
        return response.sendError(res,500,error.message)
    }
}