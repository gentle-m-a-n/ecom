import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.js"
import productRoute from "./routes/products.js"
import cartRoute from "./routes/cart.js"
import couponRoute from "./routes/coupons.js"
import paymentRoute from "./routes/payment.js"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"
dotenv.config()

const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/coupons", couponRoute)
app.use("/api/payments", paymentRoute)


app.listen(port, ()=>{
    console.log("hi")
    connectDB()
})