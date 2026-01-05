import React, { useState } from 'react'
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import { assets } from '../assets/assets';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <Title text1={'CONTACT'} text2={'US'}/>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with our team for any questions or support.
          </p>
        </div>
      </div>
      
      {/* Main Contact Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="lg:flex">
              {/* Contact Information Side */}
              <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 text-white">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
                    
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                      {/* Customer Service */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📞</span>
                          </div>
                          <h3 className="text-xl font-semibold">Customer Service</h3>
                        </div>
                        <div className="space-y-2 text-white/90">
                          <p className="font-medium">SmartBuy Technologies Pvt Ltd</p>
                          <p>No. 123, Anna Salai, Nandanam</p>
                          <p>Chennai, Tamil Nadu 600035, India</p>
                        </div>
                      </div>
                      
                      {/* Contact Details */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📧</span>
                          </div>
                          <h3 className="text-xl font-semibold">Contact Details</h3>
                        </div>
                        <div className="space-y-2 text-white/90">
                          <p>Tel: +91-44-2234-5678</p>
                          <p>Email: support@smartbuy.com</p>
                        </div>
                      </div>
                      
                      {/* Careers */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🚀</span>
                          </div>
                          <h3 className="text-xl font-semibold">Join Our Team</h3>
                        </div>
                        <p className="text-white/90 mb-4">
                          Discover exciting career opportunities across technology, operations, and customer service.
                        </p>
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                          View Careers
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form Side */}
              <div className="lg:w-3/5 p-8 lg:p-12">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Send us a Message</h2>
                    <p className="text-gray-600">
                      Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="orders">Order Issues</option>
                        <option value="returns">Returns & Refunds</option>
                        <option value="partnership">Business Partnership</option>
                        <option value="careers">Career Opportunities</option>
                      </select>
                    </div>
                    
                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tell us how we can help you..."
                        required
                      ></textarea>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                  
                  {/* Quick Contact Options */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">Or reach us directly:</p>
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href="tel:+91-44-2234-5678" 
                        className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <span>📞</span>
                        Call Us
                      </a>
                      <a 
                        href="mailto:support@smartbuy.com" 
                        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <span>📧</span>
                        Email Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-gray-100 to-blue-100 py-16">
        <div className="container mx-auto px-4">
          <NewsletterBox/>
        </div>
      </div>
    </div>
  )
}

export default Contact;
