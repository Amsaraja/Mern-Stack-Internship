import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      Object.keys(cartItems).forEach((itemId) => {
        Object.keys(cartItems[itemId]).forEach((size) => {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === itemId));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        });
      });
      console.log(formData);
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;
        
        case 'razorpay':
          const razorpayResponse = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } });
          if (razorpayResponse.data.success) {
            setCartItems({});
            navigate('/orders');
            toast.success('Order placed successfully with Razorpay!');
          } else {
            toast.error(razorpayResponse.data.message);
          }
          break;
          
        default:
          toast.error('Please select a payment method');
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <Title text1={'CHECKOUT'} text2={'ORDER'}/>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Complete your order with secure payment and delivery options
          </p>
        </div>
      </div>
      
      <form onSubmit={onSubmitHandler} className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Delivery Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <h2 className="text-white font-bold text-xl flex items-center gap-2">
                    <span>🚚</span> Delivery Information
                  </h2>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input 
                        required 
                        onChange={onChangeHandler} 
                        name='firstName' 
                        value={formData.firstName} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        type="text" 
                        placeholder='Enter first name' 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input 
                        required 
                        onChange={onChangeHandler} 
                        name='lastName' 
                        value={formData.lastName} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        type="text" 
                        placeholder='Enter last name' 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input 
                      required 
                      onChange={onChangeHandler} 
                      name='email' 
                      value={formData.email} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                      type="email" 
                      placeholder='Enter email address' 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                    <input 
                      required 
                      onChange={onChangeHandler} 
                      name='street' 
                      value={formData.street} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                      type="text" 
                      placeholder='Enter street address' 
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input 
                        required 
                        onChange={onChangeHandler} 
                        name='city' 
                        value={formData.city} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        type="text" 
                        placeholder='Enter city' 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                      <input 
                        required 
                        onChange={onChangeHandler} 
                        name='state' 
                        value={formData.state} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        type="text" 
                        placeholder='Enter state' 
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code *</label>
                      <input 
                        required 
                        onChange={onChangeHandler} 
                        name='zipcode' 
                        value={formData.zipcode} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        type="number" 
                        placeholder='Enter zip code' 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                      <input 
                        required 
                        onChange={onChangeHandler} 
                        name='country' 
                        value={formData.country} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        type="text" 
                        placeholder='Enter country' 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input 
                      required 
                      onChange={onChangeHandler} 
                      name='phone' 
                      value={formData.phone} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                      type="number" 
                      placeholder='Enter phone number' 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary & Payment */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>💳</span> Order Summary
                  </h3>
                </div>
                
                <div className="p-6">
                  <CartTotal />
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>💳</span> Payment Method
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div 
                    onClick={() => setMethod('stripe')} 
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      method === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      method === 'stripe' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                    <img className="h-6" src={assets.stripe_logo} alt="Stripe" />
                    <span className="font-medium text-gray-700">Credit/Debit Card</span>
                  </div>
                  
                  <div 
                    onClick={() => setMethod('razorpay')} 
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      method === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      method === 'razorpay' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                    <img className="h-6" src={assets.razorpay_logo} alt="Razorpay" />
                    <span className="font-medium text-gray-700">Razorpay</span>
                  </div>
                  
                  <div 
                    onClick={() => setMethod('cod')} 
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      method === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      method === 'cod' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                    <span className="font-medium text-gray-700 ml-2">Cash on Delivery</span>
                  </div>
                  
                  <button 
                    type='submit' 
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-6"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
