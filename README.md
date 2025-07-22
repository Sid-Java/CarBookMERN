# Car Booking System - MERN Stack

A full-stack car and bike booking system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User Authentication (JWT)
- Admin Dashboard
- Vehicle Management
- Booking System
- Email Notifications
- Responsive Design
- Image Upload

## Tech Stack

### Frontend
- React
- Material-UI (MUI)
- React Router
- Axios
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for emails
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/Sid-Java/CarBookMERN.git
cd CarBookMERN
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Create .env file in backend directory with:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
PORT=5000
```

5. Start the backend server
```bash
cd backend
node server.js
```

6. Start the frontend development server
```bash
cd frontend
npm run dev
```

## Admin Account
To create an admin account:
```bash
cd backend
node createAdmin.js
```

Default admin credentials:
- Email: admin@test.com
- Password: 123456

## Features

### User Features
- Browse vehicles
- View vehicle details
- Book vehicles
- View booking history
- Receive email notifications

### Admin Features
- Manage vehicles (CRUD)
- View all bookings
- Add/Edit vehicle details
- Upload vehicle images

## Contributing

Feel free to fork this repository and submit pull requests.

## License

This project is licensed under the MIT License.