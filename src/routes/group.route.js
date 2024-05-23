import express from 'express'
import * as groupControll from '../controllers/group.controller'
const router=express.Router()

//@ POST
router.post('/create-group', groupControll.createGroup)

//@GET

//@PATCH
router.patch('/add-group-user', groupControll.addGroupUser)
router.patch('/group-status', groupControll.updategroupStatus)

//@DELETE




export default router