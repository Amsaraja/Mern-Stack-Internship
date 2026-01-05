import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Edit from './pages/Edit';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹';

const AdminApp = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken')?localStorage.getItem('adminToken'):''); 
  useEffect(()=>{
    localStorage.setItem('adminToken', token)
  }, [token])

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <ToastContainer/>
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <div className="min-h-screen">
          <NavBar setToken={setToken} />
          <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8">
              <div className="bg-white rounded-3xl shadow-xl min-h-[calc(100vh-120px)] p-8">
                <Routes>
                  <Route path="/add" element={<Add token={token}/>} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route path="/edit/:id" element={<Edit token={token} />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApp;
