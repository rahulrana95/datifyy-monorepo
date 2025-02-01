// src/index.ts
import express from "express";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

import allRoutes from "./routes/allRoutes";
import morgan from "morgan";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";

const PORT = process.env.SERVER_PORT || 4000;

const app = express();

let allowedOrigins = ['https://datifyy.com'];
if (process.env.FRONTEND_URL_DEV) {
  allowedOrigins = [...allowedOrigins, process.env.FRONTEND_URL_DEV];
}

app.use(
  cors({
    origin: ["https://datifyy.com","http://localhost:3000"], // Allow only your frontend
    credentials: true, // Allow cookies and auth headers
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  })
);
app.use(cookieParser()); // Enables parsing cookies in `req.cookies`


// Create a rate limiter that allows 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});

// Apply rate limiting middleware globally to all routes
app.use(limiter);

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT) || 4000,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  synchronize: false,
  logging: true,
  entities: [__dirname + "/models/entities/*.ts"],
  ssl: {
    rejectUnauthorized: false,
  },
});
export { AppDataSource };

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

// Define a simple route
app.get("/", (req, res) => {
  res.send("Welcome to Datifyy Express Server!");
});

// Define a health
app.get("/health", (req, res) => {
  res.send("Welcome to Datifyy Express Server!");
});

app.use("/api/v1", allRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
