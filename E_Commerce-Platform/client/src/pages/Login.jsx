import React, { useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState]= useState('Sign Up');
  const {token, setToken, navigate, backendUrl} = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try{
      if(currentState === 'Sign Up'){
        const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})
        if(response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success('Account created successfully!')
        }
        else{
          toast.error(response.data.message)
        }
      }
      else{
        const response = await axios.post(backendUrl + '/api/user/login', {email, password})
        if(response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success('Login successful!')
        }
        else{
          toast.error(response.data.message)
        }
      }
    }
    catch (error){
      console.log(error);
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(()=>{
    if(token){
      navigate('/')
    }
  })
  
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-2">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">SmartBuy</h1>
          <p className="text-gray-600 text-sm">
            {currentState === 'Login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{currentState}</h2>
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
          </div>
          
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {currentState === 'Sign Up' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input 
                  onChange={(e)=>setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                  placeholder="Enter your full name" 
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input 
                onChange={(e)=>setEmail(e.target.value)} 
                value={email} 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                placeholder="Enter your email" 
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <input 
                onChange={(e)=>setPassword(e.target.value)} 
                value={password} 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
                placeholder="Enter your password" 
                required
              />
            </div>
            
            {currentState === 'Login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Forgot password?
                </button>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                currentState === 'Login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
          
          {/* Toggle Login/Signup */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              {currentState === 'Login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={()=> setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')} 
                className="ml-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                {currentState === 'Login' ? 'Create account' : 'Sign in here'}
              </button>
            </p>
          </div>
          
          {/* Admin Login Link */}
          <div className="mt-3 pt-3 border-t border-gray-200 text-center">
            <button 
              onClick={() => window.location.href = '/admin'} 
              className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center gap-1 mx-auto"
            >
              <span>🔒</span> Admin Login
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-3 text-xs text-gray-500">
          <p>By continuing, you agree to our Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default Login;
