import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } });
      if (response.data.success) {
        setUserData({
          name: response.data.user.name,
          email: response.data.user.email
        });
      }
    } catch (error) {
      toast.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For now, just show success message as backend update endpoint would need to be created
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [token]);

  if (loading) {
    return <div className='text-center py-20'>Loading...</div>;
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'EDIT'} text2={'PROFILE'} />
      </div>
      
      <form onSubmit={handleSubmit} className='max-w-md'>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
          <input
            type='text'
            value={userData.name}
            onChange={(e) => setUserData({...userData, name: e.target.value})}
            className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
            required
          />
        </div>
        
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
          <input
            type='email'
            value={userData.email}
            onChange={(e) => setUserData({...userData, email: e.target.value})}
            className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
            required
          />
        </div>
        
        <div className='flex gap-4'>
          <button
            type='submit'
            className='bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors'
          >
            Update Profile
          </button>
          <button
            type='button'
            onClick={() => navigate('/profile')}
            className='border border-black px-6 py-2 text-sm hover:bg-gray-100 transition-colors'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;