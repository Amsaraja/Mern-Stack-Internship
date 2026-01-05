import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Save, Eye, EyeOff, Sparkles, Tag, Search } from 'lucide-react';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    tags: [],
    category: '',
    status: 'draft'
  });
  
  const [aiStatus, setAiStatus] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiError, setAiError] = useState(null);

  const checkAIStatus = async () => {
    try {
      // First check if backend is reachable
      const healthResponse = await fetch('/api/health');
      if (!healthResponse.ok) {
        setAiError('Backend server not reachable');
        return;
      }
      
      const response = await fetch('/api/blogs/ai-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiStatus(data);
        if (!data.available) {
          setAiError(data.error || 'AI service unavailable');
        }
      } else {
        setAiError('Failed to check AI status');
      }
    } catch (error) {
      console.error('Error checking AI status:', error);
      setAiError('Cannot connect to server - make sure backend is running on port 5000');
    }
  };

  const getAISuggestions = async () => {
    if (!blog.title) {
      toast.error('Please enter a blog title first');
      return;
    }
    
    // If no ID, save the blog first
    if (!id) {
      await saveBlog('draft');
      return; // The save will redirect and then we can try again
    }
    
    setAiLoading(true);
    setAiError(null);
    
    try {
      const response = await fetch(`/api/blogs/${id}/ai-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: blog.title, content: blog.content })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
        
        if (data.usingFallback) {
          setAiError(data.reason || 'Using fallback mode');
          toast.success(`AI suggestions ready (${data.source || 'fallback'} mode)`);
        } else {
          toast.success('AI suggestions generated!');
        }
      } else {
        const error = await response.json();
        setAiError(error.error);
        toast.error(error.error || 'Failed to get AI suggestions');
      }
    } catch (error) {
      console.error('AI Suggestions Error:', error);
      setAiError('Network error occurred');
      toast.error('Network error - check if server is running');
    } finally {
      setAiLoading(false);
    }
  };

  const optimizeSEO = async () => {
    if (!id || !blog.title || !blog.content) {
      toast.error('Save the blog with title and content first');
      return;
    }
    
    setAiLoading(true);
    try {
      const response = await fetch(`/api/blogs/${id}/seo-optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('SEO optimized!');
        console.log('SEO Data:', data);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to optimize SEO');
      }
    } catch (error) {
      toast.error('Error optimizing SEO');
    } finally {
      setAiLoading(false);
    }
  };

  const generateTags = async () => {
    if (!id || !blog.title || !blog.content) {
      toast.error('Save the blog with title and content first');
      return;
    }
    
    setAiLoading(true);
    try {
      const response = await fetch(`/api/blogs/${id}/generate-tags`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBlog(prev => ({ ...prev, tags: data.tags }));
        toast.success('Tags generated!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to generate tags');
      }
    } catch (error) {
      toast.error('Error generating tags');
    } finally {
      setAiLoading(false);
    }
  };

  const saveBlog = async (status = blog.status) => {
    if (!blog.title.trim() || !blog.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSaving(true);
    
    try {
      const blogData = { ...blog, status };
      const url = id ? `/api/blogs/${id}` : '/api/blogs';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      });
      
      if (response.ok) {
        const savedBlog = await response.json();
        setBlog(savedBlog);
        toast.success(status === 'published' ? 'Blog published!' : 'Blog saved!');
        
        if (!id) {
          navigate(`/editor/${savedBlog._id}`);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save blog');
      }
    } catch (error) {
      toast.error('Error saving blog');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      checkAIStatus();
    }
  }, [user, token]);

  return (
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>{blog.title || 'New Blog Post'} - Editor</title>
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Tools</span>
          </button>
          
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isPreview ? 'Edit' : 'Preview'}</span>
          </button>
          
          <button
            onClick={() => saveBlog('draft')}
            disabled={isSaving}
            className="btn-secondary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          
          <button
            onClick={() => saveBlog('published')}
            disabled={isSaving}
            className="btn-primary"
          >
            Publish
          </button>
        </div>
      </div>

      {showAiPanel && (
        <div className="card p-4 mb-6 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-800">AI Writing Assistant</h3>
            <div className="flex items-center space-x-2">
              {aiStatus && (
                <span className={`text-xs px-2 py-1 rounded ${
                  aiStatus.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {aiStatus.available ? 'AI Active' : 'Fallback Mode'}
                </span>
              )}
            </div>
          </div>
          
          {aiError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>AI Issue:</strong> {aiError}
              </p>
              {aiError.includes('API key') && (
                <p className="text-xs text-red-600 mt-1">
                  Please update your OpenAI API key in the server/.env file
                </p>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={getAISuggestions}
              disabled={aiLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{aiLoading ? 'Loading...' : 'Get Content Suggestions'}</span>
            </button>
            
            <button
              onClick={optimizeSEO}
              disabled={aiLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>Optimize SEO</span>
            </button>
            
            <button
              onClick={generateTags}
              disabled={aiLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Tag className="w-4 h-4" />
              <span>Generate Tags</span>
            </button>
          </div>
          
          {aiSuggestions.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">Content Suggestions:</h4>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded text-sm text-gray-700">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-6">
        {!isPreview ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Blog title..."
              value={blog.title}
              onChange={(e) => setBlog(prev => ({ ...prev, title: e.target.value }))}
              className="w-full text-3xl font-bold border-none outline-none placeholder-gray-400"
            />
            
            <textarea
              placeholder="Write your blog content in Markdown..."
              value={blog.content}
              onChange={(e) => setBlog(prev => ({ ...prev, content: e.target.value }))}
              className="w-full h-96 border-none outline-none resize-none placeholder-gray-400 font-mono"
            />
            
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold mb-4">{blog.title || 'Untitled'}</h1>
            <div className="whitespace-pre-wrap">{blog.content || 'No content yet...'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;