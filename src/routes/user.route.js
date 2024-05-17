import express from "express"
import * as userControll from '../controllers/user.controller'
import * as validate from '../validations/user.validation'
import * as message from '../controllers/message.controller'
import Group from '../models/group.model'

const router = express.Router()

router.post('/register', validate.registerUserValidation, userControll.registerUser)
router.get('/login', userControll.loginUser)
router.get('/messsage/', message.privateMessage)
router.get('/group-messsage/:id', message.groupMessage)
// router.get('/group',async(req,res)=>{
//     const t=await new Group().save()
//     console.log(t)

// })

export default router