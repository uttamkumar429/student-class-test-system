# TestVeda — SaaS-Style Online Assessment & Examination Platform

> Production-ready full-stack assessment platform for question management, test creation, online examinations, results, analytics, and reporting.

## 1. Product Overview

TestVeda is a SaaS-style online assessment platform for managing the complete examination lifecycle in one centralized application.

```text
Admin Login
  ↓
Question Bank
  ↓
Test Creation
  ↓
Test Configuration
  ↓
Publish Test
  ↓
Student Dashboard
  ↓
Available Exam
  ↓
Start / Attempt Exam
  ↓
Submit
  ↓
Result
  ↓
Review Answers
  ↓
Admin Analytics & Reports
```

The current implementation provides the core assessment product. Multi-tenancy, subscription billing, tenant isolation, and usage-based billing are future SaaS extensions, not current implemented features.

## 2. Product Goals

- Centralized online test management
- Reusable question bank
- Secure admin/student access
- Role-based authorization
- Test publishing with snapshots
- Online exam attempts
- Result generation
- Answer review
- Hindi/English review support where implemented
- Admin analytics
- Student/test reporting
- CSV, Excel, and PDF exports
- Profiles, announcements, notifications, and settings
- Production deployment

## 3. Users

### Administrator

Admin capabilities include dashboard statistics, student management, question management, test creation/configuration, publishing, exam monitoring, results, analytics, reports, exports, announcements, and settings.

Relevant administrative routes support `admin` and `superAdmin` where configured.

### Student

Student capabilities include registration, login, profile management, profile photo upload, dashboard access, available exams, exam attempts, submission, results, answer review, notifications, and notification preferences.

## 4. Core Modules

```text
Authentication
Admin Dashboard
Student Dashboard
Students
Question Bank
Tests
Publishing
Exams
Results
Review Answers
Analytics
Reports
Profiles
Announcements
Notifications
Notification Preferences
System Settings
```

## 5. Technology Stack

### Frontend

- React.js
- React Router
- Redux / Redux Toolkit
- Axios
- Tailwind CSS
- Lucide React
- Recharts
- Vite

### Backend

- Node.js
- Express.js
- Mongoose
- JWT
- bcrypt
- Helmet
- express-rate-limit
- MongoDB sanitization
- Input validation
- Multer

### Infrastructure

- MongoDB Atlas
- Cloudinary
- Render
- Git / GitHub

### API & Reporting

- Swagger / swagger-jsdoc / swagger-ui-express
- PDFKit
- ExcelJS
- CSV generation

## 6. High-Level Architecture

```text
Browser
   ↓
React Frontend
   │ HTTPS / REST API
   ↓
Node.js + Express Backend
   ├── MongoDB Atlas
   └── Cloudinary
```

The application separates presentation, API processing, business logic, and persistence.

## 7. Frontend Architecture

```text
client/
└── src/
    ├── components/
    ├── layouts/
    ├── pages/
    ├── redux/
    ├── routes/
    ├── services/
    ├── App.jsx
    └── main.jsx
```

Pages represent screens, components provide reusable UI, Redux manages application state, routes control navigation, and service modules centralize API calls.

## 8. Backend Architecture

```text
Request
 ↓
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Model
 ↓
MongoDB
```

Routes define endpoints. Middleware handles authentication, authorization, validation, rate limiting, uploads, sanitization, and errors. Controllers coordinate HTTP requests. Services contain reusable business logic. Models define MongoDB structures.

## 9. Authentication

TestVeda uses JWT authentication.

### Registration

```text
Registration
 ↓
Validation
 ↓
Password Validation
 ↓
bcrypt Hashing
 ↓
MongoDB
 ↓
JWT
```

Registration validates full name, email, Indian phone number, and password requirements.

### Login

```text
Login Request
 ↓
Find User
 ↓
Compare Password
 ↓
Generate JWT
 ↓
Return User + Token
```

## 10. JWT Protection

Protected requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

The protection middleware verifies the token, finds the user, rejects missing/blocked users, and attaches the authenticated user to `req.user`.

Configuration:

```env
JWT_SECRET=
JWT_EXPIRES_IN=
```

## 11. Role-Based Authorization

Authentication identifies the user; authorization determines whether the user can access a resource.

Example:

```javascript
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboard
);
```

Administrative examination routes can use:

```javascript
authorize("admin", "superAdmin")
```

## 12. Question Bank

Questions contain:

| Field | Description |
|---|---|
| subject | Subject |
| chapter | Chapter |
| difficulty | Easy, Medium, Hard |
| question | Question text |
| optionA | Option A |
| optionB | Option B |
| optionC | Option C |
| optionD | Option D |
| correctAnswer | Correct option |
| explanation | Optional explanation |
| marks | Marks |
| createdBy | Admin reference |

Supported operations:

```text
Create
List
Metadata
Get by ID
Update
Delete
```

Search/filtering supports subject, chapter, question text, difficulty, pagination, and sorting.

## 13. Test Management

Typical lifecycle:

```text
Create Test
 ↓
Add Questions
 ↓
Configure
 ↓
Save Draft
 ↓
Publish
```

Test data can include title, subject, duration, total marks, total questions, schedule, questions, and status.

## 14. Publishing and TestSnapshot

Publishing creates a published exam snapshot:

```text
Test
 ↓
Publish Service
 ↓
TestSnapshot
 ↓
Published Exam
```

The snapshot stores the published exam data required for an attempt, including test reference, title, subject, duration, marks, question count, schedule, and question content.

This separates the published exam from later edits to editable test/question records.

## 15. Student Examination Lifecycle

```text
Student Login
 ↓
Dashboard
 ↓
Available Exam
 ↓
Start Exam
 ↓
Published Snapshot
 ↓
Answer Questions
 ↓
Submit
 ↓
Result
 ↓
Review Answers
```

An exam attempt is associated with a student and a `TestSnapshot`.

## 16. Exam Attempts

Attempt data can track:

- Student
- Test snapshot
- Start time
- Submission time
- Status
- Total questions
- Total marks
- Obtained marks
- Percentage
- Time taken
- Current question index

Relationship:

```text
Student + TestSnapshot → ExamAttempt
```

## 17. Results

```text
Submit
 ↓
Evaluate Answers
 ↓
Calculate Marks
 ↓
Calculate Percentage
 ↓
Result
```

Result information includes obtained marks, total marks, percentage, status, and time taken.

## 18. Review Answers

The review module can show question, student answer, correct answer, correctness, marks, and explanation where available.

Hindi/English review support is included where implemented.

## 19. Admin Dashboard

The dashboard can aggregate:

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
- Recent tests/questions
- Upcoming tests
- Recent activities
- Subject, monthly, difficulty, question-subject, and test-status analytics

## 20. Analytics

```text
Student Activity
 ↓
Exam Attempts
 ↓
Stored Result Data
 ↓
Analytics Aggregation
 ↓
Admin Dashboard / Reports
```

Analytics/reporting includes average marks, average percentage, highest/lowest marks, pass/fail percentages, submitted/running attempts, top performers, weak students, and configured subject/difficulty/test-status analytics.

## 21. Admin Reports

```text
Published Exam
 ↓
Select Exam
 ↓
Statistics
 ↓
Student Attempts
 ↓
Individual Student Report
 ↓
Export
```

Reports use published `TestSnapshot` data for published exam selection.

### Statistics

Can include exam title, subject, attempts, submitted/running counts, average marks/percentage, highest/lowest marks, and pass/fail percentages.

### Student Attempts

Can include student ID, name, email, marks, total marks, percentage, status, time taken, started time, and submitted time.

### Individual Report

```text
Attempt
 ↓
Student
 ↓
Exam
 ↓
Summary
 ↓
Question-level result
```

## 22. Report Exports

### CSV

```text
Student ID
Student Name
Email
Marks
Total Marks
Percentage
Status
Time Taken
Submitted At
```

### Excel

Exam results can be exported as `.xlsx`.

### PDF

Individual reports contain student details, exam details, summary, and question-level reporting.

## 23. Profile Management

Profiles are linked to users:

```text
Profile.userId → User._id
```

Profile information can include photo, Cloudinary public ID, school, class, section, roll number, date of birth, gender, state, district, and bio.

## 24. Profile Photo Upload

```text
Select Image
 ↓
MIME Validation
 ↓
File Size Validation
 ↓
Memory Buffer
 ↓
Cloudinary
 ↓
Delete Previous Image if Available
 ↓
Save URL + Public ID
```

Current documented upload limit: **2 MB**.

## 25. Announcements, Notifications & Settings

The application includes announcement management, student notifications, notification preferences, and system settings.

## 26. API Overview

### Health

```http
GET /api/health
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Profile

```http
GET   /api/profile
PUT   /api/profile/update
PATCH /api/profile/photo
```

### Questions

```http
POST   /api/questions
GET    /api/questions
GET    /api/questions/metadata
GET    /api/questions/:id
PUT    /api/questions/:id
DELETE /api/questions/:id
```

### Admin Dashboard

```http
GET /api/admin/dashboard
```

### Admin Exams

```http
GET /api/admin/exams/published
GET /api/admin/exams/:snapshotId/monitor
GET /api/admin/exams/:snapshotId/attempts
GET /api/admin/exams/:snapshotId/attempts/:attemptId
```

### Admin Reports

```http
GET /api/admin/reports/attempts/:attemptId
GET /api/admin/reports/attempts/:attemptId/pdf
GET /api/admin/reports/exams/:snapshotId/csv
GET /api/admin/reports/exams/:snapshotId/excel
```

Admin analytics is exposed under the configured admin analytics route structure.

> The current server routes, controllers, services, and Swagger configuration are the authoritative API contract.

## 27. API Response Format

Success:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

Validation errors may contain an `errors` array.

## 28. Validation & Error Handling

```text
Incoming Request
 ↓
Validation Middleware
 ↓
Validator
 ↓
Controller
 ↓
Service
 ↓
Central Error Handler
 ↓
Standard Response
```

Validation reduces invalid data entering the database. Centralized error handling keeps API responses consistent.

## 29. Security

Implemented security layers include:

- JWT authentication
- Role-based authorization
- bcrypt password hashing
- Rate limiting
- Helmet security headers
- MongoDB sanitization
- Input validation
- CORS allowlist

Never commit real credentials or secrets.

## 30. Database Architecture

MongoDB Atlas is used with Mongoose.

Important entities include:

```text
User
Profile
Question
Test
TestSnapshot
ExamAttempt
StudentAnswer
Notifications
Announcements
System Settings
```

Core examination relationship:

```text
Test
 ↓
TestSnapshot
 ↓
ExamAttempt
 ↓
StudentAnswer
```

## 31. Project Structure

```text
student-class-test-system/
├── client/
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── redux/
│       ├── routes/
│       └── services/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── scripts/
│   ├── app.js
│   └── server.js
│
├── README.md
└── PROJECT_DOCUMENTATION.md
```

## 32. Environment Configuration

Example:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

Never commit production secrets.

## 33. Local Development

### Backend

```bash
cd server
npm install
npm run dev
```

Typical URL:

```text
http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Typical Vite URL:

```text
http://localhost:5173
```

## 34. Production Build

```bash
cd client
npm run build
```

Large bundle-size messages are optimization warnings, not build failures. Code splitting/lazy loading can be introduced later.

## 35. Swagger

Swagger is enabled outside production according to the backend configuration.

Typical local URL:

```text
http://localhost:5000/api/docs
```

Production Swagger access is disabled according to the current environment configuration.

## 36. Deployment Architecture

```text
                    INTERNET
                       │
                       ▼
              ┌─────────────────┐
              │ React Frontend  │
              │     Render      │
              └────────┬────────┘
                       │ HTTPS
                       ▼
              ┌─────────────────┐
              │ Express Backend │
              │     Render      │
              └───────┬─┬───────┘
                      │ │
                      ▼ ▼
               MongoDB  Cloudinary
                Atlas     Images
```

## 37. Production Checklist

```text
[ ] Environment variables configured
[ ] Secrets excluded from Git
[ ] MongoDB connection verified
[ ] CORS configured
[ ] JWT configuration verified
[ ] Secure admin credentials configured
[ ] Frontend build passes
[ ] Backend starts successfully
[ ] Health endpoint responds
[ ] Authentication tested
[ ] Authorization tested
[ ] Student flow tested
[ ] Test publishing tested
[ ] Exam submission tested
[ ] Results tested
[ ] Analytics tested
[ ] Reports tested
[ ] PDF tested
[ ] CSV tested
[ ] Excel tested
[ ] Production frontend tested
[ ] Production backend tested
```

## 38. Testing & Verification

Core end-to-end workflow:

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
Open Dashboard
 ↓
Start Exam
 ↓
Answer Questions
 ↓
Submit Exam
 ↓
View Result
 ↓
Admin Analytics
 ↓
Admin Reports
```

Recommended checks:

```bash
git diff --check
```

and:

```bash
cd client
npm run build
```

## 39. Git Workflow

```bash
git status
git diff --check
git add <files>
git diff --cached --check
git commit -m "Meaningful commit message"
git push origin main
```

Finish with:

```bash
git status
```

and confirm a clean working tree.

## 40. Troubleshooting

### API health

```json
{
  "success": true,
  "message": "TestVeda API is running successfully."
}
```

### Service export error

For errors such as `getExamsService is not a function`, verify that the service exports the expected function name and that the controller imports the same name.

### Reports shows no published exams

Verify:

```text
Published Test
 ↓
TestSnapshot
 ↓
GET /api/admin/exams/published
 ↓
Reports dropdown
```

### Dashboard content is clipped

Verify responsive grid sizing and the available content width after the sidebar. Avoid fixed-width cards that exceed the viewport.

## 41. SaaS-Style Expansion

Current platform:

```text
TestVeda
 ├── Admin
 ├── Students
 ├── Questions
 ├── Tests
 ├── Exams
 ├── Results
 ├── Analytics
 └── Reports
```

Future commercial SaaS architecture:

```text
TestVeda Platform
 ↓
Organizations / Tenants
 ↓
Organization Admins
 ↓
Teachers / Students
 ↓
Questions / Tests / Exams
 ↓
Attempts / Results
 ↓
Analytics / Reports
```

Multi-tenancy is a future extension.

## 42. Future Roadmap

### Authentication

- Email verification
- Forgot password
- Password reset
- Refresh tokens
- Session/device management

### Examination

- Advanced scheduling
- Negative marking
- Random question ordering
- Question pools
- Auto-save
- Resume interrupted exams

### Administration

- Bulk question import
- CSV/Excel question import
- Advanced filtering
- Audit logs
- Fine-grained permissions

### Performance

- Redis caching
- Database index review
- API optimization
- Frontend code splitting
- Lazy loading

### DevOps

- CI/CD
- Docker
- Automated integration tests
- Centralized logging
- Monitoring
- Error tracking

### SaaS

- Multi-tenancy
- Organization management
- Organization branding
- Subscription plans
- Usage limits
- Payment gateway
- Invoices
- Tenant-level analytics

## 43. Engineering Principles

1. Keep business logic in services.
2. Keep controllers thin.
3. Protect sensitive resources.
4. Validate input before database operations.
5. Preserve exam integrity with published snapshots.
6. Centralize frontend API communication.
7. Prefer backward-compatible changes.
8. Verify changes before deployment.

## 44. Final Product Flow

```text
                         TESTVEDA
                            │
              ┌─────────────┴─────────────┐
              │                           │
           ADMIN                       STUDENT
              │                           │
           Login                         Login
              │                           │
       Question Bank                  Dashboard
              │                           │
        Create Test                  Available Exam
              │                           │
       Configure Test                    │
              │                           │
        Publish Test ───────────────► Start Exam
              │                           │
        TestSnapshot                     │
              │                      Answer Questions
              │                           │
              │                       Submit Exam
              │                           │
              │                         Result
              │                           │
              │                      Review Answers
              │
          Analytics
              │
           Reports
              │
     ┌────────┼──────────┐
     │        │          │
Statistics Attempts  Student Report
                         │
                    PDF / CSV / Excel
```

## 45. Conclusion

TestVeda provides a complete full-stack online assessment workflow:

```text
Question Management
 ↓
Test Creation
 ↓
Test Publishing
 ↓
Published Snapshot
 ↓
Student Examination
 ↓
Submission
 ↓
Result
 ↓
Review
 ↓
Analytics
 ↓
Reports
 ↓
Export
```

It combines React, Node.js/Express, MongoDB Atlas, JWT authentication, role-based authorization, Cloudinary, Swagger, and Render into a maintainable assessment platform.

The current implementation is a strong foundation for a production assessment product and can be extended toward a full commercial multi-tenant SaaS platform.

---

## Documentation Maintenance

Update this document whenever a major feature, API contract, security mechanism, database workflow, deployment architecture, or SaaS capability changes.

**Product:** TestVeda
**Documentation Type:** Product + Technical + Operations
**Architecture:** SaaS-style full-stack assessment platform
**Primary Roles:** Admin / Student
