
import Product from '../models/product.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const addProducts = async (req, res) => {
    try {
        const {name, description,price, image, category, stockQuantity} = req.body
        
         
        const product = await Product.create({ name, 
            description, 
            price, 
            image: image || "" ,
            category,
            stockQuantity })// add product to db
        res.json(product)

    } catch (error) {
        console.log("Error in addProducts controller", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const getFeatureProducts = async (req, res) => {
    try {
        
        const featuredProduct = await Product.find({ featured: true }).lean()// find in db
        if (!featuredProduct) {
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
        const id = req.params.id
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
        { $project: { _id: 1,name: 1,description:1, price: 1, image: 1 }}])//get 5 random products
    res.json(product)
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: error.message })
  }
}

export const getProductByCategory = async (req, res) => {
    const {category} = req.params.category 
    try {
        const product = await Product.find({category}).lean()
        res.json(product)
    } catch (error) {
        console.log("Error in getProdductByCategory controller", error.message);
        res.status(500).json({ message: error.message })
    }
}
