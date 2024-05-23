import express from 'express'
import * as messageControll from '../controllers/message.controller'
const router = express.Router()

//@POST

//@GET
router.get('/message', messageControll.privateMessage)
router.get('/user-chat-details', messageControll.getUserBasedMessageDetails)
router.get('/group-messsage/:id', messageControll.groupChatsBasedOnGroupId)
router.get('/user-chat-details-loop', messageControll.getUserBasedMessageDetailsUsingLoop)

//@PATCH
router.patch('/message-status', messageControll.updateMessageStatus)

//@DELETE

export default router