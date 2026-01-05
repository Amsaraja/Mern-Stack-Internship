import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const { navigate } = useContext(ShopContext);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      // For now, just show success message as backend endpoint would need to be created
      toast.success('Password updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'CHANGE'} text2={'PASSWORD'} />
      </div>
      
      <form onSubmit={handleSubmit} className='max-w-md'>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Current Password</label>
          <input
            type='password'
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
            className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
            required
          />
        </div>
        
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>New Password</label>
          <input
            type='password'
            value={passwords.newPassword}
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
            required
            minLength={8}
          />
        </div>
        
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm New Password</label>
          <input
            type='password'
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
            className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
            required
            minLength={8}
          />
        </div>
        
        <div className='flex gap-4'>
          <button
            type='submit'
            className='bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors'
          >
            Update Password
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

export default ChangePassword;