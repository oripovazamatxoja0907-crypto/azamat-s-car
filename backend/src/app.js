const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { clerkMiddleware } = require("@clerk/express");
const carsRoutes = require("./routes/cars.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(morgan("dev"));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      message: "Backend ishladi!!!",
      timestamp: new Date().toISOString(),
    },
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      name: "Kolleksiya API",
      version: "1.0.0",
      endpoints: [
        "GET /health",
        "GET /api/cars",
        "GET /api/cars/:id",
        "POST /api/cars",
        "PUT /api/cars/:id",
        "DELETE /api/cars/:id",
      ],
    },
  });
});

app.use("/api/cars", carsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint topilmadi",
  });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ success: false, error: "JSON noto'g'ri yozilgan" });
  }

  if (Array.isArray(err.issues)) {
    return res.status(400).json({
      success: false,
      error: err.issues[0]?.message || "Ma'lumotlar noto'g'ri",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  console.error(err);
  res.status(500).json({ success: false, error: "Server xatosi" });
});

module.exports = app;
