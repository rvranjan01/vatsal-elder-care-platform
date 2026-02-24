# 🧓 Vatsal – Elder Care Management System

Vatsal is a full-stack web application designed to help elderly users manage their health, activities, and family monitoring in a secure and user-friendly environment.

This system allows elders to track their health data, play cognitive games, use yoga resources, and allows family members to monitor their linked elder’s data securely.

---

## 🚀 Features Implemented (Current Stage)

### 👴 Elder
- Register with unique username
- Login with JWT authentication
- Secure dashboard access
- Username-based identity for family mapping

### 👨‍👩‍👧 Family
- Register using elder’s unique username
- Secure mapping to specific elder
- Role-based login system

### 🔐 Authentication
- JWT-based authentication
- Role-based access (Elder / Family)
- Password hashing using bcrypt
- Secure mapping using MongoDB ObjectId

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcryptjs

### Database
- MongoDB
- Mongoose ODM

---

## 📂 Project Structure
Vatsal/
│
├── client/ # React Frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
├── server/ # Node + Express Backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
│
└── README.md


---
## ⚙️ How To Run The Project
---
### 🔹 1️⃣ Clone The Repository


- git clone <your-repo-link>
- cd Vatsal
---
### 🔹 2️⃣ Setup Backend (Server)
- cd server
- npm install
---
Create a .env file inside server folder:
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key

Start backend:
- npm run dev
OR
- nodemon server.js

Server will run on:
http://localhost:5000

---
### 🔹 3️⃣ Setup Frontend (Client)
---
Open new terminal:
- cd client
- npm install
- npm start

Frontend will run on:
http://localhost:3000

### 🔄 Current System Flow

1. Elder registers with a unique username.
2. Family registers using that username.
3. Backend verifies username and maps family to elder.
4. JWT token is generated on login.
5. Protected routes use token authentication.

### 🔮 Upcoming Features

1. Health data management
2. Game tracking system
3. Medicine reminder system
4. Yoga module
5. Role-based dashboard filtering
6. Route protection middleware
7. Deployment (Render / Vercel)


👨‍💻 Author

Ranjan Kumar Verma
Full Stack Developer

### 📌 Note

### This project is under active development. Features will be updated progressively.