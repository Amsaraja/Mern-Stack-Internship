import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  
  useEffect(()=>{
    if(products.length > 0){
      const tempData = [];
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item] > 0){
            tempData.push({
              _id: items,
              size : item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <Title text1={'YOUR'} text2={'CART'}/>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Review your selected items and proceed to checkout
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {cartData.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <button 
              onClick={() => navigate('/collection')} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <h2 className="text-white font-bold text-xl flex items-center gap-2">
                    <span>🛍️</span> Shopping Cart ({cartData.length} items)
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {cartData.map((item, index) => {
                    const productData = products.find((product)=> product._id === item._id);
                    return (
                      <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                          {/* Product Image & Info */}
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-md">
                              <img src={productData.images[0]} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 mb-2">{productData.name}</h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                  {currency}{productData.price.toLocaleString()}
                                </span>
                                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                                  Size: {item.size}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-gray-600">Qty:</label>
                              <input 
                                onChange={(e)=> e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} 
                                className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                type="number" 
                                min='1' 
                                defaultValue={item.quantity} 
                              />
                            </div>
                            <button 
                              onClick={()=> updateQuantity(item._id, item.size, 0)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <img src={assets.bin_icon} className="w-4 h-4" alt="Remove" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                  <h2 className="text-white font-bold text-xl flex items-center gap-2">
                    <span>💳</span> Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  <CartTotal/>
                  <button 
                    onClick={()=> navigate('/place-order')} 
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-6"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button 
                    onClick={() => navigate('/collection')} 
                    className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-300 mt-3"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart;
