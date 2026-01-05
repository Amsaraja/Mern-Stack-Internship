import React, { useState } from 'react'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!email) return;
        
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubscribed(true);
            toast.success('Successfully subscribed to newsletter!');
            setEmail('');
            
            // Reset subscribed state after 3 seconds
            setTimeout(() => {
                setSubscribed(false);
            }, 3000);
        }, 1000);
    }
    
    return (
        <div className='text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100'>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                <span className="text-white text-2xl">📧</span>
            </div>
            <p className='text-2xl font-bold text-gray-800 mb-2'>Stay Updated with Latest Deals</p>
            <p className='text-gray-600 mb-6 max-w-md mx-auto'>Get exclusive offers, new arrivals, and special discounts delivered to your inbox.</p>
            
            {subscribed ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-md mx-auto">
                    <div className="text-4xl mb-2">✅</div>
                    <h3 className="text-lg font-semibold text-green-800 mb-1">Successfully Subscribed!</h3>
                    <p className="text-green-600 text-sm">Thank you for joining our newsletter. Check your inbox for confirmation.</p>
                </div>
            ) : (
                <form onSubmit={onSubmitHandler} className='max-w-md mx-auto'>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <input 
                            className='flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
                            type="email" 
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button 
                            className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none' 
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Subscribing...
                                </div>
                            ) : (
                                'SUBSCRIBE'
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">We respect your privacy. Unsubscribe at any time.</p>
                </form>
            )}
        </div>
    )
}

export default NewsletterBox;
