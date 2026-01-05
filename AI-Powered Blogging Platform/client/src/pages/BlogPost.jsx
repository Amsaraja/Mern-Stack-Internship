import React from 'react';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Blog Post - AI Blog Platform</title>
      </Helmet>
      
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Page</h1>
        <p className="text-gray-600">This page will display individual blog posts with full content, comments, and social sharing features.</p>
      </div>
    </div>
  );
};

export default BlogPost;