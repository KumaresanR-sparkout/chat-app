import express from "express"
import { serveHtml } from "../controllers/chat-file.controller"
const router = express.Router()

router.get('/', serveHtml)

export default router