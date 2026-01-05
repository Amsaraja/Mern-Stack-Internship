import React, { useState } from 'react'
import axios from 'axios';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Login = ({setToken}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const onSubmitHandler = async (e) =>{
        try{
            e.preventDefault();
            setLoading(true);
            const response = await axios.post(backendUrl + '/api/admin/login', {email, password})
            if(response.data.success){
                setToken(response.data.token);
                toast.success('Admin login successful!');
            }
            else{
                toast.error(response.data.message)
            }
        }
        catch (error){
            console.log(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className='h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-hidden'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3 shadow-2xl">
                        <span className="text-white text-xl font-bold">🔒</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Portal</h1>
                    <p className="text-gray-600 text-sm">SmartBuy Management</p>
                </div>
                
                {/* Login Card */}
                <div className='bg-white rounded-2xl shadow-2xl border border-gray-100 p-6'>
                    <div className="text-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-1">Administrator Login</h2>
                        <div className="w-10 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
                    </div>
                    
                    <form onSubmit={onSubmitHandler} className="space-y-4">
                        <div>
                            <label className='block text-xs font-semibold text-gray-700 mb-1'>Email Address</label>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-sm' 
                                type="email" 
                                placeholder='admin@smartbuy.com' 
                                required
                            />
                        </div>
                        
                        <div>
                            <label className='block text-xs font-semibold text-gray-700 mb-1'>Password</label>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-sm' 
                                type="password" 
                                placeholder='Enter admin password' 
                                required 
                            />
                        </div>
                        
                        <button 
                            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none' 
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Authenticating...
                                </div>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <span>🔑</span> Access Dashboard
                                </span>
                            )}
                        </button>
                    </form>
                </div>
                
                {/* Footer */}
                <div className="text-center mt-4">
                    <button 
                        onClick={() => window.location.href = '/login'} 
                        className="text-gray-500 hover:text-gray-700 text-xs font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
                    >
                        <span>←</span> Back to Customer Login
                    </button>
                </div>
                
                <div className="text-center mt-2 text-xs text-gray-400">
                    <p>Secure admin access • SmartBuy &copy; 2024</p>
                </div>
            </div>
        </div>
    )
}

export default Login
