import express from "express"
import * as userControll from '../controllers/user.controller'
import * as validate from '../validations/user.validation'
const router = express.Router()

router.post('/register', validate.registerUserValidation, userControll.registerUser)
router.get('/login', userControll.loginUser)

export default router