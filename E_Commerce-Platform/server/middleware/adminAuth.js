import jwt from 'jsonwebtoken'
import { adminModel } from '../models/adminModel.js'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token){
            return res.json({success : false, message: "Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (token_decode.role !== 'admin') {
            return res.json({ success: false, message: 'Not Authorized' });
        }
        const admin = await adminModel.findById(token_decode.id);
        if (!admin) {
            return res.json({ success: false, message: 'Admin not found' });
        }
        req.admin = { id: token_decode.id, permissions: admin.permissions };
        next()
    }
    catch (error){
        console.log(error)
        res.json({ success: false, message: error.message})
    }
}

export default adminAuth