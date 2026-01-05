# AI Blog Platform

AI-powered blogging platform with content generation and analytics.

## Setup

### Prerequisites
- Node.js 16+
- MongoDB
- OpenAI API key

### Installation

1. Clone and install:
```bash
git clone <repository-url>
cd AI-Blog
npm install
```

2. Backend setup:
```bash
cd server
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

3. Frontend setup:
```bash
cd client
npm install
npm run dev
```

## Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/ai_blog
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
```

## Usage

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Features

- AI content generation
- User authentication
- Blog management
- Analytics dashboard
- Payment integration

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- AI: OpenAI API
- Payments: Stripe

## License

MIT