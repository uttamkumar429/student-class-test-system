const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
  ],

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