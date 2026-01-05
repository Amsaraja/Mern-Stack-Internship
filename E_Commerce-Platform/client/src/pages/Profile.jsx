import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { token, backendUrl, navigate, getCartCount, getCartAmount } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0
  });

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } });
      if (response.data.success) {
        setUserData(response.data.user);
        // Calculate order stats (mock data for now)
        setOrderStats({
          totalOrders: Math.floor(Math.random() * 20) + 1,
          totalSpent: (Math.random() * 2000 + 100).toFixed(2)
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return (
      <div className='text-center py-20'>
        <p className='text-xl text-gray-600'>Please login to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='text-center py-20'>
        <p className='text-xl text-gray-600'>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='text-center py-20'>
        <p className='text-xl text-gray-600'>Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <Title text1={'MY'} text2={'PROFILE'} />
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Manage your account information and preferences
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <h2 className="text-white font-bold text-xl flex items-center gap-2">
                    <span>👤</span> Account Information
                  </h2>
                </div>
                
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-900 font-medium">{userData.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-900 font-medium">{userData.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Member Since</label>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-900 font-medium">{new Date(userData.date || userData.createdAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Account Status</label>
                      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <p className="text-green-700 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button 
                      onClick={() => navigate('/edit-profile')} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Account Stats */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>📊</span> Account Summary
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Total Orders</span>
                    <span className="font-bold text-lg text-gray-800">{orderStats.totalOrders}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Total Spent</span>
                    <span className="font-bold text-lg text-green-600">₹{orderStats.totalSpent}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Cart Items</span>
                    <span className="font-bold text-lg text-blue-600">{getCartCount()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Cart Value</span>
                    <span className="font-bold text-lg text-purple-600">₹{getCartAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>⚡</span> Quick Actions
                  </h3>
                </div>
                
                <div className="p-6 space-y-2">
                  {[
                    { label: 'View Order History', icon: '📜', action: () => navigate('/orders') },
                    { label: 'Track Current Orders', icon: '🚚', action: () => navigate('/orders') },
                    { label: 'View Shopping Cart', icon: '🛍️', action: () => navigate('/cart') },
                    { label: 'Update Password', icon: '🔒', action: () => navigate('/change-password') },
                    { label: 'Manage Addresses', icon: '📍', action: () => navigate('/manage-addresses') }
                  ].map((item, index) => (
                    <button 
                      key={index}
                      onClick={item.action} 
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-left transition-colors group"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;