import Notification, { NotificationDocument } from '../models/notification.model';
import { userStore } from '../models/userStore';
import axios from 'axios';  // Add axios to send HTTP requests

export interface NotificationInput {
  recipient: string; // email OR telephone
  sender: string;
  message: string;
}

// Simulate sending the notification for logging purposes
const simulateSend = (channel: string, recipient: string, message: string): void => {
  console.log(`📤 Simulating ${channel.toUpperCase()} send to ${recipient}: "${message}"`);
};

// Send notification to the notification service via HTTP request
const sendToNotificationService = async (channel: string, recipient: string, message: string) => {
  try {
    let response;

    // Using a switch statement instead of if-else
    switch (channel) {
      case 'email':
        response = await axios.post('http://notification-service:5001/send-email', {
          email: recipient,
          message,
        });
        break;
      case 'sms':
        response = await axios.post('http://notification-service:5001/send-sms', {
          telephone: recipient,
          message,
        });
        break;
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }

    console.log(`📡 Sent ${channel.toUpperCase()} notification to ${recipient}: ${response.status}`);
  } catch (error: any) {
    console.error(`❌ Failed to send ${channel.toUpperCase()} notification: ${error.message}`);
    throw error;  // Re-throw the error to be handled at a higher level if needed
  }
};

// Create the notification and call the notification service
export const createNotification = async (input: NotificationInput): Promise<any[]> => {
  const { recipient, sender, message } = input;

  try {
    // Try to get user by email or telephone
    const user =
      userStore.getByEmail(recipient) || userStore.getByTelephone(recipient);

    if (!user) {
      throw new Error(`User not found for recipient: ${recipient}`);
    }

    const responses: any[] = [];

    // Loop through each notification channel (email, sms)
    for (const [channel, enabled] of Object.entries(user.preferences)) {
      if (!enabled) {
        responses.push({
          channel,
          status: 'skipped',
          reason: `User has disabled ${channel} notifications`,
          to: channel === 'email' ? user.email : user.telephone,
        });
        continue;
      }

      const destination = channel === 'email' ? user.email : user.telephone;

      // Create the notification in MongoDB
      const notification: NotificationDocument = await Notification.create({
        channel,
        sender,
        recipient: destination,
        message,
      });

      simulateSend(channel, destination, message);

      // Send the notification to the notification service
      await sendToNotificationService(channel, destination, message);

      responses.push({
        status: 'sent',
        channel,
        to: destination,
        message,
      });
    }

    return responses;
  } catch (error : any) {
    console.error(`❌ Error creating notification: ${error.message}`);
    throw error;  // Rethrow to allow higher-level handling if needed
  }
};
