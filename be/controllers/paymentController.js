import Coupon from "../models/coupon.js"
import Order from "../models/order.js"
import {stripe} from "../lib/stripe.js"
import dotenv from "dotenv"
dotenv.config()

export const createCheckoutSession = async (req, res) => {
 try {
    const {product, couponCode} = req.body
    if (!Array.isArray(product) || product.length === 0) {
        return res.status(400).json({ message: "No products found" })
    }
    let totalAmount = 0
    const lineItems = product.map( product => {
        const amount = Math.round(product.price* 100)
        totalAmount += amount * product.quantity
        return {
            price_data: {
                currency: "usd",
                product_data:{
                    name: product.name,
                    images: [product.image]
                },
                unit_amount: amount
        }
    }
 })

 let coupon = null
    if (couponCode) {
        coupon = await coupon.findOne({code: couponCode, userId: req.user._id, isActive: true})
        if (coupon){
            totalAmount -= Math.round(totalAmount * coupon.discount / 100)
            if (totalAmount < 0){
                totalAmount = 0
            }
        }
    }
 const session = await stripe.checkout.session.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-failed`,
    discounts: coupon ?
    [{
        coupon: await createStripeCoupon (coupon.discountPercentage)
    }] : [],
    metaData: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON. stringify(product.map((item) => ({
            id: item._id,
            quantity: item.quantity,
            price: item.price
        })))
    }
})
 if (totalAmount > 10000){
    await createNewCoupon(req.user._id)
 }
 res.status(200).json({
    id: session.id,
    amount: totalAmount/100})
} catch (error) {
    res.status(500).json({ message: error.message })
    console.log("Error in createCheckoutSession controller", error.message);
 }

 async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    })
return coupon.id}

 async function createNewCoupon(userId){
    const newCoupon = new Coupon({
        code: "COUPON" + Math.random().toString(36).substring(2, 8),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        userId: userId

    })
    await newCoupon.save()
    return newCoupon
 }
}


export const checkoutSuccess = async (req, res) => {
    try {
        const {session_id} = req.body
        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (session.payment_status === "paid"){

            if(session.metaData.couponCode){
                await Coupon.findOneAndUpdate({code: session.metaData.couponCode, userId: req.user._id}, {isActive: false})
            }
            //store order in db
            const products = JSON.parse(session.metaData.products)
            const newOrder = new Order({
                user: session.metaData.userId,
                products: products.map((item) => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: session_id
})
            await newOrder.save()
            res.status(200).json({success: true, message: "Order created successfully", orderId: newOrder._id})
        }
    } catch (error) {
        console.log("Error in checkoutSuccess controller", error.message);
        res.status(500).json({ message: error.message })
        
    }
}