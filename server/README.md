# 🎓 TestVeda – Backend

> Production-ready REST API for TestVeda, built with Node.js, Express.js, and MongoDB.

This backend powers the complete examination workflow of **TestVeda**. It provides secure authentication, role-based authorization, student management, question management, test creation and publishing, exam attempts, result generation, analytics, reports, notifications, profile management, and system settings.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Student registration
- Student login
- Admin login
- Role-based authorization
- Protected API routes
- Password hashing using bcrypt
- JWT token verification
- Request validation

---

### 👨‍💼 Admin Features

- Admin authentication
- Admin dashboard
- Student management
- Question bank management
- Create, update, and delete questions
- Search questions
- Filter questions
- Sort and paginate questions
- Create and manage tests
- Publish tests
- Manage exam availability
- View student performance
- Analytics and statistics
- Generate reports
- Manage announcements
- Manage notifications
- System settings

---

### 👨‍🎓 Student Features

- Secure registration and login
- Profile management
- Profile photo upload
- Student dashboard
- View available exams
- Attempt exams
- Submit exams
- View results
- Notification preferences
- Receive notifications

---

## 📝 Question Management

The question bank supports:

- Subject
- Chapter
- Difficulty level
- Multiple-choice questions
- Four answer options
- Correct answer
- Explanation
- Marks
- Question creator information

### Supported Difficulty Levels

- Easy
- Medium
- Hard

### Additional Features

- Search
- Subject filtering
- Chapter filtering
- Difficulty filtering
- Pagination
- Sorting
- Question metadata

---

## 📚 Test Management

Administrators can:

- Create tests
- Update tests
- Delete tests
- Add questions to tests
- Manage test status
- Publish tests
- View test details
- Manage exam availability
- Monitor completed attempts

---

## 🧪 Complete Exam Workflow

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

The backend provides analytics and statistics for administrators, including:

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

The reporting system supports:

- Student performance reports
- Exam-related reports
- Analytics reports
- PDF reports
- Excel reports

The backend uses appropriate services for generating downloadable reports.

---

## 🖼️ Profile Image Upload

Profile images are securely handled using:

- Multer
- File validation
- Image type validation
- File size validation
- Cloudinary

### Upload Flow

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
server/
│
├── config/          # Database, Cloudinary, and application configuration
├── controllers/     # Request handling and controller logic
├── middleware/      # Authentication, authorization, validation, and error handling
├── models/          # Mongoose database models
├── routes/          # API route definitions
├── services/        # Business logic and reusable services
├── validators/      # Request validation rules
├── tests/           # Automated test suites
├── utils/           # Utility and helper functions
├── scripts/         # Application scripts
│
├── app.js           # Express application configuration
├── server.js        # Application entry point
├── package.json     # Dependencies and scripts
└── README.md        # Backend documentation

---
## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/uttamkumar429/student-class-test-system.git
```

### 2. Navigate to the Project Directory

```bash
cd student-class-test-system
```

### 3. Navigate to the Backend Directory

```bash
cd server
```

### 4. Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Add the required environment variables:

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

## ▶️ Running the Backend

Make sure MongoDB and all required environment variables are configured before starting the server.

### Development Mode

Run the backend with:

```bash
npm run dev
```

The server will start in development mode.

### Production Mode

Run the backend with:

```bash
npm start
```

By default, the backend runs on:

```text
http://localhost:5000
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

Start the backend server and open:

```text
http://localhost:5000/api/docs
```

> Swagger documentation is disabled in production.

---

## 🔒 Security Features

The backend includes multiple security layers to help protect the application and its APIs.

### Authentication & Authorization

- JWT-based authentication
- Role-based authorization
- Protected API routes
- Password hashing using bcrypt
- Secure JWT token verification

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

The backend follows a layered architecture to maintain a clean separation of concerns and reusable business logic.

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
MongoDB
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

The backend is designed for deployment in a production environment.

### Deployment Stack

| Service | Purpose |
|---|---|
| Render | Backend application deployment |
| MongoDB Atlas | Cloud database |
| Cloudinary | Profile image storage |
| GitHub | Source code and version control |

Before deploying, make sure all required production environment variables are configured correctly.

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