import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import BlogPost from './pages/BlogPost';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Subscription from './pages/Subscription';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/editor" element={
                  <ProtectedRoute><Editor /></ProtectedRoute>
                } />
                <Route path="/editor/:id" element={
                  <ProtectedRoute><Editor /></ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute><Analytics /></ProtectedRoute>
                } />
                <Route path="/subscription" element={
                  <ProtectedRoute><Subscription /></ProtectedRoute>
                } />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;