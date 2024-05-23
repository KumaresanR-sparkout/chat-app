import express from "express"
import * as userControll from '../controllers/user.controller'
import * as validate from '../validations/user.validation'

const router = express.Router()

//@POST
router.post('/register', validate.registerUserValidation, userControll.registerUser)

//@GET
router.get('/login', userControll.loginUser)

//@PATCH
router.patch('/update-user', userControll.updateUser)

//@DELETE
router.delete('/delete-user',userControll.deleteUser)

export default router