/**
 * @file apps/api/src/vercel.ts
 * @description Serverless Express entrypoint for Vercel deployments (/api/index.js)
 */
import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes/index.ts';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.ts';

const app: Application = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Support both preserved '/api/v1/*' paths and stripped '/v1/*' paths across serverless rewrites
app.use('/api', apiRouter);
app.use('/', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
