// src/index.ts
import express from "express";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import eventRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();
const PORT = process.env.SERVER_PORT || 4000;

const app = express();
app.use(morgan('combined'));
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
  entities: [__dirname + "/models/*.ts"],
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

app.use('/api/v1', eventRoutes);
app.use('/api/v1', userRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

