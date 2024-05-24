import Joi from 'joi'
import * as response from '../utils/response-util'

//@description  validating register user data
export const registerUserValidation = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 404, "no content found to register")
        }
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

//@description  validating login user data
export const LoginUserValidation = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 404, "no content found please send credientials")
        }
        const { email, password } = req.body
        const validateLoginSchema = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)).required()
        }).with('email', 'password')

        const validatedSchema = await validateLoginSchema.validateAsync({ email, password })
        next()
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

//@description  validating update user data
export const updateUserValidation = async (req, res, next) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return response.sendError(res, 400, 'please send userId to update')
        }

        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 400, 'no body content find to update')
        }
        const user = req.body
        const validateUpdateSchema = Joi.object({
            userId:Joi.string(),
            user_name: Joi.string().max(30),
            email: Joi.string().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/))
        })

        const validatedSchema = await validateUpdateSchema.validateAsync({userId,...user})
        next()
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

//@description  validating delete user data
export const deleteUserValidation = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length == 0) {
            return response.sendError(res, 404, "pass id to delete your details")
        }
        const { userId } = req.query
        const validateDeleteSchema = Joi.object({
            userId: Joi.string().required(),
        })
        const validatedSchema = await validateDeleteSchema.validateAsync({ userId })
        next()
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}