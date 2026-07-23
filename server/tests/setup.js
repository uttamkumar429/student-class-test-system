const {
  connectTestDB,
  disconnectTestDB,
} = require("./test-db");

beforeAll(async () => {
  process.env.NODE_ENV = "test";
   // Test Environment Variables
   
  process.env.JWT_SECRET = "test_jwt_secret";
  process.env.JWT_EXPIRES_IN = "1d";
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});