# 🎓 Student Class Test System

> A production-ready full-stack application for managing student class tests, question banks, online exams, results, analytics, reports, and student performance.

The **Student Class Test System** provides a complete examination workflow for both administrators and students. Administrators can manage students, create questions, build and publish tests, monitor exam activity, analyze performance, and generate reports. Students can securely log in, manage their profiles, attempt available exams, submit answers, and view their results.

---

## ✨ Features


### 🔐 Authentication & Authorization

- JWT-based authentication
- Secure student registration and login
- Admin login
- Role-based authorization
- Protected API routes
- Password hashing using bcrypt
- Secure token verification
- Request validation

### 👨‍💼 Admin Features

- Admin dashboard
- Student management
- Question bank management
- Create, update, and delete questions
- Search, filter, sort, and paginate questions
- Create and manage tests
- Publish and manage exams
- View analytics
- Generate reports
- Manage announcements
- System settings

### 👨‍🎓 Student Features

- Student registration and login
- Profile management
- Profile photo upload
- Student dashboard
- View available exams
- Attempt exams
- Submit exams
- View results
- Notification preferences
- Student notifications

---

## 📝 Question Bank

The question management system supports:

- Subject
- Chapter
- Difficulty level
- Multiple-choice questions
- Four answer options
- Correct answer
- Explanation
- Marks
- Question creator information

Supported difficulty levels:

- Easy
- Medium
- Hard

Additional features:

- Search questions
- Filter by subject
- Filter by chapter
- Filter by difficulty
- Pagination
- Sorting
- Question metadata

---

## 📚 Complete Exam Workflow

```text
Admin Login
     ↓
Create Question
     ↓
Create Test
     ↓
Publish Test
     ↓
Student Login
     ↓
View Available Exam
     ↓
Attempt Exam
     ↓
Submit Exam
     ↓
Result Generation
     ↓
Admin Analytics & Reports

```

---

## 📊 Dashboard & Analytics

The admin dashboard provides important system statistics, including:

- Total students
- Active students
- Blocked students
- Total teachers
- Total questions
- Total tests
- Published tests
- Draft tests
- Archived tests
- Completed tests
- Total attempts
- Today's attempts
- Recent tests
- Recent questions
- Upcoming tests
- Subject analytics
- Monthly analytics
- Difficulty analytics
- Test status analytics

---

## 📑 Reports

The application supports report generation and analysis, including:

- Student performance reports
- Exam-related reports
- Analytics reports
- PDF reports
- Excel reports

---

## 🖼️ Profile Image Upload

Profile image upload is handled securely using:

- Multer
- File validation
- Image type validation
- File size validation
- Cloudinary

```text
Image Selected
      ↓
Multer Validation
      ↓
File Type Validation
      ↓
File Size Validation
      ↓
Cloudinary Upload
      ↓
Profile Updated
```

---

## 📁 Project Structure

```text
student-class-test-system/
│
├── client/
│   ├── src/
│   └── ...
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── tests/
│   ├── utils/
│   ├── scripts/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── README.md
├── PROJECT_DOCUMENTATION.md
└── .gitignore

```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/uttamkumar429/student-class-test-system.git
```

```bash
cd student-class-test-system
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

> Never commit your `.env` file or sensitive credentials to GitHub.

---

## ▶️ Running the Application

### Backend

Inside the `server` directory:

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

Inside the `client` directory:

```bash
npm run dev
```

The frontend typically runs on:

```text
http://localhost:5173
```

---

## 🧪 Testing

The backend includes automated testing using:

- Jest
- Supertest
- MongoDB Memory Server

### Run All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Test Coverage

```bash
npm run test:coverage
```

---

## 🧪 Current Test Status

| Metric | Status |
|---|---|
| Test Suites | ✅ 27 |
| Tests Passing | ✅ 173 |
| Failed Tests | ✅ 0 |

🎉 **All current automated tests are passing successfully.**

---

## 📖 API Documentation

Swagger API documentation is available in development mode.

Start the backend and open:

```text
http://localhost:5000/api/docs
```

> Swagger documentation is disabled in production.

---

## 🔒 Security Features

The application includes multiple security layers:

### Authentication & Authorization

- JWT-based authentication
- Role-based authorization
- Protected API routes
- Password hashing using bcrypt

### API Security

- Helmet security headers
- CORS configuration
- API rate limiting
- Request validation
- Centralized error handling

### Database Security

- MongoDB query sanitization
- Mongoose schema validation

### File Upload Security

- Image file validation
- File type validation
- File size validation
- Cloudinary storage

### Production Security

- Environment variables
- Graceful shutdown
- Production CORS configuration

---

## 🏗️ Backend Architecture

The backend follows a layered architecture to maintain clean separation of concerns and reusable business logic.

```text
Client Request
       ↓
Routes
       ↓
Middleware
       ↓
Controllers
       ↓
Services
       ↓
Models
       ↓
MongoDB Atlas
```

This architecture provides:

- Separation of concerns
- Reusable business logic
- Better maintainability
- Easier testing
- Improved scalability

---

## 🔑 Authentication Flow

```text
User Login
     ↓
Validate Credentials
     ↓
Compare Password with bcrypt
     ↓
Generate JWT Token
     ↓
Return Token
     ↓
Client Sends Bearer Token
     ↓
Authentication Middleware
     ↓
Verify JWT
     ↓
Load User
     ↓
Authorize Role
     ↓
Access Protected Resource
```

Protected API requests use:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🚀 Deployment

The application uses cloud services for deployment and infrastructure.

| Service | Purpose |
|---|---|
| Render | Application Deployment |
| MongoDB Atlas | Cloud Database |
| Cloudinary | Profile Image Storage |
| GitHub | Source Code & Version Control |

---

## 📈 Current Project Status

| Module | Status |
|---|---|
| Authentication | ✅ Complete |
| Admin Authentication | ✅ Complete |
| Student Management | ✅ Complete |
| Profile Management | ✅ Complete |
| Profile Image Upload | ✅ Complete |
| Question Bank | ✅ Complete |
| Test Management | ✅ Complete |
| Publish Test | ✅ Complete |
| Student Dashboard | ✅ Complete |
| Student Exam | ✅ Complete |
| Exam Submission | ✅ Complete |
| Result System | ✅ Complete |
| Admin Dashboard | ✅ Complete |
| Analytics | ✅ Complete |
| Reports | ✅ Complete |
| Notifications | ✅ Complete |
| System Settings | ✅ Complete |
| Automated Testing | ✅ 173 Tests Passing |
| Deployment | ✅ Complete |

---

## 🔄 Verified End-to-End Flow

The following complete workflow has been successfully tested:

```text
Admin Login
      ↓
Create Question
      ↓
Create Test
      ↓
Publish Test
      ↓
Student Login
      ↓
Student Dashboard
      ↓
Attempt Exam
      ↓
Submit Exam
      ↓
View Result
      ↓
Admin Analytics
      ↓
Admin Reports
```

---

## 🔮 Future Improvements

Possible future enhancements include:

- Email notifications
- Forgot password and password reset
- Refresh token authentication
- Multi-school support
- AI-powered question generation
- Real-time exam monitoring
- Advanced exam scheduling
- Auto-save answers
- Advanced student performance insights
- Bulk question import using Excel or CSV
- Real-time notifications
- Docker support
- CI/CD pipeline
- Redis caching

---

## 👨‍💻 Author

**Uttam Kumar**

GitHub: https://github.com/uttamkumar429

---

## 📄 License

This project is licensed under the **ISC License**.

---

⭐ If you found this project useful, consider giving the repository a star!