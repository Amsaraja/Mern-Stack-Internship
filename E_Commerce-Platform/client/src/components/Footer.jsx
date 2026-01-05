import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>SmartBuy is your ultimate shopping destination offering millions of products across 17+ categories. From electronics to fashion, we deliver quality and convenience to your doorstep.</p>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li><Link to='/' className='hover:text-black cursor-pointer'>Home</Link></li>
                <li><Link to='/about' className='hover:text-black cursor-pointer'>About us</Link></li>
                <li><Link to='/contact' className='hover:text-black cursor-pointer'>Contact</Link></li>
                <li><Link to='/collection' className='hover:text-black cursor-pointer'>Products</Link></li>
            </ul>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91-44-2234-5678</li>
                <li>support@smartbuy.com</li>
                <li>Chennai, Tamil Nadu</li>
            </ul>
        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ smartbuy.com - All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer;
