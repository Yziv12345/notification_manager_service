import { Request, Response, NextFunction } from 'express';
import { userStore } from '../models/userStore';

const rateLimits: Record<string, number[]> = {};

const rateLimiter = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { recipient } = req.body;

  console.log(`📨 RateLimiter called for recipient: ${recipient}`);

  const user =
    userStore.getByEmail(recipient) || userStore.getByTelephone(recipient);

  if (!user) {
    console.warn(`❌ RateLimiter: No user found for recipient: ${recipient}`);
    return res.status(404).json({ error: 'User not found for rate limiting.' });
  }

  const now = Date.now();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '1000', 10);

  for (const [channel, enabled] of Object.entries(user.preferences)) {
    if (!enabled) {
      console.log(`⏩ Skipping ${channel} - disabled in preferences for ${user.email}`);
      continue;
    }

    const limit = parseInt(
      process.env[channel.toUpperCase() + '_RATE_LIMIT'] || '1',
      10
    );

    const key = `${channel}:${user.email}`;
    if (!rateLimits[key]) {
      rateLimits[key] = [];
    }

    // Filter out old timestamps
    rateLimits[key] = rateLimits[key].filter(ts => now - ts < windowMs);

    console.log(
      `🔍 Checking rate for ${channel.toUpperCase()} -> ${user.email}: ${rateLimits[key].length}/${limit} in window (${windowMs}ms)`
    );

    if (rateLimits[key].length >= limit) {
      console.warn(`🚫 Rate limit hit for ${key}`);
      return res.status(429).json({
        error: `Too many ${channel.toUpperCase()} notifications for ${user.email}. Try again later.`,
      });
    }

    rateLimits[key].push(now);
    console.log(`✅ Allowed ${channel.toUpperCase()} for ${user.email}`);
  }

  next();
};

export default rateLimiter;
