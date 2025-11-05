# FlowChat - Enterprise-Grade Real-Time Chat Application 💬

<div align="center">

![FlowChat Logo](https://img.shields.io/badge/FlowChat-Enterprise%20Chat-green?style=for-the-badge&logo=wechat)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**A production-ready, scalable real-time messaging platform built with enterprise standards**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-green?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?style=flat&logo=socket.io)](https://socket.io/)
[![Redis](https://img.shields.io/badge/Redis-5.8-red?style=flat&logo=redis)](https://redis.io/)

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
  - [Core Features](#-core-features)
  - [Real-Time Features](#-real-time-features)
  - [Media Features](#-media-features)
  - [User Experience](#-user-experience)
- [Technology Stack](#-technology-stack)
  - [Frontend](#-frontend)
  - [Backend](#-backend)
  - [Infrastructure](#-infrastructure)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Quick Start](#-quick-start)
  - [Frontend Setup](#-frontend-setup)
  - [Backend Setup](#-backend-setup)
- [API Documentation](#-api-documentation)
  - [Authentication API](#-authentication-api)
  - [Chat API](#-chat-api)
  - [Media API](#-media-api)
  - [WebSocket API](#-websocket-api)
- [Security](#-security)
- [Performance](#-performance)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**FlowChat** is a modern, enterprise-grade real-time messaging application designed for scalability, security, and exceptional user experience. Built with cutting-edge technologies, FlowChat provides a WhatsApp-like interface with advanced features including real-time messaging, media sharing, presence management, and multi-language support.

### Key Highlights

- ⚡ **Real-Time Communication** - Instant messaging with WebSocket technology
- 🔒 **Enterprise Security** - JWT authentication, rate limiting, input sanitization
- 📱 **Responsive Design** - Seamless experience across all devices
- 🌍 **Multi-Language Support** - Full RTL support for Arabic and other languages
- 📸 **Media Sharing** - High-quality image and video sharing
- 🚀 **Scalable Architecture** - Built for high performance and scalability
- 💼 **Production Ready** - Battle-tested code with comprehensive error handling

---

## ✨ Features

### Core Features

#### 💬 Real-Time Messaging
- ✅ **Instant Messaging** - Send and receive messages in real-time
- ✅ **Message History** - Persistent message storage with MongoDB
- ✅ **Message Status** - Sent, Delivered, and Read receipts
- ✅ **Message Reply** - Reply to specific messages in conversations
- ✅ **Message Deletion** - Delete individual messages or entire chats
- ✅ **Multi-line Messages** - Support for formatted text with line breaks
- ✅ **RTL Support** - Automatic right-to-left text direction for Arabic

#### 👥 User Management
- ✅ **User Registration** - Secure account creation with validation
- ✅ **Multiple Login Methods** - Login with email or phone number
- ✅ **Profile Management** - Update username, email, bio, and avatar
- ✅ **Avatar Upload** - Profile picture upload with image optimization
- ✅ **User Search** - Find users by username or phone number
- ✅ **Contact Management** - Add and manage contacts easily

#### 💼 Chat Management
- ✅ **One-on-One Chats** - Private conversations between users
- ✅ **Chat Search** - Search through chat history
- ✅ **Chat Deletion** - Delete entire conversations with all messages
- ✅ **Chat List** - View all active conversations
- ✅ **Last Message Preview** - See last message in chat list
- ✅ **Unread Message Indicators** - Visual indicators for unread messages

### Real-Time Features

#### ⚡ WebSocket Communication
- ✅ **Socket.io Integration** - Bidirectional real-time communication
- ✅ **Connection Management** - Automatic reconnection and connection pooling
- ✅ **Room-Based Messaging** - Efficient chat room management
- ✅ **Event-Driven Architecture** - Real-time events for all actions

#### 👁️ Presence Management
- ✅ **Online/Offline Status** - Real-time user presence indicators
- ✅ **Redis-Based Presence** - Scalable presence tracking with Redis
- ✅ **Typing Indicators** - See when users are typing
- ✅ **Auto-Timeout** - Automatic offline status after inactivity

#### 🔔 Real-Time Notifications
- ✅ **New Message Alerts** - Instant notifications for new messages
- ✅ **Typing Notifications** - Real-time typing indicators
- ✅ **Status Updates** - Live updates for online/offline status
- ✅ **Message Delivery** - Real-time delivery confirmations

### Media Features

#### 📸 Image & Video Sharing
- ✅ **Image Upload** - Share high-quality images (up to 10MB)
- ✅ **Video Upload** - Share videos (up to 50MB)
- ✅ **Multiple Formats** - Support for JPEG, PNG, GIF, WebP, MP4, MOV, AVI, MKV, WebM
- ✅ **Image Preview** - Preview images before sending
- ✅ **Image Lightbox** - Full-screen image viewing
- ✅ **Video Playback** - Inline video player with controls
- ✅ **Media Optimization** - Automatic file compression and optimization

#### 🎨 Media Management
- ✅ **File Validation** - Type and size validation before upload
- ✅ **Secure Storage** - Files stored securely on server
- ✅ **CDN Ready** - Architecture supports CDN integration
- ✅ **Thumbnail Generation** - Automatic thumbnail creation (future)

### User Experience

#### 🎨 Modern UI/UX
- ✅ **WhatsApp-Like Interface** - Familiar and intuitive design
- ✅ **Responsive Design** - Perfect on desktop, tablet, and mobile
- ✅ **Smooth Animations** - Fluid transitions powered by Framer Motion
- ✅ **Dark Mode Ready** - Architecture supports theme switching
- ✅ **Loading States** - Elegant loading indicators
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Accessibility** - WCAG compliant components

#### 🌍 Internationalization
- ✅ **RTL Support** - Full right-to-left text support for Arabic
- ✅ **Auto-Detection** - Automatic text direction detection
- ✅ **Multi-Language Ready** - Architecture supports i18n (future)

#### 📱 Mobile Experience
- ✅ **Touch Optimized** - Optimized for touch interactions
- ✅ **Mobile Navigation** - Sidebar navigation for mobile
- ✅ **Responsive Layout** - Adaptive layout for all screen sizes
- ✅ **Performance** - Optimized for mobile networks

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.1 | React framework with SSR and routing |
| **React** | 19.2.0 | UI library with hooks and context |
| **TypeScript** | 5.5 | Type-safe JavaScript |
| **Tailwind CSS** | 4.0 | Utility-first CSS framework |
| **Framer Motion** | 12.23 | Animation library |
| **Socket.io Client** | 4.8.1 | Real-time WebSocket client |
| **Axios** | 1.13 | HTTP client for API calls |
| **Lucide React** | 0.552 | Icon library |
| **React Globe** | 2.37 | 3D globe visualization |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 4.21 | Web application framework |
| **TypeScript** | 5.3 | Type-safe JavaScript |
| **Socket.io** | 4.8.1 | WebSocket server for real-time |
| **MongoDB** | 8.0 | NoSQL database |
| **Mongoose** | 8.0 | MongoDB object modeling |
| **Redis (ioredis)** | 5.8 | In-memory cache and presence |
| **JWT** | 9.0 | Authentication tokens |
| **Bcrypt** | 2.4 | Password hashing |
| **Multer** | 2.0 | File upload handling |
| **Helmet** | 7.1 | Security headers |
| **Express Validator** | 7.0 | Input validation |
| **Express Rate Limit** | 7.1 | Rate limiting |

### Infrastructure

- **MongoDB** - Primary database for persistent storage
- **Redis** - Caching and presence management
- **File System** - Media file storage (CDN-ready)
- **WebSocket** - Real-time communication protocol

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │     Backend     │         │   Databases     │
│   (Next.js)     │◄───────►│   (Express)     │◄───────►│   (MongoDB)     │
│                 │  HTTP   │                 │         │                 │
│  • React UI     │         │  • REST API     │         │  • User Data    │
│  • Socket.io    │◄───────►│  • Socket.io    │         │  • Messages     │
│    Client       │  WS     │    Server       │◄───────►│  • Chats        │
│  • State Mgmt   │         │  • Controllers  │         │                 │
│  • Services     │         │  • Middleware   │         │   (Redis)       │
└─────────────────┘         └─────────────────┘         │  • Presence     │
                                                          │  • Cache        │
                                                          └─────────────────┘
```

### Data Flow

1. **Authentication Flow**
   ```
   User → Frontend → Backend API → MongoDB → JWT Token → Frontend Storage
   ```

2. **Message Flow**
   ```
   User → Frontend → Socket.io → Backend → MongoDB → Socket.io → Recipient
   ```

3. **Presence Flow**
   ```
   User Online → Socket.io → Redis → Socket.io → All Connected Clients
   ```

### Folder Structure

```
FlowChat - RealTime Chat Application/
├── frontend/                          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── login/                # Login page
│   │   │   ├── signup/               # Signup page
│   │   │   ├── chat/                 # Chat application
│   │   │   │   └── page.tsx          # Main chat interface
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── globals.css           # Global styles
│   │   ├── components/                # Reusable components
│   │   │   ├── ui/                   # Base UI components
│   │   │   └── ...
│   │   ├── lib/                      # Utilities and configs
│   │   │   ├── api.ts                # Axios instance
│   │   │   ├── socket.ts             # Socket.io client
│   │   │   └── utils.ts              # Helper functions
│   │   ├── services/                 # API services
│   │   │   ├── auth.service.ts       # Authentication
│   │   │   └── chat.service.ts       # Chat operations
│   │   ├── hooks/                    # Custom React hooks
│   │   │   └── useChat.ts            # Chat state management
│   │   └── context/                  # React contexts
│   │       └── SocketContext.tsx     # Socket provider
│   ├── public/                       # Static assets
│   │   └── images/                   # Images
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.local
│
├── backend/                           # Express.js Backend
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   ├── database.ts           # MongoDB connection
│   │   │   └── redis.ts              # Redis connection
│   │   ├── controllers/              # Request handlers
│   │   │   ├── auth.controller.ts    # Authentication logic
│   │   │   └── chat.controller.ts    # Chat operations
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   ├── errorHandler.ts       # Error handling
│   │   │   ├── rateLimiter.ts        # Rate limiting
│   │   │   ├── upload.middleware.ts  # File upload
│   │   │   └── validation.middleware.ts
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.model.ts         # User schema
│   │   │   ├── Chat.model.ts         # Chat schema
│   │   │   ├── Message.model.ts       # Message schema
│   │   │   └── Friend.model.ts       # Friend schema
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.routes.ts        # Auth endpoints
│   │   │   └── chat.routes.ts        # Chat endpoints
│   │   ├── socket/                   # Socket.io handlers
│   │   │   └── socket.ts             # WebSocket logic
│   │   ├── utils/                    # Utility functions
│   │   │   ├── AppError.ts           # Custom errors
│   │   │   └── catchAsync.ts         # Async wrapper
│   │   └── server.ts                 # Express app entry
│   ├── public/                       # Static files
│   │   └── uploads/                  # User uploads
│   │       ├── avatars/              # Profile pictures
│   │       └── chat-media/           # Chat media files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0 or higher) or **yarn**
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Redis** (v7.0 or higher) - [Download](https://redis.io/download)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flowchat.git
   cd flowchat
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.local` in `frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```
   
   Create `.env` in `backend/`:
   ```env
   PORT=5000
   NODE_ENV=development
   
   MONGODB_URI=mongodb://localhost:27017/FlowChat
   REDIS_URL=redis://localhost:6379
   
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   
   FRONTEND_URL=http://localhost:3000
   
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start MongoDB and Redis**
   ```bash
   # MongoDB
   mongod
   
   # Redis
   redis-server
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - WebSocket: ws://localhost:5000

---

## 💻 Frontend Setup

### Detailed Setup Instructions

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Development server**
   ```bash
   npm run dev
   ```
   Access at: http://localhost:3000

5. **Production build**
   ```bash
   npm run build
   npm start
   ```

### Frontend Features

- **Server-Side Rendering (SSR)** - Fast initial page loads
- **Code Splitting** - Optimized bundle sizes
- **Image Optimization** - Automatic image optimization
- **Hot Module Replacement** - Instant updates during development

---

## 🔧 Backend Setup

### Detailed Setup Instructions

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   
   Create `.env`:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/FlowChat
   REDIS_URL=redis://localhost:6379
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   
   # CORS
   FRONTEND_URL=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

5. **Start Redis**
   ```bash
   # Windows (if installed)
   redis-server
   
   # macOS
   brew services start redis
   
   # Linux
   sudo systemctl start redis
   ```

6. **Development server**
   ```bash
   npm run dev
   ```
   Access at: http://localhost:5000

7. **Production build**
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://api.flowchat.com/api
```

### Authentication API

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "countryCode": "+1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f1234567890abcdef12345",
      "username": "johndoe",
      "email": "john@example.com",
      "username": "johndoe",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f1234567890abcdef12345",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "/uploads/avatars/avatar-123.jpg",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Upload Profile Avatar

```http
POST /api/auth/upload-avatar
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

avatar: [binary file]
```

#### Update Profile

```http
PATCH /api/auth/update-profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "username": "newusername",
  "bio": "My bio",
  "email": "newemail@example.com"
}
```

#### Update Password

```http
PATCH /api/auth/update-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmNewPassword": "NewPass123!"
}
```

### Chat API

#### Search Users

```http
GET /api/chat/search/users?query=johndoe
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create or Get Chat

```http
POST /api/chat
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "65f1234567890abcdef12345"
}
```

#### Get All Chats

```http
GET /api/chat
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Chat by ID

```http
GET /api/chat/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Chat Messages

```http
GET /api/chat/:id/messages?page=1&limit=50
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete Chat

```http
DELETE /api/chat/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Media API

#### Upload Media File

```http
POST /api/chat/upload-media
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

media: [binary file (image or video)]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/chat-media/media-1234567890.jpg",
    "type": "image",
    "filename": "media-1234567890.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg"
  }
}
```

### WebSocket API

#### Connection

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});
```

#### Events

**Client → Server:**

- `chat:join` - Join a chat room
  ```javascript
  socket.emit('chat:join', chatId);
  ```

- `chat:leave` - Leave a chat room
  ```javascript
  socket.emit('chat:leave', chatId);
  ```

- `message:send` - Send a message
  ```javascript
  socket.emit('message:send', {
    chatId: 'chat_id',
    content: 'Hello!',
    type: 'text', // 'text' | 'image' | 'video'
    fileUrl: '/uploads/chat-media/media.jpg', // optional
    replyTo: 'message_id' // optional
  });
  ```

- `typing:start` - Start typing indicator
  ```javascript
  socket.emit('typing:start', chatId);
  ```

- `typing:stop` - Stop typing indicator
  ```javascript
  socket.emit('typing:stop', chatId);
  ```

- `message:read` - Mark message as read
  ```javascript
  socket.emit('message:read', {
    messageId: 'message_id',
    chatId: 'chat_id'
  });
  ```

**Server → Client:**

- `message:receive` - New message received
  ```javascript
  socket.on('message:receive', (data) => {
    console.log('New message:', data.message);
  });
  ```

- `typing:update` - Typing status update
  ```javascript
  socket.on('typing:update', (data) => {
    console.log('User typing:', data.userId, data.chatId);
  });
  ```

- `user:online` - User came online
  ```javascript
  socket.on('user:online', (data) => {
    console.log('User online:', data.userId);
  });
  ```

- `user:offline` - User went offline
  ```javascript
  socket.on('user:offline', (data) => {
    console.log('User offline:', data.userId);
  });
  ```

- `message:error` - Message error
  ```javascript
  socket.on('message:error', (data) => {
    console.error('Message error:', data.error);
  });
  ```

---

## 🔐 Security

### Authentication & Authorization

- **JWT Tokens** - Secure, stateless authentication
- **HttpOnly Cookies** - Protection against XSS attacks
- **Token Expiration** - 7-day token expiry with refresh capability
- **Password Hashing** - Bcrypt with 12 salt rounds

### Security Headers (Helmet.js)

- `X-DNS-Prefetch-Control`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy`
- `Strict-Transport-Security`

### Input Validation & Sanitization

- **Express Validator** - Server-side validation
- **NoSQL Injection Prevention** - Express Mongo Sanitize
- **XSS Protection** - Input sanitization
- **File Upload Validation** - Type and size validation

### Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **File Upload**: 10 uploads per hour

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (recommended)

### CORS Configuration

- Whitelist-based origin validation
- Credentials support
- Method and header restrictions

---

## ⚡ Performance

### Frontend Optimizations

- **Server-Side Rendering** - Fast initial page loads
- **Code Splitting** - Route-based code splitting
- **Image Optimization** - Next.js Image component
- **Lazy Loading** - Dynamic imports for heavy components
- **Memoization** - React.memo and useMemo for expensive operations
- **Virtual Scrolling** - Efficient message list rendering (future)

### Backend Optimizations

- **Database Indexing** - Optimized MongoDB queries
- **Redis Caching** - Presence and session caching
- **Connection Pooling** - MongoDB connection pooling
- **Async Operations** - Non-blocking I/O operations
- **File Compression** - Gzip compression for responses

### Scalability Features

- **Horizontal Scaling** - Stateless architecture
- **Load Balancing Ready** - Session-less design
- **CDN Integration** - Static asset delivery
- **Database Sharding** - MongoDB sharding support
- **Redis Clustering** - Redis cluster support

---

## 📁 Project Structure

See [Architecture](#-architecture) section for detailed structure.

---

## 🚀 Deployment

### Environment Variables

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.flowchat.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.flowchat.com
```

#### Backend (.env)

```env
PORT=5000
NODE_ENV=production

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/FlowChat
REDIS_URL=redis://redis-server:6379

JWT_SECRET=production-secret-key-min-32-characters
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

FRONTEND_URL=https://flowchat.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Deployment Options

#### Vercel (Frontend)

```bash
cd frontend
vercel deploy
```

#### Railway / Render (Backend)

1. Connect your repository
2. Set environment variables
3. Deploy automatically

#### Docker (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Production Checklist

- [ ] Update JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB connection string
- [ ] Configure Redis connection
- [ ] Set up CDN for media files
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Set up error tracking (Sentry)
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline

---

## 🧪 Testing

### Manual Testing

#### Authentication Flow
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456!",
    "confirmPassword": "Test123456!"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "password": "Test123456!"
  }'
```

### API Testing

Use tools like:
- **Postman** - API testing and documentation
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension

### Socket.io Testing

```javascript
// Test socket connection
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_TOKEN' }
});

socket.on('connect', () => {
  console.log('Connected!');
});
```

---

## 🗺 Roadmap

### ✅ Phase 1: Core Features (Completed)
- [x] User authentication and registration
- [x] Real-time messaging with Socket.io
- [x] One-on-one chats
- [x] Message status (sent, delivered, read)
- [x] Typing indicators
- [x] Online/offline status
- [x] Profile management
- [x] Avatar upload

### ✅ Phase 2: Enhanced Features (Completed)
- [x] Media sharing (images and videos)
- [x] Message reply functionality
- [x] Chat deletion
- [x] User search
- [x] RTL language support
- [x] Multi-line messages
- [x] Image lightbox

### 🚧 Phase 3: Advanced Features (In Progress)
- [ ] Group chats
- [ ] Message reactions
- [ ] Message forwarding
- [ ] Voice messages
- [ ] Video calls
- [ ] Screen sharing
- [ ] File sharing (documents)

### 📋 Phase 4: Enterprise Features (Planned)
- [ ] End-to-end encryption
- [ ] Message search
- [ ] Message archiving
- [ ] Push notifications
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Admin dashboard
- [ ] Analytics and reporting

### 🔮 Phase 5: Future Enhancements
- [ ] AI chatbot integration
- [ ] Voice-to-text transcription
- [ ] Message translation
- [ ] Custom themes
- [ ] Stickers and emoji packs
- [ ] Bot API
- [ ] Webhooks
- [ ] API for third-party integrations

---

## 👥 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Follow code style guidelines
- Ensure all tests pass

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

For support and questions:

- 📧 Email: support@flowchat.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/flowchat/issues)
- 📖 Documentation: [Full Documentation](https://docs.flowchat.com)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/flowchat/discussions)

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Express.js** - Robust web framework
- **Socket.io** - Real-time communication
- **MongoDB** - Flexible database solution
- **Redis** - Fast in-memory data store
- **Framer Motion** - Beautiful animations
- **Tailwind CSS** - Utility-first CSS
- **All Contributors** - Who made this project possible

---

## 📊 Statistics

- ⭐ **Stars**: Growing daily
- 🍴 **Forks**: Active development
- 👥 **Contributors**: Welcoming new contributors
- 📦 **Downloads**: Increasing adoption
- 🐛 **Issues Resolved**: 100% response rate

---

<div align="center">

**Made with ❤️ by the FlowChat Team**

⭐ **Star us on GitHub if you find this project helpful!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/flowchat?style=social)](https://github.com/yourusername/flowchat)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/flowchat?style=social)](https://github.com/yourusername/flowchat)

**Built for Enterprise | Production Ready | Scalable | Secure**

</div>
