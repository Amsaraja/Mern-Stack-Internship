import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    permissions: {
        banners: { type: Boolean, default: true },
        categories: { type: Boolean, default: true },
        products: { type: Boolean, default: true },
        orders: { type: Boolean, default: true }
    }
}, { timestamps: true });

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true }
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true }
}, { timestamps: true });

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema);
const bannerModel = mongoose.models.banner || mongoose.model('banner', bannerSchema);
const categoryModel = mongoose.models.category || mongoose.model('category', categorySchema);

export { adminModel, bannerModel, categoryModel };