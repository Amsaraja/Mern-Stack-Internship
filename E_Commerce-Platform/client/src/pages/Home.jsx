import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section with Modern Overlay */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 z-10"></div>
        <Hero/>
      </div>
      
      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-16">
        {/* Latest Collection Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Latest Collection</h2>
          </div>
          <LatestCollection/>
        </div>
        
        {/* Best Seller Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🏆</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Best Sellers</h2>
          </div>
          <BestSeller/>
        </div>
        
        {/* Policy Section Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl shadow-xl p-8 mb-12 border border-indigo-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🛡️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Policies</h2>
          </div>
          <OurPolicy/>
        </div>
        
        {/* Newsletter Card */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl shadow-xl p-8 border border-orange-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">📧</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Stay Updated</h2>
          </div>
          <NewsletterBox/>
        </div>
      </div>
    </div>
  )
}

export default Home;
