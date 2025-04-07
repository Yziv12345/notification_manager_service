import express from 'express';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification.routes';
import connectToMongoDB from './utils/db';
import { userStore } from './models/userStore';
import debugRoutes from './routes/debug.routes';
import userRoutes from './routes/user.routes';
import { globalErrorHandler } from './middleware/globalErrorHandler';

dotenv.config();

// No need to type manually — TypeScript infers the type
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/', notificationRoutes);
app.use('/users', userRoutes);
app.use(debugRoutes);
app.use(globalErrorHandler);

connectToMongoDB().then(() => {
  // Preload test users
  userStore.create({
    email: 'ironman@avengers.com',
    telephone: '+123456789',
    preferences: { email: true, sms: true }
  });

  userStore.create({
    email: 'loki@avengers.com',
    telephone: '+123456788',
    preferences: { email: true, sms: false }
  });

  userStore.create({
    email: 'hulk@avengers.com',
    telephone: '+123456787',
    preferences: { email: false, sms: false }
  });
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}).catch((err: any) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});
