import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js"
const router = express.Router()
import { createCheckoutSession, checkoutSuccess } from "../controllers/paymentController.js"
router.post("/create-checkout-session", protectRoute, createCheckoutSession)
router.post("/checkout-success", protectRoute, checkoutSuccess)


export default router