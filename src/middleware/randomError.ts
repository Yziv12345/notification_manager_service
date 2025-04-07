
import { Request, Response, NextFunction } from 'express';
import { errorTracker } from '../utils/errorTracker';

const ERROR_RATE: number = parseFloat(process.env.ERROR_RATE || '0.1');

const randomError = (req: Request, res: Response, next: NextFunction) => {
  errorTracker.recordRequest();
  const { actualErrorRate } = errorTracker.getStats();

  const shouldFail = Math.random() < ERROR_RATE || actualErrorRate > ERROR_RATE;

  if (shouldFail) {
    errorTracker.recordError();
    return res.status(500).json({
      error: 'Random server error occurred.',
      meta: errorTracker.getStats(),
    });
  }

  next();
};

export default randomError;
