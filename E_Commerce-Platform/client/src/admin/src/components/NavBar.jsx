import React from 'react'
import {assets} from '../assets/assets'

const NavBar = ({setToken}) => {
  return (
    <div className='bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl'>
      <div className='flex items-center py-4 px-8 justify-between'>
        <div className='flex items-center gap-4'>
          <img className='w-12 h-12 rounded-xl' src={assets.logo} alt="" />
          <div>
            <h1 className='text-white font-bold text-xl'>SmartBuy Admin</h1>
            <p className='text-gray-300 text-sm'>Management Dashboard</p>
          </div>
        </div>
        <button 
          onClick={()=>setToken('')} 
          className='bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg'
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default NavBar
