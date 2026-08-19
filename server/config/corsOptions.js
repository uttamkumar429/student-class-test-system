const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,

  optionsSuccessStatus: 200,
};

module.exports = corsOptions;