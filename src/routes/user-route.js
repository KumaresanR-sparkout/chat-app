import express from "express"
import * as userControll from '../controllers/user-controller'
import * as jwtToken from '../tokens/jwt-token'
import * as validate from '../validations/user-validation'

const router = express.Router()
router.use(express.json())
//validate.registerUserValidation
//@POST
router.post('/user',validate.registerUserValidation,userControll.registerUser)

//@GET
router.get('/user', validate.LoginUserValidation, userControll.loginUser)

//@PATCH
router.patch('/user', jwtToken.verifyToken, validate.updateUserValidation, userControll.updateUser)

//@DELETE
router.delete('/user', jwtToken.verifyToken, validate.deleteUserValidation, userControll.deleteUser)

export default router