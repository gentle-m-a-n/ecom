import Product from "../models/product.js"

export const getCart = async (req, res) => {
    try {
        const products = await Product.find({_id: {$in: req.user.cartItems}})
        // add quantity to product
        const cartItems = products.map(product => { 
            const items = req.user.cartItems.find(item => item.id === product.id)
            return {
                ...product.toJSON(), quantity: items.quantity}
            })
        res.json(cartItems)
 } catch (error) {
        console.log("Error in getCart controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const addToCart = async (req, res) => {
    try {
        const {productId} = req.body
        const user = req.user
        
        const existingItem = await user.cartItems.find(item => item.id === productId)
        if (existingItem){
            existingItem.quantity +=1
        }
        else {
            user.cartItems.push({ id:productId, quantity: 1})
        }
        await user.save()
        res.json(user.cartItems)
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: error.message })
        
    }
}

export const updateCart = async (req, res) => {
    try {
        const {id} = req.params
        const {quantity} = req.body
        const user = req.user
        const item = user.cartItems.find(item => item.id === id)
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
            }
        if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item => item.id !== id);
            } else {
                item.quantity = quantity;
            }
            await user.save();
            res.json(user.cartItems);
        }
    
    catch (error) {
        console.log("Error in updateCart controller", error.message);
        res.status(500).json({ message: error.message })
    }
}
export const deleteAllFromCart = async (req, res) => {
    try {
        const productId = req.body
        const user = req.user
        
        if (productId){
            user.cartItems = user.cartItems.filter(item => item.id !== productId);}
        else {
            user.cartItems = []
        }
        await user.save()
        res.json(user.cartItems)
    } catch (error) {
        console.log("Error in deleteAllFromCart controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

