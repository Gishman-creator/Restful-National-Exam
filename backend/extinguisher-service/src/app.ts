import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
  console.log(`[EXTINGUISHER] ${req.method} ${req.originalUrl}`);
  next();
});

RegisterRoutes(app);

app.use('/docs', swaggerUi.serve, async (req: Request, res: Response) => {
  const swaggerDocument = require('../build/swagger.json');
  return res.send(swaggerUi.generateHTML(swaggerDocument));
});

app.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
  
  if (err instanceof Error) {
    let details = err.message;
    
    // Handle Tsoa validation errors or Mongoose validation errors
    if ((err as any).fields) {
      details = JSON.stringify((err as any).fields);
    } else if ((err as any).errors) {
      details = JSON.stringify((err as any).errors);
    }

    const isValidation = err.name === 'ValidateError' || err.name === 'ValidationError';
    
    return res.status(isValidation ? 422 : 500).json({
      message: isValidation ? 'Validation Failed' : 'Internal Server Error',
      details: details,
    });
  }
  
  next();
});

export { app };
