import express from "express"
const router = express.Router()
import {getAllProducts, deleteProducts, addProducts, getFeatureProducts, getRecommendedProducts, getProductByCategory} from "../controllers/productController.js"
import {protectRoute, adminRoute} from "../middleware/authMiddleware.js"
router.get ('/', protectRoute, adminRoute,  getAllProducts) // get all products
router.get ('/featured', getFeatureProducts)
router.post ('/', protectRoute, adminRoute,  addProducts)
router.delete ('/:id', protectRoute, adminRoute,  deleteProducts)
router.get ('/recommendation', getRecommendedProducts)
router.get ('/category/:category', getProductByCategory)
export default router