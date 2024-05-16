import Joi from 'joi'
import * as response from '../utils/response.util'

export const registerUserValidation = async (req, res, next) => {
    try {
        const user = req.body
        const validateUserSchema = Joi.object({
            user_name: Joi.string().max(30),
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)).required()
        }).with('user_name', 'email')

        const validatedSchema = await validateUserSchema.validateAsync(user)
        next()

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }

}