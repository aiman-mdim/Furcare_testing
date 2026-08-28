🐾 FurCare

A full-stack pet care management platform designed to help pet owners access and manage pet-related services from one place.
FurCare provides features for pet management, authentication, bookings and orders, lost & found functionality, and AI-Chat doctor.

## ✨ Features

* 🔐 User authentication and authorization using JWT
* 🐶 Pet profile and pet management
* 📦 Order and service management
* 🔎 Lost & Found pet functionality
* 📱 Responsive React user interface
* 🗄️ MongoDB database integration
* 🌐 RESTful API architecture
* 🤖 Responsive AI Doctor Chat

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Lucide React
* Motion

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* CORS
* Cookie Parser
* dotenv

## 📂 Project Structure

Furcare_testing/
├── src/                    # React frontend source code
├── server/
│   ├── middleware/         # Authentication and other middleware
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic and services
│   └── db.ts               # Database connection
├── assets/                 # Static assets
├── server.ts               # Main Express server
├── index.html              # Application entry HTML
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── vercel.json             # Deployment configuration


# 🔌 API Modules

The backend is organized into separate route modules for major application features.

### Main API Modules

* Authentication
* Pet Management
* Orders and Services
* Lost & Found

# 🔐 Authentication

FurCare uses **JSON Web Tokens (JWT)** for user authentication and authorization.


# 🗄️ Database

FurCare uses **MongoDB** as the primary database.

**Mongoose** is used to:

* Define database schemas
* Create models
* Perform CRUD operations
* Connect the Node.js backend with MongoDB

# 🤖 AI Features

* 🩺 **AI Pet Doctor:** Provides AI-powered assistance for pet health-related questions and offers basic guidance based on the user's concerns.
* 🐾 Helps pet owners better understand common pet health issues and care needs.

# 🌐 Deployment

The project includes a `vercel.json` configuration file for deployment settings.

Before deployment, make sure all required environment variables are configured in your deployment platform.

# 👥 Contributors

This project was developed as an academic full-stack web application project by the **FurCare project team**.


⭐ If you like this project, consider giving the repository a star!
