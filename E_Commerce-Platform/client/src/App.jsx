import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import ManageAddresses from './pages/ManageAddresses';
import Collection from './pages/Collection';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from './context/ShopContext';

// Admin Components
import AdminApp from './admin/src/App';

const App = () => {
  const { token } = useContext(ShopContext);
  
  return (
    <div>
      <ToastContainer/>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Login Route - Always accessible */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Client Routes */}
        <Route path="/*" element={
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <NavBar />
            <SearchBar/>
            <Routes>
              <Route path="/" element={!token ? <Navigate to="/login" replace /> : <Home />} />
              <Route path="/collection" element={!token ? <Navigate to="/login" replace /> : <Collection />} />
              <Route path="/about" element={!token ? <Navigate to="/login" replace /> : <About />} />
              <Route path="/contact" element={!token ? <Navigate to="/login" replace /> : <Contact />} />
              <Route path="/product/:productId" element={!token ? <Navigate to="/login" replace /> : <Product />} />
              <Route path="/cart" element={!token ? <Navigate to="/login" replace /> : <Cart />} />
              <Route path="/place-order" element={!token ? <Navigate to="/login" replace /> : <PlaceOrder />} />
              <Route path="/orders" element={!token ? <Navigate to="/login" replace /> : <Orders />} />
              <Route path="/profile" element={!token ? <Navigate to="/login" replace /> : <Profile />} />
              <Route path="/edit-profile" element={!token ? <Navigate to="/login" replace /> : <EditProfile />} />
              <Route path="/change-password" element={!token ? <Navigate to="/login" replace /> : <ChangePassword />} />
              <Route path="/manage-addresses" element={!token ? <Navigate to="/login" replace /> : <ManageAddresses />} />
            </Routes>
            <Footer/>
          </div>
        } />
      </Routes>
    </div>
  );
};

export default App;
