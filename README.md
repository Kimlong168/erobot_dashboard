# Taskflow To-Do Board - Backend API

A scalable REST API built with Node.js and Express, providing comprehensive task management functionality with MongoDB integration, authentication, and real-time capabilities.

[![Watch Demo](https://img.shields.io/badge/▶️%20Watch%20Demo-YouTube-red?logo=youtube)](https://youtu.be/b0YGkyuZeWY?si=KQbl3kX2MA6xTP-v)

## ✨ API Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based auth system
- **User Registration**: Account creation with validation
- **Password Security**: Bcrypt hashing with salt rounds
- **Token Refresh**: Automatic token renewal
- **Role-based Access**: Admin and user role management

### 📋 Task Management
- **Full CRUD Operations**: Create, Read, Update, Delete tasks

### 🗂️ Column Management
- **Dynamic Columns**: Create custom workflow stages
- **Column Ordering**: Reorder columns for optimal workflow
- **Column Customization**: Rename and configure columns

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL document database
- **Mongoose** - Elegant MongoDB ODM
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing library
- **Cors** - Cross-origin resource sharing

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [MongoDB](https://www.mongodb.com/) (v5.0 or higher) or MongoDB Atlas
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Kimlong168/ANB-Taskflow-Backend.git

cd ANB-Taskflow-Backend
```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-board

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
BLACKLIST_CLEANUP_INTERVAL= 24 * 60 * 60 * 1000

# File upload
CLOUDINARY_CLOUD_NAME = xxxxx
CLOUDINARY_API_KEY = xxxxx
CLOUDINARY_API_SECRET = xxxxx

```

### 5. Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`


## 🚀 API Documentation

### Base URL
```
Development: http://localhost:3000/api
```
