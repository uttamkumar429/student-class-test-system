# 🎓 Student Class Test System

> A production-ready backend application for managing student class tests, question banks, exams, results, analytics, and reports.

---

## ✨ Features

- 🔐 JWT Authentication
- 👨‍🎓 Student Management
- 👨‍💼 Admin Management
- 📝 Question Bank
- 📚 Test Management
- 🚀 Publish Tests
- 📊 Dashboard & Analytics
- 📑 Reports (PDF & Excel)
- 📖 Swagger API Documentation
- 🧪 Jest + Supertest Integration Testing
- 🛡️ Security with Helmet, Rate Limiter & Mongo Sanitize

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Swagger
- Helmet
- Express Rate Limit
- Morgan
- Multer
- PDFKit
- ExcelJS

### Testing

- Jest
- Supertest
- MongoDB Memory Server

---

## 📁 Project Structure

```text
server/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
├── tests/
├── utils/
├── app.js
├── server.js
└── package.json
```

---

## ⚙️ Installation

```bash
git clone <repository-url>

cd server

npm install
```

---

## 🔐 Environment Variables

Create a `.env` file using `.env.example`.

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

---

## ▶️ Running the Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## 🧪 Running Tests

Run all tests

```bash
npm test
```

Watch mode

```bash
npm run test:watch
```

Coverage

```bash
npm run test:coverage
```

---

## 📖 API Documentation

Swagger Documentation

```
http://localhost:5000/api/docs
```

Available only in development mode.

---

## 🔒 Security Features

- Helmet
- CORS
- Rate Limiter
- MongoDB Query Sanitization
- JWT Authentication
- Cookie Parser
- Environment Variables
- Graceful Shutdown

---

## 📈 Current Status

- ✅ Authentication Module
- ✅ Student Module
- ✅ Admin Module
- ✅ Profile Module
- ✅ Question Module
- ✅ Test Module
- ✅ Publish Test Module
- ✅ Dashboard Module
- ✅ Analytics Module
- ✅ Reports Module

---

## 🧪 Test Status

- ✅ 16 Test Suites
- ✅ 95 Tests Passing
- ✅ 0 Failed Tests

---

## 🚀 Deployment

Backend: Render

Frontend: Vercel

Database: MongoDB Atlas

---

## 🔮 Future Scope

- Online Live Exam
- Email Notifications
- Attendance Module
- AI Question Generator
- Multi-School Support
- Real-Time Exam Monitoring

---

## 👨‍💻 Author

**Uttam**

---

## 📄 License

This project is licensed under the ISC License.