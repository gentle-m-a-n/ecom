import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js"
const router = express.Router()
import { validateCoupon, getCoupon } from "../controllers/couponController.js"
router.get("/", protectRoute, getCoupon)
router.get("/validate", protectRoute, validateCoupon)


export default router