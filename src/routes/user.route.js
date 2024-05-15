import express from "express"
import * as userControll from '../controllers/user.controller'
const router = express.Router()

router.post('/register',userControll.registerUser)
router.get('/login',userControll.loginUser)

export default router