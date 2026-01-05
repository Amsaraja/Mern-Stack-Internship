import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {assets} from '../assets/assets'
import { backendUrl } from '../App'
import axios from 'axios'

const Sidebar = () => {
  const [stats, setStats] = useState({
    totalProducts: '--',
    pendingOrders: '--',
    totalRevenue: '--'
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${backendUrl}/api/admin/stats`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setStats({
          totalProducts: response.data.stats.totalProducts,
          pendingOrders: response.data.stats.pendingOrders,
          totalRevenue: `₹${response.data.stats.totalRevenue.toLocaleString()}`
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  const menuItems = [
    { path: '/admin/add', icon: assets.add_icon, label: 'Add Items', emoji: '➕' },
    { path: '/admin/list', icon: assets.order_icon, label: 'List Items', emoji: '📜' },
    { path: '/admin/orders', icon: assets.order_icon, label: 'Orders', emoji: '📦' }
  ];

  return (
    <div className='w-80 bg-white shadow-xl border-r border-gray-200'>
      <div className='p-6'>
        <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
          <span>🛠️</span> Admin Panel
        </h2>
        
        <div className='space-y-3'>
          {menuItems.map((item, index) => (
            <NavLink 
              key={index}
              className={({isActive}) => 
                `flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
                }`
              }
              to={item.path}
            >
              <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 group-hover:bg-white/30'>
                <span className='text-xl'>{item.emoji}</span>
              </div>
              <div>
                <p className='font-semibold'>{item.label}</p>
                <p className='text-xs opacity-75'>Manage {item.label.toLowerCase()}</p>
              </div>
            </NavLink>
          ))}
        </div>
        
        <div className='mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200'>
          <div className='flex items-center gap-3 mb-2'>
            <span className='text-2xl'>📊</span>
            <h3 className='font-semibold text-gray-800'>Quick Stats</h3>
          </div>
          <div className='space-y-2 text-sm text-gray-600'>
            <div className='flex justify-between'>
              <span>Total Products:</span>
              <span className='font-semibold'>{stats.totalProducts}</span>
            </div>
            <div className='flex justify-between'>
              <span>Pending Orders:</span>
              <span className='font-semibold'>{stats.pendingOrders}</span>
            </div>
            <div className='flex justify-between'>
              <span>Revenue:</span>
              <span className='font-semibold'>{stats.totalRevenue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
