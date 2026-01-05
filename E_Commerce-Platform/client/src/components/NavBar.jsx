import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
    const [visible, setVisible] = useState(false);
    const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = useContext(ShopContext);
    const logout = () => {
      navigate('/login')
      localStorage.removeItem('token')
      setToken('')
      setCartItems({})
    }
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 font-medium max-w-7xl mx-auto">
        {/* Logo */}
        <Link to='/' className="flex items-center">
          <img src={assets.logo} className="w-32 sm:w-36 hover:opacity-80 transition-opacity" alt="Logo" />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8 text-sm text-gray-700">
          <li>
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all hover:text-blue-600 hover:bg-blue-50 ${
                  isActive ? 'text-blue-600 bg-blue-50' : ''
                }`
              }
            >
              <p className="font-medium">HOME</p>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/collection" 
              className={({isActive}) => 
                `flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all hover:text-blue-600 hover:bg-blue-50 ${
                  isActive ? 'text-blue-600 bg-blue-50' : ''
                }`
              }
            >
              <p className="font-medium">COLLECTION</p>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({isActive}) => 
                `flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all hover:text-blue-600 hover:bg-blue-50 ${
                  isActive ? 'text-blue-600 bg-blue-50' : ''
                }`
              }
            >
              <p className="font-medium">ABOUT</p>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contact" 
              className={({isActive}) => 
                `flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all hover:text-blue-600 hover:bg-blue-50 ${
                  isActive ? 'text-blue-600 bg-blue-50' : ''
                }`
              }
            >
              <p className="font-medium">CONTACT</p>
            </NavLink>
          </li>
        </ul>

        {/* Profile and Cart */}
        <div className="flex items-center gap-4">
          <div className="group relative">
            <button 
              onClick={() => token ? null : navigate('/login')} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Profile"
            >
              <img src={assets.profile_icon} className="w-5" alt="Profile" />
            </button>
            {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2">
                <div className="flex flex-col gap-1 w-40 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    👤 My Profile
                  </button>
                  <button 
                    onClick={() => navigate('/orders')} 
                    className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    📦 Orders
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button 
                    onClick={logout} 
                    className="text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <img src={assets.cart_icon} className="w-5" alt="Cart" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-center leading-5 bg-blue-600 text-white text-xs rounded-full font-medium">
                {getCartCount()}
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setVisible(true)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
            aria-label="Menu"
          >
            <img src={assets.menu_icon} className="w-5" alt="Menu" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 bottom-0 bg-white z-50 transition-all duration-300 ${visible ? 'w-full sm:w-80' : 'w-0'} overflow-hidden`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button 
              onClick={() => setVisible(false)} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Close" />
            </button>
          </div>
          <div className="flex-1 py-4">
            <NavLink 
              onClick={() => setVisible(false)} 
              className={({isActive}) => 
                `block py-3 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`
              }
              to="/"
            >
              🏠 HOME
            </NavLink>
            <NavLink 
              onClick={() => setVisible(false)} 
              className={({isActive}) => 
                `block py-3 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`
              }
              to="/collection"
            >
              🛍️ COLLECTION
            </NavLink>
            <NavLink 
              onClick={() => setVisible(false)} 
              className={({isActive}) => 
                `block py-3 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`
              }
              to="/about"
            >
              ℹ️ ABOUT
            </NavLink>
            <NavLink 
              onClick={() => setVisible(false)} 
              className={({isActive}) => 
                `block py-3 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`
              }
              to="/contact"
            >
              📞 CONTACT
            </NavLink>
            
            {token && (
              <>
                <hr className="my-4 mx-6 border-gray-200" />
                <button 
                  onClick={() => {navigate('/profile'); setVisible(false);}} 
                  className="block w-full text-left py-3 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  👤 My Profile
                </button>
                <button 
                  onClick={() => {navigate('/orders'); setVisible(false);}} 
                  className="block w-full text-left py-3 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  📦 Orders
                </button>
                <button 
                  onClick={() => {logout(); setVisible(false);}} 
                  className="block w-full text-left py-3 px-6 text-red-600 hover:bg-red-50 transition-colors"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      {visible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setVisible(false)}
        ></div>
      )}
    </div>
  );
};

export default NavBar;
