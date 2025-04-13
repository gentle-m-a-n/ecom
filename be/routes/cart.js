import express from "express"
const router = express.Router()
import {addToCart, getCart, deleteAllFromCart, updateCart} from "../controllers/cartController.js"
import {protectRoute} from "../middleware/authMiddleware.js"
router.post('/', protectRoute, addToCart) // Add item to cart
router.delete('/', protectRoute, deleteAllFromCart) // Remove all item from cart
router.put('/:id', protectRoute, updateCart) // update item quantity of cart
router.get('/', protectRoute, getCart) // Get all items in cart


export default router