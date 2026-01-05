import express from 'express';
import { getAdmins, createAdmin, adminLogin, createBanner, getBanners, createCategory, getCategories, getStats } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRoute = express.Router();

adminRoute.get('/list', adminAuth, getAdmins);
adminRoute.post('/create', createAdmin);
adminRoute.post('/login', adminLogin);
adminRoute.get('/stats', adminAuth, getStats);
adminRoute.post('/banner', adminAuth, createBanner);
adminRoute.get('/banners', adminAuth, getBanners);
adminRoute.post('/category', adminAuth, createCategory);
adminRoute.get('/categories', adminAuth, getCategories);

export default adminRoute;