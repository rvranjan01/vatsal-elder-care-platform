# 🧓 Vatsal – Elder Care Management System

Vatsal is a modern full-stack web platform designed to support elderly users, their families, and care providers with a secure and user-friendly experience. It brings together health monitoring, wellness activities, appointment booking, and care coordination in one place.

## ✨ Overview

This project helps elders stay connected with their caregivers while allowing families to monitor and support them easily. The platform includes role-based dashboards for elders, family members, doctors, companions, nurses, and admins.

## 📸 Screenshots

- 🏠 Dashboard overview
- 🩺 Doctor / companion booking flow
- 🧘 Health, yoga, and games experience

Example placeholders:

- ![Dashboard Screenshot](./Assets/1%20(1).png)
- ![Admin Dashboard](./Assets/1%20(2).png)
- ![Local Events](./Assets/1%20(6).png)

> Replace the placeholder image paths with your actual screenshots once they are available.

## 🌐 Live Demo

- Live Website: https://vatsal-mu.vercel.app/


## 🚀 Features

### 👴 Elder Features

- Secure registration and login
- Personalized dashboard access
- Health tracking and wellness resources
- Games, yoga, chat, and activity support

### 👨‍👩‍👧 Family Features

- Family member registration and linking
- Secure access to connected elder information
- Better care coordination and monitoring

### 🩺 Care Provider Features

- Doctor, companion, and nurse profiles
- Booking and appointment management
- Role-based dashboard experience

### 🛡️ Security & Authentication

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Secure backend APIs

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- Bootstrap
- React Icons / Bootstrap UI components

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Socket.IO
- Nodemailer

### Database

- MongoDB
- Mongoose ODM

## 📂 Project Structure

```text
vatsal-elder-care-platform/
├── client/           # React frontend
├── server/           # Node.js + Express backend
├── scripts/          # Utility scripts
├── README.md
└── LICENSE
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/rvranjan01/vatsal-elder-care-platform.git
cd vatsal-elder-care-platform
```

### 2️⃣ Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder with values like:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3️⃣ Setup the frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

The frontend will run at:

```text
http://localhost:3000
```

## 🔄 Basic Workflow

1. An elder registers and logs in.
2. Family members or caregivers link to the elder account.
3. Care providers can be viewed and booked.
4. Health, wellness, and activity modules become available through the dashboard.

## 📌 Future Improvements

- Enhanced health analytics
- Reminder and notification system
- More personalized dashboards
- Improved deployment and CI/CD setup

## 👨‍💻 Author

- Ranjan Kumar Verma
- Email: vermaranjan2001@gmail.com

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
