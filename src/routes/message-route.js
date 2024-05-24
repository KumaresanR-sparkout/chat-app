import express from 'express'
import * as messageControll from '../controllers/message-controller'
import * as jwtToken from '../tokens/jwt-token'
import * as validation from '../validations/message-validation'
const router = express.Router()

//@POST

//@GET
router.get('/private-chat', jwtToken.verifyToken, messageControll.privateMessage)
router.get('/group-chat/:id', jwtToken.verifyToken, messageControll.groupChatsBasedOnGroupId)
router.get('/user-chat', jwtToken.verifyToken, messageControll.getUserBasedMessageDetails)
router.get('/user-chat-loop', jwtToken.verifyToken, messageControll.getUserBasedMessageDetailsUsingLoop)

//@PATCH
router.patch('/private-status', jwtToken.verifyToken, validation.updateMessageStatusValidation, messageControll.updateMessageStatus)

//@DELETE

export default router