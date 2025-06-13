import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import helmet from 'helmet';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import adminRoute from './routes/adminRoute';
import agentRoute from './routes/agentRoute';
import morgan from 'morgan';
import { Request } from "express";

dotenv.config();
connectDB();
const app = express();
app.use(helmet());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials:true,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});


app.use(cookieParser());
app.use(express.json());

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const PORT: number = parseInt(process.env.PORT || '8001', 10);

morgan.token("body", (req: Request) => JSON.stringify(req.body) || "No Body");
app.use(morgan("Request Body: :body"));
const logDirectory = path.join(__dirname, 'logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
console.log('Directory ::',__dirname);
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' } 
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use('/admin',adminRoute);
app.use('/auth',authRoute);
app.use('/user',userRoute);
app.use('/agent',agentRoute);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

