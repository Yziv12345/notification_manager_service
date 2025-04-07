
import { Request, Response, NextFunction } from 'express';
import { errorTracker } from '../utils/errorTracker';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorTracker.recordRequest();
  errorTracker.recordError();

  console.error('🔥 Global Error:', err);

  res.status(500).json({
    error: 'Unhandled system error',
    message: err.message || 'Something went wrong',
  });
};
