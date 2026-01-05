# SmartBuy E-Commerce Application

A full-stack e-commerce platform built with React.js frontend and Node.js backend, featuring user authentication, product management, shopping cart, order processing, and admin panel.

## Features

### Customer Features
- User registration and authentication
- Product browsing and search
- Shopping cart management
- Order placement and tracking
- User profile management
- Address management
- Password change functionality
- Multiple payment options (Stripe & Razorpay)

### Admin Features
- Product management (Add, Edit, Delete)
- Order management
- User management
- Dashboard analytics
- Image upload with Cloudinary integration

## Tech Stack

### Frontend
- React.js - UI framework
- Vite - Build tool
- React Router DOM - Navigation
- Tailwind CSS - Styling
- Axios - HTTP client
- React Toastify - Notifications

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Bcrypt - Password hashing
- Multer - File upload
- Cloudinary - Image storage
- Stripe & Razorpay - Payment processing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Stripe account (optional)
- Razorpay account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartBuy-E_Commerce-Application
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

### Environment Configuration

#### Server (.env)
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Client (.env)
```env
VITE_BACKEND_URL=http://localhost:4000
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run server
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the Application**
   - Customer Portal: `http://localhost:5173`
   - Admin Panel: `http://localhost:5173/admin`

