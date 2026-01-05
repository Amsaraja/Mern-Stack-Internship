import React from 'react'
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <Title text1={'ABOUT'} text2={'US'}/>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover the story behind SmartBuy - where innovation meets convenience in the world of e-commerce
          </p>
        </div>
      </div>
      
      {/* Story Timeline */}
      <div className="container mx-auto px-4 py-16">
        {/* Our Story Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img className="w-full h-64 md:h-full object-cover" src={assets.about_img} alt="About SmartBuy" />
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🚀</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Our Journey</h2>
                </div>
                <div className="space-y-6 text-gray-600">
                  <p className="leading-relaxed">
                    SmartBuy was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a comprehensive marketplace where customers can easily discover, explore, and purchase everything they need from the comfort of their homes.
                  </p>
                  <p className="leading-relaxed">
                    Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products across 17+ categories. From cutting-edge electronics and home essentials to fashion, beauty, books, and beyond - we offer an extensive collection sourced from trusted brands and suppliers worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16 border border-indigo-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🎯</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Our mission at SmartBuy is to create the ultimate shopping destination that combines the convenience of online shopping with the variety and quality you'd expect from the world's leading marketplace. We're dedicated to providing a seamless experience that exceeds expectations at every step.
              </p>
            </div>
          </div>
          
          {/* Why Choose Us Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✨</span>
                </div>
                <Title text1={'WHY'} text2={'CHOOSE US'}/>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover what makes SmartBuy the preferred choice for millions of customers worldwide
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Vast Product Selection</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Browse through 17+ categories including Electronics, Home & Kitchen, Fashion, Beauty, Books, Sports, and much more - all in one place.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">💰</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Competitive Pricing</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  From budget-friendly options starting at ₹699 to premium products, we offer competitive prices across all categories with regular deals and discounts.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Smart Shopping Features</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Advanced filtering, sorting options, bestseller recommendations, and personalized suggestions make finding the perfect product effortless.
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 mb-16 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">SmartBuy by Numbers</h2>
              <p className="text-gray-300">Our achievements speak for themselves</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">17+</div>
                <div className="text-gray-300">Categories</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">1M+</div>
                <div className="text-gray-300">Products</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">500K+</div>
                <div className="text-gray-300">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
                <div className="text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 py-16">
        <div className="container mx-auto px-4">
          <NewsletterBox/>
        </div>
      </div>
    </div>
  )
}

export default About;
