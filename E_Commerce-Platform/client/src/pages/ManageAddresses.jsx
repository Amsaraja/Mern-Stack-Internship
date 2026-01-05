import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { toast } from 'react-toastify';

const ManageAddresses = () => {
  const { navigate } = useContext(ShopContext);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      street: '123 Main Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipcode: '600001',
      phone: '+91-9876543210'
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    phone: ''
  });

  const handleAddAddress = (e) => {
    e.preventDefault();
    const address = {
      ...newAddress,
      id: addresses.length + 1
    };
    setAddresses([...addresses, address]);
    setNewAddress({
      type: 'Home',
      name: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      phone: ''
    });
    setShowForm(false);
    toast.success('Address added successfully!');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success('Address deleted successfully!');
  };

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'MANAGE'} text2={'ADDRESSES'} />
      </div>
      
      <div className='max-w-2xl'>
        <button
          onClick={() => setShowForm(!showForm)}
          className='mb-6 bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors'
        >
          {showForm ? 'Cancel' : 'Add New Address'}
        </button>

        {showForm && (
          <form onSubmit={handleAddAddress} className='mb-8 p-6 border border-gray-300 rounded'>
            <h3 className='text-lg font-medium mb-4'>Add New Address</h3>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Address Type</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
                >
                  <option value='Home'>Home</option>
                  <option value='Office'>Office</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                <input
                  type='text'
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
                  required
                />
              </div>
              
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Street Address</label>
                <input
                  type='text'
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
                  required
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                <input
                  type='text'
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
                  required
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
                <input
                  type='text'
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
                  required
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Zipcode</label>
                <input
                  type='text'
                  value={newAddress.zipcode}
                  onChange={(e) => setNewAddress({...newAddress, zipcode: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
                  required
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
                <input
                  type='tel'
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
                  required
                />
              </div>
            </div>
            
            <button
              type='submit'
              className='mt-4 bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors'
            >
              Save Address
            </button>
          </form>
        )}

        <div className='space-y-4'>
          {addresses.map((address) => (
            <div key={address.id} className='p-4 border border-gray-300 rounded'>
              <div className='flex justify-between items-start'>
                <div>
                  <h4 className='font-medium text-lg'>{address.type}</h4>
                  <p className='text-gray-700'>{address.name}</p>
                  <p className='text-gray-600'>{address.street}</p>
                  <p className='text-gray-600'>{address.city}, {address.state} {address.zipcode}</p>
                  <p className='text-gray-600'>{address.phone}</p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className='text-red-600 hover:text-red-800 text-sm'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => navigate('/profile')}
          className='mt-6 border border-black px-6 py-2 text-sm hover:bg-gray-100 transition-colors'
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default ManageAddresses;