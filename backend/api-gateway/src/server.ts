import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  console.log(`[GATEWAY] ${req.method} ${req.url}`);
  next();
});

// Expose individual swagger JSONs
app.get('/docs/auth.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../user-auth-service/build/swagger.json'));
});
app.get('/docs/extinguishers.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../extinguisher-service/build/swagger.json'));
});
app.get('/docs/inspections.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../inspection-service/build/swagger.json'));
});
app.get('/docs/reports.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../reporting-service/build/swagger.json'));
});

// Setup aggregated Swagger UI
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      { url: '/docs/auth.json', name: 'Auth Service' },
      { url: '/docs/extinguishers.json', name: 'Extinguisher Service' },
      { url: '/docs/inspections.json', name: 'Inspection Service' },
      { url: '/docs/reports.json', name: 'Reporting Service' }
    ]
  }
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, swaggerOptions));

app.use(createProxyMiddleware({
  target: 'http://localhost:3000', // Default fallback
  router: function (req) {
    if (req.originalUrl.startsWith('/api/auth')) return 'http://localhost:3001';
    if (req.originalUrl.startsWith('/api/users')) return 'http://localhost:3001';
    if (req.originalUrl.startsWith('/api/extinguishers')) return 'http://localhost:3002';
    if (req.originalUrl.startsWith('/api/inspections')) return 'http://localhost:3003';
    if (req.originalUrl.startsWith('/api/reports')) return 'http://localhost:3004';
    return 'http://localhost:3000';
  },
  changeOrigin: true,
  pathRewrite: function (path, req) {
    if (path.startsWith('/api/extinguishers')) return path.replace('/api/extinguishers', '/extinguishers');
    if (path.startsWith('/api/inspections')) return path.replace('/api/inspections', '/inspections');
    if (path.startsWith('/api/reports')) return path.replace('/api/reports', '/reports');
    // Auth service and users expect /api/auth and /api/users to remain intact due to @Route('api/auth')
    return path;
  }
}));

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`API Gateway is running on port ${PORT} (0.0.0.0)`);
});
