const allowedOrigins = [
  process.env.CLIENT_URL,

  "https://student-class-test-system-1.onrender.com",

  "http://localhost:3000",

  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {

    // Allow requests without origin
    // Example: Postman, server-to-server
    if (!origin) {
      return callback(null, true);
    }

    // Allow known frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);

    return callback(
      new Error(`Not allowed by CORS: ${origin}`)
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,

  optionsSuccessStatus: 200,

  maxAge: 86400,
};

module.exports = corsOptions;