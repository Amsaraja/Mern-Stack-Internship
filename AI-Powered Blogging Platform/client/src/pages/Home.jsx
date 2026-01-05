import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, User, Eye, Clock, Tag, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['technology', 'business', 'lifestyle', 'education', 'health'];

  useEffect(() => {
    fetchBlogs();
    fetchPopularBlogs();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/blogs?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularBlogs = async () => {
    try {
      const response = await fetch('/api/analytics/popular?limit=5');
      
      if (response.ok) {
        const data = await response.json();
        setPopularBlogs(data);
      }
    } catch (error) {
      console.error('Failed to load popular blogs');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>AI Blog Platform - Modern Blogging with AI</title>
        <meta name="description" content="Discover amazing blog posts powered by AI. Read, write, and share your thoughts with our modern blogging platform." />
      </Helmet>

      {/* Hero Section */}
      <div className="text-center py-12 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-primary-600">AI Blog</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing stories, insights, and ideas from our community of writers. 
          Powered by AI to help you write better and reach more readers.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => {setSelectedCategory(''); setCurrentPage(1);}}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === '' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {setSelectedCategory(category); setCurrentPage(1);}}
              className={`px-4 py-2 rounded-full text-sm transition-colors capitalize ${
                selectedCategory === category 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No blogs found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {blogs.map((blog) => (
                  <article key={blog._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                    {blog.featuredImage && (
                      <img 
                        src={blog.featuredImage} 
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {blog.category && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium capitalize">
                            {blog.category}
                          </span>
                        )}
                        {blog.isPremium && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            Premium
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                        <Link 
                          to={`/blog/${blog.slug}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {blog.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt || blog.content.substring(0, 150) + '...'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{blog.user?.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{blog.views || 0}</span>
                          </div>
                          
                          {blog.readTime && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{blog.readTime}m</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Posts */}
          {popularBlogs.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                Popular This Week
              </h3>
              
              <div className="space-y-4">
                {popularBlogs.map((item, index) => (
                  <div key={index} className="flex space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                        <Link 
                          to={`/blog/${item.blog?.[0]?.slug}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {item.blog?.[0]?.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.views} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100">
            <h3 className="font-semibold text-gray-800 mb-2">Start Writing Today</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join our community of writers and share your stories with the world.
            </p>
            <Link to="/register" className="btn-primary w-full text-center">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;