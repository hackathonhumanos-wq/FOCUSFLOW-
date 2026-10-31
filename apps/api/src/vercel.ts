/**
 * @file apps/api/src/vercel.ts
 * @description Serverless Express entrypoint for Vercel deployments (/api/index.js)
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
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

/**
 * Normalizes Vercel rewrite query parameter (`__ff_path`) before Express parses req.url / req.query
 */
export default function handler(req: IncomingMessage, res: ServerResponse): void {
  const rawUrl = req.url || '/';
  const parsedUrl = new URL(rawUrl, 'http://localhost');
  const rewrittenSegments = parsedUrl.searchParams.getAll('__ff_path').filter(Boolean);

  if (rewrittenSegments.length > 0 || parsedUrl.searchParams.has('__ff_path')) {
    parsedUrl.searchParams.delete('__ff_path');
    const remainingQuery = parsedUrl.searchParams.toString();
    let pathname = parsedUrl.pathname;

    if (
      rewrittenSegments.length > 0 &&
      (pathname === '/' ||
        pathname === '/api' ||
        pathname === '/api/' ||
        pathname === '/api/index' ||
        pathname === '/api/index.js')
    ) {
      const cleanSubpath = rewrittenSegments.join('/').replace(/^\/+/, '');
      pathname = `/api/${cleanSubpath}`;
    }

    req.url = `${pathname}${remainingQuery ? `?${remainingQuery}` : ''}`;
  }

  app(req, res);
}
