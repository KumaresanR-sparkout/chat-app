import express from "express"
import * as userControll from '../controllers/user.controller'
import * as validate from '../validations/user.validation'
import * as userMessage from '../controllers/user-chat-message.controller'
import * as groupMessage from '../controllers/group-chat-message.controller'
import group from '../models/group.model'
const router = express.Router()

router.post('/register', validate.registerUserValidation, userControll.registerUser)
router.get('/login', userControll.loginUser)
router.get('/user-chat-messsage/:id', userMessage.userChatMessage)
router.get('/group-chat-messsage/:id', groupMessage.groupChatMessage)

export default router