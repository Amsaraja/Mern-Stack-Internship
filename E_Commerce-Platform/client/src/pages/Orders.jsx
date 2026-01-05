import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const {backendUrl, token, currency} = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try{
      if(!token){
        return null
      }
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, {headers: {token}})
      if(response.data.success){
        let allOrderItems = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order._id
            allOrderItems.push(item)
          })
        })
        setOrderData(allOrderItems.reverse())
      }
    }
    catch(error){
      console.log(error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false);
    }
  }

  const trackOrder = async (orderId) => {
    try {
      await loadOrderData();
      toast.success('Order status refreshed!');
    } catch (error) {
      toast.error('Failed to track order');
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Placed': return 'bg-yellow-500';
      case 'Packing': return 'bg-blue-500';
      case 'Shipped': return 'bg-purple-500';
      case 'Out for delivery': return 'bg-orange-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'Order Placed': return 'bg-yellow-100 text-yellow-800';
      case 'Packing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Out for delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  useEffect(()=>{
    loadOrderData()
  }, [token])

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h3>
          <p className="text-gray-600">Please login to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <Title text1={'MY'} text2={'ORDERS'}/>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Track and manage all your orders in one place
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">⏳</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Orders...</h3>
            <p className="text-gray-600">Please wait while we fetch your order history</p>
          </div>
        ) : orderData.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Orders Found</h3>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button 
              onClick={() => window.location.href = '/collection'} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orderData.map((item, index)=>(
              <div key={index} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                        <img className="w-full h-full object-cover" src={item.images[0]} alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">{item.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <span className="text-blue-600 font-medium">Price</span>
                            <p className="font-bold text-blue-800">{currency}{item.price}</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded-lg">
                            <span className="text-green-600 font-medium">Quantity</span>
                            <p className="font-bold text-green-800">{item.quantity}</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded-lg">
                            <span className="text-purple-600 font-medium">Size</span>
                            <p className="font-bold text-purple-800">{item.size}</p>
                          </div>
                          <div className="bg-orange-50 p-2 rounded-lg">
                            <span className="text-orange-600 font-medium">Payment</span>
                            <p className="font-bold text-orange-800 text-xs">{item.paymentMethod}</p>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="font-medium">Order Date:</span> {new Date(item.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:w-64">
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                            <span className="font-semibold text-gray-700">Order Status</span>
                          </div>
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(item.status)}`}>
                            {item.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => trackOrder(item.orderId)} 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-sm"
                        >
                          🔄 Track Order
                        </button>
                        <div className="text-xs text-gray-500 text-center">
                          Order ID: {item.orderId.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders;
