import { adminModel, bannerModel, categoryModel } from "../models/adminModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// Get all admins
const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find().select('-password');
        console.log('Found admins:', admins.length);
        res.json({ success: true, admins, count: admins.length });
    } catch (error) {
        console.log('Error getting admins:', error);
        res.json({ success: false, message: error.message });
    }
};

// Create new admin user
const createAdmin = async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;
        
        const exists = await adminModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Admin already exists" });
        }
        
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newAdmin = new adminModel({
            name,
            email,
            password: hashedPassword,
            permissions: permissions || {
                banners: true,
                categories: true,
                products: true,
                orders: true
            }
        });
        
        await newAdmin.save();
        res.json({ success: true, message: "Admin created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Admin login attempt:', email);
        
        const admin = await adminModel.findOne({ email });
        console.log('Admin found:', admin ? 'Yes' : 'No');
        
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('Password match:', isMatch);
        
        if (isMatch) {
            const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log('Login error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Create banner
const createBanner = async (req, res) => {
    try {
        const { title, image, link } = req.body;
        const banner = new bannerModel({
            title,
            image,
            link,
            createdBy: req.admin.id
        });
        await banner.save();
        res.json({ success: true, message: "Banner created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all banners
const getBanners = async (req, res) => {
    try {
        const banners = await bannerModel.find().populate('createdBy', 'name email');
        res.json({ success: true, banners });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create category
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const category = new categoryModel({
            name,
            description,
            image,
            createdBy: req.admin.id
        });
        await category.save();
        res.json({ success: true, message: "Category created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find().populate('createdBy', 'name email');
        res.json({ success: true, categories });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get dashboard stats
const getStats = async (req, res) => {
    try {
        const totalProducts = await productModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();
        const pendingOrders = await orderModel.countDocuments({ status: { $in: ['Order Placed', 'Packing', 'Shipped'] } });
        
        const revenueData = await orderModel.aggregate([
            { $match: { payment: true } },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]);
        
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        
        res.json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                pendingOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.log('Error getting stats:', error);
        res.json({ success: false, message: error.message });
    }
};

export { getAdmins, createAdmin, adminLogin, createBanner, getBanners, createCategory, getCategories, getStats };