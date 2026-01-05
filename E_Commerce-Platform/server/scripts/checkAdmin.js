import mongoose from 'mongoose';
import { adminModel } from '../models/adminModel.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const admins = await adminModel.find({});
        console.log('Total admins found:', admins.length);
        
        if (admins.length > 0) {
            admins.forEach(admin => {
                console.log('Admin:', {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                });
            });
        } else {
            console.log('No admins found in database');
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
};

checkAdmin();