import express from "express"
const router = express.Router()
import { login, signUp, logout, getProfile } from "../controllers/authController.js"
router.post("/signup", signUp)
router.get("/profile", getProfile)
router.post("/login", login)
router.post("/logout", logout)
export default router