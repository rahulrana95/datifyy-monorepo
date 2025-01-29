// src/index.ts
import express from "express";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import allRoutes from "./routes/allRoutes";
import morgan from "morgan";
import cors from "cors";

dotenv.config();
const PORT = process.env.SERVER_PORT || 4000;

const app = express();

const allowedOrigins = ['https://datifyy.com'];

app.use(
  cors({
    origin: allowedOrigins, // Ensure this matches your frontend domain
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());


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
