import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { adminModel } from '../models/adminModel.js';
import dotenv from 'dotenv';

dotenv.config();

const createFirstAdmin = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        
        const adminExists = await adminModel.findOne({});
        if (adminExists) {
            console.log('Admin already exists:', adminExists.email);
            await adminModel.deleteMany({});
            console.log('Deleted existing admins, creating new one...');
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const firstAdmin = new adminModel({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            permissions: {
                banners: true,
                categories: true,
                products: true,
                orders: true
            }
        });
        
        await firstAdmin.save();
        console.log('First admin created successfully');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        mongoose.connection.close();
    }
};

createFirstAdmin();