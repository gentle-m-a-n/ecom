import Coupon from "../models/coupon.js";
export const getCoupon = async (req, res) => {
    try {
        coupon = await Coupon.findOne({userId: req.user._id, isActive: true})
        res.json(coupon || null)
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: error.message })
        
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const {code} = req.body
        const coupon = await Coupon.findOne({code: code, isActive: true, userId: req.user._id})
        if (!coupon){
            res.status(400).json({message: "Coupon not found"})
        }
        else if (coupon.expirationDate < Date.now){
            coupon.isActive = false
            await coupon.save()
            res.status(400).json({message: "Coupon expired"})
        }
        else {
            res.json({message: "Coupon valid", discountPercentage: coupon.discountPercentage, code:coupon.code})
        }
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: error.message })
    }
        
    }