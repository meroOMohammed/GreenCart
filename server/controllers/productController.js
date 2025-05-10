import {v2 as cloudinary} from "cloudinary"
import Product from "../models/Product.js" 

// Add product: /api/product/add
export const addProduct = async (req, res) => {
  const productData = JSON.parse(req.body.productData);
  const images = req.files;

  if (!images || images.length === 0) {
    return res.status(400).json({ success: false, message: "No images uploaded" });
  }

  const imagesUrl = [];

  for (const item of images) {
    try {
      const result = await cloudinary.uploader.upload(item.path, {
        resource_type: "image",
      });
      imagesUrl.push(result.secure_url);
    } catch (err) {
      console.error("Cloudinary error:", err.message);

      // Send error and stop — return before anything else is sent
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed: " + err.message,
        });
      }
      return;
    }
  }

  try {
    await Product.create({ ...productData, image: imagesUrl });

    if (!res.headersSent) {
      return res.status(201).json({ success: true, message: "Product Added" });
    }
  } catch (error) {
    console.error("DB error:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};


  

// Get product : /api/product/list
export const productList = async(req, res)=> {
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get single product : /api/product/id
export const productById = async(req, res)=> {
    try {
        const {id} = req.body
        const product = await Product.findById(id)
        res.json({success: true, product})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Change product inStock: /api/product/stock
export const changeStock = async(req, res)=> {
    try {
        const {id, inStock }= req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
