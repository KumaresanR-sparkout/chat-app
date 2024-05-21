import express from "express"
import * as userControll from '../controllers/user.controller'
import * as validate from '../validations/user.validation'
import * as message from '../controllers/message.controller'
import * as group from '../controllers/group.controller'
import GroupMessage from "../models/group-message.model"

const router = express.Router()

router.post('/register', validate.registerUserValidation, userControll.registerUser)

router.get('/login', userControll.loginUser)
router.get('/message', message.privateMessage)
router.get('/message-count',message.getMessageStatus)
router.get('/group-messsage/:id', message.groupMessage)

router.patch('/add-group-user',group.addGroupUser)
router.patch('/message-status',message.updateMessageStatus)
router.patch('/group-status',group.updategroupStatus)












//router.get('/groupuser',group.fetchArrayOfuser)
// router.get('/group',async(req,res)=>{
//     const t=await GroupMessage.find()
//     t.map((status)=>{
//         status.seen_by=false
//         status.save()
//     })
//     res.send(t)
// })  

export default router