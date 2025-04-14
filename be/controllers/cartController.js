import Product from "../models/product.js"


export const getCart = async (req, res) => {
    try {
        const productIds = req.user.cartItems.map(item => item.product)

        const products = await Product.find({_id: {$in: productIds}})
        // add quantity to product
        const cartItems = products.map(product => { 
            const items = req.user.cartItems.find(item => item.product.toString() === product.id)
            return {
                ...product.toJSON(), quantity: items.quantity}
            })
        res.json(cartItems)
        console.log("cart items", cartItems)
 } catch (error) {
        console.log("Error in getCart controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const addToCart = async (req, res) => {
    try {
        const {productId} = req.body
        const user = req.user
        
        //check stock quantity
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stockQuantity <= 0) {
            return res.status(400).json({ message: "Product is out of stock" });
        }

        const existingItem = user.cartItems.find(item => item.product.toString() === productId)
        if (existingItem){
            // Check if adding more than product stock
            if (existingItem.quantity + 1 > product.stockQuantity) {
                return res.status(400).json({ message: "Not enough stock available" });
            }
            else {existingItem.quantity +=1}
        }
        else {
            user.cartItems.push({product: productId})
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
        const item = user.cartItems.find(item => item.product.toString() === id)
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" })
            }
         // Check if product exists in db
         const checkProduct = await Product.findById(id);
         if (!checkProduct) {
             return res.status(404).json({ message: "Product not found" });
         }
        // Check if product out of stock
         if (checkProduct.stockQuantity === 0) {
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== id);
            await user.save();
            return res.status(200).json({
                message: `Product ${checkProduct.name} is out of stock`,
                cartItems: user.cartItems
            });
        }
         // Check if requested quantity exceeds available stock
         if (quantity > checkProduct.stockQuantity) {
             return res.status(400).json({
                 message: `Not enough stock available for product: ${checkProduct.name}`
             })
         }
         
         //update quantity or remove it from cart
         if (quantity > 0) {
            item.quantity = quantity    
            } 
        else {
            user.cartItems = user.cartItems.filter(item => item.product !== id)
            }
            await user.save()
            res.json(user.cartItems)
        }
    
    catch (error) {
        console.log("Error in updateCart controller", error.message);
        res.status(500).json({ message: error.message })
    }
}


export const deleteAllFromCart = async (req, res) => {
    try {
        const {productId} = req.body
        const user = req.user
        
        if (productId){
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);}
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

