import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
  });
  

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, discountPercentage } = req.body;

        // ✅ Handle case when no images are uploaded
        let imagesUrl = [];
        
        if (req.files && Object.keys(req.files).length > 0) {
            // ✅ Extract images safely
            const image1 = req.files.image1?.[0];
            const image2 = req.files.image2?.[0];
            const image3 = req.files.image3?.[0];
            const image4 = req.files.image4?.[0];

            const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

            try {
                // ✅ Upload images to Cloudinary
                imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                        return result.secure_url;
                    })
                );
            } catch (cloudinaryError) {
                console.log('Cloudinary error:', cloudinaryError);
                // Use placeholder images if Cloudinary fails
                imagesUrl = [
                    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
                    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
                ];
            }
        } else {
            // Use default placeholder images
            imagesUrl = [
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
            ];
        }

        // ✅ Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            discountPercentage: Number(discountPercentage) || 0,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true:false,
            images: imagesUrl,
            date: Date.now(),
        };

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: "Product Added" });

    } 
    catch (error){
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

// function for list product
const listProducts = async (req, res) => {
    try{
        const products = await productModel.find({});
        res.json({success:true, products})
    }
    catch (error){
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product removed"})
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    }
    catch (error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// function for update product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, bestseller, discountPercentage } = req.body;
        
        const updateData = {
            name,
            description,
            price: Number(price),
            discountPercentage: Number(discountPercentage) || 0,
            category,
            subCategory,
            sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes),
            bestseller: bestseller === "true" || bestseller === true
        };

        const product = await productModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }