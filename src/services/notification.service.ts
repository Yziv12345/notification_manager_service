import Notification, { NotificationDocument } from '../models/notification.model';
import { userStore } from '../models/userStore';

export interface NotificationInput {
  recipient: string; // email OR telephone
  sender: string;
  message: string;
}

const simulateSend = (channel: string, recipient: string, message: string): void => {
  console.log(`📤 Simulating ${channel.toUpperCase()} send to ${recipient}: "${message}"`);
};

export const createNotification = async (input: NotificationInput): Promise<any[]> => {
  const { recipient, sender, message } = input;

  // Try to get user by email or telephone
  const user =
    userStore.getByEmail(recipient) || userStore.getByTelephone(recipient);

  if (!user) {
    throw new Error(`User not found for recipient: ${recipient}`);
  }

  const responses: any[] = [];

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

    const notification: NotificationDocument = await Notification.create({
      channel,
      sender,
      recipient: destination,
      message,
    });

    simulateSend(channel, destination, message);

    responses.push({
      status: 'sent',
      channel,
      to: destination,
      message,
    });
    /// assuming the flow continue by sending req by channel to notification service /send-email /send-sms
  }

  return responses;
};
