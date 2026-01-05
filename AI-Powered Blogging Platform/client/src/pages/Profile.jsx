import React from 'react';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Profile - AI Blog Platform</title>
      </Helmet>
      
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">User Profile</h1>
        <p className="text-gray-600">This page will display user profiles with their blogs, bio, social links, and follower information.</p>
      </div>
    </div>
  );
};

export default Profile;