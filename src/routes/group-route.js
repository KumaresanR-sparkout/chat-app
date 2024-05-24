import express from 'express'
import * as groupControll from '../controllers/group-controller'
import * as jwtToken from '../tokens/jwt-token'
import * as validation from '../validations/group-validation'

const router = express.Router()

//@POST
router.post('/group', jwtToken.verifyToken, validation.createGroupValidation, groupControll.createGroup)

//@GET

//@PATCH
router.patch('/group-user', jwtToken.verifyToken, validation.addGroupUserValidation, groupControll.addGroupUser)
router.patch('/group-status', jwtToken.verifyToken, validation.updategroupStatusValidation, groupControll.updategroupStatus)

//@DELETE

export default router