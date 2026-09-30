const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const prisma = require("./prisma");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      endpoints: ["GET /health", "GET /api/cars"],
    },
  });
});

app.get("/api/cars", async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: cars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server xatosi",
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint topilmadi",
  });
});

module.exports = app;
