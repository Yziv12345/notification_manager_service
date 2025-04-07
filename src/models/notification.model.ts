import mongoose, { Document, Schema } from 'mongoose';

export interface NotificationDocument extends Document {
  channel: 'email' | 'sms';
  sender: string;
  recipient: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    channel: {
      type: String,
      enum: ['email', 'sms'],
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'sent', // or 'pending' if using a queue
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);
export default Notification;
