import User from '../models/user.model'
import * as jwtToken from '../tokens/jwt-token'
import * as response from '../utils/response-util'

//@description  creating register function
//@route        POST/api/chat/user
export const registerUser = async (req, res) => {
    try {
        const { user_name, email, password } = req.body
        const existingUser = await User.findOne({ "user_name": user_name, "email": email })
        if (existingUser) {
            return response.sendError(res, 400, "user already exist")
        }

        const saveResponse = await new User(req.body).save()

        return response.sendSuccess(res, 201, "user added", [saveResponse])

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

//@description  creating login function
//@route        GET/api/chat/user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email)

        const existingUser = await User.findOne({ "email": email })
        if(!existingUser){
            return response.sendError(res, 400, "In valid email")
        }

        if (existingUser.password != password) {
            return response.sendError(res, 401, "In valid password")
        }
        const userToken = await jwtToken.generateToken({
            "jwt": "jwtToken"
        })
        const sendUserDetails = {
            "userId":existingUser._id,
            "email": existingUser.email,
            "token": userToken
        }
        return response.sendSuccess(res, 200, "successfully login", [sendUserDetails])

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }

}

//@description  creating update function
//@route        PATCH/api/chat/user
//@acess        protected
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.query
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true
        })

        if (!updatedUser) {
            return response.sendError(res, 401, 'you are not the user to update the details')
        }
        return response.sendSuccess(res, 201, 'updated your details', [updatedUser])
    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}

//@description  delete login function
//@route        DELETE /api/chat/user
//@acess        protected
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return response.sendError(res, 400, 'please send userId to delete')
        }
        const deleteUser = await User.findByIdAndDelete(userId)
        console.log(deleteUser)
        if (!deleteUser) {
            return response.sendError(res, 401, 'you are not the user to delete the details')
        }
        return response.sendSuccess(res, 201, 'deleted your details', deleteUser)

    }
    catch (error) {
        return response.sendError(res, 500, error.message)
    }
}