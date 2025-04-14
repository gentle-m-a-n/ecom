import mongoose from 'mongoose';
import Product from '../models/product.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        if (products.length === 0) {
            console.log("No products found in the database.");
            return res.status(404).json({ message: "No products found" })}
        res.json(products)
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const addProducts = async (req, res) => {
    try {
        const {name, description,price, image, category, stockQuantity} = req.body
        
         
        const product = await Product.create({ name: name, 
            description: description, 
            price: price, 
            image: image || [] ,
            category: category,
            stockQuantity: stockQuantity || 0 })// add product to db
        res.json(product)

    } catch (error) {
        console.log("Error in addProducts controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const getFeatureProducts = async (req, res) => {
    try {
        
        const featureProduct = await Product.find({ featured: true }).lean()// find in db
        if (!featureProduct) {
            return res.status(404).json({ message: "No featured product found" })
        }
        res.json(featureProduct)

    } catch (error) {
        console.log("Error in getFeatureProducts controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const deleteProducts = async (req, res) => {
    try {

        const {id} = req.params
        console.log("Request params:", req.params)
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" })
          }
          
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        await Product.findByIdAndDelete(id)
    } catch (error) {
        console.log("Error in deleteProducts controller", error.message);
        res.status(500).json({ message: error.message })
    }
}
// get recommended product ( 5random)
export const getRecommendedProducts = async (req, res) => {
  try {
    const product = await Product.aggregate([
        { $sample: { size: 5 } },
        { $project: { _id: 1,name: 1,description:1, price: 1, image: 1, stockQuantity:1 }}])//get 5 random products
    res.json(product)
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: error.message })
  }
}

export const getProductByCategory = async (req, res) => {
    const category = req.params.category 
    try {
        const product = await Product.find({category: category}).lean()
        res.json(product)
    } catch (error) {
        console.log("Error in getProdductByCategory controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const searchProducts = async (req, res) => {
    try {
        const { query, inStock, minPrice, maxPrice } = req.query 
        const loc ={}
        //keyword search
        if (query) {
            loc.$or = [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        }
            //loc stock quantity    
            if (inStock === "true") {
                loc.stockQuantity = {$gte: 1}
            }

            //loc price range
            if (minPrice || maxPrice) {
                loc.price = {}
                if (minPrice) {
                    loc.price.$gte = parseFloat(minPrice)
                }
                if (maxPrice) {
                    loc.price.$lte = parseFloat (maxPrice)
                }
            }
    
        const products = await Product.find(loc).lean()
        console.log(loc)
        if (products.length === 0) {
            return res.status(404).json({ message: "kaka, no products found matching your search" });
        }

        res.json(products)
    } catch (error) {
        console.error("Error in searchProducts controller:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}