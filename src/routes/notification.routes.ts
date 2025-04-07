import { Router, Request, Response, NextFunction } from 'express';
import rateLimiter from '../middleware/rateLimiter';
import randomError from '../middleware/randomError';
import { createNotification } from '../services/notification.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/send', rateLimiter, randomError, async (req: Request, res: Response) => {
  const { recipient, sender, message } = req.body;

  if (!recipient || !sender || !message) {
    return res.status(400).json({ error: 'recipient, sender, and message are required.' });
  }

  try {
    const result = await createNotification({ recipient, sender, message });
    return res.status(201).json(result); 
  } catch (err: any) {
    return res.status(404).json({ error: err.message }); 
  }
});


export default router;
