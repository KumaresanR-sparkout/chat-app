import User from '../models/user.model'
import * as response from '../utils/response.util'

export const registerUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 404, "no content found to register")
        }
        const { user_name, email, password } = req.body
        const existingUser = await User.findOne({ "user_name": user_name, "email": email })
        if (existingUser) {
            return response.sendError(res, 400, "user already exist")
        }

        const _response = await new User(req.body).save()

        return response.sendSuccess(res, 200, "user added", _response)

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

export const loginUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 404, "no content found please send credientials")
        }
        const { email, password } = req.body
        console.log(email)

        const existingUser = await User.findOne({ "email": email })

        if ((existingUser.email != email) || (existingUser.password != password)) {
            return response.sendError(res, 401, "use valid login credientials")
        }
        return response.sendSuccess(res, 200, "successfully login", existingUser)

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }

}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) {
            response.sendError(res, 400, 'please send userId to delete')
        }

        if (Object.keys(req.body).length == 0) {
            return response.sendError(res, 400, 'no body content find to update')
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            new: true
        })

        if (!updatedUser) {
            return response.sendError(res, 401, 'you are not the user to update the details')
        }
        return response.sendSuccess(res, 201, 'updated your details', updatedUser)
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return response.sendError(res, 400, 'please send userId to delete')
        }
        const deleteUser = await User.findByIdAndDelete(userId)
        if (!deleteUser) {
            return response.sendError(res, 401, 'you are not the user to delete the details')
        }
        return response.sendSuccess(res, 201, 'deleted your details', deleteUser)

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}